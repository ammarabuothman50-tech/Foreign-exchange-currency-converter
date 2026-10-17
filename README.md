# FX Checker

Foreign exchange currency converter built with Angular 21 and PrimeNG, based on the
[Frontend Mentor challenge](https://www.frontendmentor.io/challenges/foreign-exchange-currency-converter).

Rates come from the [SWOP](https://swop.cx) GraphQL API (ECB end-of-day data).

## Setup

```bash
npm install
cp .env.example .env
```

Put your SWOP API key in `.env`, then:

```bash
npm start
```

Open http://localhost:4200.

## Scripts

- `npm start` - dev server
- `npm run build` - production build
- `npm test` - unit tests

## Notes

- The free SWOP plan only allows EUR as the base currency, so every other pair is calculated
  from EUR rates (`USD -> GBP = EUR->GBP / EUR->USD`).
- History, change and ticker values come from `historical` rates, one aliased query per range.
- Favorites and the conversion log are saved in `localStorage`.
- `NG_APP_*` variables end up in the browser bundle, so only use a key that is fine to expose.
