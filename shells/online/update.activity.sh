#!/bin/bash
#init
mkdir /var/www/html/yougou-finddiff
mkdir /var/www/html/yougou-static/activity/finddiff

#code
cd /home/yougou/yougou
git reset --hard
git pull

#deploy
cd /home/yougou/yougou/activity/finddiff
fis release -omd online

#sed
mobile_build_version=`date +%Y%m%d%s`

#sed -i "s#mobile_build_version#${mobile_build_version}#g" `grep -lr mobile_build_version /var/www/html/yougou-luckybag/*`
#sed -i "s#localhost:3001#weixin.yougou.com/activity/luckybag#g" `grep -lr localhost:3001 /var/www/html/yougou-luckybag/*`
#sed -i "s#localhost:3001#weixin.yougou.com/activity/luckybag#g" `grep -lr localhost:3001 /var/www/html/yougou-static/activity/luckybag/*`

cd /var/www/html/yougou-finddiff/conf
mv -f index.online.js index.js
cd /var/www/html/yougou-finddiff
rm -rf /var/www/html/yougou-static/activity/finddiff
cp -rf public /var/www/html/yougou-static/activity/finddiff
rm -rf public
cd /var/www/html/yougou-finddiff
cnpm install
pm2 delete finddiff
pm2 start process.json

