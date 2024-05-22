# Use the official Node.js image
FROM node:21.6.2

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY package.json yarn.lock ./

# Install production dependencies
RUN yarn install

# Copy local code to the container image
COPY . .

# Add SQLite3 to container
RUN yarn add sqlite3
RUN yarn add ts-node

# Expose the port
EXPOSE 3000

# Command to run your script
CMD ["yarn", "run", "start:transactions"]
