import { ensureElement } from '../../utils/utils'
import { IProduct  } from '../../types/index'
import { categoryMap } from '../../utils/constants'
import { Card } from './Card'

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}
interface ICardCatalog extends Pick<IProduct, 'title' | 'price' | 'image' | 'category'> {};
export type TCategory = keyof typeof categoryMap;

export class CardCatalog extends Card<ICardCatalog> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLImageElement>('.card__category', this.container);
        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick)
        }
    }

    set category(value: TCategory) {
        this.categoryElement.textContent = value;

        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as TCategory],
                key === value
            );
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.titleProduct)
    }
}