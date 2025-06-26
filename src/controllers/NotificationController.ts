import { ObserverDTO } from "../dtos/ObserverDTO";
import { NotificationService } from "./../services/NotificationService";
import { Request, Response } from "express";

const service: NotificationService = new NotificationService();

export async function inscreverObservador(req: Request, res: Response) {
  const { email, product } = req.body;
  try {
    const observer = await service.inscrever(email, product);
    res.status(201).json({
      mensagem: "Inscrito com sucesso",
      observador: observer,
    });
  } catch (err: any) {
    res.status(400).json({ mensagem: err.message });
  }
}

export async function desinscreverObservador(req: Request, res: Response) {
  try {
    const { email, product } = req.body;

    await service.desinscrever(email, product);

    res.status(200).json({
      mensagem: "Desinscrito com sucesso!",
      observador: { email, product },
    });
  } catch (error: any) {
    res.status(400).json({ mensagem: error.message });
  }
}

export async function notificarObservadores(req: Request, res: Response) {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ message: "Produto é obrigatório." });
    }

    const mensagens = await service.notificar(
      product,
      `O produto '${product}' está disponível em estoque!`
    );

    res.status(200).json({
      message: `Notificações enviadas com sucesso.`,
      notificacoes: mensagens,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
