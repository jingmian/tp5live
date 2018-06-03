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

 var wsUrl = "ws://118.24.91.76:8812";

    var websocket = new WebSocket(wsUrl);

    //实例对象的onopen属性
    websocket.onopen = function(evt) {
      console.log("conected-swoole-success");
    }

    // 实例化 onmessage
    websocket.onmessage = function(evt) {
      chat(evt.data);
      console.log("ws-server-return-data:" + evt.data);
    }

    //onclose
    websocket.onclose = function(evt) {
      console.log("close");
    }
    //onerror

    websocket.onerror = function(evt, e) {
      console.log("error:" + evt.data);
    }
function chat(data) {
	data = JSON.parse(data);
  if(data.type != '1'){
      html = '<div class="comment">';
      html += '<span>'+data.user+'</span>';
      html += '<span>'+data.content+'</span>';
      html += '</div>';
      $('#comments').append(html);
  }
}