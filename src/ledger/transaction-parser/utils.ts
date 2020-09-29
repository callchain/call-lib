import * as _ from 'lodash'
import BigNumber from 'bignumber.js'

function dropsToCALL(drops) {
    return drops.dividedBy(1000000)
}

function normalizeNode(affectedNode) {
    let diffType = Object.keys(affectedNode)[0]
    let node = affectedNode[diffType]
    return {
      diffType: diffType,
      entryType: node.LedgerEntryType,
      ledgerIndex: node.LedgerIndex,
      newFields: node.NewFields || {},
      finalFields: node.FinalFields || {},
      previousFields: node.PreviousFields || {}
    }
}

function normalizeNodes(metadata) {
    if (!metadata.AffectedNodes) {
      return []
    }
    return metadata.AffectedNodes.map(normalizeNode)
}

function parseCurrencyAmount(currencyAmount) {
    if (currencyAmount === undefined) {
      return undefined
    }
    if (typeof currencyAmount === 'string') {
      return {
        currency: 'CALL',
        value: dropsToCALL(new BigNumber(currencyAmount)).toString()
      }
    }
  
    return {
      currency: currencyAmount.currency,
      counterparty: currencyAmount.issuer,
      value: currencyAmount.value
    }
}

function isAccountField(fieldName) {
    let fieldNames = ['Account', 'Owner', 'Destination', 'Issuer', 'Target']
    return _.includes(fieldNames, fieldName)
}

function isAmountFieldAffectingIssuer(fieldName) {
    let fieldNames = ['LowLimit', 'HighLimit', 'TakerPays', 'TakerGets']
    return _.includes(fieldNames, fieldName)
}

function getAffectedAccounts(metadata) {
    let accounts = []
    _.forEach(normalizeNodes(metadata), function(node) {
      let fields = node.diffType === 'CreatedNode' ?
        node.newFields : node.finalFields
      _.forEach(fields, function(fieldValue, fieldName) {
        if (isAccountField(fieldName)) {
          accounts.push(fieldValue)
        } else if (isAmountFieldAffectingIssuer(fieldName) && fieldValue.issuer) {
          accounts.push(fieldValue.issuer)
        }
      })
    })
    return _.uniq(accounts)
}

export {
    dropsToCALL,
    normalizeNodes,
    parseCurrencyAmount,
    getAffectedAccounts
}