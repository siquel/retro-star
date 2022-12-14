FROM node:16.16.0-alpine as dependencies

WORKDIR /app
EXPOSE 3000

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG GIT_COMMIT
ENV GIT_COMMIT ${GIT_COMMIT}

FROM dependencies as production

CMD ["npm", "run", "start"]
