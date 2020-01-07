"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status;
(function (Status) {
    Status["Pending"] = "pending";
    Status["Rejected"] = "rejected";
    Status["Fulfilled"] = "fulfilled";
})(Status || (Status = {}));
function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}
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
        // func = func && func.bind(this);
        this.thenable = isFunction(func)
            ? function () { return func(_this.resolve.bind(_this), _this.reject.bind(_this)); }
            : function () { };
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
        var res = this.promiseResolution(value);
        if (!res.finish) {
            return;
        }
        // const valueIsPromise = isPromise(value);
        // // 2.3.2.1. If x is pending, promise must remain pending until x is fulfilled or rejected.
        // if (valueIsPromise && value.status === Status.Pending) {
        //   value.then(this.resolve.bind(this), this.reject.bind(this));
        //   return undefined;
        // }
        this.status = Status.Fulfilled;
        this.value = res.value;
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
            return;
        }
        var res = this.promiseResolution(reason);
        if (!res.finish) {
            return;
        }
        // const reasonIsPromise = isPromise(reason);
        // // 2.3.2.1. If x is pending, promise must remain pending until x is fulfilled or rejected.
        // if (reasonIsPromise && reason.status === Status.Pending) {
        //   reason.then(this.resolve.bind(this), this.reject.bind(this));
        //   return undefined;
        // }
        this.status = Status.Rejected;
        this.reason = res.value;
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
            var value = _this.value;
            var reason = _this.reason;
            var resolveWrapper = function () {
                try {
                    value = onFulfilled && onFulfilled(value);
                    resolve(value);
                }
                catch (error) {
                    reject(error);
                }
            };
            var rejectWrapper = function () {
                try {
                    reason = onRejected && onRejected(reason);
                    reject(reason);
                }
                catch (error) {
                    resolve(error);
                }
            };
            if (_this.status === Status.Fulfilled) {
                if (isFunction(onFulfilled)) {
                    resolveWrapper();
                }
                else if (isFunction(onRejected)) {
                    reason = _this.value;
                    rejectWrapper();
                }
                else {
                    resolve(value);
                }
            }
            else if (_this.status === Status.Rejected) {
                if (isFunction(onRejected)) {
                    rejectWrapper();
                }
                else if (isFunction(onFulfilled)) {
                    value = _this.reason;
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
// Tests failing where a promise is thrown and should be returned, but the promiseResolution unpacks the value
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFLLE1BSUo7QUFKRCxXQUFLLE1BQU07SUFDVCw2QkFBbUIsQ0FBQTtJQUNuQiwrQkFBcUIsQ0FBQTtJQUNyQixpQ0FBdUIsQ0FBQTtBQUN6QixDQUFDLEVBSkksTUFBTSxLQUFOLE1BQU0sUUFJVjtBQUVELFNBQVMsTUFBTSxDQUFDLFNBQWtCLEVBQUUsT0FBZTtJQUNqRCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsTUFBTSxPQUFPLElBQUksa0JBQWtCLENBQUM7S0FDckM7QUFDSCxDQUFDO0FBU0QsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBRWpCLElBQU0sVUFBVSxHQUFHLFVBQUMsSUFBUztJQUMzQixPQUFBLElBQUksSUFBSSxJQUFJLEtBQUssU0FBUyxJQUFJLE9BQU8sSUFBSSxLQUFLLFVBQVU7QUFBeEQsQ0FBd0QsQ0FBQztBQUUzRCxJQUFNLGtCQUFrQixHQUFHLFVBQUMsR0FBUTtJQUNsQyxPQUFBLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLENBQUM7QUFBbkQsQ0FBbUQsQ0FBQztBQUV0RCxJQUFNLFNBQVMsR0FBRyxVQUFDLEdBQVEsSUFBSyxPQUFBLEdBQUcsWUFBWSxTQUFTLEVBQXhCLENBQXdCLENBQUM7QUFFekQ7SUFjRSxtQkFDRSxJQUdTO1FBSlgsaUJBVUM7UUF2Qk0sV0FBTSxHQUFXLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFHaEMsT0FBRSxHQUFHLEVBQUUsUUFBUSxDQUFDO1FBTWIsYUFBUSxHQUFHLFVBQUMsS0FBZSxJQUFNLENBQUMsQ0FBQztRQUVyQyxlQUFVLEdBQW1CLEVBQUUsQ0FBQztRQVF0QyxrQ0FBa0M7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO1lBQzlCLENBQUMsQ0FBQyxjQUFNLE9BQUEsSUFBSSxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxDQUFDLEVBQXJELENBQXFEO1lBQzdELENBQUMsQ0FBQyxjQUFPLENBQUMsQ0FBQztJQUNmLENBQUM7SUFsQkQsc0JBQVcsOEJBQU87YUFBbEI7WUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUN4QyxDQUFDOzs7T0FBQTtJQWtCTSwyQkFBTyxHQUFkLFVBQWUsS0FBYztRQUE3QixpQkFpQ0M7UUFoQ0MsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ25CO1FBRUQsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO1lBQ2YsT0FBTztTQUNSO1FBRUQsMkNBQTJDO1FBRTNDLDZGQUE2RjtRQUM3RiwyREFBMkQ7UUFDM0QsaUVBQWlFO1FBQ2pFLHNCQUFzQjtRQUN0QixJQUFJO1FBRUosSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUV2QixJQUFNLE9BQU8sR0FBRztZQUNkLEtBQXdCLFVBQWUsRUFBZixLQUFBLEtBQUksQ0FBQyxVQUFVLEVBQWYsY0FBZSxFQUFmLElBQWUsRUFBRTtnQkFBcEMsSUFBTSxTQUFTLFNBQUE7Z0JBQ2xCLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRTtvQkFDckIsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUN0QjthQUNGO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV2QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSwwQkFBTSxHQUFiLFVBQWMsTUFBVztRQUF6QixpQkFpQ0M7UUFoQ0MsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsT0FBTztTQUNSO1FBRUQsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO1lBQ2YsT0FBTztTQUNSO1FBRUQsNkNBQTZDO1FBRTdDLDZGQUE2RjtRQUM3Riw2REFBNkQ7UUFDN0Qsa0VBQWtFO1FBQ2xFLHNCQUFzQjtRQUN0QixJQUFJO1FBRUosSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUV4QixJQUFNLE1BQU0sR0FBRztZQUNiLEtBQXdCLFVBQWUsRUFBZixLQUFBLEtBQUksQ0FBQyxVQUFVLEVBQWYsY0FBZSxFQUFmLElBQWUsRUFBRTtnQkFBcEMsSUFBTSxTQUFTLFNBQUE7Z0JBQ2xCLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRTtvQkFDckIsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUN0QjthQUNGO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV0QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCx3QkFBSSxHQUFKLFVBQ0UsV0FBNkIsRUFDN0IsVUFBaUM7UUFGbkMsaUJBa0RDO1FBOUNDLElBQU0sU0FBUyxHQUFHLElBQUksU0FBUyxDQUFJLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDakQsSUFBSSxLQUFLLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQztZQUN2QixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDO1lBRXpCLElBQUksY0FBYyxHQUFHO2dCQUNuQixJQUFJO29CQUNGLEtBQUssR0FBRyxXQUFXLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMxQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2hCO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDZjtZQUNILENBQUMsQ0FBQztZQUVGLElBQUksYUFBYSxHQUFHO2dCQUNsQixJQUFJO29CQUNGLE1BQU0sR0FBRyxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUMxQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ2hCO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDaEI7WUFDSCxDQUFDLENBQUM7WUFFRixJQUFJLEtBQUksQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLFNBQVMsRUFBRTtnQkFDcEMsSUFBSSxVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUU7b0JBQzNCLGNBQWMsRUFBRSxDQUFDO2lCQUNsQjtxQkFBTSxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtvQkFDakMsTUFBTSxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3BCLGFBQWEsRUFBRSxDQUFDO2lCQUNqQjtxQkFBTTtvQkFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2hCO2FBQ0Y7aUJBQU0sSUFBSSxLQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUU7Z0JBQzFDLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUMxQixhQUFhLEVBQUUsQ0FBQztpQkFDakI7cUJBQU0sSUFBSSxVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUU7b0JBQ2xDLEtBQUssR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDO29CQUNwQixjQUFjLEVBQUUsQ0FBQztpQkFDbEI7cUJBQU07b0JBQ0wsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUNoQjthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVoQyxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRU8scUNBQWlCLEdBQXpCLFVBQWlELENBQU07UUFDckQsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO1lBQ2QsTUFBTSxJQUFJLFNBQVMsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1NBQ3RFO1FBRUQsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDaEIsMEZBQTBGO1lBQzFGLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFO2dCQUMvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQzthQUNwQztZQUVELDJDQUEyQztZQUMzQyx1RUFBdUU7WUFDdkUsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUU7Z0JBQ2hDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO2FBQ2Q7WUFFRCx1RUFBdUU7WUFDdkUsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Z0JBQ2pDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO2FBQ2I7U0FDRjthQUFNLElBQUksa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDaEMsbURBQW1EO1lBQ25ELCtCQUErQjtZQUMvQixJQUFJLElBQUksU0FBQSxDQUFDO1lBQ1QsSUFBSTtnQkFDRixJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQzthQUNmO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsTUFBTSxLQUFLLENBQUM7YUFDYjtZQUNELHlIQUF5SDtZQUN6SCxtSUFBbUk7WUFDbkksSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3BCLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQzthQUMxQztTQUNGO1FBRUQsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUE1TEQsSUE0TEM7QUFFUSw4QkFBUzs7QUFFbEIsOEdBQThHIn0=