
/* JavaScript content from js/wordsToNum.js in folder common */
var wordValues= new Array();

wordValues["zero"]=0;
wordValues["one"]=1;
wordValues["two"]=2;
wordValues["three"]=3;
wordValues["four"]=4;
wordValues["five"]=5;
wordValues["six"]=6;
wordValues["seven"]=7;
wordValues["eight"]=8;
wordValues["nine"]=9;

wordValues["ten"]=10;
wordValues["eleven"]=11;
wordValues["twelve"]=12;
wordValues["thirteen"]=13;
wordValues["fourteen"]=14;
wordValues["fifteen"]=15;
wordValues["sixteen"]=16;
wordValues["seventeen"]=17;
wordValues["eighteen"]=18;
wordValues["nineteen"]=19;

wordValues["twenty"]=20;
wordValues["thirty"]=30;
wordValues["forty"]=40;
wordValues["fifty"]=50;
wordValues["sixty"]=60;
wordValues["seventy"]=70;
wordValues["eighty"]=80;
wordValues["ninety"]=90;

var magnitudeValues = new Array();

magnitudeValues["hundred"]=100;
magnitudeValues["thousand"]=1000;
magnitudeValues["million"]=1000000;

function wordsToCurrency(currencyStr)
{
    var iAnd = currencyStr.indexOf(" and ");
    if(iAnd === -1) {
        return(wordsToNumber(currencyStr));
    } else {
        dollars = wordsToNumber(currencyStr.substring(0, iAnd));
        cents = wordsToNumber(currencyStr.substring(iAnd));
        if(dollars === -1 || cents === -1) return -1;
        return(dollars + cents/100);
    }
}

function wordsToNumber(inWords)
{
   var returnValue = -1;
   var sum = 0;
   var words = inWords.split(" ");
   var wordVal;
   var magnitude=1;
   var maxMagnitude = -1;
   
   for(var iWord=0; iWord<words.length; iWord++)
   {
      wordVal = wordValues[words[iWord]];
       //alert("wordVal: " + wordVal);
      if(wordVal !== undefined) {
         if(iWord+1<words.length) {
            magnitude = magnitudeValues[words[iWord+1]];
            if(magnitude===undefined) 
            {
               magnitude = 1;
            } 
         }
         else {
            magnitude=1;
         }
         if(maxMagnitude > -1 && magnitude > maxMagnitude) {
            sum = (sum + wordVal) * magnitude;  // thousands after hundreds
         } else {
            sum = sum + (wordVal * magnitude);
         }
         maxMagnitude = Math.max(maxMagnitude, magnitude);
         returnValue = sum;
      }
   }
   return returnValue;
}

function formatMoney(number, places, symbol, thousand, decimal) {
   number = number || 0;
   places = !isNaN(places = Math.abs(places)) ? places : 2;
   symbol = symbol !== undefined ? symbol : "$";
   thousand = thousand || ",";
   decimal = decimal || ".";
   var negative = number < 0 ? "-" : "",
       i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
       j = (j = i.length) > 3 ? j % 3 : 0;
   return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}

//alert(wordsToNumber("one hundred twenty nine"));
//alert(wordsToNumber("two thousand forty one"));
//alert(wordsToCurrency("four thousand two hundred seventy dollars and twenty two"));
//alert(wordsToCurrency("eight hundred forty thousand twenty one and ninety nine"));