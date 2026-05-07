# WhatsApp API Secure Gateway

A high-performance authentication middleware designed to secure unofficial WhatsApp API gateways through centralized Nginx verification.

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.1-blue.svg" />
  <img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white" />
  <a href="LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-yellow.svg" target="_blank" />
  </a>
  <a href="https://codecov.io/gh/reynaldiarya/WhatsApp-API-Unofficial">
    <img src="https://codecov.io/gh/reynaldiarya/WhatsApp-API-Unofficial/branch/main/graph/badge.svg" />
  </a>
</p>

## Description

WhatsApp API Secure Gateway provides a robust authentication layer for securing private or unofficial WhatsApp API instances. It is specifically engineered to integrate with the Nginx `auth_request` module, allowing developers to centralize security logic and protect multiple backend services with a single, cryptographically secure token system. By offloading authentication to this specialized service, you ensure that only authorized requests reach your WhatsApp automation logic, preventing unauthorized access and potential rate-limiting issues on the messaging platform.

## Features

- **Nginx Integration** - Native support for the `auth_request` module, enabling subrequest-based authentication for backend services
- **Automated Token Management** - Automatically generates, rotates, and persists secure cryptographically strong tokens in a flat-file database
- **Timing-Safe Verification** - Implements timing-safe string comparisons to protect against side-channel attacks during authentication
- **High-Performance Logging** - Structured, production-ready logging powered by Pino for real-time observability and monitoring
- **Security-First Headers** - Pre-configured with Helmet.js to enforce secure HTTP headers and protect against common web vulnerabilities
- **Containerized Architecture** - Fully dockerized with an optimized Alpine Linux footprint for seamless deployment in modern CI/CD pipelines
- **Graceful Lifecycle Management** - Built-in handlers for clean shutdowns, ensuring no data loss or hung processes during service restarts

## Tech Stack

- **Runtime**: Node.js 22 (LTS)
- **Framework**: Express.js 5.x
- **Security**: Helmet, Timing-Safe Comparisons
- **Logging**: Pino, Pino-Pretty
- **Reverse Proxy Support**: Nginx (auth_request)
- **Deployment**: Docker, Alpine Linux

## Installation Guide

### Prerequisites

- Node.js 20.x or higher
- Docker (optional, for containerized deployment)
- Nginx with `ngx_http_auth_request_module` enabled

### Manual Setup

1. Clone the repository
```bash
git clone -b auth https://github.com/reynaldiarya/WhatsApp-API-Unofficial.git
cd WhatsApp-API-Unofficial
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

4. Start the service
```bash
npm start
```

### Docker Deployment

```bash
docker build -t whatsapp-api-auth .
docker run -d -p 5000:5000 --env-file .env --restart unless-stopped whatsapp-api-auth
```

## Configuration

The application is configured using environment variables. Ensure these are set in your `.env` file or container environment.

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | The port the authentication service listens on | `5000` |
| `TOKEN_FILE` | Path to the file where the secure token is stored | `./auth/data/token.txt` |
| `NODE_ENV` | Environment mode (development/production) | `development` |
| `LOG_LEVEL` | Minimum log level (info, debug, error) | `info` |

## Usage

### Nginx Configuration

To secure your WhatsApp API with this service, add the following to your Nginx server block:

```nginx
server {
    listen 80;
    server_name wa.yourdomain.com;

    location / {
        auth_request /auth;
        proxy_pass http://your_whatsapp_api_backend;
        proxy_set_header Authorization $http_authorization;
    }

    location = /auth {
        internal;
        proxy_pass http://localhost:5000/auth;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header X-Original-URI $request_uri;
        proxy_set_header Authorization $http_authorization;
    }
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/auth` | Validates the `Authorization` header against the stored token. |
| `GET` | `/health` | Returns the service status and current server timestamp. |

**Sample Authentication Request:**
```bash
curl -X GET http://localhost:5000/auth \
  -H "Authorization: YOUR_GENERATED_TOKEN"
```

## Project Structure

```text
/
├── auth/data/            # Persistent storage for the authentication token
├── src/
│   ├── middleware/       # Express middleware (Error handling, etc.)
│   ├── utils/            # Security utilities and token generation logic
│   └── index.js          # Main entry point and API route definitions
├── tests/                # Automated testing suite
├── Dockerfile            # Container definition
└── nginx.conf.example    # Reference configuration for reverse proxy integration
```

## Scripts / Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start the production server |
| `npm run dev` | Start the server with Nodemon for development |
| `npm test` | Execute the authentication logic tests |
| `npm run format` | Format the source code using Prettier |

## Contributing

Contributions are essential for maintaining a secure and reliable gateway. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes following professional standards
4. Push to the branch and open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for the full text.

## Author

Reynaldi Arya