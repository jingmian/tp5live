
## 学习笔记

swoole woker进程为 master_pid是主进程的ID，manager_pid是管理进程的ID 可通过设置 worker_num 参数增加进程，所以woker进程数为 2+worker_num

>事件执行顺序

* 所有事件回调均在$server->start后发生
* 服务器关闭程序终止时最后一次事件是onShutdown
* 服务器启动成功后，onStart/onManagerStart/onWorkerStart会在不同的进程内并发执行
* onReceive/onConnect/onClose在Worker进程中触发
* Worker/Task进程启动/结束时会分别调用一次onWorkerStart/onWorkerStop
* onTask事件仅在task进程中发生
* onFinish事件仅在worker进程中发生

>onStart/onManagerStart/onWorkerStart 3个事件的执行顺序是不确定的

>调用Task进程必须设置 task_worker_num 参数,否则会报错,且不能放在onWorkerStart执行，执行Task进程会加载OnTask，需设置返回值才能执行onFinish函数

