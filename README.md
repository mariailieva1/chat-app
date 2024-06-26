## Instant messenger | Project for WEBTech course  

## Table of Contents
- [Overview](#overview)

## Overview
This repository contains submission for project for WEBTech course. 

#### Description of the project:
- Implement a prototype of sending messages in real time.

### Built With
- Express
- NodeJS
- TypeScript
- Socket.io
- JavaScript
- Angular
- Mongoose
- SCSS
- Material

### How to run the project
1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages
   ```sh
   npm run install-all
   ```
3. Create a .env file inside the backend folder with the following content
   ```sh
      DB_CONNECTION_STRING=<MONGO_DB_CONNECTION_STRING>
      PORT=3000 #the port your backend listens to (should be the same as in proxy.conf.json)
      JWT_SECRET=secret #the secret used to sign/verify the auth jwt
   ```
4. Serve the backend
   ```sh
   cd backend
    npm run start
   ```
5. Serve the frontend
   ```sh
   cd frontend
    npm run start
   ```
6. Open http://localhost:4200
