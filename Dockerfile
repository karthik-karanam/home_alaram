# Base image
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose port 3000 (the port your application is listening on)
EXPOSE 3001

# Start the application
CMD ["node", "server.js"]
