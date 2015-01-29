#!/bin/bash
#init
mkdir /var/www
mkdir /var/www/html
mkdir /var/www/html/yougou
mkdir /var/www/html/yougou-static
mkdir /var/www/html/yougou-static/activity
mkdir /var/www/html/yougou-static/activity/luckybag
mkdir /var/www/html/yougou-webot
mkdir /var/www/html/yougou-luckybag

#code
cd /home/yougou/yougou
git reset --hard
git pull

cp -frap api/* /var/www/html/yougou
cp -frap static/* /var/www/html/yougou-static
cp -frap webot/* /var/www/html/yougou-webot

cp -frap activity/luckybag/* /var/www/html/yougou-luckybag
cp -frap activity/luckybag/public/* /var/www/html/yougou-static/activity/luckybag

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

sed -i "s#mobile_build_version#${mobile_build_version}#g" `grep -lr mobile_build_version /var/www/html/yougou-luckybag/*`
sed -i "s#localhost:3001#weixin.yougou.com/activity/luckybag#g" `grep -lr localhost:3001 /var/www/html/yougou-luckybag/*`
sed -i "s#localhost:3001#weixin.yougou.com/activity/luckybag#g" `grep -lr localhost:3001 /var/www/html/yougou-static/activity/luckybag/*`


#webot
cd /var/www/html/yougou-webot/conf
mv -f index.online.js index.js
cd /var/www/html/yougou-webot
pm2 delete wechat
pm2 start process.json


#luckybag
cd /var/www/html/yougou-static/activity/luckybag/stylesheets
stylus --compress style.styl

cd /var/www/html/yougou-luckybag/conf
mv -f index.online.js index.js
cd /var/www/html/yougou-luckybag
pm2 delete luckybag
pm2 start process.json

