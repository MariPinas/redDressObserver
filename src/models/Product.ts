export class Product {
  id?: number;
  name: string;
  quantity: number;

  constructor(name: string, quantity: number, id?: number) {
    this.name = name;
    this.quantity = quantity;
    if (id) this.id = id;
  }
}
