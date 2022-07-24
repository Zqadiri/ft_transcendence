
FROM node:18 as dev


WORKDIR /usr/frontend/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @vue/cli
# RUN npm install -g @vue/cli@5.0.8

# Bundle App Source
COPY . .

# Run the build command which creates the production bundle
RUN npm run build

EXPOSE 8080

