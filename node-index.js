var request = require('request');

var engine = getItems(['google', 'duck'], 1, 1)[0];
console.log('ENGINE:', engine);

//var appKey = 'AIzaSyAXXTuVp2KeF3dnIWNkV74o8UGdYHWokhM';
//var appKey = 'AIzaSyD1S2tYVgpUredMMQyhjc_PraTXu6c3JVk';
//var appKey = 'AIzaSyAPwWqDUHNPG-Wg9qSuOeNxnzmT2MFPdgU';
//var appKey = 'AIzaSyABs4O84RsUVmPQiXSaOVSJ-Le8qaWqo4E';
//var appKey = 'AIzaSyDKGZfjM_yzgF-34G53ldDrDNzvsUz5Dzg';
// var appKey = 'AIzaSyBl0NeEv8Usv9HhKwPQGpv3LPYDlWEvwY4';
var appKey = 'AIzaSyAMoMXx2F0KM_3aAPR7iQt1omD14e8SPQc';

var retry = 1;
var minWords = 3;
var maxWords = 13;
var minPermutations = 10;
var maxPermutations = 15;
var forceSpeed = 130;

var dictionnary = [
  "what's up",
  "well",
  "ugly",
  "horrible",
  "tacky",
  "trashy",
  "terrible",
  "sorry",
  "bum",
  "scabby",
  "smelly",
  "worthless",
  "beach",
  "slut",
  "royal",
  "small",
  "big",
  "big",
  "big",
  "dumb",
  "dumb",
  "dumb",
  "stupid",
  "dick",
  "filthy",
  "dirty",
  "scam",
  "of",
  "some",
  "cock",
  "this is",
  "I",
  "you",
  "you",
  "he",
  "us",
  "they",
  "cunt",
  "pussy",
  "twat",
  "prick",
  "asshole",
  "funny",
  "ah",
  "oh",
  "bastard",
  "shitting",
  "fucking",
  "strange",
  "motherfucker",
  "motherfucker",
  "motherfucker",
  "motherfucker",
  "shithead",
  "anto",
  "alex",
  "simon",
  "clemos",
  "JB",
  "eva",
  "tariq",
  "william",
  "laila",
];
generate(function (best) {
  console.log('best:', best.phrase, best, getScore(best.result), getCorrection(best.result), 'DONE!', best.phrase);
  // document.body.innerHTML = getCorrection(best.result) || best.phrase;
  //window.location = `https://translate.google.com/translate_tts?ie=UTF-8&q=${best.phrase}&tl=en&total=1&idx=0&tk=589126.967705&client=t&prev=input&ttsspeed=0.24`;


var streamArray = require("stream-array");
var makeProp = require("make-prop-stream");
var speechStream = require("speech-stream");
var randomvoice = require("randomvoice")();
var fs = require("fs");

var Speaker = require('speaker');
var wav = require('wav');
var reader = new wav.Reader();

// the "format" event gets emitted at the end of the WAVE header
reader.on('format', function (format) {

  // the WAVE header is stripped from the output of the reader
  reader.pipe(new Speaker(format));
});
randomvoice.speed = forceSpeed || randomvoice.speed;
console.log('random voice options: ', randomvoice, forceSpeed);
streamArray([best.phrase])
.pipe(makeProp("message"))
.pipe(speechStream(randomvoice))
.pipe(reader)
.pipe(fs.createWriteStream("out.wav"))

/*
.on('finish', function() {
  console.log('THE END')
  var wav = require('wav');
  var Speaker = require('speaker');

  var file = fs.createReadStream('out.wav');
  var reader = new wav.Reader();

  // the "format" event gets emitted at the end of the WAVE header
  reader.on('format', function (format) {

    // the WAVE header is stripped from the output of the reader
    reader.pipe(new Speaker(format));
  });

  // pipe the WAVE file to the Reader instance
  file.pipe(reader);
});
*/




});

function getScore(result) {
  return result.Results ? result.Results.length : result.searchInformation.totalResults;
}

function getCorrection(result) {
  try {
    return result.spelling.correctedQuery;
  } catch (e) {
    return null;
  }
}

function getItems(dictionnary, min, max) {
  var num = Math.ceil(min + Math.random() * (max - min));
  var words = [];
  var clone = JSON.parse(JSON.stringify(dictionnary));
  for(i=0; i<num; i++) {
    var idx = Math.floor(Math.random() * clone.length);
    words = words.concat(clone.splice(idx, 1));
  }
  return words;
}

function generate(cbk) {

  var permutations = [];
  while (permutations.length < maxPermutations) {
    permutations.push(getItems(dictionnary, minWords, maxWords));
  }
  console.log(permutations.length, 'permutations');
  permutations = getItems(permutations, minPermutations, maxPermutations);
  console.log(permutations.length, 'permutations');

  ////////////////////////////////////////
  function lookupAll(phrases, done, searchResults) {
    searchResults = searchResults || [];
    var str = phrases[0].join(' ');
    console.log(str, phrases.length, searchResults.length);
    search(str, function(res) {
      console.log(str, '=>', getCorrection(res), getScore(res));
      searchResults.push({
        "result": res,
        "phrase": str
      });
      if(phrases.length > 1) {
        lookupAll(phrases.slice(1), done, searchResults);
      }
      else{
        done(searchResults);
      }
    });
  }

  function search(phrase, cbk) {
    var url = engine === 'google' ?
        `https://www.googleapis.com/customsearch/v1?key=${appKey}&cx=017576662512468239146:omuauf_lfve&q=${phrase}` :
        `http://api.duckduckgo.com/?q=${phrase}&format=json`;

    function reqListener () {
      var res = this.responseText;
      cbk(JSON.parse(res));
    }
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        cbk(JSON.parse(body));
      }
      else console.error('HTTP ERROR (you may have reach the API quota)', error, response.statusCode);
    })
  }

  var results;
  lookupAll(permutations, function(res) {
    results = res;
    var best = results.sort(function(a, b) {
      return getScore(b.result) - getScore(a.result);
    });
    console.log(getScore(best[0].result), best[0].phrase, best);
    if(getScore(best[0].result) > 0 || --retry===0) cbk(best[0]);
    else generate(cbk);
  });

}
