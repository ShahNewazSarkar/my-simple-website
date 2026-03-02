# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose app port
EXPOSE 3055

# Start the application
CMD ["node", "server.js"]