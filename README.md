# UMKM-KU API

UMKM-KU API adalah layanan backend untuk mengelola pendaftaran dan login pengguna untuk pemberi pinjaman dan peminjam. Proyek ini menggunakan Express.js, Prisma, dan TypeScript.

## Daftar Isi

- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)
- [Endpoint API](#endpoint-api)
- [Validasi](#validasi)
- [Penanganan Kesalahan](#penanganan-kesalahan)
- [Variabel Lingkungan](#variabel-lingkungan)
- [Lisensi](#lisensi)

## Instalasi

1. Clone repository:

   ```bash
   git clone https://github.com/UMKM-Ku/umkm-ku-api.git
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

- **POST /auth/register/user**

  Mendaftarkan pengguna baru.

  **Request Body:**

  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "Password123!",
    "phoneNumber": "1234567890123",
    "role": "Lender"
  }
  ```

  **Response:**

  ```json
  {
      "message": "User registered successfully",
      "data": { ... }
  }
  ```

- **POST /auth/register-lender**

  Mendaftarkan pemberi pinjaman baru..

  **Request Body:**

  ```json
  {
    "address": "123 Main St",
    "identityNumber": "1234567890123456",
    "accountNumber": "1234567890",
    "birthDate": "1990-01-01"
  }
  ```

  **Response:**

  ```json
  {
    "message": "Lender Details registered successfully",
    "data": { ... }
  }
  ```

- **POST /auth/register-borrower**

  Mendaftarkan peminjam baru.

  **Request Body:**

  ```json
  {
    "address": "123 Main St",
    "identityNumber": "1234567890123456",
    "accountNumber": "1234567890",
    "npwp": "1234567890",
    "isInstitution": true
  }
  ```

  **Response:**

  ```json
  {
    "message": "Borrower Details registered successfully",
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

- **POST /borrower/create**

  Membuat permintaan pendanaan baru.

  **Request Body:**

  ```json
  {
    "title": "Funding Title",
    "description": "Funding Description",
    "totalFund": 1000000,
    "tenor": 12,
    "returnRate": 5.5,
    "sectorId": 1
  }
  ```

  **Response:**

  ```json
  {
    "message": "Funding request created successfully",
    "FundingRequest": { ... }
  }
  ```

- **PUT /borrower/edit/:id**

  Mengedit permintaan pendanaan.

  **Request Body:**

  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description",
    "totalFund": 2000000,
    "tenor": 24,
    "returnRate": 6.0,
    "sectorId": 2
  }
  ```

  **Response:**

  ```json
  {
    "message": "Funding request updated successfully",
    "fundingRequest": { ... }
  }
  ```

- **POST /borrower/extend**

  Meminta perpanjangan permintaan pendanaan.

  **Request Body:**

  ```json
  {
    "fundingRequestId": 1
  }
  ```

  **Response:**

  ```json
  {
    "message": "Funding request extension requested successfully",
    "FundingAction": { ... }
  }
  ```

- **GET /borrower/funding-requests**

  Mendapatkan semua permintaan pendanaan peminjam.

  **Response:**

  ```json
  {
    "message": "Funding request retrieved successfully",
    "fundingRequest": [ ... ],
    "pagination": { ... }
  }
  ```

- **GET /borrower/funding-requests/:id**

  Mendapatkan permintaan pendanaan berdasarkan ID.

  **Response:**

  ```json
  {
    "message": "Funding request retrieved successfully",
    "fundingRequest": { ... }
  }
  ```

- **GET /borrower/:borrowerId/reviews**

  Mendapatkan ulasan untuk peminjam.

  **Response:**

  ```json
  {
    "message": "Reviews fetched successfully",
    "reviews": [ ... ]
  }
  ```

- **POST /lender/wallet/deposit**

  Menyetor dana ke dompet pemberi pinjaman.

  **Request Body:**

  ```json
  {
    "amount": 1000000
  }
  ```

  **Response:**

  ```json
  {
    "message": "Deposit successful",
    "wallet": { ... }
  }
  ```

- **GET /lender/fundings**

  Mendapatkan semua permintaan pendanaan yang dipublikasikan.

  **Response:**

  ```json
  {
    "message": "Published funding requests",
    "fundingRequests": [ ... ],
    "pagination": { ... }
  }
  ```

- **GET /lender/fundings/:id**

  Mendapatkan detail permintaan pendanaan berdasarkan ID.

  **Response:**

  ```json
  {
    "message": "Funding request details fetched successfully",
    "fundingRequest": { ... }
  }
  ```

- **POST /lender/fundings/transaction**

  Membuat transaksi pendanaan.

  **Request Body:**

  ```json
  {
    "fundingRequestId": 1,
    "amount": 500000
  }
  ```

  **Response:**

  ```json
  {
    "message": "Funding transaction created successfully",
    "transaction": { ... },
    "updatedFundingRequest": { ... }
  }
  ```

- **GET /lender/fundings/filter**

  Memfilter permintaan pendanaan.

  **Request Query:**

  ```json
  {
    "returnRate": 5.5,
    "sectorId": 1,
    "totalFund": 1000000,
    "page": 1,
    "pageSize": 10
  }
  ```

  **Response:**

  ```json
  {
    "message": "Filtered funding requests fetched successfully",
    "fundingRequests": [ ... ],
    "pagination": { ... }
  }
  ```

- **POST /lender/review**

  Menambahkan ulasan untuk peminjam.

  **Request Body:**

  ```json
  {
    "lenderId": 1,
    "borrowerId": 2,
    "rating": 5,
    "comment": "Great borrower!"
  }
  ```

  **Response:**

  ```json
  {
    "message": "Review added successfully",
    "review": { ... }
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
