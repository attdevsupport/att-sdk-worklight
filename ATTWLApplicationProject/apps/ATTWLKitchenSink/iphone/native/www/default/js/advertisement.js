
/* JavaScript content from js/advertisement.js in folder common */
var params={},invocationData={},options={};

/**
 * Function to get an advertisement 
 * @param category 
 * @param gender
 * @param ageGroup
 * @param city
 * @param keywords
 * @param cbData Success Callback Function 
 * @param busyInd
 */
function getAds(category, gender, ageGroup, city, keywords, cbData, busyInd)
{
	busyInd.show();
	
	params = 
	{
		'accept' : 'application/json',
		'accessToken': window.localStorage.accessToken,
		'queryParameters' :
		{
			"Category" : category
		}
	};
	
	if(gender !== undefined && gender !== "") params.queryParameters.Gender=gender;
	if(ageGroup !== undefined && ageGroup !== "") params.queryParameters.AgeGroup=ageGroup;
	if(city !== undefined && city !== "") params.queryParameters.City=city;
	if(keywords !== undefined && keywords !== "") params.queryParameters.Keywords=keywords;
	
	invocationData= {
		adapter : 'Advertising',
		procedure : 'getAds' ,
		parameters : [params]			
	};
	
	options =
	{
		onSuccess : function(data)
		{
		   busyInd.hide();
		   WL.Logger.debug("Success : Response is - " + JSON.stringify(data));
			
		   var wrapperID = 'advertisement',
		   wrapperStyle = 'position:fixed; width:100%; bottom:0; left:0; text-align: center',
		   $elm = buildAdsElement(data);
		   
		   $('#' + wrapperID).remove(); //Remove old wrapper 
		   var $wrapper = $('<div id="' + wrapperID + '" style="' + wrapperStyle + '"/>');
		   $wrapper.append($elm).appendTo('body');
		   
		   //Update the spacer so we can scroll to reach elements under the ad
		   $('.adSpacer').height($wrapper.height() + 5);			
		} ,
		onFailure : function(error) {
			busyInd.hide();
			WL.Logger.debug("Failiure : Response is - "+error);
			cbData(error);
		} ,
		invocationContext : {}
	};
	
	WL.Client.invokeProcedure(invocationData, options);
}

function buildAdsElement(rawData)
{
	var $adElm;
	var result = rawData.invocationResult;
    if(result.statusCode==204) {
	    alert(result.statusCode + " " + result.statusReason);
        $adElem="<p>" + result.statusCode + " " + result.statusReason + "</p>";
        return $adElem;
    }
    
   var adsData = result.AdsResponse.Ads;
 
   //Example of how to attach the returned data to the DOM to diplay the ad
   if(adsData.Type === 'thirdparty') {
      $adElm = $(adsData.Content);
      
      //Ensure all links are opened externally
      $adElm.filter('a').attr('target','_blank');
      $adElm.find('a').attr('target','_blank');
   } else {
      var trackUrl = adsData.TrackUrl, htmlToAdd = '<a href="' + adsData.ClickUrl + '" target="_blank"></a>';
      if(trackUrl) htmlToAdd += '<img alt="" width="1" height="1" src="' + trackUrl + '" />';
      $adElm = $(htmlToAdd);
      
      if(adsData.Type === 'image') {
         $adElm.filter('a').append('<img src="' + adsData.ImageUrl.Image + '" />');
      } else if(adsData.Type === 'text') {
         $adElm.filter('a').html(adsData.Text);
      }
   }
   return $adElm;
}
