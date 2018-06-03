
### 安装nginx

```Bash
#安装
yum -y install nginx
#启动
service nginx start
#修改nginx.conf
vi /etc/nginx/nginx.conf
#新建www服务器目录
cd /usr/local/
mkdir www
#修改root，设置静态文件配置
root /usr/local/www
#添加nginx转发，在location里面添加，转发到swoole对应的端口
if (!-e $request_filename) {
	proxy_pass http://127.0.0.1:9501;
}
```

### git安装源码

```Bash
#git下载源码
git clone https://github.com/kbdxbt/tp5live.git
#测试swoole服务访问成功
cd /usr/local/www/tp5live/script/bin/server
php http.php
```

>通过浏览器访问 你的ip:9501+/index.php?s=/login.html 测试是否访问成功,访问成功说明swoole服务成功开启
