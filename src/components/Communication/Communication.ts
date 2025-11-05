import {
  IApi,
  IProductResponse,
  IOrder,
  IOrderResult,
} from "../../types/index.ts";

export class Communication {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductResponse> {
    return this.api.get<IProductResponse>("/product/");
  }

  sendOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>("/order/", order);
  }
}
