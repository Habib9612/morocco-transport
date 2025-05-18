# Carrier-Shipper Matching ML Model

This directory contains the machine learning model implementation for matching carriers with shippers based on various criteria. The model uses gradient boosting to predict successful matches.

## Key Features

- **Intelligent Matching Algorithm**: Matches carriers and shippers based on multiple factors:
  - Load size compatibility
  - Destination/route preferences
  - Historical reliability metrics
  - Cost efficiency

- **REST API Interface**: Provides easy integration with frontend and backend services
- **Batch Processing**: Support for bulk matching operations
- **Real-time Updates**: Model can be retrained as new data becomes available

## Components

### 1. Model Implementation (`carrier_shipper_matching.py`)

The core machine learning implementation that:
- Preprocesses carrier and shipment data
- Trains a gradient boosting model on historical successful matches
- Provides prediction capabilities for new carrier-shipment pairs
- Handles model persistence (saving/loading)

### 2. REST API (`api.py`)

A Flask-based REST API that exposes the model functionality:
- `/api/matches/carrier/<carrier_id>`: Get best shipments for a specific carrier
- `/api/matches/shipment/<shipment_id>`: Get best carriers for a specific shipment
- `/api/batch/match`: Batch processing for multiple carriers and shipments
- `/api/model/train`: Trigger model retraining
- `/api/model/status`: Check model status
- `/api/health`: Health check endpoint

## Getting Started

### Prerequisites

```
pip install flask pandas scikit-learn joblib numpy
```

### Running the API

```bash
cd models
python api.py
```

The API will be available at `http://localhost:5000`.

### Example API Calls

#### Get top matches for a carrier

```bash
curl http://localhost:5000/api/matches/carrier/C1
```

#### Get top matches for a shipment

```bash
curl http://localhost:5000/api/matches/shipment/S2
```

#### Trigger model training

```bash
curl -X POST http://localhost:5000/api/model/train
```

## Integration with Backend

The Spring Boot backend can integrate with this model through:

1. **HTTP Requests**: Direct API calls from Java using RestTemplate or WebClient
2. **Shared Database**: Both systems can read/write to shared tables
3. **Message Queue**: For asynchronous processing (future enhancement)

## Model Performance

The current model achieves the following metrics on test data:
- Accuracy: ~0.85
- Precision: ~0.83
- Recall: ~0.87
- F1 Score: ~0.85

## Future Enhancements

- **Enhanced Features**: Incorporate weather data and traffic patterns
- **Model Improvements**: Experiment with neural networks for better prediction
- **Real-time Learning**: Implement online learning for continuous model updates
- **Explainability**: Add feature importance analysis for better decision transparency# MarocTransit - AI-Powered Logistics Platform

MarocTransit is a modern logistics platform that connects shippers with carriers using AI-powered matching algorithms. The platform streamlines the process of finding and managing transportation services in Morocco.

## Features

- 🤖 AI-powered carrier matching
- 📱 Real-time shipment tracking
- 🚛 Fleet management
- 📊 Performance analytics
- 💳 Secure payment processing
- 🔔 Real-time notifications
- 🌐 Multi-language support
- 📱 Mobile-responsive design

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with secure session management
- **Maps**: Google Maps API
- **Payments**: Stripe
- **Storage**: AWS S3
- **Analytics**: Google Analytics, Sentry
- **Email**: SMTP with custom templates
- **Caching**: Redis
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL 14+
- Redis (for caching)
- AWS account (for S3)
- Google Cloud account (for Maps API)
- Stripe account (for payments)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/maroctransit-frontend.git
   cd maroctransit-frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration values.

4. Set up the database:
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
maroctransit-frontend/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard pages
│   ├── login/         # Authentication pages
│   └── ...
├── components/         # React components
│   ├── ui/            # UI components
│   └── ...
├── lib/               # Utility functions
├── prisma/            # Database schema
├── public/            # Static assets
└── styles/            # Global styles
```

## Development

### Code Style

- We use ESLint and Prettier for code formatting
- Run `pnpm lint` to check for issues
- Run `pnpm format` to format code

### Testing

- Run `pnpm test` for unit tests
- Run `pnpm test:e2e` for end-to-end tests
- Run `pnpm test:coverage` for coverage report

### Database

- Run `pnpm prisma studio` to view/edit database
- Run `pnpm prisma generate` after schema changes
- Run `pnpm prisma db push` to update database schema

## Deployment

1. Push to main branch
2. Vercel automatically deploys
3. Check deployment status at [Vercel Dashboard](https://vercel.com)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@maroctransit.com or join our Slack channel.

## Acknowledgments

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com)
- [Vercel](https://vercel.com)