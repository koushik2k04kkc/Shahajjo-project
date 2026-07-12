import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import http from "http";
import { initSocketServer } from "./modules/notification-gateway/notification.gateway.js";
import { setSocketInstance } from "./modules/notification-gateway/notification.service.js";
import { startSlaListener } from "./redis/queue/sla-timer.processor.js";

const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);
const io = initSocketServer(httpServer);
setSocketInstance(io);
startSlaListener(io);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway on port ${PORT}`);
  console.log(`Analytics: ${process.env.ANALYTICS_URL}`);
  console.log(`OpenAI: ${process.env.OPENAI_API_KEY ? "OK" : "MISSING"}`);
});