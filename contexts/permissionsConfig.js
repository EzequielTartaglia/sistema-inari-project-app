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
    requiredPlugins: [1],
  },
  {
    group: "stock",
    name: "Categorias",
    route: "/platform/stock/stock_product_categories",
    icon: FiList,
    requiredPlugins: [1],
  },
  {
    group: "stock",
    name: "Medidas (U.)",
    route: "/platform/stock/stock_product_measure_units",
    icon: FiList,
    requiredPlugins: [1],
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
      requiredPlugins: [2],
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
      requiredPlugins: [2],
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
      group: "stock",
      name: "Productos",
      route: "/platform/stock/stock_products",
      icon: FiBox,
      requiredPlugins: [1],
    },
    {
      group: "stock",
      name: "Categorias",
      route: "/platform/stock/stock_product_categories",
      icon: FiList,
      requiredPlugins: [1],
    },
    {
      group: "stock",
      name: "Medidas (U.)",
      route: "/platform/stock/stock_product_measure_units",
      icon: FiList,
      requiredPlugins: [1],
    },
    {
      group: "sales",
      name: "Ventas",
      route: "/platform/sales",
      icon: FiShoppingCart,
      requiredPlugins: [2],
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
  //Administrador (empresas)
  6: [
    ...sharedPermissions,
    {
      group: "stock",
      name: "Productos",
      route: "/platform/stock/stock_products",
      icon: FiBox,
      requiredPlugins: [1],
    },
    {
      group: "stock",
      name: "Categorias",
      route: "/platform/stock/stock_product_categories",
      icon: FiList,
      requiredPlugins: [1],
    },
    {
      group: "stock",
      name: "Medidas (U.)",
      route: "/platform/stock/stock_product_measure_units",
      icon: FiList,
      requiredPlugins: [1],
    },
    {
      group: "sales",
      name: "Ventas",
      route: "/platform/sales",
      icon: FiShoppingCart,
      requiredPlugins: [2],
    },
    {
      group: "users",
      name: "Usuarios",
      route: "/platform/users",
      icon: FiUser,
    },
    {
      group: "users",
      name: "Empresas en sistema",
      route: "/platform/platform_user_businesses",
      icon: FiUser,
    },
    {
      group: "settings",
      name: "Ajustes",
      route: "/platform/platform_settings",
      icon: FiSettings,
    },

  ], // Access to all routes
};

export default userPermissions;
