import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

const productService = new ProductService();

export async function addProduct(req: Request, res: Response): Promise<any> {
  try {
    const { name, quantity } = req.body;
    if (
      typeof name !== "string" ||
      typeof quantity !== "number" ||
      quantity <= 0
    ) {
      return res
        .status(400)
        .json({ message: "Nome e quantidade positiva são obrigatórios." });
    }

    const product = await productService.addOrUpdateProduct(name, quantity);

    res.status(200).json({
      message: `Produto '${product.name}' atualizado. Estoque: ${product.quantity}`,
      product,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function filtrarProduto(req: Request, res: Response) {
  try {
    const quantidade = await productService.getQuantity(req.query.name);
    res.status(200).json({
      quantity: quantidade,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function removeProduct(req: Request, res: Response) {
  try {
    const { name, quantity } = req.body;
    if (typeof name !== "string" || typeof quantity !== "number") {
      res.status(400).json({ message: "Nome e quantidade são obrigatórios." });
      return;
    }

    const product = await productService.removeFromStock(name, quantity);

    res.status(200).json({
      message: `Produto '${product.name}' atualizado. Quantidade restante em estoque: ${product.quantity}`,
      product,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
