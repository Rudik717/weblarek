import { ICustomer, TPayment } from "../../types/index.ts";

export class Customer {
  private payment: TPayment = '';
  private address: string = "";
  private email: string = "";
  private phone: string = "";

  setPayment(payment: "card" | "cash" | ""): void {
    this.payment = payment;
  }

  setAddress(address: string): void {
    this.address = address;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = phone;
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
