# Store Rating System

This is a full-stack web application where users can rate stores from 1 to 5.

I built this project as part of a Full Stack Intern coding challenge.

## Tech Used

**Frontend**

* React
* Vite
* Axios
* React Router

**Backend**

* Node.js
* Express.js
* JWT
* bcryptjs

**Database**

* PostgreSQL

## What the application does

There are three types of users:

### Admin

* Login
* View total users, stores and ratings
* Add new users
* Add stores
* Assign a store to a store owner
* View user details
* View stores and their ratings
* Search and filter users/stores
* Sort tables

### Normal User

* Create an account and login
* View stores
* Search stores by name or address
* See the overall rating of a store
* Submit a rating from 1 to 5
* Change their submitted rating
* Change password

### Store Owner

* Login
* See their stores
* See the average rating of their stores
* See users who have rated their store
* Change password

## Project Structure

```text
rating_app_roxiler
│
├── frontend
│   └── src
│       ├── components
│       ├── pages
│       ├── services
│       ├── App.jsx
│       └── index.css
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── server.js
│   └── seed.js
│
└── README.md
```

## Running the project

### 1. Database

Create a PostgreSQL database called:

```text
store_rating
```

Create the required tables using the SQL provided with the project.

### 2. Backend

Open a terminal in the backend folder:

```cmd
cd backend
npm install
```



```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_roxiler_db
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
JWT_SECRET=your_secret_key
```

Change the database password to your local PostgreSQL password.

Then start the server:

```cmd
npm run dev
```

Backend:

```text
http://localhost:5000
```

### 3. Frontend

Open another terminal:

```cmd
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

## Login Details

For testing, an admin account is available:

```text
Email: admin@example.com
Password: Admin@123
```

A store owner account is also included:

```text
Email: owner@example.com
```

The owner password can be changed using the Change Password option.

Normal users can create an account from the Signup page.

## Validation

The following validations are implemented:

 Name: 20 to 60 char
 Address: maximum 400 char
 Password: 8 to 16 characters
 Password requires an uppercase letter
 Password requires a special character
 Email format validation
 Rating must be between 1 and 5

## Authentication

JWT is used for login authentication.

Passwords are stored as bcrypt hashes instead of plain text.

The backend also checks the user's role before allowing access to admin, user and store-owner features.

## Notes

The frontend and backend are separate applications, so both need to be running at the same time.


