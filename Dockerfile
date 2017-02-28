FROM daocloud.io/nginx
FROM daocloud.io/node

WORKDIR /app
ADD package.json /app/
RUN npm install -g bower grunt-cli
RUN npm install
RUN bower install
ADD . /app/
RUN grunt build && \
    cp -R /app/dist/*  /usr/share/nginx/html && \
    rm -rf /app

ENTRYPOINT ["nginx", "-g","daemon off;"]