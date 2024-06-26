## Instant messenger | Project for WEBTech course  

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
  
## Overview
This repository contains submission for project for WEBTech course. 

## Features
- **User Authentication**: Sign up, log in.
- **Channels**: Create public or private channel, join, see members, see all messages, leave channel, search through messages, invite members.
- **Search**: Search for messages within channels and search for channels in the list of the channels.
- **Message History**: Access and view the history of messages in channels.
- **Real-time Messaging**: Send and receive messages in real-time.

## Technologies
- Express
- NodeJS
- TypeScript
- Socket.io
- JavaScript
- Angular
- Mongoose
- SCSS
- Material

## Installation
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

## Usage
- **Sign Up / Log In**: Create an account or log in with existing credentials.
- **Create Channels**: Create new channels for different topics or groups.
- **Join Channels**: Join existing channels to start participating in conversations.
- **Search Messages**: Use the search bar within channels to find specific messages.
- **View History**: Scroll through the message history to view past conversations.
