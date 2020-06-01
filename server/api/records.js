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
const db = require('../db/records')

const FILTER_KEYS = ['recordId', 'recordType', 'owner', 'receivingAgent', 'issuingAgent']//@luana add 2 keys for answer proposals

const fetchProperty = ({recordId, propertyName}) => {
  return db.fetchProperty(recordId, propertyName)
}

const fetchRecord = ({recordId, authedKey}) => {
  return db.fetchRecord(recordId, authedKey)
}

const listRecords = params => {
  if(params.hasOwnProperty('owner')){
    return db.listRecordsByOwner(params.authedKey, _.pick(params, FILTER_KEYS))
  }
  return db.listRecords(params.authedKey, _.pick(params, FILTER_KEYS))
}

const listProposals = params =>
  db.listProposalsByAgent(_.pick(params, FILTER_KEYS))//@luana submit proposal

module.exports = {
  fetchProperty,
  fetchRecord,
  listRecords,
  listProposals//@luana submit proposal

}
