---

# WhatsApp API Authentication Service

This project provides a simple authentication service for a WhatsApp API. The service is containerized using Docker for easy deployment and scalability.

## Features
- **Authentication Endpoint:** Handles user authentication for accessing the WhatsApp API.
- **Error Handling:** Returns custom error pages for unauthorized requests.
- **Dockerized Deployment:** Simple and efficient containerized setup.

## Requirements
- Docker installed on your system
- Access to the terminal/command prompt

---

## Getting Started

### Step 1: Build the Docker Image
Use the following command to build the Docker image:
```bash
docker build -t whatsapp-api:auth .
```

### Step 2: Run the Container
Run the Docker container and expose the service on port 5000:
```bash
docker run -p 5000:5000 --name whatsappapi --restart unless-stopped whatsapp-api:auth
```

### Step 3: Access the Service
The service will be accessible at:
```
http://localhost:5000/auth
```

---

## Example Requests

### Authentication Request
Make a POST request to the `/auth` endpoint with user credentials:
```bash
curl -X POST http://localhost:5000/auth \
     -H "Content-Type: application/json" \
     -d '{"username": "user", "password": "pass"}'
```

### Error Response
If authentication fails, you will receive an error message:
```json
{
  "error": "Unauthorized"
}
```

---

## Stopping and Removing the Container
To stop the running container:
```bash
docker stop whatsappapi
```

To remove the container:
```bash
docker rm whatsappapi
```

---

## Notes
- Ensure that port `5000` is not being used by other services.
- Use `--restart unless-stopped` to automatically restart the container if it stops unexpectedly.

---
