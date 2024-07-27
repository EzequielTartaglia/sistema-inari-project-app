import { FiBox, FiList, FiUser } from "react-icons/fi";

const sharedPermissions = [
    { group: "stock", name: 'Lista de Productos', route: '/platform/products', icon: FiBox  },
    { group: "stock", name: 'Categorias', route: '/platform/product_categories', icon: FiList },
    { group: "stock", name: 'Unidades de medida', route: '/platform/product_measure_units', icon: FiList }
  ];
  
  const userPermissions = {
    // Salesman
    1: [...sharedPermissions], 
    // Supervisor
    2: [...sharedPermissions], 
    // Administrator
    3: [
      ...sharedPermissions,
      
      { group: "users", name: 'Usuarios', route: '/platform/users', icon: FiUser },

    ], 
    // Manager
    4: [
      ...sharedPermissions,

      { group: "users", name: 'Usuarios', route: '/platform/users', icon: FiUser },

    ],
    // Provider
    5: [
      ...sharedPermissions,
      
      { group: "users", name: 'Usuarios', route: '/platform/users', icon: FiUser },

    ],
    // Root
    6: [], // Access to all routes
  };
  
  export default userPermissions;
  