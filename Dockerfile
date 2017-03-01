FROM daocloud.io/gizwits2015/g-node-with-nginx-image:latest
FROM digitallyseamless/nodejs-bower-grunt:latest

RUN npm install -g cnpm

WORKDIR /app
ADD . /app/
ADD package.json ./
RUN cnpm install --allow-root
ADD bower.json ./
RUN bower install --allow-root
RUN grunt build
RUN cp -R ./dist/*  ../usr/share/nginx/html
RUN cat ./theNginx.conf > ../etc/nginx/conf.d/default.conf
RUN rm -rf /app

CMD ["nginx", "-g","daemon off;","grunt","cnpm","bower"]
