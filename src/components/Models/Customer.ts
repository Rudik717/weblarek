import { ICustomer, TPayment } from "../../types/index.ts";
import { IEvents } from '../base/Events'

export class Customer {
  private payment: TPayment = '';
  private address: string = "";
  private email: string = "";
  private phone: string = "";
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events.emit('customer:change', { field: 'payment', value: payment });
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit('customer:change', { field: 'address', value: address });
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit('customer:change', { field: 'email', value: email });
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit('customer:change', { field: 'phone', value: phone });
  }

  getData(): ICustomer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clear(): void {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
    this.events.emit('customer:clear');
  }

  validate(): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.address.trim()) {
      errors.address = "Укажите адрес";
    }
    if (!this.email.trim()) {
      errors.email = "Укажите емэйл";
    }
    if (!this.phone.trim()) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }
}
