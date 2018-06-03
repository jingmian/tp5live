
### Websocket启动服务

>启动swoole服务的websocket连接，并监听另一个端口，8811为图文直播端口，8812为聊天室端口
```php
$this->ws = new swoole_websocket_server(self::HOST, self::PORT);
$this->ws->listen(self::HOST, self::CHART_PORT, SWOOLE_SOCK_TCP);
```
>设置配置
```php
$this->ws->set(
       [
           'enable_static_handler' => true,
           'document_root' => "/usr/local/www/tp5live/public/static/",
           'worker_num' => 4,
           'task_worker_num' => 4,
       ]
);
```
>注册Server的事件回调函数
```php
$this->ws->on("start", [$this, 'onStart']);
$this->ws->on("open", [$this, 'onOpen']);
$this->ws->on("message", [$this, 'onMessage']);
$this->ws->on("workerstart", [$this, 'onWorkerStart']);
$this->ws->on("request", [$this, 'onRequest']);
$this->ws->on("task", [$this, 'onTask']);
$this->ws->on("finish", [$this, 'onFinish']);
$this->ws->on("close", [$this, 'onClose']);
```
>设置进程别名
```php
public function onStart($server) {
    swoole_set_process_name("live_master");
}
```
>加载thinkphp框架 路径必须保持与自己一致
```php
public function onWorkerStart($server,  $worker_id) {
  define('APP_PATH', __DIR__ . '/../../../application/');
  require __DIR__ . '/../../../thinkphp/start.php';
}
```
>处理request请求和执行response响应
```php
public function onRequest($request, $response) {
   if($request->server['request_uri'] == '/favicon.ico') {
      $response->status(404);
      $response->end();
      return ;
   }
   $_SERVER  =  [];
   if(isset($request->server)) {
        foreach($request->server as $k => $v) {
           $_SERVER[strtoupper($k)] = $v;
        }
   }
   if(isset($request->header)) {
       foreach($request->header as $k => $v) {
           $_SERVER[strtoupper($k)] = $v;
       }
   }
   $_GET = [];
   if(isset($request->get)) {
       foreach($request->get as $k => $v) {
           $_GET[$k] = $v;
       }
   }
   $_FILES = [];
   if(isset($request->files)) {
      foreach($request->files as $k => $v) {
           $_FILES[$k] = $v;
      }
   }
   $_POST = [];
   if(isset($request->post)) {
       foreach($request->post as $k => $v) {
           $_POST[$k] = $v;
       }
   }
   $this->writeLog();
   $_POST['http_server'] = $this->ws;
   ob_start();
   // 执行应用并响应
   try {
       think\Container::get('app', [APP_PATH])
            ->run()
            ->send();
    }catch (\Exception $e) {
        // todo
    }
    $res = ob_get_contents();
    ob_end_clean();
    $response->end($res);
}
```
>监听ws连接事件，通过redis记录用户$fd，禁止关闭redis，否则会出现多余的$fd未删除
```php
public function onOpen($ws, $request) {
     \app\common\lib\redis\Predis::getInstance()->sAdd(config('redis.live_game_key'), $request->fd);
}
```
>关闭ws连接，通过redis删除用户$fd
```php
public function onClose($ws, $fd) {
     \app\common\lib\redis\Predis::getInstance()->sRem(config('redis.live_game_key'), $fd);
     echo "clientid:{$fd}\n";
}
```

## 直播管理模块
>你的 ip + /index.php?s=/live.html 访问直播管理页面 发布信息会通过get请求到admin/live模块的push方法
```php
#记录信息通过task进程异步执行
$taskData = [
    'method' => 'pushLive',
    'data' => $data
];
$_POST['http_server']->task($taskData);
```
>通过task机制发送赛况实时数据给客户端
```php
public function pushLive($data, $serv = '') {
    $clients = Predis::getInstance()->sMembers(config("redis.live_game_key"));
    foreach($clients as $fd) {
        $serv->push($fd, json_encode($data));
    }
}
```
>直播管理页面上传图片
通过webupload插件上传图片，上传至admin/image模块
```php
public function index() {
   $file = request()->file('file');
   $info = $file->move('../../../public/static/admin/upload');
   if($info) {
       $data = [
          'image' => config('live.host')."admin/upload/".$info->getSaveName(),
        ];
        return Util::show(config('code.success'), 'OK', $data);
    }else {
        return Util::show(config('code.error'), 'error');
    }
}
```

## 聊天室功能
>通过live.js和chart.js连接websocket端口8811和8812
```js
var wsUrl = "ws://118.24.91.76:8812";
var websocket = new WebSocket(wsUrl);
websocket.onopen = function(evt) {
    console.log("conected-swoole-success");
}
websocket.onmessage = function(evt) {
    push(evt.data);
    console.log("ws-server-return-data:" + evt.data);
}
websocket.onclose = function(evt) {
    console.log("close");
}
websocket.onerror = function(evt, e) {
    console.log("error:" + evt.data);
}
```
>聊天室发送信息
```js
$(function() {
		$('#chart').keydown(function(event) {
			if(event.keyCode == 13) {
				var text = $(this).val();
				var url = "index.php?s=/index/chart/index.html";
				var data = {'content':text, 'game_id':1};

				$.post(url, data, function(result) {
					$(this).val("");
				}, 'json');
			}
		});
});
```
>通过connections连接给每个用户发送信息
```php
foreach(input('http_server')->ports[1]->connections as $fd) {
    input('http_server')->push($fd, json_encode($data));
}
```



## 用户直播页面
>你的 ip + /index.php?s=/detail.html 访问图文直播页面，因为nginx转发到8811端口，所以无需加端口访问即可
### 测试模块
> 打开直播管理页面发送信息->打开图片直播页面是否收到信息(包含上传图片)
> 聊天室打开多个窗口，发送信息查看是否都收到信息
> 由于图文直播和聊天室有了端口websocket端口，所以会收到两个图文信息数据
