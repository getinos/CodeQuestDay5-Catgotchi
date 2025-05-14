# 🐱 Catgotchi AI - Your AI Browser Companion

Catgotchi AI is a fun and productivity-boosting Chrome extension featuring a virtual cat that lives in your browser. It helps you stay focused, reminds you to take breaks, and supports you with real-time AI-generated advice powered by **Google Gemini**.

### 🌟 Features

- 🕒 **Activity Tracker**: Monitors your time on websites and reminds you to stretch or take breaks after inactivity or long work periods.
- 🧠 **Real-time AI Support**: Uses Gemini AI to deliver playful, witty advice to keep you motivated and smiling.
- 📝 **To-Do List**: A simple built-in task manager lets you stay organized with daily goals.
- 🐾 **Friendly UI**: Designed to feel like a digital pet that encourages productivity and well-being.

---

## 🚀 How to Install

Follow these steps to install Catgotchi AI manually in your browser:

1. **Download or Clone this Repository**

2. **Open Chrome and Visit the Extensions Page**
- Go to `chrome://extensions/` in your browser.

3. **Enable Developer Mode**
- Toggle the **Developer mode** switch in the top-right corner.

4. **Load the Extension**
- Click on **Load unpacked**.
- Select the folder where you cloned/downloaded the extension.

5. **Start Using Catgotchi AI**
- Click the cat icon in your toolbar.
- Start tracking, managing your to-dos, and getting real-time cat-powered advice!

---

## 🛠 Files Overview

| File/Folder     | Purpose                                                |
|----------------|--------------------------------------------------------|
| `manifest.json` | Extension metadata and configuration                   |
| `popup.html`    | The main interface with to-do and AI features         |
| `popup.js`      | Manages UI, to-do logic, and AI interactions          |
| `content.js`    | Tracks time spent and sends reminders based on activity |
| `content.css`   | Optional styling for content-injected elements        |
| `icon.png`      | Extension icon shown in toolbar and extensions list   |

---

## 💡 Notes

- Requires internet access for Gemini AI responses.
- Works across all websites due to `<all_urls>` permission, but can be limited by editing `manifest.json`.
- Chrome only (for now).

---

## 🐾 Let Catgotchi AI Help You Work Smarter and Happier!

