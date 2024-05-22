# Use the official Node.js image
FROM node:18

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY package*.json yarn.lock ./

# Install production dependencies
RUN yarn install

# Copy local code to the container image
COPY . .

# Set permissions for the database file
RUN mkdir -p database && touch database/database.sqlite && chmod 777 database/database.sqlite

# Expose the port and start the app
EXPOSE 3000

CMD ["yarn", "process"]