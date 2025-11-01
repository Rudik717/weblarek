import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { IProduct  } from '../../types/index'

export interface ICard extends Pick<IProduct, 'title' | 'price'> {}

export abstract class Card<T> extends Component<ICard & T> {
    protected title: HTMLElement;
    protected price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.price = ensureElement<HTMLElement>('.card__price', this.container);
        this.title = ensureElement<HTMLElement>('.card__title', this.container);
    }

    set titleProduct(value: string) {
        this.title.textContent = value.trim();
    }
    set priceProduct(value: number | null) {
        this.price.textContent = value ? `${value} синапсов` : 'Бесценно';
    }
}