"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// class Thenable<T> implements IThenable<T> {
//   public onFulfilled?: (value: T) => T;
//   public onRejected?: (reason: any) => any;
//   public then(
//     onFulfilled?: (value: T) => T,
//     onRejected?: (reason: any) => any
//   ) {
//     this.onFulfilled =
//       onFulfilled && typeof onFulfilled === "function"
//         ? onFulfilled.bind(undefined)
//         : undefined;
//     this.onRejected =
//       onRejected && typeof onRejected === "function"
//         ? onRejected.bind(undefined)
//         : undefined;
//     return this;
//   }
// }
var globalId = 0;
var Guarantee = /** @class */ (function () {
    function Guarantee(func) {
        var _this = this;
        this.status = "pending";
        this.reason = "";
        this.id = ++globalId;
        this.thenable = function (value) { };
        this.gaurantees = [];
        try {
            func = func && func.bind(this);
            this.thenable =
                func && func !== undefined && typeof func === "function"
                    ? function () { return func(_this.resolve.bind(_this), _this.reject.bind(_this)); }
                    : function () { };
            this.thenable();
        }
        catch (error) {
            console.log(error);
        }
    }
    Guarantee.prototype.resolve = function (value) {
        if (this.status !== "pending") {
            return undefined;
        }
        this.status = "fulfilled";
        this.value = value;
        var self = this;
        // const resolve = () => {
        var nextValue = value;
        var thrown = false;
        var error;
        for (var _i = 0, _a = self.gaurantees; _i < _a.length; _i++) {
            var guarantee = _a[_i];
            if (guarantee.status !== "pending") {
                continue;
            }
            if (thrown && guarantee !== undefined) {
                // previous handler threw an error, so call next reject handler
                guarantee.reject(error);
                thrown = false;
                error = undefined;
            }
            else if (guarantee !== undefined) {
                try {
                    // guarantee.resolve(nextValue);
                    nextValue = guarantee.thenable(nextValue);
                    // Promise resolution: if `nextValue` is a promise, adopt its state
                    // if (nextValue instanceof Guarantee) {
                    //   context.status = nextValue.status;
                    // }
                }
                catch (err) {
                    thrown = true;
                    error = err;
                }
            }
        }
        // };
        // setTimeout(resolve, 0);
        return this;
    };
    Guarantee.prototype.reject = function (reason) {
        if (this.status !== "pending") {
            return undefined;
        }
        this.status = "rejected";
        this.reason = reason;
        var self = this;
        // const reject = () => {
        var nextReason = reason;
        var thrown = false;
        var error;
        for (var _i = 0, _a = self.gaurantees; _i < _a.length; _i++) {
            var guarantee = _a[_i];
            if (guarantee.status !== "pending") {
                continue;
            }
            if (thrown && guarantee !== undefined) {
                guarantee.resolve(error);
                thrown = false;
                error = undefined;
            }
            else if (guarantee !== undefined) {
                try {
                    // nextReason = guarantee.reject(nextReason);
                    nextReason = guarantee.thenable(nextReason);
                    // Promise resolution: if `nextReason` is a promise, adopt its state
                    // if (nextReason instanceof Guarantee) {
                    //   context.status = nextReason.status;
                    // }
                }
                catch (err) {
                    thrown = true;
                    error = err;
                }
            }
        }
        // };
        // setTimeout(reject, 0);
        return this;
    };
    Guarantee.prototype.then = function (onFulfilled, onRejected) {
        var self = this;
        var guarantee = new Guarantee(function (resolve, reject) {
            if (self.status === "fulfilled") {
                if (onFulfilled) {
                    var value = onFulfilled(self.value);
                    resolve(value);
                }
            }
            else if (self.status === "rejected") {
                if (onRejected !== undefined) {
                    var reason = onRejected(self.reason);
                    reject(reason);
                }
            }
        });
        this.gaurantees.push(guarantee);
        return guarantee;
    };
    return Guarantee;
}());
exports.Guarantee = Guarantee;
exports.default = Guarantee;
// const promise = new Guarantee<number>();
// promise.then(() => {
//   console.log(1);
//   return -1;
// });
// promise.then(() => {
//   console.log(2);
//   return -1;
// });
// promise.then(() => {
//   console.log(3);
//   return -1;
// });
// promise.resolve(1);
// console.log(1);
// promise.then(null, function () {
//   console.log('1 func');
//   return 1;
// }).then(function (value) {
//   console.log('2 func');
//   console.log(value);
// });
// promise.then(null, function () {
//   console.log('3 func');
//   throw Error("error")
// }).then(null, function (reason) {
//   console.log('4 func');
//   console.log(reason);
// });
// promise.then(null, function () {
//   console.log('5 func');
//   return 2;
// }).then(function (value) {
//   console.log('6 func');
//   console.log(value);
// });
// const isFunction = (func: any) => typeof func === "function";
// const isObject = (supposedObject: any) =>
//   typeof supposedObject === "object" &&
//   supposedObject !== null &&
//   !Array.isArray(supposedObject);
// const isThenable = (obj: any) => isObject(obj) && isFunction(obj.then);
// const identity = (val: any) => val;
// enum States {
//   PENDING = "PENDING",
//   RESOLVED = "RESOLVED",
//   REJECTED = "REJECTED"
// }
// interface Handler<T, U> {
//   onSuccess: HandlerOnSuccess<T, U>;
//   onFail: HandlerOnFail<U>;
// }
// type HandlerOnSuccess<T, U = any> = (value: T) => U | Thenable<U>;
// type HandlerOnFail<U = any> = (reason: any) => U | Thenable<U>;
// type Finally<U> = () => U | Thenable<U>;
// interface Thenable<T> {
//   then<U>(
//     onSuccess?: HandlerOnSuccess<T, U>,
//     onFail?: HandlerOnFail<U>
//   ): Thenable<U>;
//   then<U>(
//     onSuccess?: HandlerOnSuccess<T, U>,
//     onFail?: (reason: any) => void
//   ): Thenable<U>;
// }
// type Resolve<R> = (value?: R | Thenable<R>) => void;
// type Reject = (value?: any) => void;
// class TimeoutError extends Error {
//   constructor() {
//     super("TIMEOUT");
//   }
// }
// const errors = {
//   TimeoutError
// };
// class PQ<T> {
//   private state: States = States.PENDING;
//   private handlers: Handler<T, any>[] = [];
//   private value: T | any;
//   public static errors = errors;
//   public constructor(callback: (resolve: Resolve<T>, reject: Reject) => void) {
//     try {
//       callback(this.resolve, this.reject);
//     } catch (e) {
//       this.reject(e);
//     }
//   }
//   private resolve = (value?: T | Thenable<T>) => {
//     return this.setResult(value, States.RESOLVED);
//   };
//   private reject = (reason: any) => {
//     return this.setResult(reason, States.REJECTED);
//   };
//   private setResult = (value: T | any, state: States) => {
//     const set = () => {
//       if (this.state !== States.PENDING) {
//         return null;
//       }
//       if (isThenable(value)) {
//         return (value as Thenable<T>).then(this.resolve, this.reject);
//       }
//       this.value = value;
//       this.state = state;
//       return this.executeHandlers();
//     };
//     setTimeout(set, 0);
//   };
//   private executeHandlers = () => {
//     if (this.state === States.PENDING) {
//       return null;
//     }
//     this.handlers.forEach(handler => {
//       if (this.state === States.REJECTED) {
//         return handler.onFail(this.value);
//       }
//       return handler.onSuccess(this.value);
//     });
//     this.handlers = [];
//   };
//   private attachHandler = (handler: Handler<T, any>) => {
//     this.handlers = [...this.handlers, handler];
//     this.executeHandlers();
//   };
//   public then<U>(
//     onSuccess?: HandlerOnSuccess<T, U>,
//     onFail?: HandlerOnFail<U>
//   ) {
//     return new PQ<U | T>((resolve, reject) => {
//       return this.attachHandler({
//         onSuccess: result => {
//           if (!onSuccess) {
//             return resolve(result);
//           }
//           try {
//             return resolve(onSuccess(result));
//           } catch (e) {
//             return reject(e);
//           }
//         },
//         onFail: reason => {
//           if (!onFail) {
//             return reject(reason);
//           }
//           try {
//             return resolve(onFail(reason));
//           } catch (e) {
//             return reject(e);
//           }
//         }
//       });
//     });
//   }
//   public catch<U>(onFail: HandlerOnFail<U>) {
//     return this.then<U>(identity, onFail);
//   }
//   // methods
//   public toString() {
//     return `[object PQ]`;
//   }
//   public finally<U>(cb: Finally<U>) {
//     return new PQ<U>((resolve, reject) => {
//       let val: U | any;
//       let isRejected: boolean;
//       return this.then(
//         value => {
//           isRejected = false;
//           val = value;
//           return cb();
//         },
//         reason => {
//           isRejected = true;
//           val = reason;
//           return cb();
//         }
//       ).then(() => {
//         if (isRejected) {
//           return reject(val);
//         }
//         return resolve(val);
//       });
//     });
//   }
//   public spread<U>(handler: (...args: any[]) => U) {
//     return this.then<U>(collection => {
//       if (Array.isArray(collection)) {
//         return handler(...collection);
//       }
//       return handler(collection);
//     });
//   }
//   public timeout(timeInMs: number) {
//     return new PQ<T>((resolve, reject) => {
//       const timeoutCb = () => {
//         return reject(new PQ.errors.TimeoutError());
//       };
//       setTimeout(timeoutCb, timeInMs);
//       return this.then(resolve);
//     });
//   }
//   // static
//   public static resolve<U = any>(value?: U | Thenable<U>) {
//     return new PQ<U>(resolve => {
//       return resolve(value);
//     });
//   }
//   public static reject<U>(reason?: any) {
//     return new PQ<U>((resolve, reject) => {
//       return reject(reason);
//     });
//   }
//   // public static props<U = any>(obj: object) {
//   //   return new PQ<U>((resolve, reject) => {
//   //     if (!isObject(obj)) {
//   //       return reject(new TypeError("An object must be provided."));
//   //     }
//   //     const resolvedObject = {};
//   //     const keys = Object.keys(obj);
//   //     const resolvedValues = PQ.all<string>(keys.map(key => obj[key]));
//   //     return resolvedValues
//   //       .then(collection => {
//   //         return collection.map((value, index) => {
//   //           resolvedObject[keys[index]] = value;
//   //         });
//   //       })
//   //       .then(() => resolve(resolvedObject as U))
//   //       .catch(reject);
//   //   });
//   // }
//   // public static all<U = any>(collection: (U | Thenable<U>)[]) {
//   //   return new PQ<U[]>((resolve, reject) => {
//   //     if (!Array.isArray(collection)) {
//   //       return reject(new TypeError("An array must be provided."));
//   //     }
//   //     let counter = collection.length;
//   //     const resolvedCollection: U[] = [];
//   //     const tryResolve = (value: U, index: number) => {
//   //       counter -= 1;
//   //       resolvedCollection[index] = value;
//   //       if (counter !== 0) {
//   //         return null;
//   //       }
//   //       return resolve(resolvedCollection);
//   //     };
//   //     return collection.forEach((item, index) => {
//   //       return PQ.resolve(item)
//   //         .then(value => {
//   //           return tryResolve(value, index);
//   //         })
//   //         .catch(reject);
//   //     });
//   //   });
//   // }
//   // public static spread<U extends any[]>(
//   //   collection: U,
//   //   handler: HandlerOnSuccess<any[]>
//   // ) {
//   //   return PQ.all(collection).spread(handler);
//   // }
//   // public static any<U = any>(collection: (U | Thenable<U>)[]) {
//   //   return new PQ<U>((resolve, reject) => {
//   //     return collection.forEach(item => {
//   //       return PQ.resolve(item)
//   //         .then(resolve)
//   //         .catch(reject);
//   //     });
//   //   });
//   // }
//   // public static delay(timeInMs: number) {
//   //   return new PQ(resolve => {
//   //     return setTimeout(resolve, timeInMs);
//   //   });
//   // }
//   // public static promisify<U = any>(
//   //   fn: (...args: any[]) => void,
//   //   context = null
//   // ) {
//   //   return (...args: any[]) => {
//   //     return new PQ<U>((resolve, reject) => {
//   //       return fn.apply(context, [
//   //         ...args,
//   //         (err: any, result: U) => {
//   //           if (err) {
//   //             return reject(err);
//   //           }
//   //           return resolve(result);
//   //         }
//   //       ]);
//   //     });
//   //   };
//   // }
//   // public static promisifyAll<U>(obj: any): U {
//   //   return Object.keys(obj).reduce((result, key) => {
//   //     let prop = obj[key];
//   //     if (isFunction(prop)) {
//   //       prop = PQ.promisify(prop, obj);
//   //     }
//   //     result[`${key}Async`] = prop;
//   //     return result;
//   //   }, {}) as U;
//   // }
// }
// export { PQ };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFTQSw4Q0FBOEM7QUFDOUMsMENBQTBDO0FBQzFDLDhDQUE4QztBQUU5QyxpQkFBaUI7QUFDakIscUNBQXFDO0FBQ3JDLHdDQUF3QztBQUN4QyxRQUFRO0FBQ1IseUJBQXlCO0FBQ3pCLHlEQUF5RDtBQUN6RCx3Q0FBd0M7QUFDeEMsdUJBQXVCO0FBQ3ZCLHdCQUF3QjtBQUN4Qix1REFBdUQ7QUFDdkQsdUNBQXVDO0FBQ3ZDLHVCQUF1QjtBQUV2QixtQkFBbUI7QUFDbkIsTUFBTTtBQUNOLElBQUk7QUFFSixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFFakI7SUFVRSxtQkFDRSxJQUdTO1FBSlgsaUJBZ0JDO1FBekJNLFdBQU0sR0FBVyxTQUFTLENBQUM7UUFDM0IsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUVwQixPQUFFLEdBQUcsRUFBRSxRQUFRLENBQUM7UUFFYixhQUFRLEdBQUcsVUFBQyxLQUFlLElBQU0sQ0FBQyxDQUFDO1FBRXJDLGVBQVUsR0FBbUIsRUFBRSxDQUFDO1FBUXRDLElBQUk7WUFDRixJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLFFBQVE7Z0JBQ1gsSUFBSSxJQUFJLElBQUksS0FBSyxTQUFTLElBQUksT0FBTyxJQUFJLEtBQUssVUFBVTtvQkFDdEQsQ0FBQyxDQUFDLGNBQU0sT0FBQSxJQUFJLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLENBQUMsRUFBckQsQ0FBcUQ7b0JBQzdELENBQUMsQ0FBQyxjQUFPLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwQjtJQUNILENBQUM7SUFFTSwyQkFBTyxHQUFkLFVBQWUsS0FBYztRQUMzQixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQzdCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7UUFDMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFFbkIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWxCLDBCQUEwQjtRQUMxQixJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksS0FBVSxDQUFDO1FBRWYsS0FBd0IsVUFBZSxFQUFmLEtBQUEsSUFBSSxDQUFDLFVBQVUsRUFBZixjQUFlLEVBQWYsSUFBZSxFQUFFO1lBQXBDLElBQU0sU0FBUyxTQUFBO1lBQ2xCLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQ2xDLFNBQVM7YUFDVjtZQUVELElBQUksTUFBTSxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7Z0JBQ3JDLCtEQUErRDtnQkFDL0QsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxHQUFHLEtBQUssQ0FBQztnQkFDZixLQUFLLEdBQUcsU0FBUyxDQUFDO2FBQ25CO2lCQUFNLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDbEMsSUFBSTtvQkFDRixnQ0FBZ0M7b0JBQ2hDLFNBQVMsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUUxQyxtRUFBbUU7b0JBQ25FLHdDQUF3QztvQkFDeEMsdUNBQXVDO29CQUN2QyxJQUFJO2lCQUNMO2dCQUFDLE9BQU8sR0FBRyxFQUFFO29CQUNaLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ2QsS0FBSyxHQUFHLEdBQUcsQ0FBQztpQkFDYjthQUNGO1NBQ0Y7UUFDRCxLQUFLO1FBRUwsMEJBQTBCO1FBRTFCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLDBCQUFNLEdBQWIsVUFBYyxNQUFXO1FBQ3ZCLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDN0IsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFFbEIseUJBQXlCO1FBQ3pCLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQztRQUN4QixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxLQUFVLENBQUM7UUFFZixLQUF3QixVQUFlLEVBQWYsS0FBQSxJQUFJLENBQUMsVUFBVSxFQUFmLGNBQWUsRUFBZixJQUFlLEVBQUU7WUFBcEMsSUFBTSxTQUFTLFNBQUE7WUFDbEIsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtnQkFDbEMsU0FBUzthQUNWO1lBRUQsSUFBSSxNQUFNLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDckMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsTUFBTSxHQUFHLEtBQUssQ0FBQztnQkFDZixLQUFLLEdBQUcsU0FBUyxDQUFDO2FBQ25CO2lCQUFNLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDbEMsSUFBSTtvQkFDRiw2Q0FBNkM7b0JBQzdDLFVBQVUsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUM1QyxvRUFBb0U7b0JBQ3BFLHlDQUF5QztvQkFDekMsd0NBQXdDO29CQUN4QyxJQUFJO2lCQUNMO2dCQUFDLE9BQU8sR0FBRyxFQUFFO29CQUNaLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ2QsS0FBSyxHQUFHLEdBQUcsQ0FBQztpQkFDYjthQUNGO1NBQ0Y7UUFDRCxLQUFLO1FBRUwseUJBQXlCO1FBRXpCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHdCQUFJLEdBQUosVUFDRSxXQUE2QixFQUM3QixVQUFpQztRQUVqQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUksVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUNqRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssV0FBVyxFQUFFO2dCQUMvQixJQUFJLFdBQVcsRUFBRTtvQkFDZixJQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN0QyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2hCO2FBQ0Y7aUJBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtnQkFDckMsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO29CQUM1QixJQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUN2QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ2hCO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUE3SUQsSUE2SUM7QUFFUSw4QkFBUzs7QUFFbEIsMkNBQTJDO0FBRTNDLHVCQUF1QjtBQUN2QixvQkFBb0I7QUFDcEIsZUFBZTtBQUNmLE1BQU07QUFDTix1QkFBdUI7QUFDdkIsb0JBQW9CO0FBQ3BCLGVBQWU7QUFDZixNQUFNO0FBQ04sdUJBQXVCO0FBQ3ZCLG9CQUFvQjtBQUNwQixlQUFlO0FBQ2YsTUFBTTtBQUVOLHNCQUFzQjtBQUN0QixrQkFBa0I7QUFFbEIsbUNBQW1DO0FBQ25DLDJCQUEyQjtBQUMzQixjQUFjO0FBQ2QsNkJBQTZCO0FBQzdCLDJCQUEyQjtBQUMzQix3QkFBd0I7QUFDeEIsTUFBTTtBQUVOLG1DQUFtQztBQUNuQywyQkFBMkI7QUFDM0IseUJBQXlCO0FBQ3pCLG9DQUFvQztBQUNwQywyQkFBMkI7QUFDM0IseUJBQXlCO0FBQ3pCLE1BQU07QUFFTixtQ0FBbUM7QUFDbkMsMkJBQTJCO0FBQzNCLGNBQWM7QUFDZCw2QkFBNkI7QUFDN0IsMkJBQTJCO0FBQzNCLHdCQUF3QjtBQUN4QixNQUFNO0FBRU4sZ0VBQWdFO0FBRWhFLDRDQUE0QztBQUM1QywwQ0FBMEM7QUFDMUMsK0JBQStCO0FBQy9CLG9DQUFvQztBQUVwQywwRUFBMEU7QUFFMUUsc0NBQXNDO0FBRXRDLGdCQUFnQjtBQUNoQix5QkFBeUI7QUFDekIsMkJBQTJCO0FBQzNCLDBCQUEwQjtBQUMxQixJQUFJO0FBRUosNEJBQTRCO0FBQzVCLHVDQUF1QztBQUN2Qyw4QkFBOEI7QUFDOUIsSUFBSTtBQUVKLHFFQUFxRTtBQUNyRSxrRUFBa0U7QUFDbEUsMkNBQTJDO0FBRTNDLDBCQUEwQjtBQUMxQixhQUFhO0FBQ2IsMENBQTBDO0FBQzFDLGdDQUFnQztBQUNoQyxvQkFBb0I7QUFDcEIsYUFBYTtBQUNiLDBDQUEwQztBQUMxQyxxQ0FBcUM7QUFDckMsb0JBQW9CO0FBQ3BCLElBQUk7QUFFSix1REFBdUQ7QUFDdkQsdUNBQXVDO0FBRXZDLHFDQUFxQztBQUNyQyxvQkFBb0I7QUFDcEIsd0JBQXdCO0FBQ3hCLE1BQU07QUFDTixJQUFJO0FBRUosbUJBQW1CO0FBQ25CLGlCQUFpQjtBQUNqQixLQUFLO0FBRUwsZ0JBQWdCO0FBQ2hCLDRDQUE0QztBQUM1Qyw4Q0FBOEM7QUFDOUMsNEJBQTRCO0FBQzVCLG1DQUFtQztBQUVuQyxrRkFBa0Y7QUFDbEYsWUFBWTtBQUNaLDZDQUE2QztBQUM3QyxvQkFBb0I7QUFDcEIsd0JBQXdCO0FBQ3hCLFFBQVE7QUFDUixNQUFNO0FBRU4scURBQXFEO0FBQ3JELHFEQUFxRDtBQUNyRCxPQUFPO0FBRVAsd0NBQXdDO0FBQ3hDLHNEQUFzRDtBQUN0RCxPQUFPO0FBRVAsNkRBQTZEO0FBQzdELDBCQUEwQjtBQUMxQiw2Q0FBNkM7QUFDN0MsdUJBQXVCO0FBQ3ZCLFVBQVU7QUFFVixpQ0FBaUM7QUFDakMseUVBQXlFO0FBQ3pFLFVBQVU7QUFFViw0QkFBNEI7QUFDNUIsNEJBQTRCO0FBRTVCLHVDQUF1QztBQUN2QyxTQUFTO0FBRVQsMEJBQTBCO0FBQzFCLE9BQU87QUFFUCxzQ0FBc0M7QUFDdEMsMkNBQTJDO0FBQzNDLHFCQUFxQjtBQUNyQixRQUFRO0FBRVIseUNBQXlDO0FBQ3pDLDhDQUE4QztBQUM5Qyw2Q0FBNkM7QUFDN0MsVUFBVTtBQUVWLDhDQUE4QztBQUM5QyxVQUFVO0FBRVYsMEJBQTBCO0FBQzFCLE9BQU87QUFFUCw0REFBNEQ7QUFDNUQsbURBQW1EO0FBRW5ELDhCQUE4QjtBQUM5QixPQUFPO0FBRVAsb0JBQW9CO0FBQ3BCLDBDQUEwQztBQUMxQyxnQ0FBZ0M7QUFDaEMsUUFBUTtBQUNSLGtEQUFrRDtBQUNsRCxvQ0FBb0M7QUFDcEMsaUNBQWlDO0FBQ2pDLDhCQUE4QjtBQUM5QixzQ0FBc0M7QUFDdEMsY0FBYztBQUVkLGtCQUFrQjtBQUNsQixpREFBaUQ7QUFDakQsMEJBQTBCO0FBQzFCLGdDQUFnQztBQUNoQyxjQUFjO0FBQ2QsYUFBYTtBQUNiLDhCQUE4QjtBQUM5QiwyQkFBMkI7QUFDM0IscUNBQXFDO0FBQ3JDLGNBQWM7QUFFZCxrQkFBa0I7QUFDbEIsOENBQThDO0FBQzlDLDBCQUEwQjtBQUMxQixnQ0FBZ0M7QUFDaEMsY0FBYztBQUNkLFlBQVk7QUFDWixZQUFZO0FBQ1osVUFBVTtBQUNWLE1BQU07QUFFTixnREFBZ0Q7QUFDaEQsNkNBQTZDO0FBQzdDLE1BQU07QUFFTixlQUFlO0FBRWYsd0JBQXdCO0FBQ3hCLDRCQUE0QjtBQUM1QixNQUFNO0FBRU4sd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5QywwQkFBMEI7QUFDMUIsaUNBQWlDO0FBRWpDLDBCQUEwQjtBQUMxQixxQkFBcUI7QUFDckIsZ0NBQWdDO0FBQ2hDLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekIsYUFBYTtBQUNiLHNCQUFzQjtBQUN0QiwrQkFBK0I7QUFDL0IsMEJBQTBCO0FBQzFCLHlCQUF5QjtBQUN6QixZQUFZO0FBQ1osdUJBQXVCO0FBQ3ZCLDRCQUE0QjtBQUM1QixnQ0FBZ0M7QUFDaEMsWUFBWTtBQUVaLCtCQUErQjtBQUMvQixZQUFZO0FBQ1osVUFBVTtBQUNWLE1BQU07QUFFTix1REFBdUQ7QUFDdkQsMENBQTBDO0FBQzFDLHlDQUF5QztBQUN6Qyx5Q0FBeUM7QUFDekMsVUFBVTtBQUVWLG9DQUFvQztBQUNwQyxVQUFVO0FBQ1YsTUFBTTtBQUVOLHVDQUF1QztBQUN2Qyw4Q0FBOEM7QUFDOUMsa0NBQWtDO0FBQ2xDLHVEQUF1RDtBQUN2RCxXQUFXO0FBRVgseUNBQXlDO0FBRXpDLG1DQUFtQztBQUNuQyxVQUFVO0FBQ1YsTUFBTTtBQUVOLGNBQWM7QUFFZCw4REFBOEQ7QUFDOUQsb0NBQW9DO0FBQ3BDLCtCQUErQjtBQUMvQixVQUFVO0FBQ1YsTUFBTTtBQUVOLDRDQUE0QztBQUM1Qyw4Q0FBOEM7QUFDOUMsK0JBQStCO0FBQy9CLFVBQVU7QUFDVixNQUFNO0FBRU4sbURBQW1EO0FBQ25ELGlEQUFpRDtBQUNqRCxpQ0FBaUM7QUFDakMsMEVBQTBFO0FBQzFFLGFBQWE7QUFFYixzQ0FBc0M7QUFFdEMsMENBQTBDO0FBQzFDLDZFQUE2RTtBQUU3RSxpQ0FBaUM7QUFDakMsbUNBQW1DO0FBQ25DLHlEQUF5RDtBQUN6RCxzREFBc0Q7QUFDdEQsbUJBQW1CO0FBQ25CLGdCQUFnQjtBQUNoQix1REFBdUQ7QUFDdkQsNkJBQTZCO0FBQzdCLGFBQWE7QUFDYixTQUFTO0FBRVQscUVBQXFFO0FBQ3JFLG1EQUFtRDtBQUNuRCw2Q0FBNkM7QUFDN0MseUVBQXlFO0FBQ3pFLGFBQWE7QUFFYiw0Q0FBNEM7QUFDNUMsK0NBQStDO0FBRS9DLDZEQUE2RDtBQUM3RCwyQkFBMkI7QUFDM0IsZ0RBQWdEO0FBRWhELGtDQUFrQztBQUNsQyw0QkFBNEI7QUFDNUIsZUFBZTtBQUVmLGlEQUFpRDtBQUNqRCxjQUFjO0FBRWQsd0RBQXdEO0FBQ3hELHFDQUFxQztBQUNyQyxnQ0FBZ0M7QUFDaEMsa0RBQWtEO0FBQ2xELGtCQUFrQjtBQUNsQiwrQkFBK0I7QUFDL0IsZUFBZTtBQUNmLGFBQWE7QUFDYixTQUFTO0FBRVQsOENBQThDO0FBQzlDLHdCQUF3QjtBQUN4QiwwQ0FBMEM7QUFDMUMsV0FBVztBQUNYLG9EQUFvRDtBQUNwRCxTQUFTO0FBRVQscUVBQXFFO0FBQ3JFLGlEQUFpRDtBQUNqRCwrQ0FBK0M7QUFDL0MscUNBQXFDO0FBQ3JDLDhCQUE4QjtBQUM5QiwrQkFBK0I7QUFDL0IsZUFBZTtBQUNmLGFBQWE7QUFDYixTQUFTO0FBRVQsK0NBQStDO0FBQy9DLG9DQUFvQztBQUNwQyxpREFBaUQ7QUFDakQsYUFBYTtBQUNiLFNBQVM7QUFFVCx5Q0FBeUM7QUFDekMsdUNBQXVDO0FBQ3ZDLHdCQUF3QjtBQUN4QixXQUFXO0FBQ1gsc0NBQXNDO0FBQ3RDLG1EQUFtRDtBQUNuRCx3Q0FBd0M7QUFDeEMsd0JBQXdCO0FBQ3hCLDBDQUEwQztBQUMxQyw0QkFBNEI7QUFDNUIsdUNBQXVDO0FBQ3ZDLG1CQUFtQjtBQUVuQix5Q0FBeUM7QUFDekMsaUJBQWlCO0FBQ2pCLGlCQUFpQjtBQUNqQixlQUFlO0FBQ2YsWUFBWTtBQUNaLFNBQVM7QUFFVCxvREFBb0Q7QUFDcEQsMkRBQTJEO0FBQzNELGdDQUFnQztBQUVoQyxtQ0FBbUM7QUFDbkMsNkNBQTZDO0FBQzdDLGFBQWE7QUFFYix5Q0FBeUM7QUFFekMsMEJBQTBCO0FBQzFCLHNCQUFzQjtBQUN0QixTQUFTO0FBQ1QsSUFBSTtBQUVKLGlCQUFpQiJ9