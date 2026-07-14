# Asteroid Tracker & Vault – Orbital Data Platform

🚀 **[View Live Application](https://asteroid-tracker-psi.vercel.app/)**

A secure, full-stack orbital data platform integrating NASA's NeoWs API to catalog and visualize near-Earth objects, allowing users to curate an isolated, cryptographically protected vault of custom favorites.

## Technical Stack
* **Frontend:** React (Client-Side Rendered), Vite, Tailwind CSS (v4)
* **Backend:** Node.js, Express (RESTful API Architecture)
* **Database:** MongoDB Atlas (Cloud NoSQL)
* **Authentication:** Clerk (Identity Provider & JWT Authentication)
* **Infrastructure:** Decoupled Cloud Runtimes via Vercel (Frontend) and Render (Backend)

## System Architecture & Data Flow
The application is architected across four decoupled layers to enforce strict environment and data isolation:

1. **Client Layer (React):** Manages user interactions, state, and UI-gating to prevent unauthorized access. Handles asynchronous network requests to NASA's NeoWs API and the backend gateway with defensive error boundaries.
2. **Identity Layer (Clerk):** Operates as an external Identity Provider (IdP), verifying user sessions and generating mathematically signed JSON Web Tokens (JWTs) for secure client-server communication.
3. **Server Gateway (Express):** Acts as the backend gatekeeper hosting REST endpoints. Implements custom Express middleware to cryptographically verify bearer JWTs before executing route handlers.
4. **Data Persistence Layer (MongoDB):** A permanent cloud-hosted NoSQL cluster that enforces data integrity and document schemas via Mongoose.

## Security Architecture & IDOR Mitigation
* **Stateless Authentication:** Enforces secure JWT verification passed via `Authorization: Bearer` headers, eliminating vulnerabilities associated with session hijacking or insecure browser cookies.
* **IDOR Attack Mitigation:** Systematically prevents Insecure Direct Object Reference (IDOR) vulnerabilities by extracting the immutable `userId` directly from the cryptographically verified token payload. All CRUD operations are mapped exclusively to that verified ID, ensuring MongoDB queries are strictly scoped to the authenticated user's private data.

## REST API Reference

*Note: All endpoints modifying user data are strictly protected and require a valid JWT passed in the Authorization header.*

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/asteroids/favorites` | Fetches the authenticated user's saved asteroids. | `200 OK`, `401 Unauthorized` |
| `POST` | `/asteroids/favorites` | Commits a new asteroid document to the user's vault. | `201 Created`, `400 Bad Request` |
| `PATCH` | `/asteroids/favorites/:name` | Updates a custom note on a specific asteroid. | `200 OK`, `404 Not Found` |
| `DELETE` | `/asteroids/favorites/:name` | Erases a specific asteroid from the user's vault. | `200 OK`, `404 Not Found` |

## Local Development Setup
To ensure strict credential isolation, configure `.env` files in both the root frontend and backend directories before running locally:

**Frontend (`/.env`)**
| Variable | Description |
| :--- | :--- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Public key for Clerk frontend UI components. |
| `VITE_API_URL` | Base URL for the Express server (e.g., `http://localhost:3000`). |

**Backend (`/.env`)**
| Variable | Description |
| :--- | :--- |
| `CLERK_SECRET_KEY` | Private cryptographic key to decode and verify JWTs. |
| `MONGO_URL` | Connection string for MongoDB Atlas. |