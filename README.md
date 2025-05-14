# 🚀 CodeVault

![License](https://img.shields.io/github/license/suhelahmedprojectspace/codevault?style=flat-square)
![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)
![Tech](https://img.shields.io/badge/built%20with-Next.js%20%7C%20Prisma%20%7C%20TailwindCSS%20%7C%20ShadCN-informational?style=flat-square)

**CodeVault** is a sleek and developer-focused platform to **save, manage, share, and collaborate** on code snippets. Built with modern full-stack technologies and an elegant UI, it helps you organize code effortlessly.

![CodeVault Banner](https://your-image-url/banner.png) <!-- Replace this with a real image URL -->

---

## 🌟 Features

- 🧩 **Create, update, delete** code snippets
- 🧠 **Portfolio builder** to showcase your snippets in an organized layout
- 🎯 **Filtering and search** by title, tags, and language
- 🔄 **Pagination** for clean snippet browsing
- 📊 **Dashboard** with usage stats and user data
- 📩 **Request notification system** for snippet access
- 🔐 Public/Private snippet visibility
- 🎨 Syntax highlighting and framework selection
- 📋 Paste from clipboard, clear editor, and more
- ⚙️ Role-based access control (Admin/Author)

---

## 🧪 Technologies Used

| Category           | Tech Stack                                                                 |
|--------------------|----------------------------------------------------------------------------|
| **Frontend**       | `Next.js (App Router)` · `Tailwind CSS` · `ShadCN UI` · `CSS3`            |
| **Backend**        | `Next.js API Routes` · `Prisma ORM` · `Auth.js` · `bcrypt`                |
| **Editor**         | `Monaco Editor` (VS Code-like syntax highlighting)                        |
| **Realtime**       | `Native WebSocket` for notifications                                      |
| **Database**       | `PostgreSQL` (or any relational DB supported by Prisma)                   |
| **Others**         | `Axios` · `Framer Motion` · `Zod` · `Radix UI`                            |

---

## 📁 Project Structure & Folder Guide

```bash /app 
# Next.js App Router /(auth)
# Login/Register logic /dashboard
# Snippet management UI /portfolio # Portfolio builder /api
# API endpoints /snippet
# CRUD APIs for snippets /components # Reusable UI components /snippet
 # Snippet cards, editors, etc. /dashboard
# Stats, tables, pagination /notifications
# Toasts, access requests /constants
# Enums, route lists, snippet filters /lib
# Helper functions /styles # Global CSS, Tailwind configs /types
# TypeScript types/interfaces /utils # Utilities (slugify, debounce, etc.) /prisma
# Prisma schema and migrations /public # Static files and images ``` 
