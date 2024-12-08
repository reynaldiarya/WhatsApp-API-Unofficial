# WhatsApp API Unofficial

This project provides a simple WhatsApp API using whatsapp-web.js. The service is containerized using Docker for easy deployment and scalability.

## Requirements
- Docker installed on your system
- Access to the terminal/command prompt

## Getting Started

### Step 1: Build the Docker Image for Load Balancing
Use the following command to build the Docker image:
```bash
docker build -t whatsapp-api:v1 .
```

### Step 2: Run the Container
Run the Docker container and expose the service on port 5000:
```bash
docker run -p 3001:3001 --name whatsapp-api --restart unless-stopped whatsapp-api:v1
```

### Step 3: Access the Service
The service will be accessible at:
```
http://localhost:3001/api/send
```

## Example Requests

### Send Message Request
Make a POST request to the `/api/send` endpoint:
```bash
curl -X POST http://localhost:3001/api/send \
     -H "Content-Type: application/json" \
     -d '{
           "phone": "+6201111111111",
           "message": "Alo"
         }'
```

## Stopping and Removing the Container
To stop the running container:
```bash
docker stop whatsapp-api
```

To remove the container:
```bash
docker rm whatsapp-api
```

## Notes
- Ensure that port `3001` is not being used by other services.
- Use `--restart unless-stopped` to automatically restart the container if it stops unexpectedly.
