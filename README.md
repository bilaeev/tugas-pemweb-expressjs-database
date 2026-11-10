# Tugas Pemrograman Web

## Branch
- main: 01. TugasExpressJS (array)
- feat/prisma-postgresql: 02. TugasExpressXDatabase (PostgreSQL + Prisma)

## Endpoint
GET /products
GET /products/:id
POST /products
PUT /products/:id
DELETE /products/:id

## Instalasi
npm install
Copy-Item .env.example .env
# Sesuaikan DATABASE_URL dengan PostgreSQL yang digunakan
npx prisma migrate dev --name init
npm run db:seed
npm run dev

## Contoh POST/PUT
{"name":"Penggaris","price":7000}

Catatan: PUT dan DELETE tersedia pada branch database.
