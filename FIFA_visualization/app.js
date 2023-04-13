function project(){
    var filePath="Players.csv";
    question0(filePath);
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
}

var question0=function(filePath){
    d3.csv(filePath).then(function(data){
        //console.log(data[0])
    });
}

var question1=function(filePath){
    
    //reading data
    d3.csv(filePath).then(data=>{
        svgheight = 900;
        svgwidth = 900;
        padding = 80;
        xAxis_pos = svgwidth - padding;
        yAxis_pos = padding;
        margin = {top:10, right:30, bottom: 30, left:10}
        var svg = d3.select("#q1_plot").append("svg")
        .attr("width", svgwidth+margin.left+margin.right).attr("height", svgheight+margin.top+margin.bottom)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        males = data.filter(function(d){return d.gender == "Male"});
        male_array = Array.from(d3.rollup(males, a=>a.length, b=>b.year));
        females = data.filter(function(d){return d.gender == "Female"});
        female_array = Array.from(d3.rollup(females, a=>a.length, b=>b.year));
        years = Array.from(d3.rollup(males, a=>a.length, b=>b.year).keys());
        xScale = d3.scaleLinear().domain([d3.min(years)-0.25, d3.max(years)])
                   .range([padding, svgwidth -padding]);
        yScale = d3.scaleLinear().domain([0, d3.max(male_array, d=>d[1])])
                   .range([svgheight-padding, padding]);
        xAxis = d3.axisBottom().scale(xScale).tickValues(years).tickFormat((d,i) => years[i]);
        svg.append("g").call(xAxis).attr("transform", "translate(0," + xAxis_pos + ")");
        svg.append("text").attr("transform", "translate(" + (svgwidth/2) + " ," +
                                                            (svgheight-30) + ")")
                          .style("text-anchor", "middle").text("Year");
        yAxis = d3.axisLeft().scale(yScale);
        svg.append("g").call(yAxis).attr("transform", "translate(" + yAxis_pos + ",0)");
        svg.append("text").attr("transform", "rotate(-90)")
                          .attr("y", 0 - margin.left)
                          .attr("x", 0 - (svgheight/2))
                          .attr("dy", "1em")
                          .style("text-anchor", "middle").text("Counts");

        
        var tooltip = d3.select("#q1_plot").append("div")
            .style("opacity", 0).attr("class", "tooltip")
            .style("background-color", "white").style("border", "solid")
            .style("padding", "5px");
        var mouseover = function(d){
            tooltip.style("opacity", 1).transition()
        }
        var mousemove = function(d, i){
            var x = 0;
            tooltip
            .text("year: " + i[0] + " count: " + i[1])
            .style("top", (event.pageY) + "px")
            .style("left", (event.pageX) + "px");
        }
        var mouseleave = function(d){
            tooltip.style("opacity", 0)
        }
        svg.selectAll("q1_plot").data(male_array).enter()
           .append("circle").attr("r", 5)
           .attr("cx", function(d){
               return xScale(d[0])
           })
           .attr("cy", function(d){
               return yScale(d[1])
           })
           .style("fill", "blue")
           .on("mouseover", mouseover)
           .on("mousemove", mousemove)
           .on("mouseleave", mouseleave);
        svg.selectAll("q1_plot").data(female_array).enter()
           .append("circle").attr("r", 5)
           .attr("cx", function(d){
               return xScale(d[0])
           })
           .attr("cy", function(d){
               return yScale(d[1])
           })
           .style("fill", "pink")
           .on("mouseover", mouseover)
           .on("mousemove", mousemove)
           .on("mouseleave", mouseleave);
        svg.append("circle").attr("cx", svgwidth-50).attr("cy", 120).attr("r", 5).style("fill", "blue");
        svg.append("text").attr("x", svgwidth-40).attr("y", 125).text("male");
        svg.append("circle").attr("cx", svgwidth-50).attr("cy", 135).attr("r", 5).style("fill", "pink");
        svg.append("text").attr("x", svgwidth-40).attr("y", 140).text("female");
        
        var dict = {};
        for (let i = 0; i < male_array.length; i++) {
            diff = male_array[i][1] - female_array[i][1]
            dict[male_array[i][0]] =  diff;
        }
        ans = "";
        for (let i = 0; i < dict.length; i ++) {
            ans += Object.keys(dict)[i] + ": " + Object.values(dict)[i] + "<br>";
        }
        document.getElementById("q1_answer").innerHTML = Object.keys(dict)[0] + ": " + Object.values(dict)[0] + "<br>"
            + Object.keys(dict)[1] + ": " + Object.values(dict)[1] + "<br>" +
            Object.keys(dict)[2] + ": " + Object.values(dict)[2] + "<br>" + 
            Object.keys(dict)[3] + ": " + Object.values(dict)[3] + "<br>"+
            Object.keys(dict)[4] + ": " + Object.values(dict)[4] + "<br>" +
            Object.keys(dict)[5] + ": " + Object.values(dict)[5] + "<br>" + "<br>" + 
            "I used higher saturation color(blue) vs lower saturation(light pink) for this graph because it is better for point marks. The mark in this graph is point since it is a scatter plot. The channels includes position and color.";

    })
}
//
var question2=function(filePath){
    //reading data
    //create default graph
    d3.csv(filePath).then(data=>{
        svgheight = 900;
        svgwidth = 900;
        padding = 80;
        xAxis_pos = svgwidth - padding;
        yAxis_pos = padding;
        margin = {top:10, right:30, bottom: 30, left:10}
        var svg = d3.select("#q2_plot").append("svg")
        .attr("width", svgwidth+margin.left+margin.right).attr("height", svgheight+margin.top+margin.bottom)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        year = data.filter(function(d){return d.year == 2019});
        male = year.filter(function(d){return d.gender == "Male"});
        positions = Array.from(d3.rollup(male, a=>a.length, b=>b.player_positions).keys());
        values = Array.from(d3.rollup(male, a=>a.length, b=>b.player_positions).values());
        by_positions = d3.rollup(male, a=>a.length, b=>b.player_positions);
        a = by_positions;
        //positions = by_position.keys();
        xScale = d3.scaleBand().domain(d3.range(positions.length))
                   .range([padding, svgwidth-padding]).padding(0.1);
        yScale = d3.scaleLinear().domain([0, d3.max(values)])
                   .range([svgheight - padding, padding])
        
        xAxis = d3.axisBottom().scale(xScale).tickFormat((d,i) => positions[i]);
        yAxis = d3.axisLeft().scale(yScale);
        svg.append("g").call(xAxis).attr("transform", "translate(0," + xAxis_pos + ")");
        svg.append("text").attr("transform", "translate(" + (svgwidth/2) + " ," +
                                                            (svgheight-30) + ")")
                          .style("text-anchor", "middle").text("Positions");
        svg.append("g").call(yAxis).attr("transform", "translate(" + yAxis_pos + ",0)");
        svg.append("text").attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (svgheight/2))
        .attr("dy", "1em")
        .style("text-anchor", "middle").text("Counts");
        
        tooltip = d3.select("#q2_plot").append("div")
                    .style("opacity", 0).attr("class", "tooltip")
                    .style("background-color", "white").style("border", "solid")
                    .style("padding", "5px");
        var mouseover = function(d){
            tooltip.style("opacity", 1).transition()
        }
        var mousemove = function(d, i){
            tooltip
            .text(i[0] + " Counts: " + i[1])
            .style("top", (event.pageY) + "px")
            .style("left", (event.pageX) + "px");
        }
        var mouseleave = function(d){
            tooltip.style("opacity", 0)
        }
        svg.selectAll("q2_plot").data(by_positions)
           .enter().append("rect")
           .attr("x", function(d,i){
               return xScale(i);
            })
           .attr("y", function(d){
               return yScale(d[1]);
            })
           .attr("height", function(d,i){
               return svgheight - yScale(d[1])- padding;
           })
           .attr("width", function(d) { 
               return xScale.bandwidth();
           })
           .style("fill", "pink")
           .on("mouseover", mouseover)
           .on("mousemove", mousemove)
           .on("mouseleave", mouseleave);

        a = by_positions;
        by_positions_ascending = Array.from(by_positions).sort(function(a,b){return b[1]-a[1]});
        by_positions_descending = Array.from(by_positions).sort(function(a,b){return a[1]-b[1]});
        console.log(by_positions_descending);
        var isDescending = false;
        var sortBars = function(){
            svg.selectAll("rect")
                .sort(function(a, b){
                    if (isDescending){
                        xAxis = d3.axisBottom().scale(xScale).tickFormat((d,i) => by_positions_descending[i][0]);
                        svg.selectAll("g").remove();
                        svg.append("g").call(xAxis).attr("transform", "translate(0," + xAxis_pos + ")");
                        svg.append("g").call(yAxis).attr("transform", "translate(" + yAxis_pos + ",0)");

                        return d3.ascending(a[1], b[1]);
                    }
                    else {
                        xAxis = d3.axisBottom().scale(xScale).tickFormat((d,i) => by_positions_ascending[i][0]);
                        svg.selectAll("g").remove();
                        svg.append("g").call(xAxis).attr("transform", "translate(0," + xAxis_pos + ")");
                        svg.append("g").call(yAxis).attr("transform", "translate(" + yAxis_pos + ",0)");
                        return d3.descending(a[1],b[1]);
                    }
                })
                .transition("sorting")
                .delay(10)
                .duration(100)
                .attr("x", function(d,i){
                    return xScale(i);
                });
            isDescending = !isDescending
        }
        
        d3.select("#Sort").on("click", function(){
            sortBars();
        });
        
        
        var toAdd = "";
        for (let i of by_positions) {
            document.getElementById("q2_answer").innerHTML +=  i[0] + " : " + i[1] + "<br>"
        }
        document.getElementById("q2_answer").innerHTML += "<br>" + "<br>" + "The color I used here is pink(low saturation) because " +
         "a bar chart uses area. The mark is lines and the channel is position. There is a small problem with this graph, sometimes "+
         "the sorting/default will malfunction," +
         " but if you refresh the page a few times then it will work properly again LOL" 
    })
}
    
