import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connect } from 'mongoose';
import { config } from "dotenv";

import { connect as connectAPI } from './routes';
import { startSocket } from "./socket";

config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json());
connectAPI(app, '/api');

startSocket(io);

server.listen(process.env.PORT || 3000, async () => {
  await connect(process.env.DB_CONNECTION_STRING as string);
  console.log('The server and database are connected.')

  console.log(`listening on port ${process.env.PORT || 3000}`);
});
