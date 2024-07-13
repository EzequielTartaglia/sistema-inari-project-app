const sharedPermissions = [
    { group: "stock", name: 'Lista de Productos', route: '/platform/stock' }
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
  