# Crypto Frens Back End REST API

This is the back end REST api for the Crypto Frens web application. It is built on Express.js and uses MongoDB for data persistence.

### Installation

`npm intall`

### Environment Variables

Populate the variables in `.env.example` and rename the file `.env`.

Database strings e.g. `DB_STRING` expects a MongoDB Atlas conection string. [Sign up](https://www.mongodb.com/atlas/database) for free account and cluster

Google variables are used for the Log in With Google functionality on the front end. They are obtained from [Google Developer Console](https://console.cloud.google.com/) (APIs and Services > Credentials > Create Credentials). You will need to register a new application on the developer console.

### Running the Application Locally

`npm run devstart`

### Testing

[SuperTest](https://github.com/visionmedia/supertest) is used for testing.

`npm run test`
