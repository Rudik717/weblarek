import "./scss/styles.scss";
import { Catalog } from "./components/Models/Catalog";
import { ShoppingCart } from "./components/Models/ShoppingCart";
import { Customer } from "./components/Models/Customer";
import { Communication } from "./components/Communication/Communication.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { Basket } from "./components/View/Basket";
import { CardBasket } from "./components/View/CardBasket";
import { CardCatalog } from "./components/View/CardCatalog";
import { CardPreview } from "./components/View/CardPreview";
import { FormContacts } from "./components/View/FormContacts";
import { FormOrder } from "./components/View/FormOrder";
import { Gallery } from "./components/View/Gallery";
import { Header } from "./components/View/Header";
import { Modal } from "./components/View/Modal";
import { SuccessOrder } from "./components/View/SuccessOrder";
import { cloneTemplate } from "./utils/utils.ts";
import { ensureElement } from "./utils/utils.ts";
import { IProduct, ICustomer, TPayment } from "./types/index.ts";

const api = new Api(API_URL);
const communication = new Communication(api);
const events = new EventEmitter();
const catalogModel = new Catalog(events);
const customerModel = new Customer(events);
const shoppingCartModel = new ShoppingCart(events);
const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));
const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const basket = new Basket(
  events,
  cloneTemplate(ensureElement<HTMLTemplateElement>("#basket"))
);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const formOrder = new FormOrder(
  events,
  cloneTemplate(ensureElement<HTMLTemplateElement>("#order"))
);
const formContacts = new FormContacts(
  events,
  cloneTemplate(ensureElement<HTMLTemplateElement>("#contacts"))
);
const successOrder = new SuccessOrder(
  events,
  cloneTemplate(ensureElement<HTMLTemplateElement>("#success"))
);

events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
});

events.on("catalog:change", () => {
  const productCards = catalogModel.getProductList().map((product) => {
    const card = new CardCatalog(
      cloneTemplate(ensureElement<HTMLTemplateElement>("#card-catalog")),
      { onClick: () => events.emit("product:selected", product) }
    );
    return card.render(product);
  });
  gallery.render({ catalog: productCards });
});

function updatePreviewButtonText(card: CardPreview, product: IProduct) {
  /*Функция для обновления текста кнопки в превью товара*/
  const inCart = shoppingCartModel.hasProduct(product.id);
  if (!product.price) {
    card.buttonTextToggle("Недоступно", true);
  } else if (inCart) {
    card.buttonTextToggle("Удалить из корзины", false);
  } else {
    card.buttonTextToggle("Купить", false);
  }
}

events.on("product:selected", (product: IProduct) => {
  catalogModel.setSelectedProduct(product);
});

let cardPreview: CardPreview;

events.on("catalog:selectedProductChange", () => {
  const product = catalogModel.getSelectedProduct();
  if (product) {
    cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
      onClick: () => {
        if (!shoppingCartModel.hasProduct(product.id)) {
          shoppingCartModel.addProduct(product);
        } else {
          shoppingCartModel.removeProduct(product);
        }
        modal.closeModal();
      },
    });
    modal.render({
      modalContent: cardPreview.render({ ...product }),
    });
    modal.openModal();

    updatePreviewButtonText(cardPreview, product);
  }
});

events.on("shoppingCart:change", () => {
  header.counter = shoppingCartModel.getProductsCount();
  const product = catalogModel.getSelectedProduct();
  if (cardPreview && product) {
    updatePreviewButtonText(cardPreview, product);
  }
  const basketList = shoppingCartModel
    .getProductCartList()
    .map((product, index) => {
      const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
        onClick: () => {
          shoppingCartModel.removeProduct(product);
        },
      });
      card.indexProductBasket = index + 1;
      return card.render(product);
    });

  const basketPrice = shoppingCartModel.getProductsTotalPrice();

  modal.render({
    modalContent: basket.render({
      basketList,
      basketPrice,
    }),
  });
});

events.on("basket:open", () => {
  modal.render({
    modalContent: basket.render(),
  });
  modal.openModal();
});

events.on("order:open", () => {
  const { payment, address } = customerModel.validate();
  const customerData = customerModel.getData();

  modal.render({
    modalContent: formOrder.render({
      payment: customerData.payment,
      address: customerData.address,
      validForm: !payment && !address,
      errorForm: "",
    }),
  });
});

events.on("form:change", (data: { field: keyof ICustomer; value: string }) => {
  switch (data.field) {
    case "payment":
      customerModel.setPayment(data.value as TPayment);
      break;
    case "address":
      customerModel.setAddress(data.value);
      break;
    case "email":
      customerModel.setEmail(data.value);
      break;
    case "phone":
      customerModel.setPhone(data.value);
      break;
  }
});

events.on(
  "customer:change",
  (data: { field: keyof ICustomer; value: string }) => {
    const { payment, address, email, phone } = customerModel.validate();
    const customerData = customerModel.getData();

    if (data.field === "payment" || data.field === "address") {
      formOrder.render({
        payment: customerData.payment,
        address: customerData.address,
        validForm: !payment && !address,
        errorForm: Object.values({ payment, address })
          .filter(Boolean)
          .join(", "),
      });
    }

    if (["email", "phone"].includes(data.field)) {
      formContacts.render({
        email: customerData.email,
        phone: customerData.phone,
        validForm: !email && !phone,
        errorForm: Object.values({ email, phone }).filter(Boolean).join(", "),
      });
    }
  }
);

events.on("order:submit", () => {
  const { email, phone } = customerModel.validate();
  const customerData = customerModel.getData();

  modal.render({
    modalContent: formContacts.render({
      email: customerData.email,
      phone: customerData.phone,
      validForm: !email && !phone,
      errorForm: "",
    }),
  });
});

events.on("contacts:submit", () => {
  const dataOrder = {
    ...customerModel.getData(),
    total: shoppingCartModel.getProductsTotalPrice(),
    items: shoppingCartModel.getProductCartList().map((product) => product.id),
  };
   shoppingCartModel.clear();
   customerModel.clear();

  communication.sendOrder(dataOrder).then((res) => {
    modal.render({
      modalContent: successOrder.render({
        orderAmount: res.total,
      }),
    });
  });
});

events.on("modal:close", () => {
  modal.closeModal();
});

communication
  .getProducts()
  .then((products) => {
    const items = products.items;
    catalogModel.setProductList(items);
  })
  .catch((err) => {
    console.error("Ошибка при загрузке каталога:", err);
  });
