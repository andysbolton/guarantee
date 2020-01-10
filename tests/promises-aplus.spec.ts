const promisesAplusTests = require("promises-aplus-tests");
import Guarantee from "../src/index";

const adapter = {
  // resolved(value: any) {
  //   return Guarantee.resolved(value);
  // },
  // rejected(reason: string) {
  //   return Guarantee.rejected(reason);
  // },
  deferred() {
    const promise = new Guarantee();
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
};

promisesAplusTests(adapter, function(err: string) {
  // All done; output is in the console. Or check `err` for number of failures.
});
