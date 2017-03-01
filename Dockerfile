FROM daocloud.io/nginx
FROM daocloud.io/node

WORKDIR /app
ADD package.json /app/
RUN npm install -g bower grunt-cli
RUN npm install cnpm -g
ADD bower.json /app/
RUN bower install --allow-root
RUN cnpm install --allow-root
ADD . /app/
RUN grunt build
COPY /app/dist/*  /usr/share/nginx/html

CMD ["bower", "grunt", "cnpm"]
ENTRYPOINT ["nginx", "-g","daemon off;"]