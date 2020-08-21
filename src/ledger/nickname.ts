import {stringToHexWide} from './utils'

type AccountInfoOptions = {
  ledgerVersion?: number
}

function getAccountByName(name: string, options: AccountInfoOptions = {}) {
    const request = {
        command: 'nick_search',
        NickName: stringToHexWide(name).toUpperCase(),
        ledger_index: options.ledgerVersion || 'validated'
    };
    return this.connection.request(request);
}


export default getAccountByName
