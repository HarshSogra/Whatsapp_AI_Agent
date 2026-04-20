# EduAgent AI: WhatsApp Lead Automation SaaS

EduAgent AI is a powerful WhatsApp-based AI assistant designed for Coaching Institutes to capture, qualify, and convert leads automatically. It bridges the gap between AI automation and human connection.

## 🚀 Core Features

### 1. 🧠 Smart Lead Capture & Scoring
Not all messages are equal. EduAgent uses a dual-layer intent detection system:
- **Keyword Matching**: Fast detection of common queries like "fees", "demo", or "admission".
- **AI Classification (Groq + Llama-3)**: For nuanced messages, the AI classifies intent to distinguish between high-intent leads and general enquiries.
- **Lead Status**: Automatically tags students as `HOT`, `WARM`, or `COLD` based on their interactions.

### 2. 🤝 Human Connect (The "m=feature")
The agent knows when to step aside. When a student expresses a strong desire to talk to a human or asks for contact details:
- **Instant Redirection**: Provides the institute's direct phone number.
- **WhatsApp Direct Link**: Generates a `wa.me` link so the student can start a chat with a human agent in one tap.
- **Intelligent Handoff**: Marks the lead as `HOT` and stops automated AI responses if a closing flow is triggered.

### 3. 📢 Admin Instant Alerts
Never miss a high-value lead.
- **Real-time Notifications**: Sends a WhatsApp alert directly to the Institute Admin's phone as soon as a `HOT` lead or "Human Connect" request is detected.
- **Enquiry Context**: Alerts include the student's phone number and the specific message that triggered the alert.

### 4. ⏰ Automated Drip Follow-ups (Cron)
Keeps the conversation alive without manual effort.
- **2-Hour Nudge**: If a student drops off after showing high intent, the AI sends a gentle nudge to re-engage.
- **24-Hour Closer**: A final follow-up sent after a day, highlighting seat availability or demo bookings.
- **Safety Guards**: Follow-ups automatically stop if the student replies or shows negative intent.

### 5. 📊 Real-time CRM Dashboard
A sleek interface for Institute Admins to:
- Monitor conversation volume and lead conversion rates.
- View detailed profiles for every student lead.
- Check AI conversation history in real-time.

---

## 🏗️ Architecture & Stack

- **Backend**: Node.js (Express + TypeScript)
- **Database**: PostgreSQL (Prisma ORM)
- **AI Engine**: Groq SDK (Llama 3.1 8B Instant)
- **WhatsApp Engine**: Meta WhatsApp Cloud API
- **Frontend**: React (Vite) + TailwindCSS + Lucide Icons
- **Schedulers**: Node-cron for automated follow-ups

---

## 🛠️ Setup & Deployment

### 1. Database Setup
- Provision a PostgreSQL instance (Render/Supabase).
- Set your `DATABASE_URL` and `DIRECT_URL` in `backend/.env`.

### 2. Configuration
1. **Backend**:
   ```bash
   cd backend
   npm install
   npx prisma db push
   npm run dev
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### 3. Environment Variables
Ensure the following are set in `backend/.env`:
- `GROQ_API_KEY`: Your Groq API key for Llama-3.
- `WHATSAPP_API_TOKEN`: Meta WhatsApp Cloud API token.
- `WHATSAPP_PHONE_NUMBER_ID`: Your WhatsApp Business Phone ID.
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`: For Meta webhook verification.

---

## 📦 Deployment

### Backend (Render/Railway)
- Enable `/backend` as a Web Service.
- Build: `npm install && npx prisma generate && npm run build`
- Start: `npm start`

### Frontend (Static Hosting)
- Build: `npm run build`
- Output: `dist`

---

## 🔮 Roadmap
- **Stripe Integration**: Generate payment links for course fees directly in WhatsApp.
- **Multi-Tenancy**: Support for multiple institutes under a single SaaS umbrella.
- **Broadcast Campaigns**: Bulk WhatsApp templates for 'COLD' lead re-activation.

