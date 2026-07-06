# LancerFlow React Client Application

This is the premium React user interface frontend for LancerFlow, built with Vite, Tailwind CSS, Framer Motion transitions, and React Hook Form.

## Tech Stack
- **React (Vite)**
- **Tailwind CSS** (glassmorphic theme styling)
- **Framer Motion** (micro-animations)
- **Lucide React** (icons library)
- **React Hook Form** (validated inputs)
- **React Hot Toast** (notifications popup)
- **Context API** (auth states, theme dark/light modes)

## Setup Instructions

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration:
   ```bash
   copy .env.example .env
   ```

4. Verify your proxy endpoint inside `.env`:
   - `VITE_API_URL`: Should point to the running backend service (default: `http://localhost:5000/api`)

5. Launch the React development app:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

## Features Walkthrough
- **Landing Page**: Full marketing SaaS flow showing stats, FAQ accordions, and contact forms.
- **Role Registration**: Sign up as a Client or Freelancer with conditional fields (Company names vs. Skills arrays).
- **Client Workspace**: Manage total postings, review freelancer proposals, accept bids (closing project queries), and mark projects as completed.
- **Freelancer Workspace**: Check recommendation matches based on skills, tracking application states (pending, accepted, rejected), and configure portfolios.
- **Details & Search**: Dynamic range query filters on budgets, categories, and keyword searches with pagination.
