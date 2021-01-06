FROM node
ADD / /app
WORKDIR /app
RUN rm -rf /app/node_modules && npm install && npm run build
#CMD npm run start-next
CMD npm run develop
