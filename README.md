![Doge-o logo banner](_memes/doge-o-logo-banner.png)

> _Came up with the name while on a walk and it stuck 😅. So I made a quick logo with Dalle and Figma 🖌️._

## Overview

Your task is to create a simple yet functional Friends List system. The system should allow users to manage a list of friends through a set of API endpoints (bonus: provide a small React-based home page displaying basic statistics about the users and their friends).

This project includes 3 things:

1. A ReactJS based frontend with friend stats, located in the `client/` directory
2. Backend with standardized API endpoints for `users` and `friends`, located in the `/server` directory
3. CI/CD & automatic testing & deploys through GitHub, located in the `.github` directory

### Accessing the project

- The client side (frontend) of this application is hosted on Cloudflare Pages & can be accessed via [doge.allanjeremy.com](https://doge.allanjeremy.com).
- The APIs are hosted on Cloudflare Workers & can be accessed via [https://api.aj-doge.workers.dev](https://api.aj-doge.workers.dev/).

### Tech Stack

- [Hono](https://hono.dev) - Web framework
- [Cloudflare workers](https://workers.cloudflare.com/) - Serverless hosting
- [Typescript](https://www.typescriptlang.org/)
- [Neon](https://neon.tech/) - Serverless [Postgres](https://www.postgresql.org/)
- [Drizzle](https://orm.drizzle.team/) - Database ORM
- [ReactJS](https://react.dev/) - Client side library
- [Bun](https://bun.sh) - A fast runtime, bundler and package manager

---

# Setting up the project

Since this project contains both a backend (`server/`) and frontend (`client/`), we'll need to set up **both** in order to get everything up and running smoothly.

The following steps will guide you through cloning the project and getting it set up on your machine.

```sh
# clone with ssh
git clone git@github.com:AllanJeremy/something-interesting.git

# or: clone with https
git clone https://github.com/AllanJeremy/something-interesting.git

# cd into the repository directory
cd something-interesting
```

## Setting up the Backend

### Step 1: Install Dependencies

Navigate to the `server/` directory and run `bun install` to install dependencies.

```sh
# cd into the server directory - assuming you're at the root ./
cd server

# Install dependencies
bun install
```

### Step 2: Configure Environment Variables

Copy the `.dev.vars.example` file in the `server/` directory and rename it to `.dev.vars` in the same directory. Update the environment variables with the correct values (sensible defaults are already set up when possible).

> Tip: The file also contains tips on what values are expected for each environment variable

### Step 3: Set up the Database

To connect to our database, a valid [Neon/Postgres] `DATABASE_URL` is required. We suggest creating a new project on [Neon](https://neon.tech/) and setting up a dev branch.

### Step 4: Run Database Migrations

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

### Step 5: Seed the Database with Fake Records (Optional)

To populate the database with fake records for testing purposes, you can use the `db:seed` command. This command utilizes [Faker.js](https://fakerjs.dev/) to generate realistic fake data.

### Step 6: Start the Backend Server

Use `bun dev` to start the backend development server.

```sh
# Start the backend development server while in the 'server/' directory
bun dev
```

---

## Setting up the Frontend

### Step 1: Install Dependencies

Navigate to the `client/` directory and run `bun install` to install dependencies.

```sh
# cd into the client directory - assuming you're at the root ./
cd client

# Install dependencies
bun install
```

### Step 2: Start the Frontend Development Server

Use `bun dev` to start the frontend development server.

```sh
# Start the frontend development server while in the 'client/' directory
bun dev
```

---

## Running the project locally

To run the project locally, you will need to start both the backend and frontend servers simultaneously. This might require using two separate terminal windows.

First, follow the instructions in **Setting up the Backend** to ensure your backend is correctly setup. Then, in one terminal window, navigate to the project root and run:

```sh
bun dev
```

This will start the backend server. The backend should now be accessible via [http://localhost:8787](http://localhost:5173).

In another terminal window, navigate to the `client/` directory and run:

```sh
bun dev
```

This will start the frontend. The frontend should now be accessible via [http://localhost:5173](http://localhost:5173).

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

![Cat Typing](_memes/cat-typing.gif)

Anyway, here are some assumptions I made while creating these APIs:

1. The database should be able to handle 10M users (100K concurrent)
2. Reads are more frequent than writes - we make additional queries when adding new friends to cache the number of friends/pending friend requests a user has

---

## Areas of Improvement

![SpongeBob and Patrick thinking deeply](_memes/spongebob-and-patrick-thinking.gif)

Based on how we have structured the project, here are a few potential areas of improvement (in no particular order):

1. **Add user friend search** - This would potentially need having the username be part of the `user_friends` table to be efficient (so we don't have to search through joined tables)

2. **Add authentication & authorization to API routes**

- Control who has access to what endpoints

3. **Caching:** Further reduce the load on the database by potentially using an in-memory cache to access frequently accessed records

- This would work particularly well when fetching user/friend information for popular creators, which would be lots of duplicate requests being made to fetch the same thing.

4. **Track friend request metrics** (sent, received, pending) on the home page.

- This can help us derive insight on what players tend to initiate social interactions (which can serve as a growth engine for what type of players to target when marketing / retargeting ads).

5. **Add typesafety to `.env` by using zod to validate whether or not our environment variables are correctly setup.**

6. **Rate limiting:** limit how many requests a user can make over a period of time eg. per minute (prevent spam & ddos)

7. **Database backups & replication:** snapshots of the database that can be used incase one database instance goes down.

8. **Use RPC for backend-frontend communication**

- This would mean that our backend is the only source of truth - leading to typesafe endpoints.
- We currently still get types from the server, but the return types for different API requests are manually set on the frontend (this was the fastest short-term solution, given we aren't using a Hono project for our client side [and we might have different client types in future])

9. Combine initial migrations into one migration file

- Since I was iterating in dev, there were a few database changes that were made in the early stages.
- In retrospect, I could have waited until I was done to generate the single migration needed to run when you setup the project. However, creating multiple migrations is also indicative of how real-world use occurs, so ><

10. Add friendlier error message responses from db instead of forwarding db error as response (for example: when creating duplicate records)

11. Use transactions in write queries for atomic queries (eg. if we fail to increment friend count, don't decrement pending friend count)

12. Implement Message Queues (e.g. [RabbitMQ](https://www.rabbitmq.com/)) for managing, prioritizing, and processing a large number of concurrent requests.

13. Validate inputs using zod schema on the frontend (potentially even share input validation with backend).

14. Figure out how to run integration tests in staging rather than production (setup staging deployment)

15. **Run tests in CI** - Currently tests can only run locally as they have been configured to work in cloudflare worker environments (which GitHub actions is not). This means that in GitHub actions, we don't have access to the same environment variables we have access to locally.
