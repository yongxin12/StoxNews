# Use the official Nginx image from Docker Hub
FROM nginx:alpine

# Copy custom Nginx config file to the container
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static frontend files (HTML, CSS, JS)
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]