FROM daocloud.io/nginx
FROM daocloud.io/node:0.10-onbuild

WORKDIR /app
ADD package.json /app/
RUN npm install
ADD . /app/
RUN grunt build && \
    cp -R /app/dist/*  /usr/share/nginx/html && \
    rm -rf /app

ENTRYPOINT ["nginx", "-g","daemon off;"]