/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** The `BigDecimal` scalar type represents signed fractional values with arbitrary precision. */
  BigDecimal: { input: number; output: number };
  /** The `Date` scalar type represents a date value as specified by [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). */
  Date: { input: string; output: string };
  /** The `DateTime` scalar type represents a date/time value as specified by [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). */
  DateTime: { input: unknown; output: unknown };
};

export type CurrenciesQueryVariables = Exact<{ [key: string]: never }>;

export type CurrenciesQuery = { currencies: Array<{ code: string; name: string }> };

export type LatestQueryVariables = Exact<{ [key: string]: never }>;

export type LatestQuery = { latest: Array<{ quoteCurrency: string; quote: number }> };

export const CurrenciesDocument = gql`
  query Currencies {
    currencies {
      code
      name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CurrenciesGQL extends Apollo.Query<CurrenciesQuery, CurrenciesQueryVariables> {
  document = CurrenciesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LatestDocument = gql`
  query Latest {
    latest {
      quoteCurrency
      quote
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LatestGQL extends Apollo.Query<LatestQuery, LatestQueryVariables> {
  document = LatestDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
