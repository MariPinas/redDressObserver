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

  async notificar(product: string, message: string): Promise<string[]> {
    const observers = await this.repository.getObserversByProduct(product);
    const notificacoes: string[] = [];
    // so pra fingir um envio no email
    for (const observer of observers) {
      const msg = `Para ${observer.email}: ${message}`;
      console.log(msg);
      notificacoes.push(msg);
    }

    console.log(
      `[Notificação] Produto "${product}" disponível! Observadores: ${observers.length}`
    );

    return notificacoes;
  }
}
