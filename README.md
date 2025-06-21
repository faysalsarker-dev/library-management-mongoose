# Library Management System

A Library Management System built with **Express**, **TypeScript**, and **MongoDB** (via Mongoose).

---

## Project Overview

This system allows managing books and borrowings with:

- Strict schema validations  
- Business logic for borrowing and availability  
- Aggregation for summary reports  
- Use of Mongoose static/instance methods and middleware  
- Filtering, sorting, and pagination support  
- Well-structured RESTful API design

---

## Technology Stack

- Node.js + Express  
- TypeScript  
- MongoDB with Mongoose  

---

## Data Models

### Book

| Field       | Type     | Constraints                                     |
|-------------|----------|------------------------------------------------|
| title       | string   | Required                                       |
| author      | string   | Required                                       |
| genre       | string   | Required; one of FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY |
| isbn        | string   | Required; unique                               |
| description | string   | Optional                                      |
| copies      | number   | Required; non-negative integer                 |
| available   | boolean  | Defaults to true; updated based on copies     |

### Borrow

| Field    | Type       | Constraints                      |
|----------|------------|---------------------------------|
| book     | ObjectId   | Required; references Book model  |
| quantity | number     | Required; positive integer       |
| dueDate  | Date       | Required                        |

---

## Key Features & Implementation

- **Schema Validation:** Enforced via Mongoose schemas and TypeScript interfaces  
- **Business Logic:**  
  - Instance method `handleCopies()` updates book availability when copies change  
  - Borrowing checks available copies before deducting  
- **Aggregation:**  
  - Summary endpoint groups borrow records by book and sums quantities  
  - Uses `$lookup` to fetch book details  
- **Mongoose Middleware:** Pre-save hooks to maintain data integrity  
- **Filtering & Sorting:** API supports genre filtering, sorting by any field, and pagination  
- **Error Handling:** Consistent JSON error responses with detailed validation messages  

---

## API Endpoints

| Method | Endpoint             | Description                         |
|--------|----------------------|-----------------------------------|
| POST   | /api/books           | Create a new book                  |
| GET    | /api/books           | Get all books with filter & sort  |
| GET    | /api/books/:bookId   | Get details of a specific book    |
| PUT    | /api/books/:bookId   | Update book data                  |
| DELETE | /api/books/:bookId   | Delete a book                     |
| POST   | /api/borrow          | Borrow a book                     |
| GET    | /api/borrow          | Borrowed books summary (aggregation) |

---






## Local Setup Instructions

1. **Clone the repository:**
  ```bash
  git clone <repository-url>
  cd assignment-3
  ```

2. **Install dependencies:**
  ```bash
  npm install
  ```

3. **Configure environment variables:**
  - Copy `.env.example` to `.env` and update values as needed (e.g., MongoDB URI).

4. **Run MongoDB:**
  - Ensure MongoDB is running locally or update the URI for a remote instance.

5. **Start the development server:**
  ```bash
  npm run dev
  ```
  - For production build:
    ```bash
    npm run build
    npm start
    ```

6. **API is available at:**  
  `http://localhost:3000/api`

7. **Run tests (if available):**
  ```bash
  npm test
  ```