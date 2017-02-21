var apiKey = 'UnHPhaZSSCzd6yHuNm0c2Xut3fDJcKIkBUIvmcUN';
  
document.addEventListener('DOMContentLoaded', setButtons);

function setButtons(){
    document.getElementById('submit').addEventListener('click', function(event){
        var request = new XMLHttpRequest();
        var food = {q:null};
        food.q = document.getElementById('foodEntry').value;
        request.open('GET', 'https://api.nal.usda.gov/ndb/search/?format=json&sort=r&max=10&offset=0&ds=Standard Reference&q=' + food.q +'&api_key=' + apiKey, true);
        request.addEventListener('load',function(){
			if(request.status >= 200 && request.status < 400){
				var response = JSON.parse(request.responseText);
				createList(response);	
			} else {
				console.log("Error in network request: " + request.statusText);
			}});
   	    request.send(null);
        event.preventDefault();
    })
}

function createList(response){
	var oldList = document.getElementById("items");
	oldList.innerHTML = "";
	
	var results = response.list.item;
	for (var i in results){
		console.log(results[i]);
		var listItem = document.createElement("li");
		var itemName = document.createTextNode(results[i].name);
	 
		listItem.id = results[i].ndbno;
		listItem.addEventListener("click", itemClick);
		listItem.appendChild(itemName);
	
		document.getElementById("items").appendChild(listItem);	
		
	}
}

function itemClick(event){
	var request = new XMLHttpRequest();
    var food = {ndbno: this.id};
    request.open('GET', 'https://api.nal.usda.gov/ndb/reports/?ndbno=' + food.ndbno +'&type=b&format=json&api_key=' + apiKey, true);
    request.addEventListener('load',function(){
		if(request.status >= 200 && request.status < 400){
			var response = JSON.parse(request.responseText);
			console.log(response);
			createReport(response);	
		} else {
			console.log("Error in network request: " + request.statusText);
		}});
   	request.send(null);
    event.preventDefault();
}

function createReport(response){
	var nutrients = response.report.food.nutrients;
	var total = Number(nutrients[2].value) + Number(nutrients[3].value) + Number(nutrients[4].value);
	var protein = Number(nutrients[2].value) / total * 360
	var fat = Number(nutrients[3].value) / total * 360
	var carbs =  Number(nutrients[4].value) / total * 360
	var data = [protein, fat, carbs];

	var reportCard = document.getElementById("report");
    if(reportCard.className == 'hidden'){
        reportCard.className = 'unhidden' ;
    }
	
	canvas = document.getElementById("piechart");
	var context = canvas.getContext("2d");
	for (var i = 0; i < data.length; i++) {
		drawSegment(canvas, context, i, data);
	}
}
