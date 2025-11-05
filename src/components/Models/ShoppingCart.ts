import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events";

export class ShoppingCart {
  private productCartList: IProduct[];
  private events: IEvents;

  constructor(events: IEvents, productCartList: IProduct[] = []) {
    this.productCartList = productCartList;
    this.events = events;
  }

  getProductCartList(): IProduct[] {
    return this.productCartList;
  }

  addProduct(product: IProduct): void {
    this.productCartList.push(product);
    this.events.emit("shoppingCart:change");
  }

  removeProduct(product: IProduct): void {
    this.productCartList = this.productCartList.filter(
      (p) => p.id !== product.id
    );
    this.events.emit("shoppingCart:change");
  }

  clear(): void {
    this.productCartList = [];
    this.events.emit("shoppingCart:change");
  }

  getProductsTotalPrice(): number {
    return this.productCartList.reduce(
      (sum, product) => sum + (product.price || 0),
      0
    );
  }

  getProductsCount(): number {
    return this.productCartList.length;
  }

  hasProduct(id: string): boolean {
    return this.productCartList.some((product) => product.id === id);
  }
}
