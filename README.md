# WhatsApp API Unofficial

A high-performance, secure, and containerized WhatsApp API gateway built with Node.js and whatsapp-web.js.

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.1-blue.svg" />
  <img src="https://img.shields.io/badge/Node.js-20.x-339933.svg" />
  <img src="https://img.shields.io/badge/Express-5.x-000000.svg" />
  <a href="LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-yellow.svg" target="_blank" />
  </a>
</p>

## Description

WhatsApp API Unofficial provides a robust RESTful interface for interacting with WhatsApp through an automated browser session. It eliminates the complexity of managing headless browsers and session persistence, offering a streamlined developer experience for sending messages and automating notifications. The service includes a built-in security layer with token-based authentication and is fully containerized, making it ideal for microservices architectures and automated deployment pipelines.

## Features

- **Automated Authentication** - Integrated QR code terminal generation for seamless account linking and session management
- **Secure API Access** - Token-based authorization system with timing-safe comparisons to protect endpoints
- **RESTful Messaging** - Simple HTTP POST endpoint for sending text messages to any valid WhatsApp number
- **System Monitoring** - Dedicated health check and status endpoints to monitor API availability and WhatsApp client readiness
- **Container Ready** - Optimized Docker configuration for rapid deployment and consistent environments
- **Smart Auto-Responder** - Optional automated reply system for directing users to primary contact numbers
- **Advanced Logging** - High-performance structured logging using Pino with support for multiple log levels

## Tech Stack

- **Runtime Environment**: Node.js 20+
- **Web Framework**: Express 5.2
- **WhatsApp Integration**: whatsapp-web.js (Puppeteer)
- **Security**: Helmet, CORS, Custom Token Auth
- **Process Management**: PM2
- **Logging**: Pino & Pino-pretty
- **Containerization**: Docker

## Installation Guide

### Prerequisites

- Node.js 20 or higher
- Docker and Docker Compose (optional, for containerized deployment)
- A WhatsApp account for linking

### Local Installation

1. Clone the repository and navigate to the project directory
2. Install the required dependencies

```bash
npm install
```

3. Configure the environment variables

```bash
cp .env.example .env
```

4. Start the development server

```bash
npm run dev
```

5. Scan the QR code displayed in your terminal using your WhatsApp mobile application (Linked Devices > Link a Device)

### Docker Deployment

To run the application using Docker, use the provided Dockerfile:

```bash
docker build -t wa-api-unofficial .
docker run -p 3000:3000 --env-file .env --restart unless-stopped wa-api-unofficial
```

## Configuration

The application is configured via environment variables. Ensure your `.env` file is properly set up.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | The port on which the Express server listens | `3000` |
| `TOKEN_FILE` | Path to store the generated secure authorization token | `./auth/data/token.txt` |
| `LOG_LEVEL` | Logging verbosity (debug, info, warn, error) | `info` |
| `AUTOREPLY` | Enable or disable the automatic response system | `true` |
| `MAIN_NUMBER` | The primary contact number for the auto-responder | `+6281234567890` |
| `NODE_ENV` | Current execution environment | `development` |

## Usage

### Authorization

Upon the first execution, the application generates a secure token stored in the file specified by `TOKEN_FILE`. This token must be included in the `Authorization` header for all protected requests.

### API Endpoints

#### 1. Send Message
Sends a text message to a specified phone number.

- **Endpoint**: `POST /api/send`
- **Headers**: `Authorization: YOUR_SECURE_TOKEN`
- **Body**:
```json
{
  "phone": "628123456789",
  "message": "Hello from the WhatsApp API!"
}
```

#### 2. System Status
Check the current state of the API and WhatsApp connection.

- **Endpoint**: `GET /status`
- **Response**:
```json
{
  "status": "online",
  "token_preview": "a1b2c3d4...",
  "whatsapp_ready": true
}
```

#### 3. Health Check
Simple endpoint for load balancer health checks.

- **Endpoint**: `GET /health`

## Project Structure

```text
/
├── src/
│   ├── index.js          # Server entry point and WhatsApp client logic
│   ├── middleware/       # Express middleware (error handling, auth)
│   └── utils/            # Security and phone normalization utilities
├── auth/                 # Persistent storage for session and tokens
├── tests/                # API and integration tests
├── Dockerfile            # Container configuration
├── ecosystem.config.js   # PM2 process management configuration
└── package.json          # Project dependencies and scripts
```

## Scripts / Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start the application in production mode using PM2 |
| `npm run dev` | Start the application in development mode with Nodemon |
| `npm test` | Execute the test suite |
| `npm run format` | Format the codebase using Prettier |

## Contributing

Contributions are welcome to enhance the functionality and security of this project.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for the full license text.

## Author

Reynaldi Arya
