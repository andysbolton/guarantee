"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var promisesAplusTests = require("promises-aplus-tests");
var index_1 = __importDefault(require("../src/index"));
var adapter = {
    // resolved(value: any) {
    //   // return Guarantee.resolved(value);
    // },
    // rejected(reason: string) {
    //   // return Guarantee.rejected(reason);
    // },
    deferred: function () {
        var promise = new index_1.default(function (resolve, reject) { });
        return {
            promise: promise,
            resolve: function (value) {
                promise.resolve(value);
            },
            reject: function (reason) {
                promise.reject(reason);
            }
        };
    }
    // deferred() {
    //   let doResolve = (func: any) => (val: any) => func(val);
    //   let doReject = (func: any) => (val: any) => func(val);
    //   let resolver: any;
    //   let rejecter: any;
    //   const callback = (resolve: any, reject: any) => {
    //     resolver = doResolve(resolve);
    //     rejecter = doReject(reject);
    //   };
    //   const promise = new Promise(callback);
    //   return {
    //     promise,
    //     resolve(value: any) {
    //       resolver(value);
    //     },
    //     reject(reason: string) {
    //       rejecter(reason);
    //     }
    //   };
    // }
};
promisesAplusTests(adapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZXMtYXBsdXMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3RzL3Byb21pc2VzLWFwbHVzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQzNELHVEQUFxQztBQUVyQyxJQUFNLE9BQU8sR0FBRztJQUNkLHlCQUF5QjtJQUN6Qix5Q0FBeUM7SUFDekMsS0FBSztJQUNMLDZCQUE2QjtJQUM3QiwwQ0FBMEM7SUFDMUMsS0FBSztJQUNMLFFBQVEsRUFBUjtRQUNFLElBQU0sT0FBTyxHQUFHLElBQUksZUFBUyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sSUFBTSxDQUFDLENBQUMsQ0FBQztRQUN2RCxPQUFPO1lBQ0wsT0FBTyxTQUFBO1lBQ1AsT0FBTyxFQUFQLFVBQVEsS0FBVTtnQkFDaEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QixDQUFDO1lBQ0QsTUFBTSxFQUFOLFVBQU8sTUFBYztnQkFDbkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6QixDQUFDO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFDRCxlQUFlO0lBQ2YsNERBQTREO0lBQzVELDJEQUEyRDtJQUMzRCx1QkFBdUI7SUFDdkIsdUJBQXVCO0lBQ3ZCLHNEQUFzRDtJQUN0RCxxQ0FBcUM7SUFDckMsbUNBQW1DO0lBQ25DLE9BQU87SUFDUCwyQ0FBMkM7SUFDM0MsYUFBYTtJQUNiLGVBQWU7SUFDZiw0QkFBNEI7SUFDNUIseUJBQXlCO0lBQ3pCLFNBQVM7SUFDVCwrQkFBK0I7SUFDL0IsMEJBQTBCO0lBQzFCLFFBQVE7SUFDUixPQUFPO0lBQ1AsSUFBSTtDQUNMLENBQUM7QUFFRixrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsVUFBUyxHQUFXO0lBQzlDLDZFQUE2RTtBQUMvRSxDQUFDLENBQUMsQ0FBQyJ9