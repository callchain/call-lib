import * as _ from 'lodash'
import * as assert from 'assert'
import BigNumber from 'bignumber.js'
import * as utils from './utils'
const validate = utils.common.validate
const issuesetFlags = utils.common.txFlags.IssueSet
const ValidationError = utils.common.errors.ValidationError
const AccountFlagIndices = utils.common.constants.AccountFlagIndices
const AccountFields = utils.common.constants.AccountFields
import {Instructions, Prepare} from './types'
import {Amount, Memo} from '../common/types'

type IssueSet = {
  total?: Amount,
  additional?: boolean,
  nonFungible?: boolean,
  transferRate?: number,
  memos?: Memo[],
}

// Emptry string passed to setting will clear it
const CLEAR_SETTING = null

function setTransactionFlags(txJSON: any, values: IssueSet) {
  const keys = Object.keys(values)
  //assert(keys.length === 1, 'ERROR: can only set one setting per transaction')
  const flagName = keys[0]
  const value = values[flagName]
  const index = AccountFlagIndices[flagName]
  if (index !== undefined) {
    if (value) {
      txJSON.SetFlag = index
    } else {
      txJSON.ClearFlag = index
    }
  }
}

function setTransactionFields(txJSON: Object, input: IssueSet) {
  const fieldSchema = AccountFields
  for (const fieldName in fieldSchema) {
    const field = fieldSchema[fieldName]
    let value = input[field.name]

    if (value === undefined) {
      continue
    }

    // The value required to clear an account root field varies
    if (value === CLEAR_SETTING && field.hasOwnProperty('defaults')) {
      value = field.defaults
    }

    if (field.encoding === 'hex' && !field.length) {
      // This is currently only used for Domain field
      value = new Buffer(value, 'ascii').toString('hex').toUpperCase()
    }

    txJSON[fieldName] = value
  }
}

/**
 *  Note: A fee of 1% requires 101% of the destination to be sent for the
 *        destination to receive 100%.
 *  The transfer rate is specified as the input amount as fraction of 1.
 *  To specify the default rate of 0%, a 100% input amount, specify 1.
 *  To specify a rate of 1%, a 101% input amount, specify 1.01
 *
 *  @param {Number|String} transferRate
 *
 *  @returns {Number|String} numbers will be converted while strings
 *                           are returned
 */

function convertTransferRate(transferRate: number | string): number | string {
  return (new BigNumber(transferRate)).shift(9).toNumber()
}

function createIssueSetTransactionWithoutMemos(
  account: string, issueset: IssueSet
): any {

  if (issueset.total == undefined) {
    throw new ValidationError('total amount should be present')
  }
  if (issueset.total.issuer !== account) {
    throw new ValidationError('only allow to issue asset for self')
  }

  const txJSON: any = {
    TransactionType: 'IssueSet',
    Account: account,
    Total: issueset.total,
    Flags: 0
  }

  setTransactionFlags(txJSON, _.omit(issueset, 'memos'))
  setTransactionFields(txJSON, issueset)

  if (txJSON.TransferRate && issueset.nonFungible) {
    throw new ValidationError('Non fungible asset not allow to set transfer rate')
  }

  if (txJSON.TransferRate !== undefined) {
    txJSON.TransferRate = convertTransferRate(txJSON.TransferRate)
  }

  if (issueset.additional) {
    txJSON.Flags |= issuesetFlags.Additional;
  }
  if (issueset.nonFungible) {
    txJSON.Flags |= issuesetFlags.NonFungible;
  }

  return txJSON
}

function createIssueSetTransaction(account: string, issueset: IssueSet
): Object {
  const txJSON = createIssueSetTransactionWithoutMemos(account, issueset)
  if (issueset.memos !== undefined) {
    txJSON.Memos = _.map(issueset.memos, utils.convertMemo)
  }
  return txJSON
}

function prepareIssueSet(address: string, issueset: IssueSet,
  instructions: Instructions = {}
): Promise<Prepare> {
  //validate.prepareSettings({address, issueset, instructions})
  validate.prepareIssueSet({address, issueset, instructions})
  const txJSON = createIssueSetTransaction(address, issueset)
  return utils.prepareTransaction(txJSON, this, instructions)
}

export default prepareIssueSet
