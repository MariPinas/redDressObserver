export class Observer {
  email: string;
  product: string;

  constructor(email: string, product: string) {
    if (!email.includes("@")) {
      throw new Error("Email inválido");
    }
    if (!product) {
      throw new Error("Produto obrigatório");
    }
    this.email = email;
    this.product = product;
  }
}
