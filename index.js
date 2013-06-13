#!/usr/bin/env node

var http = require('http'),
	crypto = require('crypto'),
	argv = require('optimist')
	    .usage('Usage: $0 -u [uri]')
	    .demand(['u'])
	    .argv;

var api_host = 'SERVER_HOST',
	api_port = 15000,
	uri = argv.u,
	api_key = 'API_KEY',
	secret_key = 'SECRET_KEY',
	user_agent = 'NodeAPI',
	timestamp = Date.now(),
	method = 'GET',
	signature = api_key+":"+method+":"+uri+":"+timestamp+":"+user_agent;

var options = {
	host: api_host,
	path: uri,
	port: api_port,
	headers: 
			{
				'User-Agent': user_agent,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Host': api_host,
				'x-es-details': 'basic',
				'x-es-with-perms': 'false',
				'x-esauth-access': api_key,
				'x-esauth-signature': crypto.createHmac('sha256', new Buffer(secret_key, 'utf8')).update(new Buffer(signature, 'utf8')).digest('base64'),
				'x-esauth-timestamp': timestamp
			}
};

callback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
	  var obj = JSON.parse(str);
	  console.log(obj);
  });
}

var req = http.request(options, callback);
req.end();
