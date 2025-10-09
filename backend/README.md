# Gami Gedara Restaurant Backend

## Overview
This project is the backend for the Gami Gedara Restaurant application. It provides user registration and login functionalities, along with JWT-based authentication.

## Project Structure
```
backend
├── app.js
├── server.js
├── router.js
├── controller.js
├── model.js
├── middleware
│   ├── auth.js
│   └── validation.js
├── utils
│   ├── hashPassword.js
│   └── generateToken.js
├── config
│   └── database.js
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```
   cd backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Configuration

- Update the database configuration in `config/database.js` to connect to your MongoDB instance.

## Running the Application

1. Start the server:
   ```
   node server.js
   ```

2. The server will run on the specified port (default is 3000).

## API Endpoints

### Register User
- **Endpoint:** `POST /api/register`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "city": "string",
    "district": "string",
    "contactNumber": "string",
    "password": "string"
  }
  ```

### Login User
- **Endpoint:** `POST /api/login`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

## Middleware
- **Authentication:** JWT tokens are used for securing routes.
- **Validation:** Incoming requests are validated to ensure data integrity.

## Utilities
- **Password Hashing:** Passwords are hashed before being stored in the database.
- **Token Generation:** JWT tokens are generated for authenticated users.

## License
This project is licensed under the MIT License.