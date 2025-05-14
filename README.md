# 🚀 CodeVault

![License](https://img.shields.io/github/license/suhelahmedprojectspace/codevault?style=flat-square)
![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)
![Tech](https://img.shields.io/badge/built%20with-Next.js%20%7C%20Prisma%20%7C%20TailwindCSS%20%7C%20ShadCN-informational?style=flat-square)

**CodeVault** is a modern, developer-first platform designed to **create, manage, and showcase code snippets** with precision and elegance.  
It includes features like portfolio creation, real-time notifications, advanced filtering, pagination, and role-based access control.

> Built using a full-stack modern tech stack to elevate your developer workflow.

![CodeVault Banner](https://your-image-url/banner.png) <!-- Replace this with a real image -->

---

## 🌟 Features

- 🧩 **CRUD Snippets** – Create, update, and delete code snippets
- 💼 **Portfolio Builder** – Showcase selected snippets in a clean UI
- 🔍 **Advanced Filtering & Search** – Search by title, tag, language, or framework
- 📄 **Pagination** – Efficient browsing for large snippet libraries
- 📊 **Dashboard** – Visual stats and snippet activity
- 📬 **Access Request Notifications** – Real-time alerts via WebSocket
- 🔐 **Public/Private Visibility** – Control who can access your code
- 🎨 **Syntax Highlighting** – VS Code-like editor with Monaco
- 📋 **Clipboard Support** – Paste from clipboard, clear code editor
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
/types                # TypeScript types and interfaces
/utils                # Utility functions (slugify, debounce, etc.)
/prisma               # Prisma schema & migration files
/public               # Static assets and images

# 🚀 Getting Started


Foobar is a Python library for dealing with word pluralization.

## Installation


```bash
git clone https://github.com/suhelahmedprojectspace/codevault.git
cd codevault
```

## Install Dependencies

```bash
npm install
# or
yarn install
```
## Setup Environment Variables

#### Create a .env file in the root:

```bash
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_here
```

## Run Database Migrations

```bash
npx prisma migrate dev --name init
```

## 🤝 Contributing

```bash Contributions, suggestions, and feature requests are welcome! Feel free to open issues or submit a pull request.```


## 📬 Connect
###### GitHub: @suhelahmedprojectspace

### Built with ❤️ by Sahel — for developers who love clean code and beautiful UIs.


