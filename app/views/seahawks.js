import Ember from 'ember';
/* global d3 */

export default Ember.View.extend({
	didInsertElement: function() {
		var bardata = [];
		var years = [];
		var wins = [];
		var loses = [];
		d3.tsv('data/seahawks.tsv', function(data) {

			data.forEach(function(item) {
				bardata.push(parseInt(item.win));
				years.push(parseInt(item.year));
				wins.push(parseInt(item.win));
				loses.push(parseInt(item.loss));
			});

			console.log(years, wins, loses);

			var margin = { top: 20, right: 20, bottom: 30, left: 40 };


			var height = 600 - margin.top - margin.bottom;
			var width = 750 - margin.left - margin.right;
			var barWidth = 50;
			var barOffset = 5;

			var colors = d3.scale.linear()
				.domain([0, wins.length])
				.range(['blue', 'green']);

			var yScale = d3.scale.linear()
				.domain([0, d3.max(wins)])
				.range([0, height]);

			var xScale = d3.scale.ordinal()
				.domain(d3.range(0, years.length))
				.rangeBands([0, width], 0.2);

			var tooltip = d3.select('body').append('div')
				.style('position', 'absolute')
				.style('padding', '0 10px')
				.style('background', 'white')
				.style('opacity', '0');

			var myChart = d3.select('#seahawks').append('svg')
				.style('background', '#E7E0CB')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
				.selectAll('rect').data(wins)
				.enter().append('rect')
					.style('fill', function(d,i) {
						return colors(i);
					})
					.attr('width', xScale.rangeBand())
					.attr('x', function(d,i) {
						return xScale(i);
					})
					.attr('height', 0)
					.attr('y', height)
				.on('mouseover', function(d) {
					tooltip.transition()
						.style('opacity', 0.9);
					tooltip.html(d)
						.style('left', (d3.event.pageX - 500) + 'px')
						.style('top', (d3.event.pageY + 20) + 'px');
					d3.select(this).style('opacity', 0.5);
				})
				.on('mouseout', function(d) {
					d3.select(this).style('opacity', 1);
				});

			// animate the chart
			myChart.transition()
				.attr('height', function(d) {
					return yScale(d);
				})
				.attr('y', function(d) {
					return height - yScale(d);
				})
				.delay(function(d, i) {
					return i * 20;
				})
				.duration(1000)
				.ease('elastic');

			// add a vertical scale
			var vGuideScale = d3.scale.linear()
				.domain([0, d3.max(bardata)])
				.range([height, 0])

			var vAxis = d3.svg.axis()
				.scale(vGuideScale)
				.orient('left')
				.ticks(10);

			var vGuide = d3.select('svg').append('g');
			vAxis(vGuide);
			vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
			vGuide.selectAll('path')
				.style({fill: 'none', stroke: '#000'})
			vGuide.selectAll('line')
				.style({stroke: '#000'});

			// add a horizontal scale
			var hAxis = d3.svg.axis()
				.scale(xScale)
				.orient('bottom')
				.tickValues(xScale.domain().filter(function(d, i) {
					return !(i % (bardata.length/5));
				}));

			var hGuide = d3.select('svg').append('g');
			hAxis(hGuide);
			hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
			hGuide.selectAll('path')
				.style({fill: 'none', stroke: '#000'})
			hGuide.selectAll('line')
				.style({stroke: '#000'});

		});
	}
});
