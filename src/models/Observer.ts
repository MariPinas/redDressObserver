export class Observer {
  id?: number;
  email: string;
  product: string;

  constructor(email: string, product: string, id?: number) {
    if (!email.includes("@")) {
      throw new Error("Email inválido");
    }
    if (!product) {
      throw new Error("Produto obrigatório");
    }
    this.email = email;
    this.product = product;
    if (id) this.id = id;
  }
}
