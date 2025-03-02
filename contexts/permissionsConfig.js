import {
  FiBox,
  FiList,
  FiUser,
  FiSettings,
  FiShoppingCart,
} from "react-icons/fi";

const sharedPermissions = [
  {
    group: "stock",
    name: "Productos",
    route: "/platform/stock/stock_products",
    icon: FiBox,
  },
  {
    group: "stock",
    name: "Categorias",
    route: "/platform/product_categories",
    icon: FiList,
  },
  {
    group: "stock",
    name: "Medidas (U.)",
    route: "/platform/product_measure_units",
    icon: FiList,
  },
];

const userPermissions = {
  //Salesman
  1: [
    ...sharedPermissions,
    {
      group: "sales",
      name: "Ventas",
      route: "/platform/sales",
      icon: FiShoppingCart,
    },
  ],
  //Supervisor of Salesmen
  2: [
    ...sharedPermissions,
    {
      group: "sales",
      name: "Ventas",
      route: "/platform/sales",
      icon: FiShoppingCart,
    },
  ],
  //Administrative
  3: [
    ...sharedPermissions,
    {
      group: "users",
      name: "Usuarios",
      route: "/platform/users",
      icon: FiUser,
    },
    {
      group: "settings",
      name: "Ajustes",
      route: "/platform/platform_settings",
      icon: FiUser,
    },
  ],
  //Manager
  4: [
    ...sharedPermissions,
    {
      group: "sales",
      name: "Ventas",
      route: "/platform/sales",
      icon: FiShoppingCart,
    },
    {
      group: "users",
      name: "Usuarios",
      route: "/platform/users",
      icon: FiUser,
    },
    {
      group: "settings",
      name: "Ajustes",
      route: "/platform/platform_settings",
      icon: FiSettings,
    },
  ],
  //Provider
  5: [],
  //Root
  6: [], // Access to all routes
};

export default userPermissions;
