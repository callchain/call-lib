import * as assert from 'assert'
import BigNumber from 'bignumber.js'

/*
The quality, as stored in the last 64 bits of a directory index, is stored as
the quotient of TakerPays/TakerGets. It uses drops (1e-6 CALL) for CALL values.
*/

function adjustQualityForCALL(quality, takerGetsCurrency, takerPaysCurrency) {
    let numeratorShift = (takerPaysCurrency === 'CALL' ? -6 : 0)
    let denominatorShift = (takerGetsCurrency === 'CALL' ? -6 : 0)
    let shift = numeratorShift - denominatorShift
    return shift === 0 ? (new BigNumber(quality)).toString() :
      (new BigNumber(quality)).shift(shift).toString()
}

function parseQuality(qualityHex, takerGetsCurrency, takerPaysCurrency) {
    assert(qualityHex.length === 16)
    let mantissa = new BigNumber(qualityHex.substring(2), 16)
    let offset = parseInt(qualityHex.substring(0, 2), 16) - 100
    let quality = mantissa.toString() + 'e' + offset.toString()
    return adjustQualityForCALL(quality, takerGetsCurrency, takerPaysCurrency)
}

export {
    parseQuality
}