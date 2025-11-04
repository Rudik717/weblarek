import "./scss/styles.scss";
import { apiProducts } from "./utils/data.ts";
import { Catalog } from "./components/Models/Catalog";
import { ShoppingCart } from "./components/Models/ShoppingCart";
import { Customer } from "./components/Models/Customer";
import { Communication } from "./components/Communication/Communication.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";
import { EventEmitter } from "./components/base/Events.ts"
import { Basket } from "./components/View/Basket";
import { Card } from "./components/View/Card";
import { CardBasket } from "./components/View/CardBasket";
import { CardCatalog, TCategory } from "./components/View/CardCatalog";
import { CardPreview } from "./components/View/CardPreview";
import { Form } from "./components/View/Form";
import { FormContacts } from "./components/View/FormContacts";
import { FormOrder } from "./components/View/FormOrder";
import { Gallery } from "./components/View/Gallery";
import { Header } from "./components/View/Header";
import { Modal } from "./components/View/Modal";
import { SuccessOrder } from "./components/View/SuccessOrder";
import { cloneTemplate } from "./utils/utils.ts";
import { ensureElement } from './utils/utils.ts'
import { IProduct } from "./types/index.ts";

const api = new Api(API_URL);
const communication = new Communication(api);
const events = new EventEmitter();
const catalogModel = new Catalog(events);
const CustomerModel = new Customer(events);
const ShoppingCartModel = new ShoppingCart(events);
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const basket = new Basket(events, cloneTemplate(ensureElement<HTMLTemplateElement>('#basket')));
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const formOrder = new FormOrder(events, cloneTemplate(ensureElement<HTMLTemplateElement>('#order')));
const formContacts = new FormContacts(events, cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')));
const successOrder = new SuccessOrder(events, cloneTemplate(ensureElement<HTMLTemplateElement>('#success')))

events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
});  /* МОНИТОРИНГ */


events.on('catalog:change', () => {
  const productCards = catalogModel.getProductList().map(product => {
  const card = new CardCatalog(cloneTemplate(ensureElement<HTMLTemplateElement>('#card-catalog')), 
  {onClick: () => events.emit('product:selected', product)});
  return card.render(product);
  });
  gallery.render({catalog: productCards})
})

function updatePreviewButtonText(card: CardPreview, product: IProduct) {    /*Функция для обновления текста кнопки в превью товара*/
  const inCart = ShoppingCartModel.hasProduct(product.id);
  if (!product.price) {
    card.buttonTextToggle('Недоступно', true);
  } else if (inCart) {
    card.buttonTextToggle('Удалить из корзины', false);
  } else {
    card.buttonTextToggle('Купить', false);
  }
}

events.on('product:selected', (product: IProduct) => {
  const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (!ShoppingCartModel.hasProduct(product.id)) {
        ShoppingCartModel.addProduct(product);
      } else {
        ShoppingCartModel.removeProduct(product);
      }
      updatePreviewButtonText(cardPreview, product);
    }
  });

  modal.render({
    modalContent: cardPreview.render({ ...product })
  });
  modal.openModal();

  updatePreviewButtonText(cardPreview, product);
});

events.on('shoppingCart:change', () => {
  header.counter = ShoppingCartModel.getProductsCount()
})

function renderBasketModal() {        /*Функция для рендера модалки корзины*/
  const basketList = ShoppingCartModel.getProductCartList().map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), { onClick: () => {
      ShoppingCartModel.removeProduct(product);
      events.emit('basket:change');
    }});
    card.indexProductBasket = index + 1;
    return card.render(product);
  });

  const basketPrice = ShoppingCartModel.getProductsTotalPrice();

  modal.render({
    modalContent: basket.render({
      basketList,
      basketPrice
    })
  });
}

events.on('basket:open', () => {
  renderBasketModal();
  modal.openModal();
});

events.on('basket:change', () => {
  renderBasketModal();
});










communication
  .getProducts()
  .then(products => {
    const items = products.items;
    catalogModel.setProductList(items);
  })
  .catch(err => {
    console.error("Ошибка при загрузке каталога:", err);
  });