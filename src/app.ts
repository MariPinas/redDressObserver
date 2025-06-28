import https from "https";
import fs from "fs";
import express from "express";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws"; // corrigido aqui
import path from "path";

// Controllers
import {
  inscreverObservador,
  desinscreverObservador,
  notificarObservadores,
} from "./controllers/NotificationController";
import {
  addProduct,
  filtrarProduto,
  removeProduct,
} from "./controllers/ProductController";

// Certificados SSL
const keyPath = path.join(__dirname, "..", "cert", "key.pem");
const certPath = path.join(__dirname, "..", "cert", "cert.pem");

const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

const app = express();
const PORT = 3040;

app.use(express.json());

// Habilita CORS para o frontend React
app.use(
  cors({
    origin: ["http://localhost:5173", "https://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false,
  })
);

// Rotas de notificação
app.post("/api/notify/subscribe", inscreverObservador);
app.post("/api/notify/unsubscribe", desinscreverObservador);
app.post("/api/notify/newStock", notificarObservadores);

// Rotas de produto
app.post("/api/product/add", addProduct);
app.post("/api/product/remove", removeProduct);
app.get("/api/product/quantity", filtrarProduto);

const server = https.createServer(options, app);
const wss = new WebSocketServer({ server });

// Conexões WebSocket
wss.on("connection", (ws: WebSocket) => {
  console.log(">> Cliente WebSocket conectado");

  ws.on("error", (error) => {
    console.error("Erro no WebSocket:", error);
  });

  ws.on("close", () => {
    console.log(" X Cliente WebSocket desconectado X");
  });
});

//ENVIA MSG PARA TODOS CLIENTES CONECTADOS
export function broadcastNotification(message: string) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// QUANDO QUANTIDADE > 0 DISPARA NOTIFICACAO
export function onStockUpdated(productName: string, newQuantity: number) {
  if (newQuantity > 0) {
    const payload = JSON.stringify({
      type: "STOCK_UPDATE",
      product: productName,
      message: `O produto '${productName}' está disponível em estoque!`,
    });
    console.log("...Enviando notificação WebSocket:", payload);
    broadcastNotification(payload);
  }
}

server.listen(PORT, () => {
  console.log(`>> Servidor HTTPS rodando em https://localhost:${PORT}`);
});
