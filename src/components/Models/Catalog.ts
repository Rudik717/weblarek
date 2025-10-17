import { IProduct } from "../../types/index.ts";

export class Catalog {
  private productList: IProduct[];
  private selectedProduct: IProduct | null = null;

  constructor(productList: IProduct[] = []) {
    this.productList = productList;
  }

  setProductList(products: IProduct[]): void {
    this.productList = products;
  }

  getProductList(): IProduct[] {
    return this.productList;
  }

  getProductById(id: string): IProduct | undefined {
    return this.productList.find((product) => product.id === id);
  }

  setSelectedProduct(product: IProduct | null): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
