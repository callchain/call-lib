import * as _ from 'lodash'
import BigNumber from 'bignumber.js'
import {getCALLBalance, renameCounterpartyToIssuer} from './utils'
import {validate, toCalledAmount, errors} from '../common'
import {Connection} from '../common'
import parsePathfind from './parse/pathfind'
import {CalledAmount, Amount} from '../common/types'
import {
  GetPaths, PathFind, CalledPathsResponse, PathFindRequest
} from './pathfind-types'
const NotFoundError = errors.NotFoundError
const ValidationError = errors.ValidationError


function addParams(request: PathFindRequest, result: CalledPathsResponse
): CalledPathsResponse {
  return _.defaults(_.assign({}, result, {
    source_account: request.source_account,
    source_currencies: request.source_currencies
  }), {destination_amount: request.destination_amount})
}

function requestPathFind(connection: Connection, pathfind: PathFind
): Promise<CalledPathsResponse> {
  const destinationAmount: Amount = _.assign(
    {value: '-1'},
    pathfind.destination.amount
  )
  const request: PathFindRequest = {
    command: 'call_path_find',
    source_account: pathfind.source.address,
    destination_account: pathfind.destination.address,
    destination_amount: toCalledAmount(destinationAmount)
  }
  if (typeof request.destination_amount === 'object'
      && !request.destination_amount.issuer) {
    request.destination_amount.issuer = request.destination_account
  }
  if (pathfind.source.currencies && pathfind.source.currencies.length > 0) {
    request.source_currencies = pathfind.source.currencies.map(
      amount => renameCounterpartyToIssuer(amount))
  }
  if (pathfind.source.amount) {
    if (pathfind.destination.amount.value !== undefined) {
      throw new ValidationError('Cannot specify both source.amount'
        + ' and destination.amount.value in getPaths')
    }
    request.send_max = toCalledAmount(pathfind.source.amount)
    if (typeof request.send_max !== 'string' && !request.send_max.issuer) {
      request.send_max.issuer = pathfind.source.address
    }
  }

  return connection.request(request).then(paths => addParams(request, paths))
}

function addDirectCallPath(paths: CalledPathsResponse, callBalance: string
): CalledPathsResponse {
  // Add CALL "path" only if the source acct has enough CALL to make the payment
  const destinationAmount = paths.destination_amount
  // @ts-ignore: destinationAmount can be a currency amount object! Fix!
  if ((new BigNumber(callBalance)).greaterThanOrEqualTo(destinationAmount)) {
    paths.alternatives.unshift({
      paths_computed: [],
      source_amount: paths.destination_amount
    })
  }
  return paths
}

function isCalledIOUAmount(amount: CalledAmount) {
  return (typeof amount === 'object') &&
    amount.currency && (amount.currency !== 'CALL')
}

function conditionallyAddDirectCALLPath(connection: Connection, address: string,
  paths: CalledPathsResponse
): Promise<CalledPathsResponse> {
  if (isCalledIOUAmount(paths.destination_amount)
      || !_.includes(paths.destination_currencies, 'CALL')) {
    return Promise.resolve(paths)
  }
  return getCALLBalance(connection, address, undefined).then(
    callBalance => addDirectCallPath(paths, callBalance))
}

function filterSourceFundsLowPaths(pathfind: PathFind,
  paths: CalledPathsResponse
): CalledPathsResponse {
  if (pathfind.source.amount &&
      pathfind.destination.amount.value === undefined && paths.alternatives) {
    paths.alternatives = _.filter(paths.alternatives, alt =>
        !!alt.source_amount &&
        !!pathfind.source.amount &&
        // TODO: Returns false when alt.source_amount is a string. Fix?
        typeof alt.source_amount !== 'string' &&
        new BigNumber(alt.source_amount.value).eq(pathfind.source.amount.value)
    )
  }
  return paths
}

function formatResponse(pathfind: PathFind, paths: CalledPathsResponse) {
  if (paths.alternatives && paths.alternatives.length > 0) {
    return parsePathfind(paths)
  }
  if (paths.destination_currencies !== undefined &&
      !_.includes(paths.destination_currencies,
        pathfind.destination.amount.currency)) {
    throw new NotFoundError('No paths found. ' +
      'The destination_account does not accept ' +
      pathfind.destination.amount.currency + ', they only accept: ' +
      paths.destination_currencies.join(', '))
  } else if (paths.source_currencies && paths.source_currencies.length > 0) {
    throw new NotFoundError('No paths found. Please ensure' +
      ' that the source_account has sufficient funds to execute' +
      ' the payment in one of the specified source_currencies. If it does' +
      ' there may be insufficient liquidity in the network to execute' +
      ' this payment right now')
  } else {
    throw new NotFoundError('No paths found.' +
      ' Please ensure that the source_account has sufficient funds to' +
      ' execute the payment. If it does there may be insufficient liquidity' +
      ' in the network to execute this payment right now')
  }
}

function getPaths(pathfind: PathFind): Promise<GetPaths> {
  validate.getPaths({pathfind})

  const address = pathfind.source.address
  return requestPathFind(this.connection, pathfind).then(paths =>
    conditionallyAddDirectCALLPath(this.connection, address, paths)
  )
    .then(paths => filterSourceFundsLowPaths(pathfind, paths))
    .then(paths => formatResponse(pathfind, paths))
}

export default getPaths
