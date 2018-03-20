"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const browserHacks = require("./browser-hacks");
class CallError extends Error {
    constructor(message = '', data) {
        super(message);
        this.name = browserHacks.getConstructorName(this);
        this.message = message;
        this.data = data;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    toString() {
        let result = '[' + this.name + '(' + this.message;
        if (this.data) {
            result += ', ' + util_1.inspect(this.data);
        }
        result += ')]';
        return result;
    }
    /* console.log in node uses util.inspect on object, and util.inspect allows
    us to cutomize its output:
    https://nodejs.org/api/util.html#util_custom_inspect_function_on_objects */
    inspect() {
        return this.toString();
    }
}
exports.CallError = CallError;
class CalledError extends CallError {
}
exports.CalledError = CalledError;
class UnexpectedError extends CallError {
}
exports.UnexpectedError = UnexpectedError;
class LedgerVersionError extends CallError {
}
exports.LedgerVersionError = LedgerVersionError;
class ConnectionError extends CallError {
}
exports.ConnectionError = ConnectionError;
class NotConnectedError extends ConnectionError {
}
exports.NotConnectedError = NotConnectedError;
class DisconnectedError extends ConnectionError {
}
exports.DisconnectedError = DisconnectedError;
class CalledNotInitializedError extends ConnectionError {
}
exports.CalledNotInitializedError = CalledNotInitializedError;
class TimeoutError extends ConnectionError {
}
exports.TimeoutError = TimeoutError;
class ResponseFormatError extends ConnectionError {
}
exports.ResponseFormatError = ResponseFormatError;
class ValidationError extends CallError {
}
exports.ValidationError = ValidationError;
class NotFoundError extends CallError {
    constructor(message = 'Not found') {
        super(message);
    }
}
exports.NotFoundError = NotFoundError;
class MissingLedgerHistoryError extends CallError {
    constructor(message) {
        super(message || 'Server is missing ledger history in the specified range');
    }
}
exports.MissingLedgerHistoryError = MissingLedgerHistoryError;
class PendingLedgerVersionError extends CallError {
    constructor(message) {
        super(message || 'maxLedgerVersion is greater than server\'s most recent ' +
            ' validated ledger');
    }
}
exports.PendingLedgerVersionError = PendingLedgerVersionError;
//# sourceMappingURL=errors.js.map