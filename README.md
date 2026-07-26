# 💰 SpendWise - Personal Finance & Expense Tracker

SpendWise is a full-stack personal finance application designed to help users track incomes, manage expenses, monitor recurring subscriptions, analyze spending habits through visual charts, and export financial reports.

---

<img width="978" height="695" alt="Screenshot 2026-07-26 at 9 50 12 PM" src="https://github.com/user-attachments/assets/0b3f473f-6251-4a26-afbe-0e6c3cd5b370" />


## 🌟 Key Features

- **📊 Dashboard Overview**: Visual summary of total income, expenses, net balance, and recent transaction history.
- **💸 Income & Expense Management**: Easily add, edit, categorize, and delete income and expense transactions.
- **📈 Interactive Analytics**: Dynamic Recharts charts (Pie Charts & Line Charts) providing breakdown by categories and trend analysis.
- **🏷️ Custom Categories**: Create custom expense and income categories with custom emojis and color tags.
- **🔁 Subscriptions Tracker**: Keep track of recurring monthly/yearly subscriptions and upcoming billing dates.
- **🔎 Advanced Filtering**: Filter transactions by custom date ranges, payment methods, or specific categories.
- **📄 Data Export & Import**: Export income/expense reports to Excel (`.xlsx`) or import transactions via CSV.
- **🔐 Secure Authentication**: JWT-backed user authentication with encrypted password hashing (`bcryptjs`).
- **📧 Email Notifications**: Automated email notifications powered by Brevo SMTP for transaction receipts and updates.
<img width="1122" height="725" alt="Screenshot 2026-07-26 at 9 49 16 PM" src="https://github.com/user-attachments/assets/78001d29-67ef-45e4-a3e2-20ed7f479cd3" />

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Data Visualization**: Recharts (Pie Chart, Line Chart)
- **HTTP Client**: Axios with custom interceptors
- **Notifications**: React Hot Toast
- **Date Handling**: Moment.js

### **Backend**
- **Runtime**: Node.js + Express.js (ES Modules)
- **Database**: SQLite (Zero-config local setup) / MySQL (Sequelize ORM)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **Email Service**: Nodemailer + Brevo (Sendinblue) SMTP
- **File Processing**: ExcelJS for sheet parsing and export
- **Task Scheduling**: Node Cron for automated notifications

---

