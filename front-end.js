var engine = "google";
//var engine = 'duck';

//var appKey = 'AIzaSyAXXTuVp2KeF3dnIWNkV74o8UGdYHWokhM';
//var appKey = 'AIzaSyD1S2tYVgpUredMMQyhjc_PraTXu6c3JVk';
//var appKey = 'AIzaSyAPwWqDUHNPG-Wg9qSuOeNxnzmT2MFPdgU';
//var appKey = 'AIzaSyABs4O84RsUVmPQiXSaOVSJ-Le8qaWqo4E';
//var appKey = 'AIzaSyDKGZfjM_yzgF-34G53ldDrDNzvsUz5Dzg';
// var appKey = 'AIzaSyBl0NeEv8Usv9HhKwPQGpv3LPYDlWEvwY4';
var appKey = 'AIzaSyAMoMXx2F0KM_3aAPR7iQt1omD14e8SPQc';

var retry = 3;
var minWords = 5;
var maxWords = 10;
var minPermutations = 10;
var maxPermutations = 15;

var dictionnary = [
  "hi",
  "hello",
  "good day",
  "hey",
  "so",
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
  "beach",
  "slut",
  "royal",
  "the",
  "small",
  "big",
  "dumb",
  "stupid",
  "dick",
  "filthy",
  "dirty",
  "scam",
  "of",
  "some",
  "cock",
  "dirt",
  "more",
  "less",
  "again",
  "even",
  "this is",
  "I",
  "you",
  "he",
  "us",
  "they",
  "could be",
  "appreciated",
  "appreciate",
  "mean",
  "will be",
  "is",
  "a",
  "was",
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
  console.log('best:', best, getScore(best.result), getCorrection(best.result), 'DONE!');
  // document.body.innerHTML = getCorrection(best.result) || best.phrase;
  window.location = `https://translate.google.com/translate_tts?ie=UTF-8&q=${best.phrase}&tl=en&total=1&idx=0&tk=589126.967705&client=t&prev=input&ttsspeed=0.24`;
});

function getScore(result) {
  return result.searchInformation.totalResults;
}

function getCorrection(result) {
  try {
    return result.spelling.correctedQuery;
  } catch (e) {
    return null;
  }
}

function generate(cbk) {

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
  var words = getItems(dictionnary, minWords, maxWords);
  console.log(words);

  //////////////////////////////////////

  var permArr = [],
    usedChars = [];

  function permute(input) {
    var i, ch;
    for (i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0];
      usedChars.push(ch);
      if (input.length == 0) {
        permArr.push(usedChars.slice());
      }
      permute(input);
      input.splice(i, 0, ch);
      usedChars.pop();
    }
    return permArr
  };

  var permutations = getItems(permute(words), minPermutations, maxPermutations);
  console.log(permutations);
  permutations = permutations.map(function(permutation) {
    return getItems(permutation, minWords, maxWords);
  });
  console.log(permutations);

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
    // var url = `http://api.duckduckgo.com/?q=${phrase}&format=json`;
    var url = engine === 'google' ?
        `https://www.googleapis.com/customsearch/v1?key=${appKey}&cx=017576662512468239146:omuauf_lfve&q=${phrase}` :
        `http://api.duckduckgo.com/?q=${phrase}&format=json`;

    function reqListener () {
      var res = this.responseText;
      cbk(JSON.parse(res));
    }
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
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
