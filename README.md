## Introduction

### Tech Stack

- [Hono]() - Web framework
- [Cloudflare workers]() - Serverless hosting
- [Typescript]()
- [Neon]() - Serverless [Postgres]()
- [Drizzle]() - Database ORM
- [ReactJS]() - Client side library

---

## Setting up

### Downloading the repository

```sh
# Clone the repository
git clone git@git.com #todo

# Cd into the repository directory
cd aj-doge-labs
```

### Installing dependencies

For this project, we are using [bun]() for running the project and managing dependencies.

If you haven't already set it up on your machine, then please follow the instructions on the [bun website]().

Once `bun` is setup, run the following command to install the project's dependencies:

```sh
bun install
```

### Setting up the database

For us to be able to connect to our database, we need to provide a valid [Neon/Postgres] `DATABASE_URL`. We recommend creating a new project on `Neon` and setting up a dev branch.

### Configuring environment variables

- Copy the `.env.example` file in the root directory and rename it to `.env`
- Replace the values of the environment variables with

> Tip: The .env file also contains tips on what values are expected for each environment variable

### Running database migrations

In order to create our database and its tables, we need to run migrations.

---

## Running the project

### Running the project locally

### Deploying to CloudFlare Workers

The live version of our APIs and application is hosted on cloudflare.

> Cloudflare workers contain a generous free tier and you won't need to pay for

If you don't already have a [cloudflare](https://cloudflare.com) account, [create one](https://dash.cloudflare.com/login).

**First: authenticate to cloudflare**

```sh
bun wrangler login
```

**Then: deploy to cloudflare workers**

```sh
bun wrangler deploy
```

Follow the prompts and once done, you will be able to access your deployed API via the URL returned by cloudflare.

Checkout the cloudflare workers documentation to learn more.

---

## Assumptions

Any assumptions you made during development.

---

## Areas of Improvement

Based on how we have structured the project, here are a few potential areas of improvement:

- Setup CI/CD deployments for the repo.

  - This will automate the deployment of new changes to Cloudflare workers, eliminating the need for manual effort.

- Add authentication & authorization to API routes

  - Control who has access to what endpoints

- Our home page `/` could allow us to track how many friend requests a user made vs how many they received vs how many are pending.
  - This can help us derive insight on what players tend to initiate social interactions (which can serve as a growth engine for what type of players to target when marketing / retargeting ads).
