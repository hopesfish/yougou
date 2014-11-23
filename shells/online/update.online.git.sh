#!/bin/bash
#stop
service nginx stop
forever stopall

#init
mkdir /var/www
mkdir /var/www/html
mkdir /var/www/html/yougou
mkdir /var/www/html/yougou-static
mkdir /var/www/html/yougou-webot

#code
cd /home/yougou/yougou
git reset --hard
git pull

cp -frap api/* /var/www/html/yougou
cp -frap static/* /var/www/html/yougou-static
cp -frap webot/* /var/www/html/yougou-webot

#777
mkdir /var/www/html/yougou/protected/runtime
chmod 777 /var/www/html/yougou/protected/runtime
chown nginx:nginx -R /var/www/html/*

service php-fpm restart

#webot
cd /var/www/html/yougou-webot
npm update
cd /var/www/html/yougou-webot/conf
mv -f index.online.js index.js

#sed
mobile_build_version=`date +%Y%m%d%s`
sed -i "s#mobile_build_version#${mobile_build_version}#g" `grep -lr mobile_build_version /var/www/html/yougou-webot/*`
sed -i "s#mobile_build_version#${mobile_build_version}#g" `grep -lr mobile_build_version /var/www/html/yougou-static/*`

#start
cd /var/www/html/yougou-webot
forever start -l forever.log -a app.js
service nginx start
