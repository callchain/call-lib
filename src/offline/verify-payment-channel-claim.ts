import keypairs = require('call-keypairs')
import binary = require('call-binary-codec')
import {validate, callToDrops} from '../common'

function verifyPaymentChannelClaim(channel: string, amount: string,
  signature: string, publicKey: string
): string {
  validate.verifyPaymentChannelClaim({channel, amount, signature, publicKey})

  const signingData = binary.encodeForSigningClaim({
    channel: channel,
    amount: callToDrops(amount)
  })
  return keypairs.verify(signingData, signature, publicKey)
}

export default verifyPaymentChannelClaim
