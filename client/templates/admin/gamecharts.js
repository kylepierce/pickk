Template.gameCharts.onRendered(function () {

	var question = Questions.find({gameId: "J6DAePumAo46FR8eL"}, {sort: {dateCreated: 1}}).fetch();

	var questionsCount = Questions.find({gameId: "J6DAePumAo46FR8eL"}, {sort: {dateCreated: 1}}).count()

    var negative_test_data = new d3.range(1,6).map(function(d,i) {
    		var i = i + 1
        return {
            key: 'Option' + i,
            values: new d3.range(1,questionsCount).map( function(f,j) {
                var option = "option" + i
                console.log(option)
                console.log(question[j].que)
                console.log(question[j].options.option1.usersPicked.length)
               return {
                    y: question[j].options.option1.usersPicked.length,
                    x: question[j]._id
                }
            })
        };
    });

console.log(negative_test_data)

    var chart;

    nv.addGraph(function() {
        chart = nv.models.multiBarChart()
            .barColor(d3.scale.category20().range())
            .duration(300)
            .margin({bottom: 100, left: 70})
            .rotateLabels(45)
            .groupSpacing(0.1)
        ;
        chart.reduceXTicks(false).staggerLabels(true);
        chart.xAxis
            .axisLabel("Date Created")
            .axisLabelDistance(35)
            .showMaxMin(false)
            .tickFormat(d3.format(',.6f'))
        ;
        chart.yAxis
            .axisLabel("Number of Users")
            .axisLabelDistance(-5)
            .tickFormat(d3.format(',.01f'))
        ;
        chart.dispatch.on('renderEnd', function(){
            nv.log('Render Complete');
        });
        d3.select('#chart1 svg')
            .datum(negative_test_data)
            .call(chart);
        nv.utils.windowResize(chart.update);
        chart.dispatch.on('stateChange', function(e) {
            nv.log('New State:', JSON.stringify(e));
        });
        chart.state.dispatch.on('change', function(state){
            nv.log('state', JSON.stringify(state));
        });
        return chart;
    });

});

Template.gameCharts.helpers({
	game: function (id) {
		return Questions.find({gameId: id}, {sort: {dateCreated: 1}}).fetch()
	}
});
