#!/usr/bin/env node

/**
 * Module dependencies.
 */

interface CustomSocket extends Socket {
  username?: string;
}

import app from "../app";

const debug = require("debug")("server:server");

const http = require("http");

const { Server } = require("socket.io");

const { CONFIG } = require("../constants/config");

import Room from "../models/Room";

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CONFIG.CLIENT,
  },
});

const getRoomContentByRoomId = async (roomId: string) => {
  try {
    const room = await Room.findById(roomId);
    return room || null;
  } catch (error) {
    console.error("Error fetching room content by roomId:", error);

    return null;
  }
};

import { Socket } from "socket.io";

io.on("connection", (socket: CustomSocket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", async (roomId: string, user: any) => {
    socket.join(roomId);

    socket.username = user;

    const roomContent = await getRoomContentByRoomId(roomId);

    socket.emit("currentText", { text: roomContent });
  });

  socket.on("textChange", ({ roomId, text, user, cursorIndex, textInput }) => {
    const email = user ? user.email : "guest";
    const photoURL = user ? user.photoURL : "";
    socket.to(roomId).emit("textChanged", {
      text,
      email,
      photoURL,
      cursorIndex,
      textInput,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): string | number | false {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case "EADDRINUSE":
      process.exit(1);
    default:
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
