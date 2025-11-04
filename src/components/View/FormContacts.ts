import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { Form } from './Form';

interface IFormContacts {
    email: string;
    phone: string;
}

export class FormContacts extends Form<IFormContacts> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(protected events: IEvents, container: HTMLFormElement) {
        super(events, container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name=email]', this.container)
        this.phoneInput = ensureElement<HTMLInputElement>('input[name=phone]', this.container)
    }

    set email(value: string) {
        this.emailInput.value = value;
    }
    set phone(value: string) {
        this.phoneInput.value = value;
    }
}