import { IProduct } from '../../types/index.ts'

export class ShoppingCart {
  private productCartList: IProduct[];

  constructor(productCartList: IProduct[] = []) {
    this.productCartList = productCartList;
  }

  getProductCartList(): IProduct[] {
    return this.productCartList;
  }

  addProduct(product: IProduct): void {
    this.productCartList.push(product);
  }

  removeProduct(product: IProduct): void {
    this.productCartList = this.productCartList.filter(p => p.id !== product.id);
  }

  clear(): void {
    this.productCartList = [];
  }

  getProductsTotalPrice(): number {
    return this.productCartList.reduce((sum, product) => sum + (product.price || 0), 0);
  }

  getProductsCount(): number {
    return this.productCartList.length;
  }

  hasProduct(id: string): boolean {
    return this.productCartList.some(product => product.id === id);
  }
}