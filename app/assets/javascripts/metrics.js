

//define name space
var metrics = metrics || {};

/*
* @ description: Control that manage all the page functionality.
*/
metrics.searchControl = {

	loaderClass:"loader",
	searchInput:null,
	searchBtn:null,
	mapWidget: new widget.GoogleMap(),
	/*
	* @ description: initilize all the reffrences,events,and props for this controller
	* 	must be invoke in order to use the manager properly.
	*/	
	init:function(){
       	var _self = metrics.searchControl;
        _self.mapWidget._init('g');
        _self.mapWidget._start();

        //ser refference
        _self.searchBtn = $("#search_btn");
        _self.searchInput = $("#search_input");

        //bind events
       	_self.bindEvents();
        
	},
	/*
	* @ description: bind all events for current control to handle the UI behaivor
	*/
	bindEvents:function(){

		var _self = metrics.searchControl;

		//search evnt
		_self.searchBtn.on("click",function(){
		
			_self.search(_self.searchInput.val());

		});
	},
	/*
	* @ description: raise after btnSearch click , make ajax request to the server to search for metrics
		@prams: 
			term(String): term to look for (currently search form name)
	*/
	search:function(term){

		


		var _self = metrics.searchControl;
		//Make ajax to retrive location accurding to search term
		if(typeof term == 'undifined'){
			return false;
		}

		//set loader
		_self.searchInput.addClass(_self.loaderClass);

		url = "/metrics/search.json?name=" +  term;
		//make ajax call
		$.getJSON(url, function(data){

			_self.searchSucsess(data);

			//remove loader
			_self.searchInput.removeClass(_self.loaderClass);
		});
		
	},
	/*
	* @ description: get array of metrics and set thier locations on the map by markers
		@prams: 
			data(Array): array of metrics
	*/
	searchSucsess:function(data){

		var _self = metrics.searchControl;
		//clear previuse markers
		_self.mapWidget._clearAllMarkers();
		//set markers by locations data
		_self.mapWidget._buildMarkers(data);
	}
	
}

//On ready
 $(function () {
	metrics.searchControl.init();
});
