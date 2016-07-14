var streamArray = require("stream-array");
var makeProp = require("make-prop-stream");
var speechStream = require("speech-stream");
var fs = require("fs");

streamArray(["Hello World!"])
.pipe(makeProp("message"))
.pipe(speechStream())
.pipe(fs.createWriteStream("example.wav"));
