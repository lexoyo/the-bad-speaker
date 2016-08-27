# the-bad-speaker
a bot which says non sense

```
$ npm i
$ npm start
```

on a raspberry:
```
$ sudo apt-get install gcc libasound2 libasound2-dev
$ sudo apt-get install mpg321
```

`vi node_modules/speech-stream/node_modules/mespeak/src/index.js` of `vi node_modules/mespeak/src/index.js` then
replace

>  var ESpeak = require("./ESPEAK.js")

with

>  var ESpeak = require("./ESpeak.js")
