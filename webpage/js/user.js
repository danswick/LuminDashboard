
// Load the data with Tabletop, the app is in the showInfo callback
var URL = "1MTobhIvX9wIvyYeF3X4ixcleb13eQcL_Zs5zd88W454";
Tabletop.init( { key: URL, callback: showInfo, debug: true, parseNumbers: true, simpleSheet: true } );

function showInfo(data, tabletop){
//let's put all the data in one variable
	dashboardData = data;
	console.log( "Here is your data", dashboardData);


}
