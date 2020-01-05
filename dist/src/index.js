"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status;
(function (Status) {
    Status["Pending"] = "pending";
    Status["Rejected"] = "rejected";
    Status["Fulfilled"] = "fulfilled";
})(Status || (Status = {}));
var globalId = 0;
var isFunction = function (func) {
    return func && func !== undefined && typeof func === "function";
};
var isFunctionOrObject = function (val) {
    return isFunction(val) || (val && typeof val === "object");
};
var isPromise = function (obj) { return obj instanceof Guarantee; };
var Guarantee = /** @class */ (function () {
    function Guarantee(func) {
        var _this = this;
        this.status = Status.Pending;
        this.id = ++globalId;
        this.thenable = function (value) { };
        this.gaurantees = [];
        func = func && func.bind(this);
        this.thenable = isFunction(func)
            ? function () { return func(_this.resolve.bind(_this), _this.reject.bind(_this)); }
            : function () { };
        this.thenable = this.thenable.bind(this);
    }
    Object.defineProperty(Guarantee.prototype, "pending", {
        get: function () {
            return this.status === Status.Pending;
        },
        enumerable: true,
        configurable: true
    });
    Guarantee.prototype.resolve = function (value) {
        var _this = this;
        if (!this.pending) {
            return this.value;
        }
        // const valueIsPromise = isPromise(value);
        // // 2.3.2.1. If x is pending, promise must remain pending until x is fulfilled or rejected.
        // if (valueIsPromise && value.status === Status.Pending) {
        //   value.then(this.resolve.bind(this), this.reject.bind(this));
        //   return undefined;
        // }
        this.status = Status.Fulfilled;
        this.value = value;
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
    Guarantee.prototype.reject = function (reason) {
        var _this = this;
        if (!this.pending) {
            return this.reason;
        }
        // const reasonIsPromise = isPromise(reason);
        // // 2.3.2.1. If x is pending, promise must remain pending until x is fulfilled or rejected.
        // if (reasonIsPromise && reason.status === Status.Pending) {
        //   reason.then(this.resolve.bind(this), this.reject.bind(this));
        //   return undefined;
        // }
        this.status = Status.Rejected;
        this.reason = reason;
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
        var parent = this;
        var guarantee = new Guarantee(function (resolve, reject) {
            var value = parent.value;
            var reason = parent.reason;
            var resolveWrapper = function () {
                try {
                    value = onFulfilled && onFulfilled(value);
                    var res = _this.promiseResolution(value);
                    if (res.finish) {
                        resolve(res.value);
                    }
                }
                catch (error) {
                    reject(error);
                }
            };
            var rejectWrapper = function () {
                try {
                    reason = onRejected && onRejected(reason);
                    var res = _this.promiseResolution(reason);
                    if (res.finish) {
                        resolve(res.value);
                    }
                }
                catch (error) {
                    resolve(error);
                }
            };
            if (parent.status === Status.Fulfilled) {
                if (isFunction(onFulfilled)) {
                    resolveWrapper();
                }
                else if (isFunction(onRejected)) {
                    reason = parent.value;
                    rejectWrapper();
                }
                else {
                    resolve(value);
                }
            }
            else if (parent.status === Status.Rejected) {
                if (isFunction(onRejected)) {
                    rejectWrapper();
                }
                else if (isFunction(onFulfilled)) {
                    value = parent.reason;
                    resolveWrapper();
                }
                else {
                    reject(reason);
                }
            }
        });
        this.gaurantees.push(guarantee);
        return guarantee;
    };
    Guarantee.prototype.promiseResolution = function (x) {
        if (this === x) {
            throw new TypeError("Promise and x cannot refer to the same value.");
        }
        if (isPromise(x)) {
            // 2.3.2.1. If x is pending, promise must remain pending until x is fulfilled or rejected.
            if (x.status === Status.Pending) {
                x.then(this.resolve.bind(this), this.reject.bind(this));
                return { value: x, finish: false };
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
        else if (isFunctionOrObject(x)) {
            // 2.3.3. Otherwise, if x is an object or function,
            // 2.3.3.1. Let then be x.then.
            var then = void 0;
            try {
                then = x.then;
            }
            catch (error) {
                throw error;
            }
            // TODO: 2.3.3.2. If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
            // 2.3.3.3. If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise, where:
            if (isFunction(then)) {
                x = then.call(x, this.promiseResolution);
            }
        }
        return { value: x, finish: true };
    };
    return Guarantee;
}());
exports.Guarantee = Guarantee;
exports.default = Guarantee;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFLLE1BSUo7QUFKRCxXQUFLLE1BQU07SUFDVCw2QkFBbUIsQ0FBQTtJQUNuQiwrQkFBcUIsQ0FBQTtJQUNyQixpQ0FBdUIsQ0FBQTtBQUN6QixDQUFDLEVBSkksTUFBTSxLQUFOLE1BQU0sUUFJVjtBQVNELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUVqQixJQUFNLFVBQVUsR0FBRyxVQUFDLElBQVM7SUFDM0IsT0FBQSxJQUFJLElBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVO0FBQXhELENBQXdELENBQUM7QUFFM0QsSUFBTSxrQkFBa0IsR0FBRyxVQUFDLEdBQVE7SUFDbEMsT0FBQSxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDO0FBQW5ELENBQW1ELENBQUM7QUFFdEQsSUFBTSxTQUFTLEdBQUcsVUFBQyxHQUFRLElBQUssT0FBQSxHQUFHLFlBQVksU0FBUyxFQUF4QixDQUF3QixDQUFDO0FBRXpEO0lBY0UsbUJBQ0UsSUFHUztRQUpYLGlCQVdDO1FBeEJNLFdBQU0sR0FBVyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBR2hDLE9BQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQztRQU1iLGFBQVEsR0FBRyxVQUFDLEtBQWUsSUFBTSxDQUFDLENBQUM7UUFFckMsZUFBVSxHQUFtQixFQUFFLENBQUM7UUFRdEMsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztZQUM5QixDQUFDLENBQUMsY0FBTSxPQUFBLElBQUksQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FB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