const { lazy } = require("react");
import { Admin } from "./Admin/index";
import { Profile } from "./Profile/index";

const Catalog = lazy(() => import("../components/Catalog"));

const Login = lazy(() => import("../components/Auth/Login"));

const ProductDetail = lazy(() => import("../components/ProductDetail"));

const ShoppingBasket = lazy(() => import("../components/ShoppingBasket"));

const Checkout = lazy(() => import("../components/Roles/Client/Checkout"));

const Registration = lazy(() => import("../components/Auth/Registration"));

export const Routes = [
  ...Admin,
  ...Profile,
  {
    path: "/client/checkout",
    component: Checkout,
  },
  {
    path: "/phone/:id",
    component: ProductDetail,
  },
  {
    path: "/shopping-basket",
    component: ShoppingBasket,
  },
  {
    path: "/registration",
    component: Registration,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/",
    component: Catalog,
  },
];
