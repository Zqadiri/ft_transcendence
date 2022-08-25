###################
# BUILD FOR LOCAL DEVELOPMENT
###################

# Specify Node Version and Image
# Name Image dev (can be anything)
FROM node:18 as dev

# Specify Working directory inside container
WORKDIR /usr/src/app
# Copy application dependency manifests to the container image.
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install deps inside container 
RUN npm install

# Bundle App Source
COPY . .

# Run the build command which creates the production bundle
RUN npm run build

RUN mkdir -p /usr/src/frontend

WORKDIR /usr/src/frontend

COPY ../frontend/ .

RUN npm install

RUN npm run build

EXPOSE 3000