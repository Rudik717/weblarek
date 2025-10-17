import './scss/styles.scss';
import { apiProducts } from './utils/data.ts'
import { Catalog } from './components/Models/Catalog'
import { ShoppingCart } from './components/Models/ShoppingCart'
import { Customer } from './components/Models/Customer'
import { Communication } from './components/Communication/Communication.ts'
import { Api } from './components/base/Api.ts'
import { API_URL } from './utils/constants.ts'

const testCatalog = new Catalog();
const testShoppingCart = new ShoppingCart();
const testCustomer = new Customer();

testCatalog.setProductList(apiProducts.items);
console.log("Каталог:", testCatalog.getProductList());
console.log('Товар найден: ', testCatalog.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));

testShoppingCart.addProduct(apiProducts.items[1]);
testShoppingCart.addProduct(apiProducts.items[2]);
console.log('Продукты в корзине: ', testShoppingCart.getProductCartList());
testShoppingCart.removeProduct(apiProducts.items[2]);
console.log('Продукты в корзине: ', testShoppingCart.getProductCartList());
console.log(`В корзине ${testShoppingCart.getProductsCount()} товаров`);

testCustomer.setAddress('Улица Пушкина, дом Колотушкина');
testCustomer.setPayment('card');
testCustomer.setPhone('+7999999999');
console.log(testCustomer.getData(), testCustomer.validate());


const api = new Api(API_URL);
const communication = new Communication(api);
const newCatalog = new Catalog();

communication.getProducts()
  .then(products => {
    console.log('Каталог товаров:', products);
    newCatalog.setProductList(products);
  })
  .catch(err => {
    console.error('Ошибка при загрузке каталога:', err);
  });

