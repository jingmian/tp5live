<?php
namespace app\index\controller;
use app\common\lib\sms\Sms;
class Index
{
    public function index()
    {
//	return view('view');
	return '';
    }

    public function hello($name = 'ThinkPHP5')
    {
        return 'hello,' . $name;
    }

    public function sport()
    {
        return view('index');
    }

    public function detail()
    {
        return view('detail');
    }

}
