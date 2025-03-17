# Back-end

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Auth

### POST /api/auth/sign-up
> Request
```json
{
    "firstName": "firstName", // optional
    "lastName": "lastName", // optional
    "email": "user@mail.com",
    "password": "password"
}
```
> Response
```json
{
    "access_token": "theAccessToken-1",
    "refresh_token": "theRefreshToken-1"
}
```

### POST /api/auth/sign-in
> Request
```json
{
    "email": "user@mail.com",
    "password": "password"
}
```
> Response
```json
{
    "access_token": "theAccessToken-2",
    "refresh_token": "theRefreshToken-2"
}
```

### ALL /api/*
> Request header
```json
{
    "Authorization": "Bearer theAccessToken-X",
}
```
