"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var browserHacks = require("./browser-hacks");
var CallError = /** @class */ (function (_super) {
    __extends(CallError, _super);
    function CallError(message, data) {
        if (message === void 0) { message = ''; }
        var _this = _super.call(this, message) || this;
        _this.name = browserHacks.getConstructorName(_this);
        _this.message = message;
        _this.data = data;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, _this.constructor);
        }
        return _this;
    }
    CallError.prototype.toString = function () {
        var result = '[' + this.name + '(' + this.message;
        if (this.data) {
            result += ', ' + util_1.inspect(this.data);
        }
        result += ')]';
        return result;
    };
    /* console.log in node uses util.inspect on object, and util.inspect allows
    us to cutomize its output:
    https://nodejs.org/api/util.html#util_custom_inspect_function_on_objects */
    CallError.prototype.inspect = function () {
        return this.toString();
    };
    return CallError;
}(Error));
exports.CallError = CallError;
var CalledError = /** @class */ (function (_super) {
    __extends(CalledError, _super);
    function CalledError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CalledError;
}(CallError));
exports.CalledError = CalledError;
var UnexpectedError = /** @class */ (function (_super) {
    __extends(UnexpectedError, _super);
    function UnexpectedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UnexpectedError;
}(CallError));
exports.UnexpectedError = UnexpectedError;
var LedgerVersionError = /** @class */ (function (_super) {
    __extends(LedgerVersionError, _super);
    function LedgerVersionError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LedgerVersionError;
}(CallError));
exports.LedgerVersionError = LedgerVersionError;
var ConnectionError = /** @class */ (function (_super) {
    __extends(ConnectionError, _super);
    function ConnectionError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ConnectionError;
}(CallError));
exports.ConnectionError = ConnectionError;
var NotConnectedError = /** @class */ (function (_super) {
    __extends(NotConnectedError, _super);
    function NotConnectedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NotConnectedError;
}(ConnectionError));
exports.NotConnectedError = NotConnectedError;
var DisconnectedError = /** @class */ (function (_super) {
    __extends(DisconnectedError, _super);
    function DisconnectedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DisconnectedError;
}(ConnectionError));
exports.DisconnectedError = DisconnectedError;
var CalledNotInitializedError = /** @class */ (function (_super) {
    __extends(CalledNotInitializedError, _super);
    function CalledNotInitializedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CalledNotInitializedError;
}(ConnectionError));
exports.CalledNotInitializedError = CalledNotInitializedError;
var TimeoutError = /** @class */ (function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimeoutError;
}(ConnectionError));
exports.TimeoutError = TimeoutError;
var ResponseFormatError = /** @class */ (function (_super) {
    __extends(ResponseFormatError, _super);
    function ResponseFormatError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ResponseFormatError;
}(ConnectionError));
exports.ResponseFormatError = ResponseFormatError;
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ValidationError;
}(CallError));
exports.ValidationError = ValidationError;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message) {
        if (message === void 0) { message = 'Not found'; }
        return _super.call(this, message) || this;
    }
    return NotFoundError;
}(CallError));
exports.NotFoundError = NotFoundError;
var MissingLedgerHistoryError = /** @class */ (function (_super) {
    __extends(MissingLedgerHistoryError, _super);
    function MissingLedgerHistoryError(message) {
        return _super.call(this, message || 'Server is missing ledger history in the specified range') || this;
    }
    return MissingLedgerHistoryError;
}(CallError));
exports.MissingLedgerHistoryError = MissingLedgerHistoryError;
var PendingLedgerVersionError = /** @class */ (function (_super) {
    __extends(PendingLedgerVersionError, _super);
    function PendingLedgerVersionError(message) {
        return _super.call(this, message || 'maxLedgerVersion is greater than server\'s most recent ' +
            ' validated ledger') || this;
    }
    return PendingLedgerVersionError;
}(CallError));
exports.PendingLedgerVersionError = PendingLedgerVersionError;
