import { Product } from "../models/Product";
import { executarComandoSQL } from "../db/mysql";

export class ProductRepository {
  private static instance: ProductRepository;

  private constructor() {
    this.createTable();
  }

  public static getInstance(): ProductRepository {
    if (!this.instance) {
      this.instance = new ProductRepository();
    }
    return this.instance;
  }

  private async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS product (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        quantity INT NOT NULL
      )`;

    try {
      await executarComandoSQL(query, []);
      console.log("Tabela 'product' criada ou já existe.");
    } catch (err) {
      console.error("Erro ao criar tabela product:", err);
    }
  }

  async save(product: Product): Promise<Product> {
    if (product.id) {
      // update o produto da lojinha
      const query = `UPDATE product SET name = ?, quantity = ? WHERE id = ?`;
      await executarComandoSQL(query, [
        product.name,
        product.quantity,
        product.id,
      ]);
      return product;
    } else {
      // insert o product se nao tem esse produto a ser salvado
      const query = `INSERT INTO product (name, quantity) VALUES (?, ?)`;
      const result: any = await executarComandoSQL(query, [
        product.name,
        product.quantity,
      ]);
      product.id = result.insertId;
      return product;
    }
  }

  async findByName(name: string): Promise<Product | null> {
    const query = `SELECT * FROM product WHERE name = ?`;
    const results: Product[] = await executarComandoSQL(query, [name]);
    if (results.length > 0) {
      const p = results[0];
      return new Product(p.name, p.quantity, p.id);
    }
    return null;
  }

  async findById(id: number): Promise<Product | null> {
    const query = `SELECT * FROM product WHERE id = ?`;
    const results: Product[] = await executarComandoSQL(query, [id]);
    if (results.length > 0) {
      const p = results[0];
      return new Product(p.name, p.quantity, p.id);
    }
    return null;
  }
}
