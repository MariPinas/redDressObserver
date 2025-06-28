import { Product } from "../models/Product";
import { ProductRepository } from "../repository/ProductRepository";
import { NotificationService } from "./NotificationService";
import { broadcastNotification } from "../app";
export class ProductService {
  private productRepo = ProductRepository.getInstance();
  private notificationService = new NotificationService();

  async addOrUpdateProduct(
    name: string,
    quantityToAdd: number
  ): Promise<Product> {
    let product = await this.productRepo.findByName(name);
    const oldQuantity = product ? product.quantity : 0;

    if (!product) {
      product = new Product(name, 0);
    }

    product.quantity += quantityToAdd;

    if (product.quantity < 0) {
      throw new Error("Quantidade não pode ser negativa");
    }

    await this.productRepo.save(product);

    if (oldQuantity <= 0 && product.quantity > 0) {
      await this.handleStockNotifications(product, oldQuantity);
    }

    return product;
  }

  private async handleStockNotifications(
    product: Product,
    oldQuantity: number
  ) {
    const message = `O produto '${product.name}' agora está disponível! Estoque: ${product.quantity}`;

    try {
      await this.notificationService.notificar(product.name, message);

      broadcastNotification(
        JSON.stringify({
          type: "STOCK_UPDATE",
          product: product.name,
          quantity: product.quantity,
          message: message,
        })
      );

      console.log(`Notificações enviadas para produto: ${product.name}`);
    } catch (error) {
      console.error("Erro ao enviar notificações:", error);
    }
  }

  async getQuantity(productName: any): Promise<number> {
    console.log(`${productName} bgl 2`);
    if (!productName || typeof productName !== "string") {
      throw new Error("Nome do produto é obrigatório.");
    }
    const quant = await this.productRepo.getQuantityByName(productName);
    return quant;
  }

  async removeFromStock(
    name: string,
    quantityToRemove: number
  ): Promise<Product> {
    const product = await this.productRepo.findByName(name);

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    if (quantityToRemove <= 0) {
      throw new Error("A quantidade a remover deve ser maior que zero.");
    }

    if (product.quantity < quantityToRemove) {
      throw new Error("Estoque insuficiente para remover essa quantidade.");
    }

    product.quantity -= quantityToRemove;
    await this.productRepo.save(product);

    if (product.quantity === 0) {
      console.log(`Estoque do produto '${product.name}' esgotado.`);
    }

    return product;
  }
}
