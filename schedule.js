//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule = function(params)
{

console.log(params);
	if(typeof params == 'array'){
	}

	this.init(params);
}


/** This is lala */
Schedule.scheduleObject;

/** This is lala */
Schedule.prototype.svgContainer;

/** This is lala */
Schedule.prototype.width;

/** This is lala */
Schedule.prototype.height;

/** This is lala */
Schedule.prototype.container;

/** This is lala */
Schedule.prototype.start;

/** This is lala */
Schedule.prototype.end;

/** This is lala */
Schedule.prototype.matrix;

/** This is lala */
Schedule.prototype.padding;

/** This is lala */
Schedule.prototype.eventHeight;

/** This is lala */
Schedule.prototype.yScale;

/** This is lala */
Schedule.prototype.xScale;

/** This is lala */
Schedule.prototype.xScale2;

/** This is lala */
Schedule.prototype.xAxis;

/** This is lala */
Schedule.prototype.yAxis;

/** This is lala */
Schedule.prototype.drag;

/** This is lala */
Schedule.prototype.eventData;

/** This is lala */
Schedule.prototype.eventsData = new Array();

/** This is lala */
Schedule.prototype.constraintsData = new Array();

/** This is lala */
Schedule.prototype.onReadOnlyMode;

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.init = function(params)
{

	console.log(params);
	Schedule.scheduleObject = this;

console.log(this);
	this.matrix = [20, 50, 20, 20]
	this.width      = params.width - this.matrix[1] -this.matrix[3];
	this.padding    = 40;
	this.eventHeight= 20;
	this.start = params.start;
	this.end  = params.end;

	this.getData();

	this.height     = this.calculatedHeight - this.matrix[0] -this.matrix[2];
	this.container = params.container;
	this.onReadOnlyMode = params.mode;

	this.yScale = d3.scale.linear()
		.domain([0, this.maxLevel])
		.range([0, this.height]);

	this.xScale = d3.time.scale()
		.domain([this.start, this.end])
		.rangeRound([0, this.width]);

	this.xScale2 = d3.time.scale()
		.domain([this.start, this.end])
		.rangeRound([0, this.width]);

	this.xAxis = d3.svg.axis().scale(this.xScale).orient("top"),
		this.yAxis = d3.svg.axis().scale(this.yScale).orient("left");

	this.drag = d3.behavior.drag()
	.origin(Object)
		.on("dragstart", this.dragstart)
		.on("drag", this.dragmove)
		.on("dragend", this.dragend);

//	this.eventData = $element("a").setAttr("style", "display: none");
	this.appendMenu();
}

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.draw = function()
{
	this.getData();
	this.svgContainer = d3.select("."+this.container).
		attr("id", this.container).
		append("svg:svg").
		attr("width", this.width + this.matrix[1] + this.matrix[3]).
		attr("height", this.height + this.matrix[0] + this.matrix[2] + 20).
		style("border-style", "solid").
		style("border-width", 0.5).
		style("border-color", "gray").
		append("g").
		attr("transform", "translate(" + this.matrix[3] + "," + this.matrix[0] + ")");
//			call(d3.behavior.zoom().
//			extent([[0, width], [0, height], [0, 3]]).
//			on("zoom", redraw)); 

 	this.notContextMenu();
	this.addSecondAxis(this.svgContainer);
	this.drawConstraints();

	this.svgContainer.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(" + this.matrix[3] + "," + this.matrix[0]/2 + ")")
	  .call(this.xAxis.tickSize(6));
	this.drawEvents();
}

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.drawEvents = function()
{

	var newg = this.svgContainer.append("g").
	attr("class", "events").
	selectAll("rect").
	data(this.eventsData);

	var event = newg.enter().append("g").attr("title", function(d) { return d.folio});

	var ticket = event.append("rect").
		attr("x", this.xPlot).
		attr("y", this.yPlot).
		attr("class", "ticket").
		attr("width",  this.eventWidth).
		attr("height", this.eventHeight).
		attr("cursor", "move").
		attr("transform", "translate(" + this.matrix[3] + "," + this.matrix[0] + ")").
		on("mouseover", this.mouseOver).
		on("mouseout", this.mouseOut);

	var progressBar = event.append("rect").
		attr("class", "progress").
		attr("x", this.xPlot).
		attr("y", function (d) {return Schedule.scheduleObject.yPlot(d)+5}).
		attr("width",  this.calcProgress).
		attr("height", 10).
		attr("transform", "translate(" + this.matrix[3] + "," + this.matrix[0] + ")");

	if(!this.onReadOnlyMode){
		event.call(this.drag);
		ticket.attr("cursor", "move").
		on("dblclick", this.mouseClick);

	}
}


