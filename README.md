# Identity Reconciliation Service

This service implements the identity reconciliation logic for contacts based on email and phone number.

## Technologies Required
- Node.js
- PostgreSQL database

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a PostgreSQL database named "bitespeed"

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
DB_HOST
DB_PORT
DB_USERNAME
DB_PASSWORD
DB_NAME
```

## Run the Project

Development mode:
```bash
npm run dev
```

### POST /identify

Identifies and links contacts based on email and phone number.

Request body:
```json
{
    "email": "string",
    "phoneNumber": "string"
}
```

Response:
```json
{
    "primaryContactId": number,
    "emails": string[],
    "phoneNumbers": string[],
    "secondaryContactIds": number[]
}
```