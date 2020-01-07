enum Status {
  Pending = "pending",
  Rejected = "rejected",
  Fulfilled = "fulfilled"
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw message || "Assertion failed";
  }
}

interface IThenable<T> {
  then: (
    onFulfilled?: (value: T) => T,
    onRejected?: (reason: any) => any
  ) => IThenable<T>;
}

let globalId = 0;

const isFunction = (func: any) =>
  func && func !== undefined && typeof func === "function";

const isFunctionOrObject = (val: any) =>
  isFunction(val) || (val && typeof val === "object");

const isPromise = (obj: any) => obj instanceof Guarantee;

export default class Guarantee<T> implements IThenable<T> {
  public status: Status = Status.Pending;
  public reason: any;
  public value: T | any;
  public id = ++globalId;

  public get pending() {
    return this.status === Status.Pending;
  }

  protected thenable = (value?: T | any) => {};

  private gaurantees: Guarantee<T>[] = [];

  constructor(
    func: (
      resolved: (value: any) => any,
      rejected: (reason: string) => any
    ) => void
  ) {
    // func = func && func.bind(this);
    this.thenable = isFunction(func)
      ? () => func(this.resolve.bind(this), this.reject.bind(this))
      : () => {};
  }

  public resolve(value: T | any) {
    if (!this.pending) {
      return this.value;
    }

    const res = this.promiseResolution(value);

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

  public reject(reason: any) {
    if (!this.pending) {
      return;
    }

    const res = this.promiseResolution(reason);

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
      let value = this.value;
      let reason = this.reason;

      let resolveWrapper = () => {
        try {
          value = onFulfilled && onFulfilled(value);
          resolve(value);
        } catch (error) {
          reject(error);
        }
      };

      let rejectWrapper = () => {
        try {
          reason = onRejected && onRejected(reason);
          reject(reason);
        } catch (error) {
          resolve(error);
        }
      };

      if (this.status === Status.Fulfilled) {
        if (isFunction(onFulfilled)) {
          resolveWrapper();
        } else if (isFunction(onRejected)) {
          reason = this.value;
          rejectWrapper();
        } else {
          resolve(value);
        }
      } else if (this.status === Status.Rejected) {
        if (isFunction(onRejected)) {
          rejectWrapper();
        } else if (isFunction(onFulfilled)) {
          value = this.reason;
          resolveWrapper();
        } else {
          reject(reason);
        }
      }
    });

    this.gaurantees.push(guarantee);

    return guarantee;
  }

  private promiseResolution<T>(this: Guarantee<T>, x: any) {
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
    } else if (isFunctionOrObject(x)) {
      // 2.3.3. Otherwise, if x is an object or function,
      // 2.3.3.1. Let then be x.then.
      let then;
      try {
        then = x.then;
      } catch (error) {
        throw error;
      }
      // TODO: 2.3.3.2. If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
      // 2.3.3.3. If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise, where:
      if (isFunction(then)) {
        x = then.call(x, this.promiseResolution);
      }
    }

    return { value: x, finish: true };
  }
}

export { Guarantee };
