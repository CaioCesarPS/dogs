<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Dog Breeds API - A REST API for managing dog breeds and favorites, built with NestJS.

This API integrates with the [Dog CEO API](https://dog.ceo/dog-api/) to provide information about dog breeds and allows users to manage their favorite breeds.

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

The API will be available at `http://localhost:3000`

## API Documentation

### Base URL

```
http://localhost:3000
```

### Endpoints

#### 1. Get All Dog Breeds

Get a list of all available dog breeds.

```
GET /api/breeds
```

**Parameters:** None

**Query Parameters:** None

**Request Body:** None

**Response:**

```json
[
  "affenpinscher",
  "african",
  "airedale",
  "akita",
  "appenzeller",
  "australian",
  "basenji",
  "beagle",
  "bluetick",
  "borzoi"
]
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/breeds
```

#### 2. Get Images for a Specific Breed

Get a list of image URLs for a specific dog breed.

```
GET /api/breeds/{breed}/images
```

**Parameters:**

- `breed` (string, required): The name of the dog breed (e.g., "beagle", "husky", "bulldog")

**Query Parameters:** None

**Request Body:** None

**Response:**

```json
[
  "https://images.dog.ceo/breeds/beagle/n02088364_10108.jpg",
  "https://images.dog.ceo/breeds/beagle/n02088364_10206.jpg",
  "https://images.dog.ceo/breeds/beagle/n02088364_10236.jpg"
]
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/breeds/beagle/images
```

#### 3. Get Favorite Breeds

Get a list of all favorite dog breeds.

```
GET /api/favorites
```

**Parameters:** None

**Query Parameters:** None

**Request Body:** None

**Response:**

```json
["beagle", "husky", "bulldog"]
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/favorites
```

#### 4. Add Breed to Favorites

Add a dog breed to the favorites list.

```
POST /api/favorites
```

**Parameters:** None

**Query Parameters:** None

**Request Body:**

```json
{
  "breed": "string"
}
```

**Request Body Schema:**

- `breed` (string, required): The name of the dog breed to add to favorites

**Response:**

```json
{
  "message": "Breed 'beagle' added to favorites"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"breed": "beagle"}'
```

#### 5. Remove Breed from Favorites

Remove a dog breed from the favorites list.

```
DELETE /api/favorites/{breed}
```

**Parameters:**

- `breed` (string, required): The name of the dog breed to remove from favorites

**Query Parameters:** None

**Request Body:** None

**Response:**

```json
{
  "message": "Breed 'beagle' removed from favorites"
}
```

**Example:**

```bash
curl -X DELETE http://localhost:3000/api/favorites/beagle
```

### Error Responses

The API returns appropriate HTTP status codes and error messages:

#### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["breed should not be empty", "breed must be a string"],
  "error": "Bad Request"
}
```

#### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Breed not found",
  "error": "Not Found"
}
```

#### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

### Request Headers

For POST requests, include the following header:

```
Content-Type: application/json
```

### Data Persistence

Favorite breeds are stored in a local JSON file (`favorites.json`) in the project root directory. This file is automatically created when the first favorite is added.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
