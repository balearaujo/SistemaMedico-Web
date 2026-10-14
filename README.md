SISTEMA WEB DE RECETAS MEDICAS

Este repositorio contiene el proyecto de Programación de Sistemas Web para la gestión rápida y eficiente de recetas médicas y expedientes de pacientes.
1. DISEÑO DE ARQUITECTURA Y SEPARACIÓN DE RESPONSABILIADES

   Para este proyecto utilizaremos una arquitectura basada en el patrón MVC (Modelo-Vista-Controlador) implementada a través de una API REST. La separción de responsabilidades será la siguiente:
   * Modelos: Se encargarán exclusivamente de la conexión a la base de datos MySQL usando sentencias preparadas para evitar inyección SQL. Tendremos modelos como `PacienteModel` (para registrar y buscar pacientes), `CitaModel` (agenda) y `RecetaModel` (manejará la lógica para separar recetas de medicamentos controlados de las generales).
   * Controladores: Contendrán la lógica de negocio. Por ejemplo, el `RecetaController` recibirá los datos, validará la información y ordenará la creación del PDF; el `AuthController` validará los inicios de sesión y bloqueará la cuenta tras 5 intentos fallidos.
   * Rutas: Definirán los endpoints del sistema (por ejemplo: `/api/pacientes`).
   * MiddleWares: Actuarán como filtros de seguridad antes de llegar a los controladores. Tendremos un `authMiddleWare` para verificar que la sesión esté activa y un `roleMiddleware` para asegurar que la secretaria no pueda emitir recetas.

  ESTRUCTURA DE CARPETAS PROPUESTA:
  * `/docs`: Documentación del proyecto (PDFs, diagramas ER, Casos de Uso).
  * `/src/controllers`: Lógica de negocio de la aplicación.
  * `/src/models`: Consultas y conexión a la base de datos.
  * `/src/routes`: Definición de endpoints HTTP.
  * `/src/middlewares`: Filtros de seguridad y validación de roles.
    
3. PRUEBAS DE SEGURIDAD
   De acuerdo con los requisitos de seguridad planteados, estos son los casos de prueba previstos para validar la protección del sistema:

| ID Prueba | Escenario a probar | Resultado Esperado |
| :--- | :--- | :--- |
| **SEC-01** | Un usuario intenta iniciar sesión con contraseña incorrecta 5 veces seguidas. | El sistema bloquea temporalmente la cuenta y deniega el acceso. |
| **SEC-02** | La secretaria intenta acceder mediante la URL a la ruta de emitir receta médica. | El sistema rechaza la petición por falta de permisos (Control de acceso por rol). |
| **SEC-03** | Un atacante intenta inyectar código SQL en el buscador de pacientes. | El sistema procesa el texto como una simple cadena gracias a las sentencias preparadas; no se ejecuta código maligno. |
| **SEC-04** | Un usuario deja su sesión abierta y sin actividad por un periodo prolongado. | El sistema expira la sesión automáticamente y pide volver a iniciar sesión. |
| **SEC-05** | Se intenta acceder al sistema a través de HTTP normal en lugar de HTTPS. | El sistema fuerza la redirección a HTTPS para proteger los datos en tránsito. |
