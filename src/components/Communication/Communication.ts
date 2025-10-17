import { IApi, IProduct, IOrder } from '../../types/index.ts'

export class Communication {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProduct[]> {
    return this.api.get<IProduct[]>('/product/');
  }

  sendOrder(order: IOrder): Promise<{}> {
    return this.api.post<{}>('/order/', order);
  }
}