/**
 * Copyright 2017 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ----------------------------------------------------------------------------
 */
'use strict'

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')

const auth = require('./auth')
const users = require('./users')
const { BadRequest, Unauthorized } = require('./errors')
const agents = require('./agents')
const records = require('./records')
const recordTypes = require('./record_types')
const blockchain = require('../blockchain/')
const batcher = require('../blockchain/batcher')
const config = require('../system/config')
var cors = require('cors')
const multer = require('multer')

const router = express.Router()

// Passes a request to a function, then sends back the promised result as JSON.
// Will catch errors and send on to any error handling middleware.
const handlePromisedResponse = func => (req, res, next) => {
  func(req)
    .then(filterQueryParams(req.query))
    .then(result => res.json(result))
    .catch(err => next(err))
}

// Handler suitable for all GET requests. Passes the endpoint function
// a merged copy of the parameters for a request, handling promised results
const handle = func => handlePromisedResponse(req => {
  return func(_.assign({}, req.query, req.params, req.internal))
})

// Handler suitable for POST/PATCH request, passes along the request's body
// in addition to its other parameters.
const handleBody = func => handlePromisedResponse(req => {
  return func(req.body, _.assign({}, req.query, req.params, req.internal))
})

const filterQueryParams = ({ fields, omit }) => result => {
  const filterParams = obj => fields ? _.pick(obj, fields.split(','))
    : omit ? _.omit(obj, omit.split(','))
      : obj

  return Array.isArray(result) ? _.map(result, filterParams) : filterParams(result)
}

// Parses the endpoints from an Express router
const getEndpoints = router => {
  return _.chain(router.stack)
    .filter(layer => layer.route)
    .map(({ route }) => {
      return _.chain(route.stack)
        .reduceRight((layers, layer) => {
          if (layer.name === 'restrict') {
            _.nth(layers, -1).restricted = true
          } else {
            layers.push({
              path: route.path,
              method: layer.method.toUpperCase(),
              restricted: false
            })
          }
          return layers
        }, [])
        .reverse()
        .value()
    })
    .flatten()
    .value()
}

/*
 * Custom Middleware
 */

// Logs basic request information to the console
const logRequest = (req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url} from ${req.ip}`)
  next()
}

// Adds an object to the request for storing internally generated parameters
const initInternalParams = (req, res, next) => {
  req.internal = {}
  next()
}

// Middleware for parsing the wait query parameter
const waitParser = (req, res, next) => {
  const DEFAULT_WAIT = Math.floor(config.DEFAULT_SUBMIT_WAIT / 1000)
  const parsed = req.query.wait === '' ? DEFAULT_WAIT : Number(req.query.wait)
  req.query.wait = _.isNaN(parsed) ? null : parsed
  next()
}

// Check the Authorization header if present.
// Saves the encoded public key to the request object.
const authHandler = (req, res, next) => {
  req.internal.authedKey = null
  const token = req.headers.authorization
  if (!token) return next()

  auth.verifyToken(token)
    .then(publicKey => {
      req.internal.authedKey = publicKey
      next()
    })
    .catch(() => next())
}

// Route-specific middleware, throws error if not authorized
const restrict = (req, res, next) => {
  if (req.internal.authedKey) return next()
  next(new Unauthorized('This route requires a valid Authorization header'))
}

// Send back a simple JSON error with an HTTP status code
const errorHandler = (err, req, res, next) => {

  if (err.code === 'INCORRECT_FILETYPE') {
    res.status(422).json({ error: 'Only images are allowed' })

  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(422).json({ error: 'Allow file size is 500KB' })

  }

  if (err) {
    res.status(err.status || 500).json({ error: err.message })
  } else {
    next()
  }
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Incorrect file')
    error.code = 'INCORRECT_FILETYPE'
    return cb(error, false)
  }
  cb(null, true)
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    cb(null, req.params.recordId + '.jpg')
  }
})

const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 5000000
  }
})

/*
 * Route and Middleware Setup
 */


router.use(cors())


router.use(bodyParser.json({ type: 'application/json' }))
router.use(bodyParser.raw({ type: 'application/octet-stream' }))

router.use(logRequest)
router.use(initInternalParams)
router.use(waitParser)
router.use(authHandler)

router.get('/agents', handle(agents.list))
router.get('/agents/:publicKey', handle(agents.fetch))

router.post('/authorization', handleBody(auth.authorize))

router.get('/info', handle(() => {
  return Promise.resolve()
    .then(() => ({
      pubkey: batcher.getPublicKey(),
      mapsApiKey: config.MAPS_API_KEY,
      endpoints: endpointInfo
    }))
}))

router.post('/info/mapsApiKey', handleBody(body => {
  return Promise.resolve()
    .then(() => {
      if (config.MAPS_API_KEY) {
        throw new BadRequest('Google Maps API key already set')
      }
      config.set('MAPS_API_KEY', body.mapsApiKey)
      return `Google Maps API key set to "${body.mapsApiKey}"`
    })
}))

router.get('/records', handle(records.listRecords))
router.get('/records/:recordId', handle(records.fetchRecord))
router.get('/records/:recordId/property/:propertyName', handle(records.fetchProperty))
router.get('/records/:recordId/:propertyName', handle(records.fetchProperty))

router.get('/record-types', handle(recordTypes.list))
router.get('/record-types/:typeName', handle(recordTypes.fetch))
router.post('/transactions', handleBody(blockchain.submit))
router.get('/proposals/:receivingAgent', handle(records.listProposals))
router.get('/proposals-send/:issuingAgent', handle(records.listProposals))
router.get('/proposals-all/:recordId', handle(records.listProposals))

router.post('/upload/:recordId', upload.single('file'), (req, res) => {
  res.json({ file: req.file })
})
router.get('/image/:recordId', function (req, res, next) {
  let recordId = req.params.recordId
  let reocordParent = recordId.split('-')
  res.sendFile('/sawtooth-supply-chain/server/images/' + reocordParent[0] + '.jpg', {}, function (err) {
    if (err) {
      res.sendFile('/sawtooth-supply-chain/server/images/default.jpg', {}, function (err) {
        if (err) {
          next(err)//
        }
      })
    }
  })
})

router.route('/users')
  .post(handleBody(users.create))
  .patch(restrict, handleBody(users.update))

// This route is redundant, but matches RESTful expectations
router.patch('/users/:publicKey', restrict, handleBody((body, params) => {
  return users.fetch(params.authedKey).then(user => {
    if (params.publicKey !== params.authedKey && user.role !== 'admin') {
      throw new Unauthorized('You may only modify your own user account!')
    }
    params.authedKey = params.publicKey
    return users.update(body, params)
  })

}))

router.use(errorHandler)
const endpointInfo = getEndpoints(router)

module.exports = router
