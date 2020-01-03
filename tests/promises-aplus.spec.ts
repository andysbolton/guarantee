const promisesAplusTests = require("promises-aplus-tests");
import { Guarantee } from "../src/index";

const adapter = {
  // resolved(value: any) {
  //   // return Guarantee.resolved(value);
  // },
  // rejected(reason: string) {
  //   // return Guarantee.rejected(reason);
  // },
  deferred() {
    const promise = new Guarantee(() => {});
    return {
      promise,
      resolve(value: any) {
        promise.resolve(value);
      },
      reject(reason: string) {
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

promisesAplusTests(adapter, function(err: string) {
  // All done; output is in the console. Or check `err` for number of failures.
});
