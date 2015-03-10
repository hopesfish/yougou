#!/bin/bash
#init
mkdir /var/www
mkdir /var/www/html
mkdir /var/www/html/yougou
mkdir /var/www/html/yougou-static
mkdir /var/www/html/yougou-webot
mkdir /var/www/html/yougou-static/activity

#code
cd /home/yougou/yougou
git reset --hard
git pull

cp -frap api/* /var/www/html/yougou
cp -frap static/* /var/www/html/yougou-static
cp -frap webot/* /var/www/html/yougou-webot

#update ngingx
cd /home/yougou/yougou/shells/online/nginx/conf.d
rm -f /etc/nginx/conf.d/*
cp -f *.conf /etc/nginx/conf.d

#777
mkdir /var/www/html/yougou/protected/runtime
chmod 777 /var/www/html/yougou/protected/runtime
chown nginx:nginx -R /var/www/html/*

#service php-fpm restart

#sed
mobile_build_version=`date +%Y%m%d%s`
sed -i "s#mobile_build_version#${mobile_build_version}#g" `grep -lr mobile_build_version /var/www/html/yougou-webot/*`
sed -i "s#mobile_build_version#${mobile_build_version}#g" `grep -lr mobile_build_version /var/www/html/yougou-static/*`

#webot
cd /var/www/html/yougou-webot/conf
mv -f index.online.js index.js
cd /var/www/html/yougou-webot
pm2 delete wechat
pm2 start process.json

