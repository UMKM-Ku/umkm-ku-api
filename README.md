  # UMKM-KU API

UMKM-KU API is a backend service for managing user registrations and logins for lenders and borrowers. This project uses Express.js, Prisma, and TypeScript.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/umkm-ku-api.git
   cd umkm-ku-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database using Prisma:

   ```bash
   npx prisma migrate dev --name init
   ```

4. Start the server:

   ```bash
   npm start
   ```

## Usage

The API server will be running at `http://localhost:8083`. You can use tools like Postman or curl to interact with the API.

## API Endpoints

### Auth Routes

- **POST /auth/register-lender**

  Registers a new lender.

  **Request Body:**

  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "Password123!",
    "phoneNumber": "1234567890123",
    "birthDate": "1990-01-01",
    "identityNumber": "1234567890123456",
    "identityCard": "path/to/identity/card",
    "accountNumber": "1234567890"
  }
  ```

  **Response:**

  ```json
  {
      "message": "User registered successfully",
      "data": { ... }
  }
  ```

- **POST /auth/register-borrower**

  Registers a new borrower.

  **Request Body:**

  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "password": "Password123!",
    "phoneNumber": "1234567890123",
    "identityNumber": "1234567890123456",
    "identityCard": "path/to/identity/card",
    "address": "123 Main St",
    "npwp": "1234567890",
    "accountNumber": "1234567890"
  }
  ```

  **Response:**

  ```json
  {
      "message": "User registered successfully",
      "data": { ... }
  }
  ```

- **POST /auth/login**

  Logs in a user.

  **Request Body:**

  ```json
  {
    "email": "john.doe@example.com",
    "password": "Password123!"
  }
  ```

  **Response:**

  ```json
  {
    "message": "Login successful",
    "access_token": "..."
  }
  ```

## Validation

The API uses `express-validator` for request validation. The validation rules are defined in `auth.validation.ts`.

### Example Validation Rules

- `name`: Must be at least 3 characters long.
- `email`: Must be a valid email address.
- `password`: Must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
- `phoneNumber`: Must be between 13 and 15 characters long.
- `identityNumber`: Must be exactly 16 characters long.

## Error Handling

The API uses a custom error handling middleware defined in `error.middleware.ts`. Validation errors and other errors are caught and formatted before being sent in the response.

### Example Error Response

```json
{
  "errors": [
    {
      "msg": "Invalid email format",
      "path": "email"
    }
  ]
}
```

## Environment Variables

The following environment variables are used in the project:

- `PORT`: The port on which the server runs.
- `DATABASE_URL`: The connection string for the database.
- `SECRET_KEY`: The secret key used for signing JWT tokens.

### Example .env file

Create a `.env` file in the root of your project with the following content:

```env
DATABASE_URL="mysql://user:password@localhost:3306/database"
PORT=8083
SECRET_KEY="your_secret_key"
```

## License

This project is licensed under the MIT License.

This `README.md` file provides a comprehensive overview of your project, including installation instructions, usage examples, API endpoints, validation rules, error handling, and environment variables. You can customize it further based on your project's specific requirements.
