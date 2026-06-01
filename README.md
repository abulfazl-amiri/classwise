# Classwise

Classwise is built for teachers and instructors to manage and track progress of their classes

## Description

Classwise is a REST API that helps teachers to:

- Organize their classes
- Upload their own resources
- Track prograss
- Leave notes to keep remember that what they did on each classes and what is the plan for next day

## Features

- User signup and signin
- JWT-based Auth system **access token** with **refresh token** + rotation
- Role based access: **users** only have access their own classes and resources while **admins** has more access
- Users can **create**, **read**, **update**, **delete** for resources and classes
- Users can Filter, sort, get only fields thay want, paginate
- Global Error handling

## Teck Stack

- NodeJs runtime
- Express framework
- MongoDB database with mongoose
- JWT Authentication and Authorization
- bcrypt for password hashing and dotenv for enviroment keys and secrets

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Configure enviroment variables

Create a `.env` file in project root

```env
NODE_ENV=development

PORT=3000
MONGO_URI=mongodb_connection_string

JWT_SECRET=jwt_secret
JWT_EXPIRES_IN=15min

JWT_REFRESH_SECRET=jwt_secret
JWT_REFRESH_EXPIRES_IN=7d

EMAIL_USER=you_email_address
EMAIL_PASSWORD=your_email_app_password

CLIENT_URL=http://127.0.0.1:3000
```

3. Run

In development:

```bash
npm run dev
```

or in production:

```bash
npm run start
```

## API Routes

### Auth

```http
POST    /api/v1/auth/signup
POST    /api/v1/auth/signin

GET     /api/v1/auth/me
PATCH   /api/v1/auth/me
DELETE  /api/v1/auth/me
```

### Classes

```http
GET    /api/v1/classes
POST   /api/v1/classes
GET    /api/v1/classes/:id
PATCH  /api/v1/classes/:id
DELETE /api/v1/classes/:id
```

### Resources

```http
GET    /api/v1/resources
POST   /api/v1/resources
GET    /api/v1/resources/:id
PATCH  /api/v1/resources/:id
DELETE /api/v1/resources/:id
```

## Status

Project is actively under development
Current focus is on API hardening, error handling, finding security flaws

## Authro

Abulfazl Amiri