//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.drawConstraints = function()
{
	this.svgContainer.append("g").
		attr("class", "constraints").
		attr("transform", "translate(" + this.matrix[3] + "," + this.matrix[0] + ")").
	selectAll("rect").
		data(this.constraintsData).
	enter().append("svg:rect").
		attr("class", "constraint").
		attr("x", this.xPlot).
		attr("y", 0).
		attr("width",  this.eventWidth).
		attr("fill-opacity",  0.8).
		attr("height", this.height);		
}


//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.getData = function()
{


	Schedule.scheduleObject.eventsData = [
{plan_start: new Date(2011, 1, 15), plan_end: new Date(2011, 1, 30), occupancy: 0, id: "Orden 12", type: "TICKET", degree_freedom: 1, pk_itemid: 123, progress: 80, level:2},
{plan_start: new Date(2011, 2, 1), plan_end: new Date(2011, 2, 9), occupancy: 1, id: "Orden 78", type: "TICKET", degree_freedom: 5, pk_itemid: 55, progress: 80, level:0},
{plan_start: new Date(2011, 2, 12), plan_end: new Date(2011, 2, 18), occupancy: 0, id: "Orden 886", type: "TICKET", degree_freedom: 2, pk_itemid: 109008, progress: 80, level:0}, 
{plan_start: new Date(2011, 2, 13), plan_end: new Date(2011, 2, 25), occupancy: 1, id: "Orden 33", type: "TICKET", degree_freedom: 2, pk_itemid: 155523, progress: 80, level:1}
	];

	var data3 = [
{plan_start: new Date(2011, 1, 15), plan_end: new Date(2011, 1, 30), occupancy: 0, id: "Orden 12", type: "TICKET", degree_freedom: 1, pk_itemid: 123, progress: 80},
{plan_start: new Date(2011, 2, 1), plan_end: new Date(2011, 2, 9), occupancy: 1, id: "Orden 78", type: "TICKET", degree_freedom: 5, pk_itemid: 55, progress: 80},
{plan_start: new Date(2011, 2, 12), plan_end: new Date(2011, 2, 15), occupancy: 0, id: "Orden 886", type: "TICKET", degree_freedom: 2, pk_itemid: 109008, progress: 33}, 
{plan_start: new Date(2011, 2, 13), plan_end: new Date(2011, 2, 25), occupancy: 1, id: "Orden 33", type: "TICKET", degree_freedom: 2, pk_itemid: 155523, progress: 80}
	];

	Schedule.scheduleObject.constraintsData = [
{plan_start: new Date(2011, 1, 1), plan_end: new Date(2011, 1, 10), occupancy: 0, id: "Orden 345", type: "CONSTRAINT" }, 
{plan_start: new Date(2011, 2, 20), plan_end: new Date(2011, 2, 24), occupancy: 0, id: "Orden 4", type: "CONSTRAINT"}
	];

	var tmp, highest = Number.NEGATIVE_INFINITY;

	jQuery.each(Schedule.scheduleObject.eventsData, function() {
		tmp = this.level;
		if(tmp > highest){
			highest = tmp;
		}
	});
	
	this.maxLevel = highest+1;
	this.calculatedHeight = (this.maxLevel*(this.eventHeight+6)) + this.matrix[0] +this.matrix [2];

}

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.dragMove = function(d, i)
{
	var myrect = d3.select(this);

	myrect.attr("fill-opacity", "0.5");

	this.childNodes.each( function(){
		var that = d3.select(this);
		Schedule.scheduleObject.mouseOut();
		xoff = parseFloat(that.attr('x'));
		yoff = parseFloat(that.attr('y'));
		xoff += d3.event.dx;
		yoff += d3.event.dy;
		var originalWidth  = that.attr("width");
		that.
			attr('x', Math.max(0, Math.min(Schedule.scheduleObject.width  - that.attr('width'), xoff))).
		 	attr('y', Math.max(0, Math.min(Schedule.scheduleObject.height - that.attr('height'), yoff)));

		if(that.attr("class") == "ticket"){
			d.plan_start = Date.parseString(
				Schedule.scheduleObject.xScale.invert(
					that.attr("x")).toISO(true)
			);
			var newEnd = parseFloat(originalWidth) + parseFloat(that.attr("x"));
			d.plan_end = Date.parseString(
				Schedule.scheduleObject.xScale.invert(
					newEnd).toISO(true)
			);
		}
	});
}

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.mouseClick = function(d, i)
{


}

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.appendMenu = function(d, i)
{


}

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.dragstart = function(d, i)
{


}

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.dragend = function(d, i)
{


}

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.eventWidth = function(d, i)
{
	return (Schedule.scheduleObject.xScale(d.plan_end) - Schedule.scheduleObject.xScale(d.plan_start));

}


