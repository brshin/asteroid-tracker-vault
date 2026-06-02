# Asteroid Tracker & Favorites Vault

🚀 **[View Live Application](https://asteroid-tracker-psi.vercel.app/)**

A full-stack, secure web application that allows users to explore near-Earth asteroids via NASA's NeoWs API and curate a private, personalized vault of their favorites.

## The Tech Stack
* **Frontend:** React (Client-Side Rendered), Vite, Tailwind CSS (v4)
* **Backend:** Node.js, Express (RESTful API Architecture)
* **Database:** MongoDB Atlas (Cloud NoSQL)
* **Authentication:** Clerk (Identity Provider & JWT Auth)
* **Hosting:** Vercel (Frontend), Render (Backend)

## System Architecture & Data Flow
This application operates as a distributed multi-tenant system across four core layers:

1. **Client Layer (React):** Manages user interactions and state. Implements UI-gating to prevent unauthorized access and handles asynchronous network requests with defensive error boundaries.
2. **Identity Layer (Clerk):** Acts as an external Identity Provider (IdP). Verifies users and generates mathematically signed JSON Web Tokens (JWTs) for secure client-server communication.
3. **Server Layer (Express):** The system gatekeeper. It hosts REST endpoints and utilizes custom middleware to cryptographically verify JWTs before allowing code execution.
4. **Database Layer (MongoDB):** A permanent cloud-hosted storage solution that enforces data integrity via strict Mongoose Schemas.

## Security Features
* **Stateless Authentication:** Uses JWTs passed via `Authorization: Bearer` headers rather than vulnerable session cookies.
* **IDOR Mitigation:** Protects against Insecure Direct Object Reference (IDOR) vulnerabilites by strictly extracting the `userId` from the verified token, ensuring database queries are scoped *only* to the authenticated user's private data.

## REST API Reference

*Note: All endpoints modifying user data are strictly protected and require a valid JWT passed in the Authorization header.*

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/asteroids/favorites` | Fetches the authenticated user's saved asteroids. | `200 OK`, `401 Unauthorized` |
| `POST` | `/asteroids/favorites` | Commits a new asteroid document to the user's vault. | `201 Created`, `400 Bad Request` |
| `PATCH` | `/asteroids/favorites/:name` | Updates a custom note on a specific asteroid. | `200 OK`, `404 Not Found` |
| `DELETE` | `/asteroids/favorites/:name` | Erases a specific asteroid from the user's vault. | `200 OK`, `404 Not Found` |

## Local Development Setup
To protect third-party credentials, this project utilizes environment isolation. To run this project locally for development, create `.env` files in both the frontend and backend directories:

**Frontend (`/.env`)**
| Variable | Description |
| :--- | :--- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Public key for Clerk frontend UI components. |
| `VITE_API_URL` | The base URL for the Express server (e.g., `http://localhost:3000`). |

**Backend (`/.env`)**
| Variable | Description |
| :--- | :--- |
| `CLERK_SECRET_KEY` | Private cryptographic key to decode JWTs. |
| `MONGO_URL` | Connection string for MongoDB Atlas. |