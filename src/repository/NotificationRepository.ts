import { executarComandoSQL } from "../db/mysql";
import { Observer } from "../models/Observer";

export class NotificationRepository {
  private static instance: NotificationRepository;

  private constructor() {
    this.createTable();
  }

  public static getInstance(): NotificationRepository {
    if (!this.instance) {
      this.instance = new NotificationRepository();
    }
    return this.instance;
  }

  private async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS notification_observer (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        product VARCHAR(255) NOT NULL
      );
    `;
    try {
      await executarComandoSQL(query, []);
      console.log("Tabela notification_observer criada ou já existe");
    } catch (error) {
      console.error("Erro ao criar tabela notification_observer:", error);
    }
  }

  async insereObserver(observer: Observer): Promise<Observer> {
    const query =
      "INSERT INTO notification_observer (email, product) VALUES (?, ?)";
    try {
      const result: any = await executarComandoSQL(query, [
        observer.email,
        observer.product,
      ]);
      observer.id = result.insertId;
      return observer;
    } catch (error) {
      console.error("Erro ao inserir observer:", error);
      throw error;
    }
  }

  async deleteObserverById(id: number): Promise<void> {
    const query = "DELETE FROM notification_observer WHERE id = ?";
    try {
      await executarComandoSQL(query, [id]);
    } catch (error) {
      console.error("Erro ao deletar observer por id:", error);
      throw error;
    }
  }

  async deleteObserver(email: string, product: string): Promise<void> {
    const query =
      "DELETE FROM notification_observer WHERE email = ? AND product = ?";
    try {
      await executarComandoSQL(query, [email, product]);
    } catch (error) {
      console.error("Erro ao deletar observer:", error);
      throw error;
    }
  }

  async getObserverById(id: number): Promise<Observer | null> {
    const query =
      "SELECT id, email, product FROM notification_observer WHERE id = ?";
    try {
      const results = await executarComandoSQL(query, [id]);
      if (results.length === 0) return null;
      const row = results[0];
      return new Observer(row.email, row.product, row.id);
    } catch (error) {
      console.error("Erro ao buscar observer por id:", error);
      throw error;
    }
  }

  async getObserversByProduct(product: string): Promise<Observer[]> {
    const query =
      "SELECT id, email, product FROM notification_observer WHERE product = ?";
    try {
      const results = await executarComandoSQL(query, [product]);
      return results.map(
        (row: any) => new Observer(row.email, row.product, row.id)
      );
    } catch (error) {
      console.error("Erro ao buscar observers:", error);
      throw error;
    }
  }
}
