import { NotificationRepository } from "../repository/NotificationRepository";
import { Observer } from "../models/Observer";

export class NotificationService {
  private repository: NotificationRepository;

  constructor() {
    this.repository = NotificationRepository.getInstance();
  }

  async inscrever(email: string, product: string): Promise<Observer> {
    if (!email || !product) {
      throw new Error("Email e produto são obrigatórios para inscrição.");
    }

    const observadores = await this.repository.getObserversByProduct(product);
    const jaExiste = observadores.some((o) => o.email === email);

    if (jaExiste) {
      throw new Error("Você já está inscrito para este produto.");
    }

    const novoObserver = new Observer(email, product);
    return this.repository.insereObserver(novoObserver);
  }

  async desinscrever(email: string, product: string): Promise<void> {
    if (!email || !product) {
      throw new Error("Email e produto são obrigatórios para desinscrição.");
    }
    await this.repository.deleteObserver(email, product);
  }

  async notificar(product: string): Promise<string[]> {
    if (!product) {
      throw new Error("Produto é obrigatório para notificação.");
    }

    const observers = await this.repository.getObserversByProduct(product);
    const emails = observers.map((o) => o.email);

    // tem q remover todos dps de notificar?
    // for (const observer of observers) {
    //   if (observer.id) await this.repository.deleteObserverById(observer.id);
    // }

    return emails;
  }
}
