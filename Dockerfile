FROM node:15.2-alpine3.10
EXPOSE 8080
WORKDIR /app
#COPY . .
RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python git openssh-client && \
  npm install --quiet node-gyp -g 
  # &&\
  # npm install --quiet 
  # && \
  # apk del native-deps
# RUN cd $(npm root -g)/npm \
# && npm install fs-extra \
# && sed -i -e s/graceful-fs/fs-extra/ -e s/fs.rename/fs.move/ ./lib/utils/rename.js