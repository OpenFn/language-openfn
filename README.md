# Language Template [![Build Status](https://travis-ci.org/OpenFn/language-template.svg?branch=master)](https://travis-ci.org/OpenFn/language-template)

Language Pack for building expressions and operations to interact with the
[TEMPLATE] API.

## Documentation

## post

#### sample configuration

```json
{
  "username": "taylor@openfn.org",
  "password": "supersecret"
}
```

#### sample expression using operation

```js
post({
  "url": "api/v1/forms/data/wide/json/formId",
  "body": {"a":1}
  "headers": {}
})
```

## Development

Clone the repo, run `npm install`.

Run tests using `npm run test` or `npm run test:watch`

Build the project using `make`.
