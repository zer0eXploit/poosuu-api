# Poo Suu API

**Poo Suu** is a website where various J-pop/K-pop song lyrics are translated and uploaded for the music lovers. This API backs the service with CRUD operation related to songs, artists and lyrics and administration functionalities.

This project is implemented more or less by following the CLEAN Architecture. It is made to not depend heavily on Express's framework features so that it will be resilient to changes overtime.

## Running the Server

When the server is started, it initiates connections to database servers used by the application. The databases used are **MongoDB** for persistent storage and **Redis** for caching and API key and Password Reset Tokens management. So, it is required to have the connection strings for those databases beforehand. **SMTP** credentials are also required for sending emails from the application and any SMTP service provider will do fine. For development and testing purposes, it is recommended to use _Mail Trap_.

In order to run the server, a few environment variables are required to be set properly and the most important variables being `DB_URI` and `REDIS_URI` The environment variables can be referenced from the `.env.example` file from the project `config` folder.

After setting the environment variables the server can be started via the following commands:

> `npm run dev` (_for development with auto restart and logging enabled_)

> `npm start` (_for production with disabled logs_)

## API Documentation

The full API documentation is available [here](https://documenter.getpostman.com/view/8103362/UVXerxrb).
