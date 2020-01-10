enum Status {
  Pending = "pending",
  Rejected = "rejected",
  Fulfilled = "fulfilled"
}

interface IThenable<T> {
  then: (
    onFulfilled?: (value: T) => T,
    onRejected?: (reason: any) => any
  ) => IThenable<T>;
}

type Thenable = () => void;
type ThenableContinuation<T> = { value?: T | any; finish: boolean };

const isFunction = (func: any) => typeof func === "function";
const isObject = (val: any) => val && typeof val === "object";
const isPromise = (val: any) => val instanceof Guarantee;

export default class Guarantee<T> implements IThenable<T> {
  public status: Status = Status.Pending;
  public reason: any;
  public value: T | any;

  public get pending() {
    return this.status === Status.Pending;
  }

  private thenable: Thenable;
  private gaurantees: Guarantee<T>[] = [];

  constructor(
    func: (
      resolved: (value: any, unpack?: boolean) => any,
      rejected: (reason: string, unpack?: boolean) => any
    ) => void
  ) {
    if (!isFunction(func)) {
      throw new TypeError("Constructor value should be a function.");
    }
    this.thenable = () =>
      func(this.resolveInternal.bind(this), this.rejectInternal.bind(this));
  }

  public resolve = (value: T | any) => {
    this.resolveInternal(value, false);
  };

  private resolveInternal(value: any, unpack: boolean = false) {
    if (!this.pending) {
      return this.value;
    }

    let res;
    if (!unpack) {
      res = this.promiseResolution(value);
      if (!res.finish) {
        return;
      }
    }

    this.status = Status.Fulfilled;
    this.value = res ? res.value : value;

    const resolve = () => {
      for (const guarantee of this.gaurantees) {
        if (guarantee.pending) {
          guarantee.thenable();
        }
      }
    };

    setTimeout(resolve, 0);

    return this;
  }

  public reject = (reason: any) => {
    this.rejectInternal(reason, false);
  };

  private rejectInternal(reason: any, unpack: boolean = false) {
    if (!this.pending) {
      return;
    }

    let res;
    if (!unpack) {
      res = this.promiseResolution(reason);
      if (!res.finish) {
        return;
      }
    }

    this.status = Status.Rejected;
    this.reason = res ? res.value : reason;

    const reject = () => {
      for (const guarantee of this.gaurantees) {
        if (guarantee.pending) {
          guarantee.thenable();
        }
      }
    };

    setTimeout(reject, 0);

    return this;
  }

  then(
    onFulfilled?: (value: T) => T,
    onRejected?: (reason: any) => any
  ): Guarantee<T> {
    const guarantee = new Guarantee<T>((resolve, reject) => {
      const resolveWrapper = (value: any) => {
        try {
          resolve(onFulfilled && onFulfilled(value));
        } catch (e) {
          reject(e, true);
        }
      };

      const rejectWrapper = (reason: any) => {
        try {
          reject(onRejected && onRejected(reason));
        } catch (e) {
          resolve(e, true);
        }
      };

      if (this.status === Status.Fulfilled) {
        if (isFunction(onFulfilled)) {
          resolveWrapper(this.value);
        } else if (isFunction(onRejected)) {
          rejectWrapper(this.value);
        } else {
          resolve(this.value);
        }
      } else if (this.status === Status.Rejected) {
        if (isFunction(onRejected)) {
          rejectWrapper(this.reason);
        } else if (isFunction(onFulfilled)) {
          resolveWrapper(this.reason);
        } else {
          reject(this.reason);
        }
      }
    });

    this.gaurantees.push(guarantee);

    return guarantee;
  }

  private promiseResolution<T>(
    this: Guarantee<T>,
    x: any
  ): ThenableContinuation<T> {
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
    } else if (isFunction(x) || isObject(x)) {
      // 2.3.3. Otherwise, if x is an object or function,
      let then;
      try {
        // 2.3.3.1. Let then be x.then.
        then = x.then;
      } catch (e) {
        this.rejectInternal(e, true);
        return { finish: false };
      }

      if (isFunction(then)) {
        let called = false;
        const resolvePromise = (val: any) => {
          if (!called) {
            called = true;
            let res = this.promiseResolution(val);
            if (res.finish) {
              this.resolve(res.value);
            }
          }
        };

        const rejectPromise = (reason: any) => {
          if (!called) {
            called = true;
            this.rejectInternal(reason, true);
          }
        };

        try {
          // 2.3.3.3. If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise, where:
          then.call(x, resolvePromise, rejectPromise);
        } catch (e) {
          if (!called) {
            this.rejectInternal(e, true);
          }
        }

        return { finish: false };
      }
    }

    return { value: x, finish: true };
  }
}
