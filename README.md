# Blog Admin

Admin dashboard for managing content from the Blog API.

Built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Zustand**.

## Overview

Blog Admin is the frontend administration panel for a full-stack blog application.

It allows authors to manage blog posts, users, comments, and post publication, while providing authentication and a responsive dashboard.

## Features

- Authentication with JWT
- Protected dashboard
- Author-based access control
- Dashboard with blog statistics
- Create and edit posts
- Publish and unpublish posts
- Delete posts
- Rich text editor with TinyMCE
- Post reading view
- Comments management
- Comment creation, editing, and deletion
- Like and unlike posts
- Like and unlike comments
- User management
- Profile management
- Light and dark themes
- Responsive layout
- Mobile sidebar navigation

## Tech Stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [TinyMCE](https://www.tiny.cloud/)
- [Lucide React](https://lucide.dev/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## Project Structure

```text
src/
├── app/
│   ├── login/
│   └── dashboard/
│       ├── posts/
│       ├── users/
│       └── profile/
├── components/
├── lib/
├── stores/
└── types/
```

## Requirements
- Node.js 20+
- npm
- A running instance of the Blog API

## Getting Started

Clone the repository:
```bash
git clone https://github.com/jormaedes/blog-admin.git
cd blog-admin
```

Install dependencies:
```bash
npm install
```
Create a .env.local file in the project root:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3300"
```
Start the development server:
```bash
npm run dev
```
The application will be available at:
```
http://localhost:3000
```

## Environment Variables
Variable |	Description	| Example |
|------|----------------|---------|
NEXT_PUBLIC_API_URL	| URL of the Blog API| http://localhost:3300 |

For production, set the environment variable to the URL of the deployed API:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```
Production

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

When deploying to platforms such as Vercel, configure:

```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```
as a production environment variable.

## Backend

This application requires the Blog API backend to be running.

The frontend communicates with the API for:

- Authentication
- Users
- Posts
- Comments
- Likes
- Publication status

The API must also allow requests from the frontend origin through CORS.

### Authentication

The application uses JWT authentication.

After a successful login, the JWT is stored locally and used to authenticate requests to protected API endpoints.

Only users with the AUTHOR role can access the administration dashboard.

Development

Run the development server:

```
npm run dev
```

Create a production build:

```bash
npm run build
```
License

This project is for educational and portfolio purposes.