var dayOfMonthWords = new Array();

dayOfMonthWords["first"]="1";
dayOfMonthWords["second"]="2";
dayOfMonthWords["third"]="3";
dayOfMonthWords["fourth"]="4";
dayOfMonthWords["fifth"]="5";
dayOfMonthWords["sixth"]="6";
dayOfMonthWords["seventh"]="7";
dayOfMonthWords["eighth"]="8";
dayOfMonthWords["nineth"]="9";
dayOfMonthWords["tenth"]="10";
dayOfMonthWords["eleventh"]="11";
dayOfMonthWords["twelfth"]="12";
dayOfMonthWords["thirteenth"]="13";
dayOfMonthWords["fourteenth"]="14";
dayOfMonthWords["fifteenth"]="15";
dayOfMonthWords["sixteenth"]="16";
dayOfMonthWords["seventeenth"]="17";
dayOfMonthWords["eighteenth"]="18";
dayOfMonthWords["nineteenth"]="19";
dayOfMonthWords["twenty"]="2";
dayOfMonthWords["twentyieth"]="20";
dayOfMonthWords["thirty"]="3";
dayOfMonthWords["thirtieth"]="30";

var monthWords = new Array();

monthWords["january"]="1";
monthWords["february"]="2";
monthWords["march"]="3";
monthWords["april"]="4";
monthWords["may"]="5";
monthWords["june"]="6";
monthWords["july"]="7";
monthWords["august"]="8";
monthWords["september"]="9";
monthWords["october"]="10";
monthWords["november"]="11";
monthWords["december"]="12";

function dateWordsToNum(datePhrase)
{
   var monthNum;
   var dayOfMonth="";
   var dateParts=datePhrase.split(" ");
   
   for(var iPart=0; iPart<dateParts.length; iPart++)
   {
      if(monthWords[dateParts[iPart]] !== undefined)
      {
         monthNum = monthWords[dateParts[iPart]];
      }
      
      if(dayOfMonthWords[dateParts[iPart]] !== undefined)
      {
         dayOfMonth = dayOfMonth + dayOfMonthWords[dateParts[iPart]];
      }
   }
   
   if(dayOfMonth === undefined || dayOfMonth === "")
   {
       dayOfMonth = wordsToNumber(datePhrase);   
       if(dayOfMonth === -1) {
           dayOfMonth="";
       } else {
           dayOfMonth = dayOfMonth.toString();
       }
   }
   
   if(monthNum!==undefined && dayOfMonth!==undefined && dayOfMonth !== "")
   {
      dateResult = monthNum + "/" + dayOfMonth;
   } else {
      return undefined;
   }
   
   today = new Date();
   var year;
   if(parseInt(monthNum) < (today.getMonth())+1)
   {
      year = today.getFullYear() + 1;
   } else if(parseInt(monthNum) == today.getMonth()+1 &&
             parseInt(dayOfMonth) < today.getDate())
   {
      year = today.getFullYear() + 1;
   } else {
      year = today.getFullYear();
   }
   
   return(dateResult + "/" + year.toString());
}

//alert(dateWordsToNum("this ain't no date"));
//alert(dateWordsToNum("july fifth"));
//alert(dateWordsToNum("may twenty second"));
//alert(dateWordsToNum("may seventh"));
//alert(dateWordsToNum("september tenth"));
//alert(dateWordsToNum("may seventeen"));
//alert(dateWordsToNum("september ten"));