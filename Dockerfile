FROM node:10

# Install package dependencies
COPY package.json /app/
COPY yarn.lock /app/
WORKDIR /app
RUN yarn install

# Copy project source after the dependencies get installed.
COPY ./src/. /app/src/
COPY .env /app/
COPY .sequelizerc /app/
COPY babel.config.js /app/

EXPOSE 3000
ENV HOST=0.0.0.0
CMD [ "yarn", "start" ]