//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.xPlot = function(d, i)
{
	 return Schedule.scheduleObject.xScale(d.plan_start);
}

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.yPlot = function(d, i)
{
	 return Schedule.scheduleObject.yScale(d.level + 0.5);
}

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.mouseOver = function(d, i)
{

}
//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.mouseOut = function(d, i)
{

}

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.notContextMenu = function()
{
		d3.select("svg").	
			node().
			oncontextmenu = function(){return false;}; 
}

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.calcProgress = function(d, i)
{
	if(!d.progress){
		return 0;
	}

	return (d.progress/100)*(Schedule.scheduleObject.eventWidth(d));
}

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.addSecondAxis = function()
{
//		var diff = Math.abs(this.start.diffDays(this.end));
		var diff = Math.abs(this.end.getTime() - this.start.getTime());
		var ticks = 0;
		var lines = 2;
	
		if( diff < 1296000000){
			if( diff > 864000000 ){
				ticks = 8;
				lines = 2;
			}
			else{
				ticks = 6;
				lines = 3;
			}
				bxAxis = d3.svg.axis().scale(this.xScale2).tickFormat(d3.time.format('%H')).orient("top"),		
				this.svgContainer.append("g")
					.attr("class", "z axis")
					.attr("transform", "translate(" + this.matrix[3] + "," + this.matrix[0] + ")")
					.call(bxAxis.ticks(d3.time.hours, ticks));
		}

		this.svgContainer.append("g")
			.attr("class", "x grid")
			.attr("transform", "translate(" + this.matrix[3] + "," + this.matrix[0] + ")")
			.call(this.xAxis.tickSubdivide(lines).tickSize(-this.height));

		getStrokeW = function(){
			var group = this.parentElement;
			if(group.lastElementChild.textContent == '00'){
				return 2;
			}
		}
		d3.selectAll(".z g .tick").style("stroke-width", getStrokeW);
}



//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.update = function(data)
{
  d3.selectAll(".ticket").
      data(data).
						attr("x", Schedule.scheduleObject.xPlot).
						attr("y", Schedule.scheduleObject.yPlot).
						attr("width",  Schedule.scheduleObject.eventWidth).
						attr("height", Schedule.scheduleObject.eventHeight);

  d3.selectAll(".progress").
      data(data).
						attr("x", Schedule.scheduleObject.xPlot).
						attr("y", function (d) {return Schedule.scheduleObject.yPlot(d)+5}).
						attr("width",  Schedule.scheduleObject.calcProgress).
						attr("height", 10);

}


//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.redraw = function()
{
		tx = function(d) { return "translate"+this.xScale(d)+",0)";}
		stroke = function(d) { return d ? "#ccc" : "#666";};

		if (d3.event) d3.event.transform(this.xScale, this.yScale);
		var fx = this.xScale.tickFormat(10),
		fy = this.yScale.tickFormat(10);
		// Regenerate x-ticks…
		var gx = svg.selectAll("g.x")
			.data(xScale.ticks(10), String)
			.attr("transform", tx);
		gx.select("text")
			.text(fx);
		var gxe = gx.enter().insert("g", "a")
			.attr("class", "x")
			.attr("transform", tx);
		gxe.append("line")
			.attr("stroke", stroke)
			.attr("y1", 0)
			.attr("y2", this.height);
		gxe.append("text")
			.attr("y", this.height)
			.attr("dy", "1em")
			.attr("text-anchor", "middle")
			.text(fx);
		gx.exit().remove();
}

//-----------------------------------------------------------------------
/**
*
*
*
*/
Schedule.prototype.selectDocument = function(documentId, selected)
{
//	$(Schedule.scheduleObject.container)

  d3.selectAll(this).attr("class", selected);

}

