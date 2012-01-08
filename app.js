var http = require('http'),
	fs = require('fs'),
	sys = require('sys');

http.createServer(function(req, res){
  // Обработка запроса отпрвленного библиотекой
  if(req.url == '/webcam'){
  	var file='/tmp/'+new Date()+'.jpg';
	res.writeHead(200,{'Content-Type':'text/html'});
	// Создаем поток
    ws=fs.createWriteStream(file);
    // Обрабатываем Payload
    req.on('data',function(d){
		// Производим запись в поток
        ws.write(d);
    });
    // Завершаем обработку
    req.on('end',function(){
	  fs.stat(file,function(e,s){
		if(e) throw e;
		res.end(sys.inspect(s));
	  });
    });
  // Если flash исходних библиотеки находиться на другом хосте пускаем его в моем случаи это i.net.prozn.ru
  }else if(req.url == '/crossdomain.xml'){
    res.writeHead(200,{'Content-Type':'text/xml'});
    var xml = '<?xml version="1.0"?>\r\n';
    xml += '<cross-domain-policy>\r\n';
    xml += '<allow-http-request-headers-from domain="mkstroy.px6.ru" headers="*"/>\r\n';
    xml += '<allow-access-from domain="mkstroy.px6.ru"/>\r\n';
    xml += '</cross-domain-policy>';
    res.end(xml);
  // Дефолтом выводим jpegcam
  }else{
	res.writeHead(200,{'Content-Type':'text/html'});
	res.end('<script type="text/javascript" src="http://mkstroy.px6.ru/i/wc.js"></script>'+
	'<script language="JavaScript">'+
	'webcam.set_quality( 90 );'+
	'webcam.set_shutter_sound( false );'+
	'webcam.set_swf_url("http://mkstroy.px6.ru/i/wc.swf");'+
	'webcam.set_api_url("/webcam");'+
	'webcam.set_hook("onComplete", "my_callback_function");'+
	'function my_callback_function(response) {'+
	'	alert(response);'+
	'}'+
	'document.write( webcam.get_html(320, 240) );'+
	'</script>'+
	'<br><a href="javascript:void(webcam.snap())">Фото</a>');
  }
}).listen(3000);
console.log('Server started. http://localhost:3000');
