# Sistema de Gestión Municipal Inteligente (YauDigital)

Este proyecto es una solución integral para la Municipalidad Provincial de Yau, diseñada para automatizar el procesamiento de trámites ciudadanos mediante Inteligencia Artificial y un sistema de gestión en tiempo real.

## Arquitectura del Sistema
- **Frontend (Ciudadano):** App móvil desarrollada en Kotlin (Jetpack Compose).
- **Frontend (Funcionario):** Dashboard administrativo en Vue.js (Vite).
- **Backend/IA:** Script en Python con TensorFlow para la priorización automática de trámites.
- **Base de Datos:** Google Firebase (Cloud Firestore) para sincronización en tiempo real.

## Requisitos Previos
- Node.js instalado (para el frontend web).
- Python 3.x instalado (para el motor de IA).
- Android Studio (para ejecutar la app móvil).

## Cómo ejecutar el proyecto de forma local

### 1. Panel Administrativo (Web)
1. Navega a la carpeta `/panel-municipal`.
2. Instala dependencias: `npm install`
3. Ejecuta el servidor: `npm run dev`
4. Accede en tu navegador a `http://localhost:5173`.

### 2. Motor de Inteligencia Artificial (Backend)
1. Coloca el archivo `modelo_tramites.h5` y el JSON de credenciales de Firebase en la carpeta `/motor-ia`.
2. Instala las librerías necesarias: `pip install tensorflow numpy firebase-admin`.
3. Ejecuta el script: `python automatizacion_ml.py`.

---

## Guía de Evaluación para el Instructor
Para validar el funcionamiento del sistema, siga estos pasos:

1. **Ingreso de trámite:** Abra la App móvil y registre un nuevo trámite (Ej: "Licencia de funcionamiento" con DNI "12345678"). Verá que en el estado de prioridad dirá "Calculando...".
2. **Ejecución de IA:** En la carpeta `/motor-ia`, ejecute `python automatizacion_ml.py`. El script detectará el trámite nuevo, lo clasificará y actualizará automáticamente la prioridad en Firebase.
3. **Verificación:** En el panel web (Vue.js), verá cómo el trámite cambia de "Calculando..." a una prioridad específica.

### Ejemplo para probar prioridades:
Puede probar cómo el modelo clasifica distintos niveles de urgencia ingresando estos tipos de documentos en el formulario de la App:

| Tipo de Trámite | Prioridad esperada |
| :--- | :--- |
| **Licencia de funcionamiento** | Alta |
| **Queja vecinal** | Baja |
| **Permiso de construcción** | Media |

*Nota: El script de IA buscará todos los trámites marcados como "Calculando..." y les asignará su prioridad correspondiente según el modelo entrenado.*