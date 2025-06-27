import { Product } from "../models/Product";
import { ProductRepository } from "../repository/ProductRepository";
import { NotificationService } from "./NotificationService";

export class ProductService {
  private productRepo = ProductRepository.getInstance();
  private notificationService = new NotificationService();

  async addOrUpdateProduct(
    name: string,
    quantityToAdd: number
  ): Promise<Product> {
    let product = await this.productRepo.findByName(name);
    if (!product) {
      product = new Product(name, 0); //se nao tem esse produto cria ele dando um new dps salva
    }

    const oldQuantity = product.quantity;
    product.quantity += quantityToAdd;

    if (product.quantity < 0) {
      throw new Error("Quantidade não pode ser negativa ' - ' ...");
    }

    await this.productRepo.save(product);

    if (oldQuantity <= 0 && product.quantity > 0) {
      const message = `O produto '${product.name}' agora está disponível em estoque! :D`;
      await this.notificationService.notificar(product.name, message);
    }

    return product;
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
