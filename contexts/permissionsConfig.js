import { FiBox, FiList, FiUser, FiSettings } from "react-icons/fi";
import { FaPencilAlt } from "react-icons/fa";
import Logo from "@/components/Logo";

const sharedPermissions = [
  {
    group: "stock",
    name: "Lista de Productos",
    route: "/platform/products",
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
    name: "Unidades de medida",
    route: "/platform/product_measure_units",
    icon: FiList,
  },
];

const userPermissions = {
  1: [...sharedPermissions],
  2: [...sharedPermissions],
  3: [
    ...sharedPermissions,
    {
      group: "users",
      name: "Usuarios",
      route: "/platform/users",
      icon: FiUser,
    },
  ],
  4: [
    ...sharedPermissions,
    {
      group: "users",
      name: "Usuarios",
      route: "/platform/users",
      icon: FiUser,
    },
  ],
  5: [
    ...sharedPermissions,
    {
      group: "users",
      name: "Usuarios",
      route: "/platform/users",
      icon: FiUser,
    },
  ],
  6: [], // Access to all routes
};

export default userPermissions;
