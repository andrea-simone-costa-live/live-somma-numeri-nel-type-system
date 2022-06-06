type NumberToString<N extends number> = `${N}`;

type StringToNumber<SN extends string> = SN extends NumberToString<infer N>
  ? N
  : never;

type NumberToTuple<
  N extends number,
  R extends readonly any[] = []
> = N extends R["length"] ? R : NumberToTuple<N, [...R, any]>;
type TupleToNumber<T extends readonly any[]> = T["length"];

type ConcatTuples<T1 extends readonly any[], T2 extends readonly any[]> = [
  ...T1,
  ...T2
];

type LastChar<
  S extends string,
  BEF extends string = ""
> = S extends `${infer FIRST}${infer REST}`
  ? REST extends ""
  ? [BEF, FIRST]
  : LastChar<REST, `${BEF}${FIRST}`>
  : never;

type Cast<X, Y> = X extends Y ? X : Y;

type SumDigits<
  D1 extends string,
  D2 extends string,
  Carry extends string = "0"
> = NumberToString<
  Cast<
    TupleToNumber<
      ConcatTuples<
        ConcatTuples<
          NumberToTuple<StringToNumber<D1>>,
          NumberToTuple<StringToNumber<D2>>
        >,
        NumberToTuple<StringToNumber<Carry>>
      >
    >,
    number
  >
>;

type TensAndUnits<S extends string> = S extends `${infer FIRST}${infer REST}`
  ? REST extends ""
  ? ["0", FIRST]
  : [FIRST, REST]
  : never;

type TupleToString<
  T extends readonly string[],
  R extends string = ""
> = T extends readonly []
  ? R
  : T extends readonly [infer FIRST extends string, ...infer REST extends readonly string[]]
  ? TupleToString<REST, `${R}${FIRST}`>
  : never;

namespace Sum {
  type __Sum<
    // result of SumDigits
    S extends [string, string],
    LCN0 extends string,
    LCM0 extends string,
    R extends readonly any[] = []
  > = _Sum<LCN0, LCM0, [S[1], ...R], S[0]>;

  type _Sum<
    N extends string,
    M extends string,
    R extends readonly any[] = [],
    Carry extends string = "0",
    LCN extends LastChar<N> = LastChar<N>,
    LCM extends LastChar<M> = LastChar<M>
  > = N extends ""
    ? M extends ""
    ? Carry extends "0"
    ? StringToNumber<TupleToString<R>>
    : StringToNumber<TupleToString<[Carry, ...R]>>
    : __Sum<TensAndUnits<SumDigits<"0", LCM[1], Carry>>, "", LCM[0], R>
    : M extends ""
    ? __Sum<TensAndUnits<SumDigits<LCN[1], "0", Carry>>, LCN[0], "", R>
    : __Sum<TensAndUnits<SumDigits<LCN[1], LCM[1], Carry>>, LCN[0], LCM[0], R>;

  export type SumNumbers<N extends number, M extends number> = _Sum<
    NumberToString<N>,
    NumberToString<M>
  >;
}


type T0 = Sum.SumNumbers<4, 8>;
//   ^?
type T1 = Sum.SumNumbers<73, 27>;
//   ^?
type T2 = Sum.SumNumbers<100, 3>;
//   ^?
type T3 = Sum.SumNumbers<4, 123>;
//   ^?
type T4 = Sum.SumNumbers<1234, 5678>;
//   ^?
type T5 = Sum.SumNumbers<1_000_000_000_000, 0>;
//   ^?