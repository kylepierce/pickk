Meteor.subscribe("leaderboard")
Meteor.subscribe("questions")

var chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],

    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "green",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "red",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

Template.adminSettings.onRendered(function () {

    // Render the chart
    myChart = new Chart(document.getElementById("question").getContext("2d")).Line(chartData, {
        responsive: true
    });


});

Template.adminSettings.events({
	'submit form': function (event, template) {
		// Get the value of the input box
		event.preventDefault();
		var coins = template.find('input[name=coins]').value
		console.log(coins)
		if(confirm("Are you sure?")) {
			Meteor.call("updateAllCoins", coins)
		}
	},
    'click [data-action=awardLeaders]': function(){
        Meteor.call('awardLeaders')
    },
    'click [data-action=resetGameCounter]': function(){
        Meteor.call('updateAllCounters');
    }
});