# Language OpenFn [![Build Status](https://travis-ci.org/OpenFn/language-openfn.svg?branch=master)](https://travis-ci.org/OpenFn/language-openfn)

Adaptor for building expressions and operations to interact with the OpenFn API.

## Documentation

## get

```js
get('/api/jobs', {
  params: {
    project_id: 490,
  },
});
```

#### sample configuration

```json
{
  "host": "https://www.openfn.org",
  "username": "someone@ngo.org",
  "password": "supersecret"
}
```

## Development

Clone the repo, run `npm install`.

Run tests using `npm run test` or `npm run test:watch`

Build the project using `make`.
