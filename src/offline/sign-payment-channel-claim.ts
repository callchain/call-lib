import * as common from '../common'
import keypairs = require('call-keypairs')
import binary = require('call-binary-codec')
const {validate, callToDrops} = common

function signPaymentChannelClaim(channel: string, amount: string,
  privateKey: string
): string {
  validate.signPaymentChannelClaim({channel, amount, privateKey})

  const signingData = binary.encodeForSigningClaim({
    channel: channel,
    amount: callToDrops(amount)
  })
  return keypairs.sign(signingData, privateKey)
}

export default signPaymentChannelClaim
