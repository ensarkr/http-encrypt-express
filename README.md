# http-encrypt-express

## About

Express backend api for my [react project.](https://github.com/ensarkr/http-encrypt-react) Signed in users can request random movies. All http requests are encrypted. Check bottom of README file to see whole encryption process.

## Features

- Auth with session id.
- Signed in users can see random movies.
- Http requests are encrypted via AES-CBC.
- Shared private key created via ECDH, uses prime256v1 curve.

## Middlewares

#### roleProcess

Validates client roles by verifying `Authorization` and `X-Client-ID` headers of requests.
If validation fails responds with error.
If it validates successfully `res.locals.auth` set.
Roles include unknown, guest and user.

#### decryptBody

Decrypts string bodies that sent by clients according to `res.locals.auth.clientID`.

#### sendEncrypted

Sends encrypted responses to clients.

## Routes

> API client roles = G (guest), U (user)  
> Encrypted route ✔️, Not-encrypted ❌
> If error occurs while decrypting requests, error responses mostly not-encrypted.

- ❌ handshake - create ECDH shared private key between client and server
  >
- ✔️ auth/signUp - G - sign up
- ✔️ auth/signIn - G - sign in
- ✔️ auth/verifySession - U - verify session id
  >
- ✔️ data/randomMovies - U - get 10 random movies

## To Run Locally

1. Use http_encrypt_db.sql file inside setup folder to setup database schemas.
2. Move .env.example to root folder from setup folder.
3. Remove .example and fill the blanks.

```
$ npm install
$ npm start
```

After this api is locally accessible on http://localhost:5000/

## To Test

Tests exist for most functionalities of all api routes.

```
<!-- to run all tests -->
$ npm test

<!-- to run specific tests -->
$ npm test ./src/api/<route to the test file>
```

## Technologies

- TypeScript
- Express
- ts-jest
- node-cache
- PostgreSQL

## Encryption Process
TBA