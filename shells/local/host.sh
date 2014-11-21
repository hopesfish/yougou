# !/bin/sh

#更改host
updateHost()
{
  #
  in_url=${1}
  in_ip=${2}
  inner_host=`cat /etc/hosts | grep ${in_url} | awk '{print $1}'`
  if [ ${inner_host} = ${in_ip} ];then
     echo "${inner_host}  ${in_url} ok"
  else
    #替换
     sed -i "s#${inner_host}#${in_ip}#g" /etc/hosts
     if [ $? = 0 ];then
       echo "change ${inner_host} to ${in_ip} ok"
       else 
         inner_ip_map="${in_ip} ${in_url}"
         echo ${inner_ip_map} >> /etc/hosts
         if [ $? = 0 ]; then
           echo "${inner_ip_map} to hosts success host is `cat /etc/hosts`"
         fi
     fi
  fi
}

updateHost api.test.yougouwx.us 127.0.0.1
updateHost m.test.yougouwx.us 127.0.0.1
updateHost test.yougouwx.us 127.0.0.1