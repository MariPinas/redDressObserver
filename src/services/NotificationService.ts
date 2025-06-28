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

  async notificar(product: string, message: string): Promise<void> {
    const observers = await this.repository.getObserversByProduct(product);

    // Não envia emails, apenas registra para uso futuro
    console.log(
      `[Notificação] Produto "${product}" disponível! Observadores: ${observers.length}`
    );

    // Não remove os inscritos para que possam ser notificados novamente
    // quando o estoque zerar e voltar a ter disponibilidade
  }
}
