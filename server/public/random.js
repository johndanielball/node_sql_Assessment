var express = require('express');
var router = express.Router();

router.post('/', function randomNumber (min, max) {
    return Math.floor(Math.random() * (1 + max - min) + min);
});

module.exports = router;