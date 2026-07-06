# LancerFlow Express API Backend

This is the Node.js/Express backend service for LancerFlow, built with Mongoose database connections, JWT-based security protections, and dual-mode avatar/resume file uploading strategies.

## Tech Stack
- **Node.js & Express.js**
- **MongoDB** (with Mongoose modeling)
- **JWT & bcryptjs** (security authorization hashes)
- **Multer & Cloudinary** (upload handling fallbacks)

## File Upload Fallback Architecture
To make local developer setup straightforward, the API handles uploads dynamically:
- **Cloud Mode**: If Cloudinary environment parameters are configured, profiles images and resume PDFs are hosted in Cloudinary.
- **Local Fallback**: If Cloudinary variables are left empty, files are stored locally in the `/backend/uploads` static folder.

## Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration:
   ```bash
   copy .env.example .env
   ```

4. Edit the `.env` file with your credentials:
   - `MONGODB_URI`: Connect string pointing to your Atlas Cluster
   - `JWT_SECRET`: Random string hash
   - `CLOUDINARY_*` (Optional): Cloud details for production file serving

5. Start backend development server:
   ```bash
   # Run node server directly
   npm start
   ```

## API Endpoint Reference

- **Auth** `/api/auth`
  - `POST /register`: Registers Client or Freelancer (avatar uploads parsed before validations).
  - `POST /login`: Validates password and generates JWT token.
  - `GET /me`: Fetches profile details of current user.

- **Profile** `/api/users`
  - `PUT /profile`: Updates developer bio, company details, social references, experience lists, and avatar/resume files.

- **Projects** `/api/projects`
  - `GET /`: Lists all filtered projects with page options.
  - `GET /:id`: Fetches single project detail context.
  - `POST /`: Creates project listing (Client role required).
  - `PUT /:id`: Edits project (Owner only).
  - `DELETE /:id`: Removes project (Owner only).
  - `PATCH /:id/status`: Toggles open/closed/completed project milestones.

- **Applications** `/api/applications`
  - `POST /`: Submits proposal bids (Freelancer only).
  - `GET /my-applications`: Fetches bids of current freelancer.
  - `GET /project/:projectId`: Fetches bids for client project review.
  - `PATCH /:id/status`: Accept or Reject proposal (locks project on accept).
  - `DELETE /:id`: Withdraws proposal.

- **Dashboard** `/api/dashboard`
  - `GET /stats`: Computes role-specific statistical analytics and recommendation matches.
