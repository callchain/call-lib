"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var assert = require("assert");
function mergeIntervals(intervals) {
    var stack = [[-Infinity, -Infinity]];
    _.sortBy(intervals, function (x) { return x[0]; }).forEach(function (interval) {
        var lastInterval = stack.pop();
        if (interval[0] <= lastInterval[1] + 1) {
            stack.push([lastInterval[0], Math.max(interval[1], lastInterval[1])]);
        }
        else {
            stack.push(lastInterval);
            stack.push(interval);
        }
    });
    return stack.slice(1);
}
var RangeSet = /** @class */ (function () {
    function RangeSet() {
        this.reset();
    }
    RangeSet.prototype.reset = function () {
        this.ranges = [];
    };
    RangeSet.prototype.serialize = function () {
        return this.ranges.map(function (range) {
            return range[0].toString() + '-' + range[1].toString();
        }).join(',');
    };
    RangeSet.prototype.addRange = function (start, end) {
        assert(start <= end, 'invalid range');
        this.ranges = mergeIntervals(this.ranges.concat([[start, end]]));
    };
    RangeSet.prototype.addValue = function (value) {
        this.addRange(value, value);
    };
    RangeSet.prototype.parseAndAddRanges = function (rangesString) {
        var _this = this;
        var rangeStrings = rangesString.split(',');
        _.forEach(rangeStrings, function (rangeString) {
            var range = rangeString.split('-').map(Number);
            _this.addRange(range[0], range.length === 1 ? range[0] : range[1]);
        });
    };
    RangeSet.prototype.containsRange = function (start, end) {
        return _.some(this.ranges, function (range) { return range[0] <= start && range[1] >= end; });
    };
    RangeSet.prototype.containsValue = function (value) {
        return this.containsRange(value, value);
    };
    return RangeSet;
}());
exports.default = RangeSet;
//# sourceMappingURL=rangeset.js.map