var question3=function(filePath){
    
    d3.csv(filePath).then(data =>{
        svgheight = 900;
        svgwidth = 900;
        padding = 80;
        xAxis_pos = svgwidth - padding;
        yAxis_pos = padding;
        margin = {top:10, right:30, bottom: 30, left:10}
        var svg = d3.select("#q3_plot").append("svg")
        .attr("width", svgwidth+margin.left+margin.right).attr("height", svgheight+margin.top+margin.bottom)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        year = data.filter(function(d){return d.year == 2018});
        male = year.filter(function(d){return d.gender == "Male"});
        male = male.filter(function(d){return d.player_positions != "CF"})
        female = year.filter(function(d){return d.gender == "Female"});
        positions = Array.from(d3.rollup(male, a=>a.length, b=>b.player_positions).keys());
        values = Array.from(d3.rollup(male, a=>a.length, b=>b.player_positions).values());
        male_positions = d3.rollup(male, a=>a.length, b=>b.player_positions); 
        female_positions = d3.rollup(female, a=>a.length, b=>b.player_positions); 
        
        male_counts = {"Gender": "Male", "LW": male_positions.get("LW"), "RW": male_positions.get("RW"),
                       "GK": male_positions.get("GK"), "ST": male_positions.get("ST"),
                       "CB": male_positions.get("CB"), "CM": male_positions.get("CM"),
                       "LM": male_positions.get("LM"), "CA": male_positions.get("CA"),
                       "RM": male_positions.get("RM"), "LB": male_positions.get("LB"),
                       "CD": male_positions.get("CD"), "RB": male_positions.get("RB")};
        female_counts = {"Gender": "Female", "LW": female_positions.get("LW"), "RW": female_positions.get("RW"),
                       "GK": female_positions.get("GK"), "ST": female_positions.get("ST"),
                       "CB": female_positions.get("CB"), "CM": female_positions.get("CM"),
                       "LM": female_positions.get("LM"), "CA": female_positions.get("CA"),
                       "RM": female_positions.get("RM"), "LB": female_positions.get("LB"),
                       "CD": female_positions.get("CD"), "RB": female_positions.get("RB")};
        data = [male_counts, female_counts];
        var colors = function(i){
            colorarray = ["gold", "silver", "bronze", "brown", "gray", "blue", "red",
                          "green", "yellow", "pink", "purple", "orange"]
            return colorarray[i];
        }
        var stackgenerator = d3.stack().keys(positions)
        var stacked = stackgenerator(data);
        gender = Array.from(["Male", "Female"])
        var xScale = d3.scaleBand().domain(d3.range(data.length))
                   .range([padding, svgwidth-padding]).paddingInner(0.1);
        var yScale = d3.scaleLinear().domain([0, d3.max(data, function(d){
            return d.LW + d.RW + d.GK + d.ST + d.CB + d.CM + d.LM + d.CA + d.RM + d.LB + d.CD + d.RB;
        })]).range([svgheight-padding, padding]);
        groups = svg.selectAll("g").data(stacked).enter().append("g")
                    .style("fill", function(d, i){
                        return colors(i);
                    });
        var xAxis = d3.axisBottom().scale(xScale).tickFormat((d,i) => gender[i]);
        svg.append("text").attr("transform", "translate(" + (svgwidth/2) + " ," +
                                                            (svgheight-30) + ")")
                          .style("text-anchor", "middle").text("Gender");
        var yAxis = d3.axisLeft().scale(yScale);
        svg.append("text").attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (svgheight/2))
        .attr("dy", "1em")
        .style("text-anchor", "middle").text("Counts");

        svg.append("g").call(xAxis).attr("transform", "translate(0," + xAxis_pos + ")");
        svg.append("g").call(yAxis).attr("transform", "translate(" + yAxis_pos + ",0)");


        var tooltip = d3.select("#q3_plot").append("div")
                    .style("opacity", 0).attr("class", "tooltip")
                    .style("background-color", "white").style("border", "solid")
                    .style("padding", "5px");
        var mouseover = function(d){
            tooltip.style("opacity", 1).transition()
        }
        var position = ["LW","RW","GK","ST","CB","CM","LM","CA","RM","LB","CD","RB"];
        var mousemove = function(d, i){
            var x = 0;
            console.log(d);
            tooltip
            .text("Count: " + (i[1] - i[0]))
            .style("top", (event.pageY) + "px")
            .style("left", (event.pageX) + "px");
        }
        var mouseleave = function(d){
            tooltip.style("opacity", 0)
        }
        var rects = groups.selectAll("rect")
                        .data(function(d){ return d;})
                        .enter().append("rect")
                        .attr("x", function(d, i) {
                            return xScale(i)+80;
                        })
                        .attr("y", function(d){
                            return yScale(d[1]);
                        })
                        .attr("height", function(d){
                            return yScale(d[0]) - yScale(d[1]);
                        })
                        .attr("width", function(d){
                            return 200;
                        })
                        .on("mouseover", mouseover)
                        .on("mousemove", mousemove)
                        .on("mouseleave", mouseleave);

        colorarray = ["gold", "silver", "bronze", "brown", "gray", "blue", "red",
        "green", "yellow", "pink", "purple", "orange"]
        svg.append("circle").attr("cx", svgwidth-50).attr("cy", 120).attr("r", 5).style("fill", colorarray[0]);
        svg.append("text").attr("x", svgwidth-40).attr("y", 125).text(position[0]);
        svg.append("circle").attr("cx", svgwidth-50).attr("cy", 130).attr("r", 5).style("fill", colorarray[1]);
        svg.append("text").attr("x", svgwidth-40).attr("y", 135).text(position[1]);
        svg.append("circle").attr("cx", svgwidth-50).attr("cy", 140).attr("r", 5).style("fill", colorarray[2]);
        svg.append("text").attr("x", svgwidth-40).attr("y", 145).text(position[2]);
        svg.append("circle").attr("cx", svgwidth-50).attr("cy", 150).attr("r", 5).style("fill", colorarray[3]);
        svg.append("text").attr("x", svgwidth-40).attr("y", 155).text(position[3]);
        svg.append("circle").attr("cx", svgwidth-50).attr("cy", 160).attr("r", 5).style("fill", colorarray[4]);
        svg.append("text").attr("x", svgwidth-40).attr("y", 165).text(position[4]);
        svg.append("circle").attr("cx", svgwidth-50).attr("cy", 170).attr("r", 5).style("fill", colorarray[5]);
        svg.append("text").attr("x", svgwidth-40).attr("y", 175).text(position[5]);
        svg.append("circle").attr("cx", svgwidth-50).attr("cy", 180).attr("r", 5).style("fill", colorarray[6]);
        svg.append("text").attr("x", svgwidth-40).attr("y", 185).text(position[6]);
        svg.append("circle").attr("cx", svgwidth-50).attr("cy", 190).attr("r", 5).style("fill", colorarray[7]);
        svg.append("text").attr("x", svgwidth-40).attr("y", 195).text(position[7]);
        svg.append("circle").attr("cx", svgwidth-50).attr("cy", 200).attr("r", 5).style("fill", colorarray[8]);
        svg.append("text").attr("x", svgwidth-40).attr("y", 205).text(position[8]);
        svg.append("circle").attr("cx", svgwidth-50).attr("cy", 210).attr("r", 5).style("fill", colorarray[9]);
        svg.append("text").attr("x", svgwidth-40).attr("y", 215).text(position[9]);
        svg.append("circle").attr("cx", svgwidth-50).attr("cy", 220).attr("r", 5).style("fill", colorarray[10]);
        svg.append("text").attr("x", svgwidth-40).attr("y", 225).text(position[10]);
        svg.append("circle").attr("cx", svgwidth-50).attr("cy", 230).attr("r", 5).style("fill", colorarray[11]);
        svg.append("text").attr("x", svgwidth-40).attr("y", 235).text(position[11]);
        
        for (let i in male_counts){
            document.getElementById("q3_answer").innerHTML +=  i + ": " + male_counts[i] + ",   ";
        }
        document.getElementById("q3_answer").innerHTML += "<br>";
        for (let i in female_counts){
            document.getElementById("q3_answer").innerHTML +=  i + ": " + female_counts[i] + ",   ";
        }
        document.getElementById("q3_answer").innerHTML += "<br>" + "The color I used a list of colors that is easy to differentiate because it is a stacked bar chart. The mark is lines and the channels are position and color." 
    })

    
}
var question4=function(filePath){
    
    d3.csv(filePath).then(data =>{
        svgheight = 700;
        svgwidth = 1500;
        padding = 80;
        xAxis_pos = svgwidth - padding;
        yAxis_pos = padding;
        margin = {top:10, right:30, bottom: 30, left:10}
        var svg = d3.select("#q4_plot").append("svg")
        .attr("width", svgwidth+margin.left+margin.right).attr("height", svgheight+margin.top+margin.bottom)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        for (let i = 0 ; i < data.length; i++){
            data[i].year = parseInt(data[i].year);
        }
        
    
        var year = d3.filter(data, function(d){return d.year >= 2017 && d.year <= 2020});
        var countries_counts = d3.rollup(year, a=>a.length, b=>b.country);
        var countries_names = Array.from(countries_counts.keys()).sort();
        var country_counts = {};
        for (let i in countries_names) {
            country_counts[countries_names[i]] = countries_counts.get(countries_names[i]);
        }
        all_info = []
        for (let i of countries_names) {
            info = {};
            info['country'] = i;
            info['count'] = country_counts[i];
            country = d3.filter(year, function(d){return d.country == i});
            info['latitude'] = country[0]['latitude']
            info['longitude'] = country[0]['longitude']
            all_info.push(info);
        }
        var earth = d3.geoNaturalEarth1().scale(210)
                    .rotate([0,0])
                    .center([0,0])
                    .translate([svgwidth/2, svgheight/2]);
    
        
        var pathgeo = d3.geoPath().projection(earth);
        var tooltip = d3.select("#q4_plot").append("div")
                    .style("opacity", 0).attr("class", "tooltip")
                    .style("background-color", "white").style("border", "solid")
                    .style("padding", "5px");
        var mouseover = function(d){
            tooltip.style("opacity", 1).transition()
        }
        var mousemove = function(d, i){
            var x = 0;
            tooltip
            .text(i.country+ " count: " + i.count)
            .style("top", (event.pageY) + "px")
            .style("left", (event.pageX) + "px");
        }
        var mouseleave = function(d){
            tooltip.style("opacity", 0)
        }
    
        //var g = svg.append("g");
        
        var zoomSettings = {
            duration: 1000,
            ease: d3.easeCubicOut,
            zoomLevel: 5
        };
        const worldmap = d3.json("world.json")
        const g = svg.append('g')
                .attr("transform", `translate(200px, 200px)`);
        worldmap.then(function (map) {
            
            g.selectAll("path")
               .data(map.features)
               .enter()
               .append("path")
               .attr("d", pathgeo)
               .attr("fill", "#69b3a2")
               .attr("stroke", "white")
               .attr("cursor", "pointer");
            
            all_info = JSON.parse(JSON.stringify(all_info));

            circleScale = d3.scaleLinear().domain([d3.min(countries_counts.values()),
                                        d3.max(countries_counts.values())]).range([3,15]);
            
            g.selectAll("circle").data(all_info)
                .enter().append("circle")
                .attr("cx", function(d){
                    return earth([d.longitude, d.latitude])[0];
                })
                .attr("cy", function(d){
                    return earth([d.longitude, d.latitude])[1];
                })
                .attr("r", function(d){
                    return circleScale(d.count);
                })
                .style("opacity", 0.8)
                .style("stroke", "red")
                .style("stroke-width", 0.6)
                .style("fill", "blue")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);
            function zoomed(event) {
                g
                .selectAll('path')
                .attr('transform', event.transform);
                g
                .selectAll("circle")
                .attr("transform", event.transform);
            }

            var zoom = d3.zoom()
                        .scaleExtent([1, 15])
                        .on("zoom", zoomed);
            svg.call(zoom).on("zoom", ()=>{
                g.attr("transform", event.transform);
            });
            
            
            
        })
        document.getElementById("q4_answer").innerHTML += "The color I used are blue points " +
        "and green map because it is easy to read. The mark used is point, and the channel"+
        " are position, color and size."

    })

    
}
var question5=function(filePath){
    
    d3.csv(filePath).then(data =>{
        svgheight = 300;
        svgwidth = 900;
        padding = 80;
        xAxis_pos = svgwidth - padding;
        yAxis_pos = padding;
        margin = {top:10, right:30, bottom: 30, left:10}
        var svg = d3.select("#q5_plot").append("svg")
        .attr("width", svgwidth+margin.left+margin.right).attr("height", svgheight+margin.top+margin.bottom)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        year = d3.filter(data, function(d){ return d.year == 2019});
        
        positions_counts = d3.rollup(year, a=>a.length, b=>b.player_positions);
        var data = {
            "nodes":[
                {id:1, name:"ST", x: 187, y: 145},
                {id:2, name:"CD", x: 276, y: 94},
                {id:3, name:"GK", x:349, y:162},
                {id:4, name:"CB", x:308, y:253},
                {id:5, name:"CM", x:205, y:246},
            ],
            "edges":[
                {"source": {id:1, name:"ST", x: 187, y:145},
                 "target": {id:2, name:"CD", x: 276, y:94},
                "diff": positions_counts.get("ST") - positions_counts.get("CD")},
                {"source": {id:1, name:"ST", x: 187, y:145},
                 "target": {id:3, name:"GK", x: 349, y:162},
                "diff": positions_counts.get("ST") - positions_counts.get("GK")},
                {"source": {id:1, name:"ST", x: 187, y:145},
                 "target": {id:4, name:"CB", x: 308, y:253},
                "diff": positions_counts.get("CB") - positions_counts.get("ST")},
                {"source": {id:1, name:"ST", x: 187, y:145},
                 "target": {id:5, name:"CM", x: 205, y:246},
                "diff": positions_counts.get("ST") - positions_counts.get("CM")},
                
                {"source": {id:2, name:"CD", x: 276, y:94},
                 "target": {id:3, name:"GK", x: 349, y:162},
                "diff": positions_counts.get("GK") - positions_counts.get("CD")},
                {"source": {id:2, name:"CD", x: 276, y:94},
                 "target": {id:4, name:"CB", x: 308, y:253},
                "diff": positions_counts.get("CB") - positions_counts.get("CD")},
                {"source": {id:2, name:"CD", x: 276, y:94},
                 "target": {id:5, name:"CM", x: 205, y:246},
                "diff": positions_counts.get("CM") - positions_counts.get("CD")},
                
                {"source": {id:3, name:"GK", x: 349, y:162},
                 "target": {id:4, name:"CB", x: 308, y:253},
                "diff": positions_counts.get("CB") - positions_counts.get("GK")},
                {"source": {id:3, name:"GK", x: 349, y:162},
                 "target": {id:5, name:"CM", x: 205, y:246},
                "diff": positions_counts.get("CM") - positions_counts.get("GK")},
                
                {"source": {id:4, name:"CB", x: 308, y:253},
                 "target": {id:5, name:"CM", x: 205, y:246},
                "diff": positions_counts.get("CB") - positions_counts.get("CM")},
                
                
            ]
        }
        data["links"] = []
        for(var i =0; i < data.edges.length;i++) {
            var obj = {}
            obj["source_name"] = data.edges[i]["source"].name;
            obj["source"] = data.edges[i]["source"].id;
            obj["target_name"] = data.edges[i]["target"].name;
            obj["target"] = data.edges[i]["target"].id;
            obj["diff"] = data.edges[i]["diff"];
            data.links.push(obj);
        }
        diff_arr = [];
        for (let dict of data.links) {
            diff_arr.push(dict["diff"]);
        }
        var linkScale = d3.scaleLinear().domain(
                    [d3.min(diff_arr), d3.max(diff_arr)])
                    .range([2,10]);
        var link = svg.selectAll("line")
                      .data(data.edges)
                      .enter().append("line")
                      .attr("stroke", "gray")
                      .attr("stroke-width", function(d,i){
                          return linkScale(d.diff);
                      })
                      ;
        var node = svg.selectAll("g").data(data.nodes)
                      .enter().append("circle")
                      .style("fill", function(d, i){
                          if (data.nodes[i].name == "CB" || data.nodes[i].name == "CD"
                          || data.nodes[i].name == "CM") {
                              return "red";
                          }
                          else {
                              return "green";
                          }
                      });
        
        svg.selectAll("g").data(data.nodes).enter().append("text")
           .text(function(d, i) {
               return data.nodes[i].name;
           })
           .attr("x", function(d){ return d.x})
           .attr("y", function(d){ return d.y});
        
        var force = d3.forceSimulation(data.nodes)
                      .force("charge", d3.forceManyBody().strength(3))
                      .force("collide", d3.forceCollide().radius(function(d){
                          return d.value*3;
                      }))
        force.on("tick", function() {
            link.attr("x1", function(d){ return d.source.x;})
                .attr("y1", function(d){ return d.source.y;})
                .attr("x2", function(d){ return d.target.x;})
                .attr("y2", function(d){ return d.target.y;});

            node.attr("cx", function(d){return d.x;})
                .attr("cy", function(d){return d.y;})
                .attr("r", function(d){return 40})
        });
        
        for (let i = 0; i < data.links.length; i++){
            document.getElementById("q5_answer").innerHTML += "Difference between " + data.links[i]["source_name"] + " and " + data.links[i]["target_name"] + " is " + JSON.stringify(data.links[i]["diff"]) + "<br>";
        }
        
        document.getElementById("q5_answer").innerHTML += "<br>" +
        "The colors I used are red and green, both are high saturated colors because I'm working with" +
        " points (nodes). The marks are point (nodes) and line (the connection) and channels includes" +
        " color and size (length)."
    })

    
}