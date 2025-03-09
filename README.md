# 🚗 Despertador para Conductores

Este proyecto es una aplicación web que monitorea los ojos del usuario en tiempo real y emite una alerta si detecta somnolencia. Está diseñado para ayudar a conductores a mantenerse alerta y evitar accidentes por fatiga.

## 📌 Características
- Usa la **cámara frontal** para detectar el rostro del usuario.
- Detecta si los ojos están cerrados por más de **300ms** y activa una **alarma sonora y visual**.
- Utiliza **MediaPipe Face Landmarker** para el análisis facial en el navegador.
- Totalmente **responsive**, optimizado para móviles y computadoras.

## 🚀 Instalación y Uso

### **1️⃣ Clonar el Repositorio**
```sh
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### **2️⃣ Desplegar en Firebase Hosting**
Si quieres alojarlo en Firebase Hosting:
```sh
firebase login
firebase init hosting
firebase deploy
```

También puedes simplemente abrir `index.html` en un navegador para pruebas locales.

## 📜 Estructura del Proyecto
```
/
├── index.html  # Estructura principal de la app
├── styles.css  # Estilos de la interfaz
├── main.js     # Lógica de detección de ojos y alertas
└── alerta.mp3  # Sonido de alerta
```

## 🔧 Tecnologías Usadas
- **HTML, CSS, JavaScript**
- **MediaPipe Face Landmarker** para detección de rostros
- **Firebase Hosting** (opcional para despliegue)

## 🎯 Cómo Funciona
1. Presiona el botón **“Activar Monitoreo”** para iniciar la detección.
2. Si el sistema detecta que tus ojos están cerrados por más de 300ms:
   - Cambia el color del encabezado a **rojo**.
   - Activa una **animación de alerta** en el fondo.
   - **Reproduce un sonido de advertencia**.
3. Si el usuario sigue cerrando los ojos repetidamente, el sistema activará un **mensaje de voz** para que se detenga a descansar.

## 🛠 Mejoras Futuras
- 🚀 Soporte para detección de múltiples rostros.
- 📱 Creación de una versión en **PWA** para instalar en dispositivos móviles.
- 🎙️ Integración con asistentes de voz para recomendaciones en tiempo real.

---

**📌 Autor:** Programathics by FraktLabs
🌐 **Repositorio en GitHub:** [GitHub Repo](https://github.com/FraktLabsByEM/despertador-conductor)
🌐 **Canal de YouTube:** [YouTube](https://www.youtube.com/@programathics)

📩 ¡Contribuciones y sugerencias son bienvenidas! 😊

