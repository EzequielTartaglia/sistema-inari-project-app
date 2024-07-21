const sharedPermissions = [
    { group: "stock", name: 'Lista de Productos', route: '/platform/products' },
    { group: "stock", name: 'Categorias', route: '/platform/product_categories' },
    { group: "stock", name: 'Unidades de medida', route: '/platform/product_measure_units' }
  ];
  
  const userPermissions = {
    // Salesman
    1: [...sharedPermissions], 
    // Supervisor
    2: [...sharedPermissions], 
    // Administrator
    3: [
      ...sharedPermissions,
      
      { group: "users", name: 'Usuarios', route: '/platform/users' },

    ], 
    // Manager
    4: [
      ...sharedPermissions,

      { group: "users", name: 'Usuarios', route: '/platform/users' },

    ],
    // Provider
    5: [
      ...sharedPermissions,
      
      { group: "users", name: 'Usuarios', route: '/platform/users' },

    ],
    // Root
    6: [], // Access to all routes
  };
  
  export default userPermissions;
  