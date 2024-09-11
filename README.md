## Introduction

### Tech Stack

- [Hono](https://hono.dev) - Web framework
- [Cloudflare workers](https://workers.cloudflare.com/) - Serverless hosting
- [Typescript](https://www.typescriptlang.org/)
- [Neon](https://neon.tech/) - Serverless [Postgres](https://www.postgresql.org/)
- [Drizzle](https://orm.drizzle.team/) - Database ORM
- [ReactJS](https://react.dev/) - Client side library
- [Bun](https://bun.sh) - A fast runtime, bundler and package manager

---

## Cloning the repository

```sh
# clone with ssh
git clone git@github.com:AllanJeremy/doge-labs-vr.git

# or: clone with https
git clone https://github.com/AllanJeremy/doge-labs-vr.git

# cd into the repository directory
cd aj-doge-labs
```

## Installing dependencies

For this project, we are using [bun](https://bun.sh/) for running the project and managing dependencies.

If you haven't already set it up on your machine, then please follow the instructions on the [bun website](https://bun.sh/).

Once `bun` is setup, run the following command to install the project's dependencies:

```sh
bun install
```

## Setting up the database

For us to be able to connect to our database, we need to provide a valid [Neon/Postgres] `DATABASE_URL`. We recommend creating a new project on `Neon` and setting up a dev branch.

### Configuring environment variables

- Copy the `.env.example` file in the root directory and rename it to `.env`
- Replace the values of the environment variables with

> Tip: The .env file also contains tips on what values are expected for each environment variable

### Running database migrations

In order to create our database and its tables, we need to run migrations. You can use the following command

```sh
# Runs existing migrations
bun db:migrate
```

When adding your own schemas or modifying a schema, you will need to generate new migrations. You can do so using

```sh
# Generates new migrations based on your schema files
bun db:generate
```

---

## Running the project locally

To run the project locally, use the following command:

```sh
bun dev
```

The project should now be accessible via [http://localhost:8787](http://localhost:8787).

## Deploying to CloudFlare Workers

The live version of our APIs and application are deployed using cloudflare workers.

> Cloudflare workers contain a generous free tier and you won't need to pay for anything to setup, run or test out this project.

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

Checkout the [cloudflare workers documentation](https://developers.cloudflare.com/workers) to learn more.

---

## Assumptions made

With great power, comes some compromise, or whatever Uncle Ben from spiderman said.

![Cat Typing](memes/cat-typing.gif)

Anyway, here are some assumptions I made while creating these APIs:

1. The database should be able to handle 10M users (BigBallerz currently has 2M users)

---

## Additional features

1. CI/CD & automatic deploys through GitHub

---

## Areas of Improvement

![SpongeBob and Patrick thinking deeply](memes/spongebob-and-patrick-thinking.gif)

Based on how we have structured the project, here are a few potential areas of improvement (in no particular order):

1. **Setup CI/CD deployments for the repo.**

- This will automate the deployment of new changes to Cloudflare workers, eliminating the need for manual effort.

2. **Add authentication & authorization to API routes**

- Control who has access to what endpoints

3. **Caching:** Further reduce the load on the database by potentially using an in-memory cache to access frequently accessed records

- This would work particularly well when fetching user/friend information for popular creators, which would be lots of duplicate requests being made to fetch the same thing.

4. **Track friend request metrics** (sent, received, pending) on the home page.

- This can help us derive insight on what players tend to initiate social interactions (which can serve as a growth engine for what type of players to target when marketing / retargeting ads).

5. **Add typesafety to `.env` by using zod to validate whether or not our environment variables are correctly setup.**

6. **Rate limiting:** limit how many requests a user can make over a period of time eg. per minute (prevent spam & ddos)

7. **Database backups & replication:** snapshots of the database that can be used incase one database instance goes down.

8. **Add a contribution guide**

- This would reside in [CONTRIBUTION.md](CONTRIBUTION.md) and would contain
  - Code style guides: so the codebase remains consistent
  - Architectural decisions
  - How to add/modify stuff
  - Pull request process & rules etc.

9. Combine initial migrations into one migration file

- Since I was iterating in dev, there were a few database changes that were made in the early stages.
- In retrospect, I could have waited until I was done to generate the single migration needed to run when you setup the project. However, creating multiple migrations is also indicative of how real-world use occurs, so ><
