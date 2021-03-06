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
const db = require('../db/agents')

const FILTER_KEYS = ['name', 'publicKey']

const list = params => db.list(_.pick(params, FILTER_KEYS))

const fetch = ({ publicKey, authedKey }) => {
  return db.isAdmin(authedKey)
    .then(result => {
      if (result.role === 'admin') {
        return db.fetch(publicKey, true)
      } else {
        return db.fetch(publicKey, publicKey === authedKey)
      }
    })
    .catch(err => console.log(err))

}

module.exports = {
  list,
  fetch
}
