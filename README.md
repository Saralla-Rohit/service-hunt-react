# 🛠️ ServiceHub - Find Local Service Providers Near You

**ServiceHunt** is a web application that connects users with nearby service providers for various needs — from electricians and plumbers to chefs, photographers, and more. Whether you need help around the house or want to hire a professional for a special event, ServiceHunt makes it fast and easy.

---

## 🚀 Features

### 👤 For Users:
- 🔍 **Search for Services**: Filter service providers based on:
  - Type of service (e.g., plumber, chef, electrician)
  - Price/hour
  - Location (auto-detected or manually entered)
  - Years of experience
- 📍 **Location-Based Results**: Automatically fetches user location to show nearby service providers.
- 🧠 **Smart Filtering**: Refine your results with custom filters to find the perfect match.

### 🛠️ For Service Providers:
- 🔐 **Authentication**: Secure signup and login system.
- ✏️ **Create & Manage Profile**:
  - Set hourly rate
  - Add years of experience
  - Define location
  - List services offered
- 🧾 **CRUD Operations**: Service providers can:
  - Create their profile
  - Read/view their details
  - Update information
  - Delete their profile when needed

---

## 🧱 Tech Stack

- **Frontend**: *( React )*
- **Backend**: *( Node.js with Express )*
- **Database**: *( MongoDB )*
- **Location Services**: Geolocation API
- **APIs**: RESTful APIs for user and provider interactions

---

## 📦 Installation

```bash
git clone [https://github.com/Saralla-Rohit/service-hunt-react.git]
cd service-hunt-react
npm init -y
npm install
npm run dev
