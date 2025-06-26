import express from "express";

const app = express();
const PORT = 3040;

app.use(express.json());

// Rotas
app.post("/api/notify/subscribe", inscreverObservador);
app.post("/api/notify/unsubscribe", desinscreverObservador);
app.post("/api/notify/newStock", notificarObservadores);

app.listen(PORT, () => {
  console.log(`API rodando na PORTA ${PORT}`);
});
