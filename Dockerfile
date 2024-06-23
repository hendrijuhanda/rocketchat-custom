# Use the official Meteor image as a base
FROM node:14

# Set environment variables
ENV MONGO_URL=mongodb://mongo:27017/rocketchat
ENV ROOT_URL=http://localhost
ENV PORT=3000

# Create app directory
WORKDIR /app

# Copy Meteor app files
COPY . /app

# Install Meteor
RUN curl https://install.meteor.com/ | sh

# Install dependencies
RUN yarn install

# Build the Meteor app
RUN cd /app/apps/meteor && meteor build --allow-superuser --directory /app/build

# Install server-only dependencies
RUN cd /app/build/bundle/programs/server && npm install

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "/app/build/bundle/main.js"]
