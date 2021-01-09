# [API] GoBarber
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/DiegoVictor/gobarber-api/CI?logo=github&style=flat-square)](https://github.com/DiegoVictor/gobarber-api/actions)
[![postgres](https://img.shields.io/badge/postgres-8.2.1-326690?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![mongo](https://img.shields.io/badge/mongodb-3.5.9-13aa52?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![redis](https://img.shields.io/badge/redis-3.0.2-d92b21?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![eslint](https://img.shields.io/badge/eslint-6.8.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-26.1.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/gobarber-api?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/gobarber-api)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/DiegoVictor/gobarber-api/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=GoBarber&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fgobarber%2Fmaster%2Fapi%2FInsomnia_2020-11-21.json)

Responsible for provide data to the [`web`](https://github.com/DiegoVictor/gobarber-web) and [`mobile`](https://github.com/DiegoVictor/gobarber-app) front-ends. Permit to register yourself as a provider or a customer, allows customers to see providers free days' hours availability and book with them a barber shop service and also notify by email providers when a book is created. Also the app has rate limit, uses JWT to logins and validation.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [Postgres](#postgres)
      * [Migrations](#migrations)
    * [MongoDB](#mongodb)
    * [Redis](#redis)
    * [.env](#env)
    * [Rate Limit (Optional)](#rate-limit)
* [Usage](#usage)
  * [Pagination](#pagination)
    * [Link Header](#link-header)
    * [X-Total-Count](#x-total-count)
  * [Bearer Token](#bearer-token)
  * [Routes](#routes)
    * [Requests](#requests)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
The application use three databases: [Postgres](https://www.postgresql.org/), [MongoDB](https://www.mongodb.com/) and [Redis](https://redis.io/). For the fastest setup is recommended to use [docker](https://www.docker.com/), see below how to setup ever database.

### Postgres
Responsible to store almost all application data. To create a postgres container just run:
```
$ docker run --name gobarber-postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

#### Migrations
Remember to run the database migrations:
```
$ yarn ts-node-dev ./node_modules/typeorm/cli.js migration:run
```
Or:
```
$ yarn typeorm migration:run
```
> See more information on [TypeORM Migrations](https://typeorm.io/#/migrations).

### MongoDB
Store application's notifications. You can create a MongoDB container like so:
```
$ docker run --name gobarber-mongo -d -p 27017:27017 mongo
```

### Redis
Responsible to store data utilized by the rate limit middleware and the application's cache. To create a redis container:
```
$ docker run --name gobarber-redis -d -p 6379:6379 redis:alpine
```

### .env
In this file you may configure your Postgres, MongoDB and Redis database connection, JWT settings, email and storage driver and app's urls. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|APP_API_URL|Used to mount avatars' urls.|`http://127.0.0.1:3333`
|APP_WEB_URL|Used to create the reset password link (front-end) sent in the recover password email.|`http://127.0.0.1:3000`
|APP_SECRET|A alphanumeric random string. Used to create signed tokens.| -
|MAIL_DRIVER|Indicate what email service use to send messages, the possible values are `ethereal` and `ses`, to use the [SES](https://aws.amazon.com/ses/) service remember to to configure the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_DEFAULT_REGION` keys.|`ethereal`
|AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY|These keys are necessary to AWS allow the application to use the S3 and SES services throught API. See how to get yours keys here: [Set up AWS Credentials](https://docs.aws.amazon.com/toolkit-for-eclipse/v1/user-guide/setup-credentials.html)| -
|AWS_DEFAULT_REGION|You can see your default region in the navigation bar at the top right after login in the [AWS Management Console](https://sa-east-1.console.aws.amazon.com/console/home). Read [AWS service endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html) to know more about regions.| -
|AWS_S3_BUCKET_NAME|Amazon S3 stores data as objects within buckets. To create a bucket see [Creating a bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html)|gobarber
|POSTGRES_HOST| Postgres host.|`127.0.0.1`
|POSTGRES_PORT| Postgres port.|`5432`
|POSTGRES_USERNAME| Postgres user.|`postgres`
|POSTGRES_PASSWORD| Postgres password.| -
|POSTGRES_DATABASE| Application's database name.|gobarber
|MONGO_HOST|MongoDB host.|`127.0.0.1`
|MONGO_PORT|MongoDB port.|`27017`
|MONGO_DATABASE|MongoDB database name.|gobarber
|REDIS_HOST|Redis host.|`127.0.0.1`
|REDIS_PORT|Redis port.|`6379`
|REDIS_PASSWORD|Redis password.| -
|STORAGE_DRIVER|Indicate where the users's avatar will be stored, the possible values are `disk` and `s3`, to store into [S3](https://aws.amazon.com/s3/) remember to configure all the `AWS_*` keys.|`disk`

> For Windows users using Docker Toolbox maybe be necessary in your `.env` file set the host of the Postgres, MongoDB and Redis to `192.168.99.100` (docker machine IP) instead of `localhost` or `127.0.0.1`.

### Rate Limit (Optional)
The project comes pre-configured, but you can adjust it as your needs.

* `src/config/rate_limit.ts`

|key|description|default
|---|---|---
|duration|Number of seconds before consumed points are reset.|`300`
|points|Maximum number of points can be consumed over duration.|`10`

> The lib [`rate-limiter-flexible`](https://github.com/animir/node-rate-limiter-flexible) was used to rate the api's limits, for more configuration information go to [Options](https://github.com/animir/node-rate-limiter-flexible/wiki/Options#options) page.

# Usage
To start up the app run:
```
$ yarn dev:server
```
Or:
```
npm run dev:server
```

## Pagination
All the routes with pagination returns 30 records per page, to navigate to other pages just send the `page` query parameter with the number of the page.

* To get the third page of providers:
```
GET http://localhost:3333/providers?page=3
```

### Link Header
Also in the headers of every route with pagination the `Link` header is returned with links to `first`, `last`, `next` and `prev` (previous) page.
```
<http://localhost:3333/providers?page=7>; rel="last",
<http://localhost:3333/providers?page=4>; rel="next",
<http://localhost:3333/providers?page=1>; rel="first",
<http://localhost:3333/providers?page=2>; rel="prev"
```
> See more about this header in this MDN doc: [Link - HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link).

### X-Total-Count
Another header returned in routes with pagination, this bring the total records amount.

## Bearer Token
A few routes expect a Bearer Token in an `Authorization` header.
> You can see these routes in the [routes](#routes) section.
```
POST http://localhost:3333/appointments Authorization: Bearer <token>
```
> To achieve this token you just need authenticate through the `/sessions` route and it will return the `token` key with a valid Bearer Token.

## Routes
|route|HTTP Method|pagination|params|description|auth method
|:---|:---:|:---:|:---:|:---:|:---:
|`/sessions`|POST|:x:|Body with user's email and password.|Authenticates user, return a Bearer Token and user's id and email.|:x:
|`/users`|POST|:x:|Body with user's email and password.|Create new users.|:x:
|`/profile`|GET|:x:| - |Logged in user profile.|Bearer
|`/profile`|PUT|:x:|Body with user `name`, `email`, `old_password`, `password` and `password_confirmation`.|Update user.|Bearer
|`/users/avatar`|PATCH|:x:|Multipart payload with a `avatar` field with a image (See insomnia file for good example).|Update user avatar.|Bearer
|`/appointments`|POST|:x:|Body with appointment `provider_id` and `date`.|Create a new appointment.|Bearer
|`/appointments/schedule`|GET|:x:|`day`, `month` and `year` query parameters.|Return user's scheduled appointments in a specific date.|Bearer
|`/providers`|GET|:heavy_check_mark:|`page` query parameter.|Lists providers.|Bearer
|`/providers/:id/month_availability`|GET|:x:|`month` and `year` query parameters.|List month's days availability|Bearer
|`/providers/:id/day_availability`|GET|:x:|`day`, `month` and `year` query parameters.|List a specific day availability.|Bearer
|`/password/forgot`|POST|:x:|Body with user's `email`.|Send to user the reset password email.|:x:
|`/password/reset`|POST|:x:|Body with user's new `password` and `password_confirmation`.|Reset user's password.|:x:

> Routes with `Bearer` as auth method expect an `Authorization` header. See [Bearer Token](#bearer-token) section for more information.

### Requests
* `POST /session`

Request body:
```json
{
  "email": "johndoe@example.com",
  "password": "123456"
}
```

* `POST /users`

Request body:
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "123456"
}
```

* `PUT /profile`

Request body:
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "old_password": "123456",
  "password": "123456789",
  "password_confirmation": "123456789"
}
```

* `PATCH /users/avatar`

Image file

* `POST /appointments`

Request body:
```json
{
  "provider_id": "01931fee-32d4-4af7-b4e9-12159c5d703e",
  "date": "2020-11-20 15:00:00"
}
```

* `POST /password/forgot`

Request body:
```json
{
  "email": "johndoe@example.com"
}
```

* `POST /password/reset`

Request body:
```json
{
  "password": "123456",
  "password_confirmation": "123456",
  "token": "6878f9b2-eb7c-4ad6-ac72-66d958f117c2"
}
```

# Running the tests
[Jest](https://jestjs.io/) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `test/coverage`. They are automatically created after the tests run.
