# 🚀 CodeVault

![License](https://img.shields.io/github/license/suhelahmedprojectspace/codevault?style=flat-square)
![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)
![Tech](https://img.shields.io/badge/built%20with-Next.js%20%7C%20Prisma%20%7C%20TailwindCSS%20%7C%20ShadCN-informational?style=flat-square)

**CodeVault** is a modern developer-first platform to **create, manage, and showcase code snippets**. With powerful features like portfolio building, real-time notifications, filtering, pagination, and role-based control — CodeVault simplifies the snippet management experience with performance and elegance.

![CodeVault Banner](https://your-image-url/banner.png) <!-- Replace this with a real hosted image -->

---

## 🌟 Features

- 🧩 **CRUD for Snippets** – Create, update, delete snippets easily
- 💼 **Portfolio Builder** – Visually showcase selected code snippets
- 🔍 **Filter & Search** – By title, tag, framework, and language
- 📄 **Pagination** – Efficient navigation for large snippet libraries
- 📊 **Dashboard** – Real-time stats and user insights
- 📬 **Access Request Notifications** – Request and manage snippet visibility
- 🔐 **Public/Private Access** – Control snippet visibility
- 🎨 **Syntax Highlighting** – Monaco editor with framework selection
- 📋 **Clipboard Support** – Paste from clipboard and clear editor
- 🛡️ **Role-Based Access Control** – Admin and Author roles

---

## 🧪 Tech Stack

| Layer        | Tech                                                                 |
|--------------|----------------------------------------------------------------------|
| **Frontend** | `Next.js (App Router)` · `Tailwind CSS` · `ShadCN UI` · `CSS3`       |
| **Backend**  | `Next.js API Routes` · `Prisma ORM` · `Auth.js` · `bcrypt`           |
| **Editor**   | `Monaco Editor` (VS Code-like experience)                            |
| **Realtime** | `Native WebSocket` for instant notifications                         |
| **Database** | `PostgreSQL` (via Prisma)                                            |
| **Others**   | `Axios` · `Framer Motion` · `Radix UI` · `Zod`                       |

---

## 📁 Project Structure

```bash
/app                  # Next.js App Router
  /(auth)             # Login/Register logic
  /dashboard          # Snippet management UI
  /portfolio          # Portfolio builder
  /api
    /snippet          # CRUD APIs for snippets

/components           # Reusable UI components
  /snippet            # Snippet cards, editors, previews
  /dashboard          # Stats, tables, pagination
  /notifications      # Toasts and access requests

/constants            # Enums, route lists, snippet filters
/lib                  # Helper and utility functions
/styles               # Global CSS & Tailwind configurations
/types                # Global TypeScript types and interfaces
/utils                # Utility logic (slugify, debounce, etc.)
/prisma               # Prisma schema & migration files
/public               # Static assets and images




🚀 Getting Started
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/suhelahmedprojectspace/codevault.git
cd codevault
2. Install Dependencies
bash
Copy
Edit
npm install
# or
yarn install
3. Setup Environment Variables
Create a .env file and add the following:

env
Copy
Edit
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_here
4. Run Database Migrations
bash
Copy
Edit
npx prisma migrate dev --name init
🤝 Contributing
Contributions, feedback, and feature requests are welcome! Feel free to open issues or PRs.

📄 License
This project is licensed under the MIT License.

📬 Connect
GitHub: @suhelahmedprojectspace

Project updates coming soon...

Built with ❤️ by Sahel — for developers who love clean code and beautiful UIs.

yaml
Copy
Edit
