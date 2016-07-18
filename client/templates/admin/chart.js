	
Template.pendingQuestions.helpers({
	'chart' : function(){
		var ctx = $("#myChart").get(0).getContext("2d");
		var myDoughnutChart = new Chart(ctx[0]).Doughnut(data,options);
		var data = [
			{ 
			value:  3,
			color: "#F7464a",
			highlight: "#FF5A5E",
      label: "Run"
			},
			{ value: 5 ,
			color: "#333",
			highlight: "#FF5A5E",
      label: "Pass"
			},
			{ value: 6 ,
			color: "#666",
			highlight: "#FF5A5E",
      label: "Interception"
			},
			{ value:  7,
			color: "#999",
			highlight: "#FF5A5E",
      label: "Fumble"
			} 
		]
	}
	});
