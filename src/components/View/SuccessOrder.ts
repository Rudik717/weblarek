import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

interface ISuccessOrder {
    orderAmount: number;
}

export class SuccessOrder extends Component<ISuccessOrder> {
    protected successOrderClose: HTMLButtonElement;
    protected successOrderDescription: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.successOrderClose = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.successOrderDescription = ensureElement<HTMLElement>('.order-success__description', this.container);

        this.successOrderClose.addEventListener('click', () => {
        this.events.emit('modal:close');
        });
    }

    set orderAmount(amount: number) {
        this.successOrderDescription.textContent = `Списано ${amount} синапсов`
    }
}