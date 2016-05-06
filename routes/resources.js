var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/:file', function (req, res) {
    fs.readFile('./resources/' + req.params.file, function (err, payload) {
        if (err === null) {
            res.end(payload);
        } else {
            console.log('err fetching resources: ', err);
        }
    });
});

module.exports = router;
