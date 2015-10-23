//console.log("Creating..............");
var start = Date.now(),
	fs = require('fs'),
	filePath = process.argv[2], //first word after app.js
	parseString = require('xml2js').parseString,
	stopsData = {name: "", coordinates: "", description: ""},
	stopsFileData = [],
	//coordinates = [],
	stops,
	line = "stop_id,stop_code,stop_name,stop_desc,stop_lat,stop_lon,zone_id,stop_url,location_type,parent_station,stop_timezone,wheelchair_boarding",
	lines = "";
// Reading the data from file using readFileSync as blocking
var fileData = fs.readFileSync(filePath, 'utf8');
// parse the data from file
parseString(fileData, function (err, result) {
	for (var i in result.kml.Document[0].Placemark) {
		stopsData = {name: "", coordinates: "", description: ""};
		stops = result.kml.Document[0].Placemark[i];
		if(stops.Point){
			stopsData.name = stops.name[0];
			stopsData.coordinates = stops.Point[0].coordinates[0].split(",");
			stopsData.description = stops.description[0];
		}
		stopsFileData.push(stopsData); //pushing it to array
	}
});
//create a directory with the time stamp in result folder
var timpstamp = new Date();
fs.mkdir('./result/'+timpstamp, function(err) {
  	if (err) {
		console.log(err);
	};
});
// writing the first line to the file
fs.appendFile('./result/'+timpstamp+'/stops.txt', line + "\n", function (err) {
	if (err) {
		console.log(err);
	};
});
// reading from array to file 
for(var x in stopsFileData){
	var name = stopsFileData[x].name;
	var coordinates = stopsFileData[x].coordinates;
	var description = stopsFileData[x].description;
	lines = ""; 
	line = "," + "," + name + "," +  description + "," + coordinates.splice(0, 2).join() + "," + ",,,,,,,\n";
	lines += line;
	//write to the file
	if (lines != "") {
		fs.appendFile('./result/'+timpstamp+'/stops.txt', lines, function (err) {
			if (err) {
				console.log(err);
				lines = "";
			};
		});
	};
}
var end = Date.now();
console.log("Your shape file created :D");
console.log("Time taken: %ds", (end - start)/1000);