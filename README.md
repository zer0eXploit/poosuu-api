# Poo Suu API

[![build](https://github.com/zer0eXploit/poosuu-api/actions/workflows/main.yml/badge.svg?branch=master&event=push)](https://github.com/zer0eXploit/poosuu-api/actions/workflows/main.yml)

**Poo Suu** is a website where various J-pop/K-pop song lyrics are translated and uploaded for the music lovers. This API backs the service with CRUD operation related to songs, artists and lyrics and administration functionalities.

This project is implemented more or less by following the CLEAN Architecture. It is made to not depend heavily on Express's framework features so that it will be resilient to changes overtime.

## Running the Server

When the server is started, it initiates connections to database servers used by the application. The databases used are **MongoDB** for persistent storage and **Redis** for caching and API key and Password Reset Tokens management. So, it is required to have the connection strings for those databases beforehand.

**SMTP** credentials are also required for sending emails from the application and any SMTP service provider will do fine. For development and testing purposes, it is recommended to use _Mail Trap_.

In order to run the server, a few environment variables are required to be set properly and the most important variables being `DB_URI` and `REDIS_URI`.

Image upload endpoint is also required to upload artist cover images. Currently using imgbb so, the URL can be obtained by creating an account on their website. `IMAGE_UPLOAD_URL` is the env var name for the endpoint.

The environment variables can be referenced from the `.env.example` file from the project `config` folder.

After setting the environment variables the server can be started via the following commands:

> `npm run dev` (_for development with auto restart and logging enabled_)

> `npm start` (_for production with disabled logs_)

It is a good idea to seed the database initially. The seed script populates the database with initial data to work with. The seed data is available in the `seed` folder. The commands are as followed:

> `npm run db:seed` (_for seeding dummy data_)

> `npm run db:destroy` (_for deleting all dummy data_)

## API Documentation

The full API documentation is available [here](https://documenter.getpostman.com/view/8103362/UVXerxrb).
