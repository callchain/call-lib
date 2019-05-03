import * as _ from 'lodash'
import * as utils from './utils'
// const validate = utils.common.validate
const toCalledAmount = utils.common.toCalledAmount
const paymentFlags = utils.common.txFlags.Payment
const ValidationError = utils.common.errors.ValidationError
import {Instructions, Prepare} from './types'
import {Amount, Adjustment, MaxAdjustment,
  MinAdjustment, Memo} from '../common/types'


type Payment = {
  source: Adjustment & MaxAdjustment,
  destination: Adjustment & MinAdjustment,
  paths?: string,
  memos?: Array<Memo>,
  // A 256-bit hash that can be used to identify a particular payment
  invoiceID?: string, // for non fungible
  invoice: string,
  allowPartialPayment?: boolean,
  noDirectCall?: boolean,
  limitQuality?: boolean
}

function isCALLToCALLPayment(payment: Payment): boolean {
  const sourceCurrency = _.get(payment, 'source.maxAmount.currency',
    _.get(payment, 'source.amount.currency'))
  const destinationCurrency = _.get(payment, 'destination.amount.currency',
    _.get(payment, 'destination.minAmount.currency'))
  return sourceCurrency === 'CALL' && destinationCurrency === 'CALL'
}

function isIOUWithoutCounterparty(amount: Amount): boolean {
  return amount && amount.currency !== 'CALL'
    && amount.counterparty === undefined
}

function applyAnyCounterpartyEncoding(payment: Payment): void {
  _.forEach([payment.source, payment.destination], adjustment => {
    _.forEach(['amount', 'minAmount', 'maxAmount'], key => {
      if (isIOUWithoutCounterparty(adjustment[key])) {
        adjustment[key].counterparty = adjustment.issuer
      }
    })
  })
}

function createMaximalAmount(amount: Amount): Amount {
  const maxCALLValue = '100000000000'
  const maxIOUValue = '9999999999999999e80'
  const maxValue = amount.currency === 'CALL' ? maxCALLValue : maxIOUValue
  return _.assign({}, amount, {value: maxValue})
}

function createPaymentTransaction(address: string, paymentArgument: Payment
): Object {
  const payment = _.cloneDeep(paymentArgument)
  applyAnyCounterpartyEncoding(payment)

  if (address !== payment.source.address) {
    throw new ValidationError('address must match payment.source.address')
  }

  if ((payment.source.maxAmount && payment.destination.minAmount) ||
      (payment.source.amount && payment.destination.amount)) {
    throw new ValidationError('payment must specify either (source.maxAmount '
      + 'and destination.amount) or (source.amount and destination.minAmount)')
  }
  const amount = payment.destination.minAmount && !isCALLToCALLPayment(payment) ?
    createMaximalAmount(payment.destination.minAmount) :
    (payment.destination.amount || payment.destination.minAmount)

  const txJSON: any = {
    TransactionType: 'Payment',
    Account: payment.source.address,
    Destination: payment.destination.address,
    Amount: toCalledAmount(amount),
    Flags: 0
  }

  if (payment.invoiceID !== undefined) {
    txJSON.InvoiceID = payment.invoiceID
  }
  if (payment.invoice !== undefined) {
    txJSON.Invoice = utils.convertStringToHex(payment.invoice)
  }
  if (payment.source.tag !== undefined) {
    txJSON.SourceTag = payment.source.tag
  }
  if (payment.destination.tag !== undefined) {
    txJSON.DestinationTag = payment.destination.tag
  }
  if (payment.memos !== undefined) {
    txJSON.Memos = _.map(payment.memos, utils.convertMemo)
  }
  if (payment.noDirectCall === true) {
    txJSON.Flags |= paymentFlags.NoCallDirect
  }
  if (payment.limitQuality === true) {
    txJSON.Flags |= paymentFlags.LimitQuality
  }
  if (!isCALLToCALLPayment(payment)) {
    if (payment.allowPartialPayment === true || payment.destination.minAmount !== undefined) {
      txJSON.Flags |= paymentFlags.PartialPayment
    }

    txJSON.SendMax = toCalledAmount(payment.source.maxAmount || payment.source.amount)

    if (payment.destination.minAmount !== undefined) {
      txJSON.DeliverMin = toCalledAmount(payment.destination.minAmount)
    }

    if (payment.paths !== undefined) {
      txJSON.Paths = JSON.parse(payment.paths)
    }
  } else if (payment.allowPartialPayment === true) {
    throw new ValidationError('CALL to CALL payments cannot be partial payments')
  }

  return txJSON
}

function preparePayment(address: string, payment: Payment,
  instructions: Instructions = {}
): Promise<Prepare> {
  // validate.preparePayment({address, payment, instructions})
  const txJSON = createPaymentTransaction(address, payment)
  return utils.prepareTransaction(txJSON, this, instructions)
}

export default preparePayment
