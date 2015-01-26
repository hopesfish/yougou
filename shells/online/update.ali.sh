#!/bin/bash
#stop
#init
mkdir /var/www
mkdir /var/www/html
mkdir /var/www/html/yougou-luckybag
mkdir /var/www/html/yougou-static/activity
mkdir /var/www/html/yougou-static/activity/luckybag

#code
cd /home/yougou/yougou
git reset --hard
git pull

cp -frap activity/luckybag/* /var/www/html/yougou-luckybag
cp -frap activity/luckybag/public/* /var/www/html/yougou-static/activity/luckybag

#update ngingx
cd /home/yougou/yougou/shells/online/nginx/conf.d
cp -f yougou.conf /etc/nginx/conf.d

#777
chown nginx:nginx -R /var/www/html/*

#sed
mobile_build_version=`date +%Y%m%d%s`
sed -i "s#mobile_build_version#${mobile_build_version}#g" `grep -lr mobile_build_version /var/www/html/yougou-static/activity/*`
sed -i "s#localhost:3001#weixin.yougou.com/activity/luckybag#g" `grep -lr localhost:3001 /var/www/html/yougou-static/activity/luckybag/*`

cd /var/www/html/yougou-static/activity/luckybag/stylesheets
stylus --compress style.styl

#npm update
#forever start -l dream.log -a bin/www
cd /var/www/html/yougou-luckybag
rm -rf public
rm -f conf/index.js
mv -f conf/index.online.js conf/index.js
#npm install
#npm update
pm2 delete luckybag
pm2 start process.json

service nginx start