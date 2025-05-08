# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port (match with the one in your app)
EXPOSE 3000

# Start the app
CMD ["node", "src/app.js"]
