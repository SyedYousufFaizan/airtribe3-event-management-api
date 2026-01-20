# Virtual Event Management Backend

A backend system for managing virtual events, built with **Node.js**, **Express**, **jwt** and **SQLite**.  
The platform supports **secure user authentication**, **event creation and management**, **participant registration**, and **asynchronous operations**, all exposed via RESTful APIs.

---

##  Features

###  User Authentication
- User registration and login
- Password hashing using **bcrypt**
- Session management using **JWT**
- Role-based access control (`organizer`, `attendee`)

### Event Management
- Create, update, and delete events (organizers only)
- View all available events
- Event details include:
  - Title
  - Description
  - Date
  - Time
  - Organizer

### Participant Management
- Attendees can register for events
- Prevents duplicate registrations
- Persistent event–participant storage

### Asynchronous Operations
- Simulated email notification after successful event registration
- Implemented using **Promises** and **async/await**
- Non-blocking and test-friendly

### Testing
- Automated tests using **Jest** and **Supertest**
- In-memory SQLite database used during tests
- Covers authentication, authorization, events, and registrations

---

## Tech Stack

- Node.js
- Express.js
- SQLite (better-sqlite3)
- JWT (Authentication)
- bcrypt (Password hashing)
- Jest & Supertest (Testing)

---

## Api Endpoints

-- POST /register  - register a user
-- POST /login  - login existing user
-- GET /events - get all events
-- POST /events - Add a event (only for the organize, ralong with bearer token)
-- POST /events/:id/resgister - To Register for an event
-- PUT /events/:id - Edit an event (only authorized by the organizer of that particular event)
-- DELETE /events/:id - Delete an event (only authorized by the organizer of that particular event)
