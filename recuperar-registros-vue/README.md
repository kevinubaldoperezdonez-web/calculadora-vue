# Recuperar Registros Vue

Este proyecto es una aplicación Vue.js que permite consultar registros de preinscripción de alumnos. La aplicación incluye un formulario para registrar estudiantes y una vista para consultar los registros existentes.

## Estructura del Proyecto

```
recuperar-registros-vue
├── src
│   ├── assets
│   │   └── estilo1.css         # Estilos CSS utilizados en la aplicación
│   ├── components
│   │   └── RecordsTable.vue     # Componente que muestra la tabla de registros
│   ├── router
│   │   └── index.ts             # Configuración de rutas de la aplicación
│   ├── views
│   │   ├── FormView.vue         # Componente para el formulario de registro
│   │   └── RecordsView.vue      # Componente que muestra la tabla de registros
│   ├── App.vue                  # Componente raíz de la aplicación
│   └── main.ts                  # Punto de entrada de la aplicación
├── public
│   └── index.html               # Archivo HTML principal de la aplicación
├── package.json                 # Configuración de npm
├── tsconfig.json                # Configuración de TypeScript
├── vite.config.ts               # Configuración de Vite
└── README.md                    # Documentación del proyecto
```

## Instalación

1. Clona el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Navega al directorio del proyecto:
   ```
   cd recuperar-registros-vue
   ```

3. Instala las dependencias:
   ```
   npm install
   ```

## Uso

Para iniciar la aplicación en modo de desarrollo, ejecuta:
```
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.