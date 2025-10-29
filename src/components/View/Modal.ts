import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

interface IModal {
  modalContent: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container)
    
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });
    this.container.addEventListener('click', () => {
      this.events.emit('modal:close');
    });
    this.contentElement.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  set modalContent(content: HTMLElement) {
    this.contentElement.replaceChildren(content)
  }
}