FinSight

FinSight is a personal finance tracker built for my own daily use. It helps me follow expenses, accounts, and budgets in a convenient unified place without relying on credit card apps. The app supports manual transaction entry, category-based budgeting, a dashboard with financial highlights, account management, English and Hebrew, RTL layout, and full mobile responsiveness.

Tech Stack
Frontend
React 19
TypeScript
Vite
Material UI
TanStack Query
React Hook Form
i18next (EN + HE + RTL)
Framer Motion

Backend
Node.js
Express
MongoDB (Mongoose)
JWT authentication
Google OAuth


Getting Started
Clone
git clone https://github.com/your-username/finsight.git


Install dependencies
Frontend
cd client
npm install
npm run dev

Backend
cd server
npm install
npm run dev

Environment Variables
Create .env files for both projects:

Frontend
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_client_id

Backend
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_client_id

Features
Manual transaction entry
Categories and budgets
Financial dashboard with highlights
Accounts with balances
English and Hebrew localization
RTL support
Fully responsive UI
Google login
JWT-secured API

Screenshots will be added later.

License MIT
