"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status;
(function (Status) {
    Status["Pending"] = "pending";
    Status["Rejected"] = "rejected";
    Status["Fulfilled"] = "fulfilled";
})(Status || (Status = {}));
var isFunction = function (func) { return typeof func === "function"; };
var isObject = function (val) { return val && typeof val === "object"; };
var isPromise = function (val) { return val instanceof Guarantee; };
var Guarantee = /** @class */ (function () {
    function Guarantee(func) {
        var _this = this;
        this.status = Status.Pending;
        this.gaurantees = [];
        this.resolve = function (value) {
            _this.resolveInternal(value, false);
        };
        this.reject = function (reason) {
            _this.rejectInternal(reason, false);
        };
        if (!isFunction(func)) {
            throw new TypeError("Constructor value should be a function.");
        }
        this.thenable = function () {
            return func(_this.resolveInternal.bind(_this), _this.rejectInternal.bind(_this));
        };
    }
    Object.defineProperty(Guarantee.prototype, "pending", {
        get: function () {
            return this.status === Status.Pending;
        },
        enumerable: true,
        configurable: true
    });
    Guarantee.prototype.resolveInternal = function (value, unpack) {
        var _this = this;
        if (unpack === void 0) { unpack = false; }
        if (!this.pending) {
            return this.value;
        }
        var res;
        if (!unpack) {
            res = this.promiseResolution(value);
            if (!res.finish) {
                return;
            }
        }
        this.status = Status.Fulfilled;
        this.value = res ? res.value : value;
        var resolve = function () {
            for (var _i = 0, _a = _this.gaurantees; _i < _a.length; _i++) {
                var guarantee = _a[_i];
                if (guarantee.pending) {
                    guarantee.thenable();
                }
            }
        };
        setTimeout(resolve, 0);
        return this;
    };
    Guarantee.prototype.rejectInternal = function (reason, unpack) {
        var _this = this;
        if (unpack === void 0) { unpack = false; }
        if (!this.pending) {
            return;
        }
        var res;
        if (!unpack) {
            res = this.promiseResolution(reason);
            if (!res.finish) {
                return;
            }
        }
        this.status = Status.Rejected;
        this.reason = res ? res.value : reason;
        var reject = function () {
            for (var _i = 0, _a = _this.gaurantees; _i < _a.length; _i++) {
                var guarantee = _a[_i];
                if (guarantee.pending) {
                    guarantee.thenable();
                }
            }
        };
        setTimeout(reject, 0);
        return this;
    };
    Guarantee.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        var guarantee = new Guarantee(function (resolve, reject) {
            var resolveWrapper = function (value) {
                try {
                    resolve(onFulfilled && onFulfilled(value));
                }
                catch (e) {
                    reject(e, true);
                }
            };
            var rejectWrapper = function (reason) {
                try {
                    reject(onRejected && onRejected(reason));
                }
                catch (e) {
                    resolve(e, true);
                }
            };
            if (_this.status === Status.Fulfilled) {
                if (isFunction(onFulfilled)) {
                    resolveWrapper(_this.value);
                }
                else if (isFunction(onRejected)) {
                    rejectWrapper(_this.value);
                }
                else {
                    resolve(_this.value);
                }
            }
            else if (_this.status === Status.Rejected) {
                if (isFunction(onRejected)) {
                    rejectWrapper(_this.reason);
                }
                else if (isFunction(onFulfilled)) {
                    resolveWrapper(_this.reason);
                }
                else {
                    reject(_this.reason);
                }
            }
        });
        this.gaurantees.push(guarantee);
        return guarantee;
    };
    Guarantee.prototype.promiseResolution = function (x) {
        var _this = this;
        if (this === x) {
            throw new TypeError("Promise and x cannot refer to the same value.");
        }
        if (isPromise(x)) {
            // 2.3.2.1. If x is pending, promise must remain pending until x is fulfilled or rejected.
            if (x.status === Status.Pending) {
                x.then(this.resolve.bind(this), this.reject.bind(this));
                return { finish: false };
            }
            // 2.3.2. If is a promise, adopt its state.
            // 2.3.2.3. If/when x is rejected, reject promise with the same reason.
            if (x.status === Status.Rejected) {
                x = x.reason;
            }
            // 2.3.2.2 If/when x is fulfilled, fulfill promise with the same value.
            if (x.status === Status.Fulfilled) {
                x = x.value;
            }
        }
        else if (isFunction(x) || isObject(x)) {
            // 2.3.3. Otherwise, if x is an object or function,
            var then = void 0;
            try {
                // 2.3.3.1. Let then be x.then.
                then = x.then;
            }
            catch (e) {
                this.rejectInternal(e, true);
                return { finish: false };
            }
            if (isFunction(then)) {
                var called_1 = false;
                var resolvePromise = function (val) {
                    if (!called_1) {
                        called_1 = true;
                        var res = _this.promiseResolution(val);
                        if (res.finish) {
                            _this.resolve(res.value);
                        }
                    }
                };
                var rejectPromise = function (reason) {
                    if (!called_1) {
                        called_1 = true;
                        _this.rejectInternal(reason, true);
                    }
                };
                try {
                    // 2.3.3.3. If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise, where:
                    then.call(x, resolvePromise, rejectPromise);
                }
                catch (e) {
                    if (!called_1) {
                        this.rejectInternal(e, true);
                    }
                }
                return { finish: false };
            }
        }
        return { value: x, finish: true };
    };
    return Guarantee;
}());
exports.Guarantee = Guarantee;
exports.default = Guarantee;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFLLE1BSUo7QUFKRCxXQUFLLE1BQU07SUFDVCw2QkFBbUIsQ0FBQTtJQUNuQiwrQkFBcUIsQ0FBQTtJQUNyQixpQ0FBdUIsQ0FBQTtBQUN6QixDQUFDLEVBSkksTUFBTSxLQUFOLE1BQU0sUUFJVjtBQVlELElBQU0sVUFBVSxHQUFHLFVBQUMsSUFBUyxJQUFLLE9BQUEsT0FBTyxJQUFJLEtBQUssVUFBVSxFQUExQixDQUEwQixDQUFDO0FBQzdELElBQU0sUUFBUSxHQUFHLFVBQUMsR0FBUSxJQUFLLE9BQUEsR0FBRyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBOUIsQ0FBOEIsQ0FBQztBQUM5RCxJQUFNLFNBQVMsR0FBRyxVQUFDLEdBQVEsSUFBSyxPQUFBLEdBQUcsWUFBWSxTQUFTLEVBQXhCLENBQXdCLENBQUM7QUFFekQ7SUFZRSxtQkFDRSxJQUdTO1FBSlgsaUJBV0M7UUF0Qk0sV0FBTSxHQUFXLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFTL0IsZUFBVSxHQUFtQixFQUFFLENBQUM7UUFlakMsWUFBTyxHQUFHLFVBQUMsS0FBYztZQUM5QixLQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUM7UUErQkssV0FBTSxHQUFHLFVBQUMsTUFBVztZQUMxQixLQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUM7UUExQ0EsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNyQixNQUFNLElBQUksU0FBUyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7U0FDaEU7UUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHO1lBQ2QsT0FBQSxJQUFJLENBQUMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxJ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