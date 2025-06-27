import https from "https";
import fs from "fs";
import express from "express";
import {
  inscreverObservador,
  desinscreverObservador,
  notificarObservadores,
} from "./controllers/NotificationController";
import { addProduct, removeProduct } from "./controllers/ProductController";
import path from "path";

const keyPath = path.join(__dirname, "..", "cert", "key.pem");
const certPath = path.join(__dirname, "..", "cert", "cert.pem");

const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

const app = express();
const PORT = 3040;

app.use(express.json());

// Rotas
app.post("/api/notify/subscribe", inscreverObservador);
app.post("/api/notify/unsubscribe", desinscreverObservador);
app.post("/api/notify/newStock", notificarObservadores);
// produto
app.post("/api/product/add", addProduct);
app.post("/api/product/remove", removeProduct);

https.createServer(options, app).listen(PORT, () => {
  console.log(`Servidor HTTPS rodando em https://localhost:${PORT}`);
});
