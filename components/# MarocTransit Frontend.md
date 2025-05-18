# MarocTransit Frontend

A modern web application for Morocco's transit system, providing real-time information about vehicles, schedules, and routes.

## Features

- 🚍 Real-time vehicle tracking and status updates
- 📅 Transit schedule viewing and management
- 🗺️ Interactive maps showing transit routes
- 👤 User authentication and personalized experience
- 📱 Responsive design for all devices

## Tech Stack

- **Framework**: Next.js (React)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Custom JWT-based auth
- **State Management**: React Context + SWR
- **Deployment**: Docker

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/marocotransit-frontend.git
   cd marocotransit-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your environment-specific values.

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

The following environment variables are required for the application to function properly:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API | `http://localhost:3001/api` |
| `NEXT_PUBLIC_AUTH_DOMAIN` | Auth domain | `auth.marocotransit.ma` |
| `NEXT_PUBLIC_AUTH_CLIENT_ID` | Auth client ID | - |
| `NEXT_PUBLIC_MAPS_API_KEY` | Google Maps API key | - |

## Project Structure

```
marocotransit-frontend/
├── components/           # Reusable React components
│   ├── loading.tsx       # Loading spinner component
│   └── toast.tsx         # Toast notification component
├── lib/                  # Utility functions and custom hooks
│   └── auth-context.tsx  # Authentication context provider
├── pages/                # Next.js pages
│   ├── _app.tsx          # App wrapper with providers
│   ├── index.tsx         # Home/Dashboard page
│   └── login.tsx         # Login page
├── public/               # Static assets
├── styles/               # Global styles
├── .env.example          # Example environment variables
├── Dockerfile            # Docker configuration
├── next.config.js        # Next.js configuration
└── package.json          # Dependencies and scripts
```

## Docker Deployment

The application can be deployed using Docker:

1. Build the Docker image:
   ```bash
   docker build -t marocotransit-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 marocotransit-frontend
   ```

## Development Roadmap

- [x] Core application structure
- [x] Authentication system
- [x] Basic dashboard
- [ ] Vehicle management pages
- [ ] Schedule management pages
- [ ] Interactive maps
- [ ] User profile management
- [ ] Admin dashboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [SWR](https://swr.vercel.app/)
- [Sonner](https://github.com/emilkowalski/sonner)
- [Google Maps API](https://developers.google.com/maps)