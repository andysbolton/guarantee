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
        var promise = new index_1.Guarantee(function (resolve, reject) { });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZXMtYXBsdXMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3RzL3Byb21pc2VzLWFwbHVzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQzNELHNDQUF5QztBQUV6QyxJQUFNLE9BQU8sR0FBRztJQUNkLHlCQUF5QjtJQUN6Qix5Q0FBeUM7SUFDekMsS0FBSztJQUNMLDZCQUE2QjtJQUM3QiwwQ0FBMEM7SUFDMUMsS0FBSztJQUNMLFFBQVEsRUFBUjtRQUNFLElBQU0sT0FBTyxHQUFHLElBQUksaUJBQVMsQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLElBQU0sQ0FBQyxDQUFDLENBQUM7UUFDdkQsT0FBTztZQUNMLE9BQU8sU0FBQTtZQUNQLE9BQU8sRUFBUCxVQUFRLEtBQVU7Z0JBQ2hCLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekIsQ0FBQztZQUNELE1BQU0sRUFBTixVQUFPLE1BQWM7Z0JBQ25CLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekIsQ0FBQztTQUNGLENBQUM7SUFDSixDQUFDO0lBQ0QsZUFBZTtJQUNmLDREQUE0RDtJQUM1RCwyREFBMkQ7SUFDM0QsdUJBQXVCO0lBQ3ZCLHVCQUF1QjtJQUN2QixzREFBc0Q7SUFDdEQscUNBQXFDO0lBQ3JDLG1DQUFtQztJQUNuQyxPQUFPO0lBQ1AsMkNBQTJDO0lBQzNDLGFBQWE7SUFDYixlQUFlO0lBQ2YsNEJBQTRCO0lBQzVCLHlCQUF5QjtJQUN6QixTQUFTO0lBQ1QsK0JBQStCO0lBQy9CLDBCQUEwQjtJQUMxQixRQUFRO0lBQ1IsT0FBTztJQUNQLElBQUk7Q0FDTCxDQUFDO0FBRUYsa0JBQWtCLENBQUMsT0FBTyxFQUFFLFVBQVMsR0FBVztJQUM5Qyw2RUFBNkU7QUFDL0UsQ0FBQyxDQUFDLENBQUMifQ==