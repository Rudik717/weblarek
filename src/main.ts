import './scss/styles.scss';
import { apiProducts } from './utils/data.ts'
import { Catalog } from './components/Models/Catalog'
import { ShoppingCart } from './components/Models/ShoppingCart'
import { Customer } from './components/Models/Customer'

const newCatalog = new Catalog();
const newShoppingCart = new ShoppingCart();
const newCustomer = new Customer();

