var http = require('http');
var url = require('url');
var fs=require('fs');
var io = require('socket.io');

var server= http.createServer(function(request, response){
    var path=url.parse(request.url).pathname;
    
    switch (path){
        case '/':
			fs.readFile(__dirname + '/bla.html', function(error, data){
                if(error){
                    response.writeHead(404);
                    response.write(" - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        case '/bla.html':
            fs.readFile(__dirname + path, function(error, data){
                if(error){
                    response.writeHead(404);
                    response.write(" - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        case '/js.js':
            fs.readFile(__dirname + path, function(error, data){
                if(error){
                    response.writeHead(404);
                    response.write(" - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "application/javascript"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        case '/img/bg.png':
            fs.readFile(__dirname + path, function(error, data){
                if(error){
                    response.writeHead(404);
                    response.write(" - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "image/png"});
                    response.write(data);
                    response.end();
                }
            });
            break;
        case '/img/p_bg.png':
            fs.readFile(__dirname + path, function(error, data){
                if(error){
                    response.writeHead(404);
                    response.write(" - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "image/png"});
                    response.write(data);
                    response.end();
                }
            });
            break;
        case '/style.css':
            fs.readFile(__dirname + path, function(error, data){
                if(error){
                    response.writeHead(404);
                    response.write(" - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/css"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        default:
            response.writeHead(404);
            response.write(" - 404");
            response.end();
            break;
    }
});

server.listen(3000);

var players={},
	invites=[];

var listener= io.listen(server);
listener.sockets.on('connection',function(socket){
    socket.on('new user', function(data, callback){
		if(data in players){
			callback(false);
		}else{
			callback(true);
			socket.name=data;
			socket.invites=[];
			players[socket.name]=socket;
			updateNames();
		}
    });
	
	socket.on('invite',function(invitation){
		console.log(invitation.to);
		if(invitation.to in players){
			console.log(invitation);
			players[invitation.to].emit('invite',invitation.from);
		}
	});
	
	socket.on('cancel',function(cancelation){
		if(cancelation.to in players){
				players[cancelation.to].emit('cancel',cancelation.from);
		}
	});
	
	socket.on('start',function(match){
		players[match.p1].emit('start',match.p2);
		players[match.p2].emit('start',match.p1);
		console.log("start: "+match.p1+" vs "+match.p2);
		listener.sockets.emit('cancel', match.p1);
		listener.sockets.emit('cancel', match.p2);
	});
    
    socket.on('disconnect',function(data){
		if(!socket.name)
			return;
		delete players[socket.name];
		updateNames();
    });
    
    function updateNames(){
		listener.sockets.emit('names', Object.keys(players));
    }
});
