<?php
namespace app\index\controller;
use app\common\lib\ali\Sms;
use app\common\lib\Util;
use app\common\lib\Redis;
class Send
{
    /**
     * 发送验证码
     */
    public function index() {
        $phoneNum = intval(input('phone_num'));
        if(empty($phoneNum)) {
            // status 0 1  message data
            return Util::show(config('code.error'), 'error');
        }

        // 生成一个随机数
        $code = rand(1000, 9999);

        $taskData = [
            'method' => 'sendSms',
            'data' => [
                'phone' => $phoneNum,
                'code' => $code,
            ]
        ];
        $_POST['http_server']->task($taskData);
        return Util::show(config('code.success'), 'ok');
    }
}
