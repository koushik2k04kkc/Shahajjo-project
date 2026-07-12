import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "../../config/configuration.js";

export const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: config.clientUrl, methods: ["GET", "POST"], credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) return next(new Error("Authentication required"));
    try {
      socket.user = jwt.verify(token, config.jwtSecret);
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;
    socket.join(`role:${user.role}`);
    socket.join(`agent:${user.id}`);
    if (user.provider_id) socket.join(`provider:${user.provider_id}`);
    if (user.assigned_areas) {
      user.assigned_areas.forEach((area) => socket.join(`area:${area}`));
    }
  });

  return io;
};