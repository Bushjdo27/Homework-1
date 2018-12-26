const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const httpServer = http.createServer(function(req, res){

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    const trimmedPath = pathname.replace(/\/+|\/$/, "");
    const headers = req.headers;
    const method = req.method.toLowerCase();
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function(chunk){
        buffer += decoder.write(chunk)
    })

    req.on('end', function(){
        buffer += decoder.end();

        const choosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        const data = {
            headers,
            trimmedPath,
            pathname,
            payload: buffer,
            method
        }
        
        choosenHandler(data, function(statusCode, payload){
            statusCode = typeof statusCode === 'number' ? statusCode : 200;
            payload = typeof payload === 'object' ? payload : {};
            
            payload = JSON.stringify(payload);

            res.writeHead(statusCode, {
                'Content-Type': 'application/json'
            })
            res.end(payload);
        })
    })


});

const handlers = {};

handlers.hello = function(data, callback){
    callback(200, {message: "Welcome to my homework"});
}

handlers.notFound = function(data , callback){
    callback(404, {Error: "Please check again URL, make sure you type localhost:3000/hello"})
}

const router = {
    hello: handlers.hello
}


httpServer.listen(3000, ()=> console.log(`Server is running..`))