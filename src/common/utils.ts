import * as _ from 'lodash'
import BigNumber from 'bignumber.js'
const {deriveKeypair} = require('call-keypairs')

import {Amount, CalledAmount} from './types'

function isValidSecret(secret: string): boolean {
  try {
    deriveKeypair(secret)
    return true
  } catch (err) {
    return false
  }
}

function dropsToCall(drops: string): string {
  return (new BigNumber(drops)).dividedBy(1000000.0).toString()
}

function callToDrops(call: string): string {
  return (new BigNumber(call)).times(1000000.0).floor().toString()
}

function toCalledAmount(amount: Amount): CalledAmount {
  if (amount.currency === 'CALL') {
    return callToDrops(amount.value)
  }
  return {
    currency: amount.currency,
    issuer: amount.counterparty ? amount.counterparty :
      (amount.issuer ? amount.issuer : undefined),
    value: amount.value
  }
}

function convertKeysFromSnakeCaseToCamelCase(obj: any): any {
  if (typeof obj === 'object') {
    let newKey
    return _.reduce(obj, (result, value, key) => {
      newKey = key
      // taking this out of function leads to error in PhantomJS
      const FINDSNAKE = /([a-zA-Z]_[a-zA-Z])/g
      if (FINDSNAKE.test(key)) {
        newKey = key.replace(FINDSNAKE, r => r[0] + r[2].toUpperCase())
      }
      result[newKey] = convertKeysFromSnakeCaseToCamelCase(value)
      return result
    }, {})
  }
  return obj
}

function removeUndefined<T extends object>(obj: T): T {
  return _.omitBy(obj, _.isUndefined) as T
}

/**
 * @param {Number} rpepoch (seconds since 1/1/2000 GMT)
 * @return {Number} ms since unix epoch
 *
 */
function callToUnixTimestamp(rpepoch: number): number {
  return (rpepoch + 0x386D4380) * 1000
}

function unixToCallTimestamp(timestamp: number): number {
  return Math.round(timestamp / 1000) - 0x386D4380
}

function callTimeToISO8601(callTime: number): string {
  return new Date(callToUnixTimestamp(callTime)).toISOString()
}

function iso8601ToCallTime(iso8601: string): number {
  return unixToCallTimestamp(Date.parse(iso8601))
}

export {
  dropsToCall,
  callToDrops,
  toCalledAmount,
  convertKeysFromSnakeCaseToCamelCase,
  removeUndefined,
  callTimeToISO8601,
  iso8601ToCallTime,
  isValidSecret
}

