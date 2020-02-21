declare module 'conditional-expression' {

  type TFunction<T> = (value: T) => any;

  type TOnFunction<T> = (value: T) => boolean;

  interface IHigherOrderMatchReturn<T> {
    on: (func: TOnFunction<T>) => IMachable<T>;
    with: (value: string) => IMachable<T>;
    equals: (value: T) => IMachable<T>;
    includes: (value: string) => IMachable<T>;
    typeOf: (value: string) => IMachable<T>;
    isGreaterThan: (value: T) => IMachable<T>;
    lessThan: (value: T) => IMachable<T>;
    atLeast: (value: T) => IMachable<T>;
    atMost: (value: T) => IMachable<T>;
    else: (value: T | TFunction<T>) => any;
  }

  interface IMachable<T> extends IHigherOrderMatchReturn<T> {
    then: (value: T | TFunction<T>) => IHigherOrderMatchReturn<T>;
    thenMatched: (value: T | TFunction<T>) => IHigherOrderMatchReturn<T>;
  }

  export default function match<T>(value: T): IHigherOrderMatchReturn<T>;
}