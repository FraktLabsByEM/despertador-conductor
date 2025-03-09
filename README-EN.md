# 🚗 Driver Wake-Up Alarm
🌐 **App URL:** [App](https://despertador-conductores.web.app/)

This project is a web application that monitors the user's eyes in real-time and triggers an alert if drowsiness is detected. It is designed to help drivers stay alert and avoid accidents caused by fatigue.

## 📌 Features
- Uses the **front camera** to detect the user's face.
- Detects if the eyes are closed for more than **300ms** and activates a **sound and visual alarm**.
- Utilizes **MediaPipe Face Landmarker** for facial analysis in the browser.
- Fully **responsive**, optimized for both mobile and desktop devices.

## 🚀 Installation & Usage

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### **2️⃣ Deploy on Firebase Hosting**
If you want to host it on Firebase Hosting:
```sh
firebase login
firebase init hosting
firebase deploy
```

You can also simply open `index.html` in a browser for local testing.

## 📜 Project Structure
```
/
├── index.html  # Main structure of the app
├── styles.css  # UI styles
├── main.js     # Eye detection and alert logic
└── alerta.mp3  # Alarm sound
```

## 🔧 Technologies Used
- **HTML, CSS, JavaScript**
- **MediaPipe Face Landmarker** for face detection
- **Firebase Hosting** (optional for deployment)

## 🎯 How It Works
1. Press the **“Activate Monitoring”** button to start detection.
2. If the system detects that your eyes are closed for more than 300ms:
   - The header color changes to **red**.
   - A **blinking alert animation** is triggered in the background.
   - **A warning sound is played**.
3. If the user keeps closing their eyes repeatedly, the system will trigger a **voice message** instructing them to stop and rest.

## 🛠 Future Improvements
- 🚀 Support for detecting multiple faces.
- 📱 Development of a **PWA version** for mobile installation.
- 🎙️ Integration with voice assistants for real-time recommendations.

---

**📌 Author:** Programathics by FraktLabs
🌐 **GitHub Repository:** [GitHub Repo](https://github.com/FraktLabsByEM/despertador-conductor)
🌐 **YouTube channel:** [YouTube](https://www.youtube.com/@programathics)

📩 Contributions and suggestions are welcome! 😊

