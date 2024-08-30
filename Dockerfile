# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json .

# Install dependencies
RUN npm install



# Copy the rest of the application source code
COPY . .



# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD npm run dev

RUN npm run migrate:install

RUN npm run seedRoles

RUN npm run seedPermissions

RUN npm run seedRolePermissions




