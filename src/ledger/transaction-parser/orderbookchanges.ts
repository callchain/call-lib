import * as _ from 'lodash'
import * as utils from './utils'
import GlobalBigNumber from 'bignumber.js'
const BigNumber = GlobalBigNumber.another({DECIMAL_PLACES: 40})
import { parseQuality } from './quality'

const lsfSell = 0x00020000

function removeUndefined(obj) {
    return _.omitBy(obj, _.isUndefined)
}

function convertOrderChange(order) {
    let takerGets = order.taker_gets
    let takerPays = order.taker_pays
    let direction = order.sell ? 'sell' : 'buy'
    let quantity = (direction === 'buy') ? takerPays : takerGets
    let totalPrice = (direction === 'buy') ? takerGets : takerPays
    return removeUndefined({
      direction: direction,
      quantity: quantity,
      totalPrice: totalPrice,
      sequence: order.sequence,
      status: order.status,
      makerExchangeRate: order.quality,
      expirationTime: order.expiration
    })
}

function callToUnixTimestamp(rpepoch) {
    return (rpepoch + 0x386D4380) * 1000
}
  
function getExpirationTime(node) {
    let expirationTime = node.finalFields.Expiration || node.newFields.Expiration
    if (expirationTime === undefined) {
      return undefined
    }
    return (new Date(callToUnixTimestamp(expirationTime))).toISOString()
}
  
function getQuality(node) {
    let takerGets = node.finalFields.TakerGets || node.newFields.TakerGets
    let takerPays = node.finalFields.TakerPays || node.newFields.TakerPays
    let takerGetsCurrency = takerGets.currency || 'CALL'
    let takerPaysCurrency = takerPays.currency || 'CALL'
    let bookDirectory = node.finalFields.BookDirectory || node.newFields.BookDirectory
    let qualityHex = bookDirectory.substring(bookDirectory.length - 16)
    return parseQuality(qualityHex, takerGetsCurrency, takerPaysCurrency)
}
  
function parseOrderStatus(node) {
    if (node.diffType === 'CreatedNode') {
      // "submitted" is more conventional, but could be confusing in the
      // context of Call
      return 'created'
    }
  
    if (node.diffType === 'ModifiedNode') {
      return 'partially-filled'
    }
  
    if (node.diffType === 'DeletedNode') {
      // A filled order has previous fields
      if (node.previousFields.hasOwnProperty('TakerPays')) {
        return 'filled'
      }
  
      // A cancelled order has no previous fields
      // google search for "cancelled order" shows 5x more results than
      // "canceled order", even though both spellings are correct
      return 'cancelled'
    }
    return undefined
}
  
function calculateDelta(finalAmount, previousAmount) {
    if (previousAmount) {
      let finalValue = new BigNumber(finalAmount.value)
      let previousValue = new BigNumber(previousAmount.value)
      return finalValue.minus(previousValue).abs().toString()
    }
    return '0'
}
  
function parseChangeAmount(node, type) {
    let status = parseOrderStatus(node)
  
    if (status === 'cancelled') {
      // Canceled orders do not have PreviousFields; FinalFields
      // have positive values
      return utils.parseCurrencyAmount(node.finalFields[type])
    } else if (status === 'created') {
      return utils.parseCurrencyAmount(node.newFields[type])
    }
    let finalAmount = utils.parseCurrencyAmount(node.finalFields[type])
    let previousAmount = utils.parseCurrencyAmount(node.previousFields[type])
    let value = calculateDelta(finalAmount, previousAmount)
    return _.assign({}, finalAmount, {value: value})
}
  
function parseOrderChange(node) {
    let orderChange = convertOrderChange({
      taker_pays: parseChangeAmount(node, 'TakerPays'),
      taker_gets: parseChangeAmount(node, 'TakerGets'),
      sell: (node.finalFields.Flags & lsfSell) !== 0,
      sequence: node.finalFields.Sequence || node.newFields.Sequence,
      status: parseOrderStatus(node),
      quality: getQuality(node),
      expiration: getExpirationTime(node)
    })
  
    Object.defineProperty(orderChange, 'account', {
      value: node.finalFields.Account || node.newFields.Account
    })
  
    return orderChange
}
  
function groupByAddress(orderChanges) {
    return _.groupBy(orderChanges, function(change) {
      return change.account
    })
}

  /**
 * Computes the complete list of every Offer that changed in the ledger
 * as a result of the given transaction.
 * Returns changes grouped by Call account.
 *
 *  @param {Object} metadata - Transaction metadata as return by call-lib
 *  @returns {Object} - Orderbook changes grouped by Call account
 *
 */
function parseOrderbookChanges(metadata) {
    let nodes = utils.normalizeNodes(metadata)
  
    let orderChanges = _.map(_.filter(nodes, function(node) {
      return node.entryType === 'Offer'
    }), parseOrderChange)
  
    return groupByAddress(orderChanges)
}

export {
    parseOrderbookChanges
}
