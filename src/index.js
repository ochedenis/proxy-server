const http = require('http');
const https = require('https');
const PORT = 3000;

let host = '';

const requestHandler = (req, res) => {
    if(!host || req.url.indexOf('http') > -1) {
        host = req.url.substring(req.url.indexOf('=') + 1); // get host from request url
    }

    handleData(res);
};

/**
 * get request from host url
 * write data to http response
 * 
 * @param {http.response} mainRes 
 */
function handleData(mainRes) {
    https.get(host, (res) => {
        if(res.statusCode >= 300 && res.statusCode < 400) { 
            host = res.headers.location;

            return handleData(mainRes); // recursive call to target host at case of redirection
        }

        // write status code and content-type headers to main respopse
        mainRes.writeHead(res.statusCode, {
            'content-type': res.headers['content-type'],
        });

        // write each chunk of data to main response
        res.on('data', (chunk) => {
            mainRes.write(chunk);
        });

        // ends main response and add "Hello world!" line to html
        res.on('end', () => {
            mainRes.end("<div style='position:absolute;top:15%;right:45%;color:#5fb57d'><h1>Hello world!</h1></div>");
        });
    }).on('error', (err) => {
        console.error(`Error: ${err.message}`);
    });
}

const server = http.createServer(requestHandler);

server.listen(PORT, (err) => {
    if (err) {
        return console.error(`Error: ${err.message}`);
    }
    
    console.log(`Server is listening on ${PORT}`);
});
