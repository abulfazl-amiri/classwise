# Classwise

Classwise is a small backend project I am building to manage my teaching work.

The idea is simple: I teach different classes, each class has a subject, a book, and some progress. I want an API that can keep track of that instead of doing it by memory or random notes.

For now this is only a backend API. No frontend yet.

## What I want it to do

- save my classes
- remember each class subject and book
- track current page/chapter
- track the last day I taught a class
- later, tell me what I should teach today
- later, show how much is left from each book

## Stack

- Node.js
- Express
- MongoDB
- Mongoose

## Current state

The project is still early.

Right now I have:

- server setup
- Express app setup
- class route
- class controller
- class model
- MongoDB connection

Current route:

```text
POST /api/v1/classes
```

More routes are coming next.

## Run it

Install packages:

```bash
npm install
```

Create `.env`:

```bash
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

Start dev server:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```
