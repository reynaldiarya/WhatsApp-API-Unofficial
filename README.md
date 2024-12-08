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

### Step 4: Install and Configure Nginx with a Custom Domain

#### Install Nginx
Install Nginx on your server using the following command:
```bash
sudo apt update
sudo apt install nginx
```

#### Set Up a Domain Name
1. If you have a domain (e.g., `wa.example.com`), point it to your server's IP address using your domain registrar's DNS settings.
2. Verify that the domain points to your server:
   ```bash
   ping wa.example.com
   ```

#### Configure Nginx
1. Create a new Nginx configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/wa.example.com.conf
   ```
2. Add the following configuration to the file. You can use the provided nginx.conf.example as a template to set up the API with Nginx.
3. Enable the configuration by creating a symbolic link:
   ```bash
   sudo ln -s /etc/nginx/sites-available/wa.example.com.conf /etc/nginx/sites-enabled/
   ```

#### Test and Reload Nginx
1. Test the Nginx configuration for syntax errors:
   ```bash
   sudo nginx -t
   ```
2. Reload Nginx to apply the changes:
   ```bash
   sudo systemctl reload nginx
   ```

#### Access the Service via Domain
Now, your service is accessible via the custom domain:
```
http://wa.example.com/auth
```

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
