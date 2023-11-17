
# Use an official Node.js runtime as a parent image
FROM node:21-alpine3.17

# Set the working directory in the container
WORKDIR /middleware-service

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Build the TypeScript code
RUN npm run build

# Remove the node_modules directory to save space
RUN rm -rf src
RUN rm package.json
RUN rm tsconfig.json


# Expose a port if your application listens on a specific port
EXPOSE 3000

# Define the command to start your application (using compiled JavaScript)
CMD ["node", "dist/app.js"]
