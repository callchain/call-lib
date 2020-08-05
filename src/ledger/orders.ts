import * as _ from 'lodash'
import * as utils from './utils'
import {validate} from '../common'
import {Connection} from '../common'
import parseAccountOrder from './parse/account-order'
import {OrdersOptions, Order} from './types'

type GetOrders = Array<Order>

function requestAccountOffers(connection: Connection, address: string,
  ledgerVersion: number, marker: string, limit: number
): Promise<Object> {
  return connection.request({
    command: 'account_offers',
    account: address,
    marker: marker,
    limit: utils.clamp(limit, 10, 400),
    ledger_index: ledgerVersion
  }).then(data => ({
    marker: data.marker,
    results: data.offers.map(_.partial(parseAccountOrder, address))
  }))
}

function getOrders(address: string, options: OrdersOptions = {}
): Promise<GetOrders> {
  validate.getOrders({address, options})

  return utils.ensureLedgerVersion.call(this, options).then(_options => {
    const getter = _.partial(requestAccountOffers, this.connection, address,
      _options.ledgerVersion)

    // return utils.getRecursive(getter, _options.limit).then(orders.results => _.sortBy(orders, order => order.properties.sequence))

    return utils.getRecursive(getter, _options.limit,_options.marker)
  })
}

export default getOrders
