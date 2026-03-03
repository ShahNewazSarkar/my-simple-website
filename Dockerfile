# Use Node.js base image
FROM node:23

# Create app directory
WORKDIR /usr/src/app

# Copy application source
COPY . .

# Expose app port
EXPOSE 3055