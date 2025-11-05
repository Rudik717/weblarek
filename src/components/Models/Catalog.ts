import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events";

export class Catalog {
  private productList: IProduct[];
  private selectedProduct: IProduct | null = null;
  private events: IEvents;

  constructor(events: IEvents, productList: IProduct[] = []) {
    this.events = events;
    this.productList = productList;
  }

  setProductList(products: IProduct[]): void {
    this.productList = products;
    this.events.emit("catalog:change", { productList: this.productList });
  }

  getProductList(): IProduct[] {
    return this.productList;
  }

  getProductById(id: string): IProduct | undefined {
    return this.productList.find((product) => product.id === id);
  }
  /*  На данном этапе эти методы мне не пригодились, но могут быть полезными для других задач*/

  setSelectedProduct(product: IProduct | null): void {
    this.selectedProduct = product;
    this.events.emit("catalog:selectedProductChange", {
      selectedProduct: this.selectedProduct,
    });
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
