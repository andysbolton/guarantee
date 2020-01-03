"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promisesAplusTests = require("promises-aplus-tests");
var index_1 = require("../src/index");
var adapter = {
    // resolved(value: any) {
    //   // return Guarantee.resolved(value);
    // },
    // rejected(reason: string) {
    //   // return Guarantee.rejected(reason);
    // },
    deferred: function () {
        var promise = new index_1.Guarantee(function () { });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZXMtYXBsdXMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3RzL3Byb21pc2VzLWFwbHVzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQzNELHNDQUF5QztBQUV6QyxJQUFNLE9BQU8sR0FBRztJQUNkLHlCQUF5QjtJQUN6Qix5Q0FBeUM7SUFDekMsS0FBSztJQUNMLDZCQUE2QjtJQUM3QiwwQ0FBMEM7SUFDMUMsS0FBSztJQUNMLFFBQVEsRUFBUjtRQUNFLElBQU0sT0FBTyxHQUFHLElBQUksaUJBQVMsQ0FBQyxjQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE9BQU87WUFDTCxPQUFPLFNBQUE7WUFDUCxPQUFPLEVBQVAsVUFBUSxLQUFVO2dCQUNoQixPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pCLENBQUM7WUFDRCxNQUFNLEVBQU4sVUFBTyxNQUFjO2dCQUNuQixPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLENBQUM7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUNELGVBQWU7SUFDZiw0REFBNEQ7SUFDNUQsMkRBQTJEO0lBQzNELHVCQUF1QjtJQUN2Qix1QkFBdUI7SUFDdkIsc0RBQXNEO0lBQ3RELHFDQUFxQztJQUNyQyxtQ0FBbUM7SUFDbkMsT0FBTztJQUNQLDJDQUEyQztJQUMzQyxhQUFhO0lBQ2IsZUFBZTtJQUNmLDRCQUE0QjtJQUM1Qix5QkFBeUI7SUFDekIsU0FBUztJQUNULCtCQUErQjtJQUMvQiwwQkFBMEI7SUFDMUIsUUFBUTtJQUNSLE9BQU87SUFDUCxJQUFJO0NBQ0wsQ0FBQztBQUVGLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxVQUFTLEdBQVc7SUFDOUMsNkVBQTZFO0FBQy9FLENBQUMsQ0FBQyxDQUFDIn0=