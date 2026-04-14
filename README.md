# 📝 CodeAlpha To-Do List (Full-Stack)

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

A high-performance, responsive full-stack web application for managing daily tasks. Built as a portfolio project for the **CodeAlpha Developer Internship**, this app features a modern UI connected to an asynchronous Python backend and a cloud database.

## 🚀 Live Demo

* **Frontend (Netlify):** https://todolistcodeca.netlify.app/
* **Backend API (Render):** https://codealpha-todolist-qi1a.onrender.com/

## ✨ Features

* **Full CRUD Functionality:** Seamlessly create, read, update, and delete tasks.
* **Modern UI/UX:** Clean, minimalist, and fully responsive design utilizing Tailwind CSS (Dark Mode enabled).
* **Asynchronous Backend:** High-speed data handling using FastAPI and the `motor` async MongoDB driver.
* **Cloud Database:** Persistent, secure data storage using MongoDB Atlas.
* **CORS Configured:** Secure cross-origin resource sharing between the Netlify frontend and Render backend.

## 🛠️ Technology Stack

**Frontend:**
* HTML5, CSS3, Vanilla JavaScript
* Tailwind CSS (via CDN for rapid UI development)
* Hosted on **Netlify**

**Backend:**
* Python 3
* FastAPI (Web Framework)
* Uvicorn (ASGI Server)
* Hosted on **Render**

**Database:**
* MongoDB Atlas (Cloud NoSQL Database)
* Motor (Asynchronous Python driver for MongoDB)
* Pymongo / Dnspython

## 💻 Local Setup & Installation

To run this project locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/yajurrr/CodeAlpha_ToDoList.git
cd CodeAlpha_ToDoList
