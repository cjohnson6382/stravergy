var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function (req, res) {
    fs.readFile('html/index.html', function (err, content) {
        if (err === null) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(content);
        } else {
            console.log('error loading index.html: ', err);
        }   
    }); 
});

module.exports = router;
