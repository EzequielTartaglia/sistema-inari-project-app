const sharedPermissions = [
    { group: "courses", name: 'Lista de Cursos', route: '/platform/courses' }
  ];
  
  const userPermissions = {
    // Profesor
    1: [...sharedPermissions], 
    // Student
    2: [...sharedPermissions], 
    // Administrator
    3: [
      ...sharedPermissions,
      
      { group: "administration", name: 'Estado de inscripcion', route: '/platform/admin/course_enrollment_states' },

      { group: "courses", name: 'Formatos de Curso', route: '/platform/course_formats' },
      { group: "courses", name: 'Herramientas de Curso', route: '/platform/course_platform_tools' },

      { group: "users", name: 'Usuarios', route: '/platform/users' },

      
    ], 
    // Root
    4: [], // Access to all routes
  };
  
  export default userPermissions;
  