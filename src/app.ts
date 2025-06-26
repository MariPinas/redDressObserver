import express from "express";
import {
  inscreverObservador,
  desinscreverObservador,
  notificarObservadores,
} from "./controllers/NotificationController";
import { addProduct } from "./controllers/ProductController";

const app = express();
const PORT = 3040;

app.use(express.json());

// Rotas
app.post("/api/notify/subscribe", inscreverObservador);
app.post("/api/notify/unsubscribe", desinscreverObservador);
app.post("/api/notify/newStock", notificarObservadores);
// produto
app.post("/api/product/add", addProduct);

app.listen(PORT, () => {
  console.log(`API rodando na PORTA ${PORT}`);
});
