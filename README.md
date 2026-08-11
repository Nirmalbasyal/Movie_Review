Movie Review App

A full-stack movie review platform built with the MERN stack and TypeScript. Admins can add, edit, and delete movies; users can browse the catalog, search/filter, and submit ratings & reviews.

🔗 Live Demo
Frontend: https://movie-review-peach-three.vercel.app
Backend API: https://movie-review-r2cn.onrender.com

Note: the backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request after idle time may take 30–50 seconds to respond while the server wakes up.

Test Credentials

Admin account (seeded):

Email: admin@movie.com
Password: admin123

Or register a new account from the app to test as a regular user.

 Tech Stack

Frontend: React (Vite), TypeScript, Tailwind CSS, React Router Backend: Node.js, Express, TypeScript, MongoDB (Mongoose) Auth: JWT, bcrypt File Storage: Cloudinary (movie thumbnails) Deployment: Vercel (frontend), Render (backend), MongoDB Atlas (database)

Features

Admin

Add, edit, and delete movies (with thumbnail image upload)
Admin Dashboard — catalog stats (total movies, total reviews) + searchable movie table with inline edit/delete
Admins cannot submit reviews (enforced on both frontend and backend)

User

Register / login (JWT-based auth)
Browse movies with search and genre filter
View movie details, average rating, and all reviews
Submit a star rating + written review (one review per movie per user)
Edit or delete their own review


API Overview
Method	Route	Access	Description
POST	/api/auth/register	Public	Register a new user
POST	/api/auth/login	Public	Login, returns JWT
GET	/api/movies	Public	List all movies (with avg rating)
GET	/api/movies/:id	Public	Get one movie + its reviews
POST	/api/movies	Admin	Add a movie (with thumbnail upload)
PATCH	/api/movies/:id	Admin	Update a movie
DELETE	/api/movies/:id	Admin	Delete a movie
POST	/api/reviews	User	Submit a review
PATCH	/api/reviews/:id	Owner	Edit own review
DELETE	/api/reviews/:id	Owner	Delete own review
