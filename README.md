# Asteroid Tracker & Favorites Vault

A full-stack, dynamic web application that allows users to explore near-Earth asteroids and securely save their favorites to a permanent cloud database.

## The Tech Stack
* **Frontend:** React (Client-Side Rendered), Vite
* **Backend:** Node.js, Express (RESTful API Architecture)
* **Database:** MongoDB Atlas (Cloud NoSQL)
* **Object Modeling:** Mongoose
* **Hosting:** Vercel (Frontend), Render (Backend)

## System Architecture & Data Flow
This application is built as a distributed system across three core layers:

1. **Client Layer (React):** Manages user interactions, initiates asynchronous network requests, and handles defensive error boundaries (`res.ok`) to ensure UI stability.
2. **Server Layer (Express):** Acts as the system gatekeeper. It hosts standardized REST endpoints, processes URL parameters, and safely coordinates database operations using `try/catch` execution blocks.
3. **Database Layer (MongoDB):** A permanent, cloud-hosted storage solutions that enforces data integrity via strict Mongoose Schemas.

## REST API Reference

All requests must be made to the base production URL. The API follows a strict stateless, resource-based design pattern:

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/asteroids/favorites` | Fetches all permanently saved asteroids. | `200 OK`, `500 Error` |
| `POST` | `/asteroids/favorites` | Commits a new asteroid document to the cloud. | `201 Created`, `400 Bad Request` |
| `DELETE` | `/asteroids/favorites/:name` | Erases a specific asteroid using dynamic routing. | `200 OK`, `404 Not Found` |

## DevOps & Environment Security
To protect database credentials, this project utilizes **Environment Isolation**. Connection strings are stored locally in a strictly ignored `.env` file and securely injected directly into the Render hosting environment for production.