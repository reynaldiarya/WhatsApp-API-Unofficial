# WhatsApp API Unofficial

This project provides a simple WhatsApp API using whatsapp-web.js. The service is containerized using Docker for easy deployment and scalability.

## Requirements
- Docker installed on your system
- Access to the terminal/command prompt

## Getting Started

### Step 1: Build the Docker Image for Load Balancing using single auth
Use the following command to build the Docker image:
```bash
docker build -t whatsapp-api:auth .
```

### Step 2: Run the Container
Run the Docker container and expose the service on port 5000:
```bash
docker run -p 5000:5000 --name whatsapp-api-auth --restart unless-stopped whatsapp-api:auth
```

### Step 3: Access the Service
The service will be accessible at:
```
http://localhost:5000/auth
```

### Step 4: Configure Nginx as a Reverse Proxy
To serve the API through Nginx, you can use the provided nginx.conf.example as a template.

## Example Requests

### Authentication Request
Make a POST request to the `/auth` endpoint with user credentials:
```bash
curl -X POST http://localhost:5000/auth \
     -H "Content-Type: application/json" \
     -H "Authorization: <your-token>"
```

### Error Response
If authentication fails, you will receive an error message:
```json
{
  "status": "false",
  "message": "Error",
  "meta": "Not Authorized"
}
```

## Stopping and Removing the Container
To stop the running container:
```bash
docker stop whatsapp-api-auth
```

To remove the container:
```bash
docker rm whatsapp-api-auth
```

## Notes
- Ensure that port `5000` is not being used by other services.
- Use `--restart unless-stopped` to automatically restart the container if it stops unexpectedly.
