let choropleth = function(){
    
    Promise.all([fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"), fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")])
    

    // .then(responses => Promise.all(responses.map(response => response.json)))
    .then(function (responses) {
    return Promise.all(responses.map(function (response) {
		return response.json();
	}))
})
    .then(data => {
  
        

        let usMap = data[0];
        let eduData = data[1];

        console.log(usMap);
        console.log(eduData);
      

        const h = 900;
        const w = 1200;
        const padding = 0;
        let projection = d3.geoMercator();  
        const path = d3.geoPath();
                  

        let maparea = d3.select("#appContainer")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h)
                        .attr("fill", "blue")

       maparea
        .selectAll("path") 
        .data(topojson.feature(usMap, usMap.objects.counties).features) 
        .enter()
        .append("path")
        .attr("d", path) 
        // .attr("transform", "scale(0.82, 0.62)")
        // .attr("class", "county");


        // console.log(path)

        // maparea.selectAll("rect")
        // .data(usMap.objects.counties)
        // .enter()
        // .append("rect")
        // .attr("x", (d,i) => { return 10*i})
        // .attr("y", (d,i) => 10+i)
        // .attr("width", 10)
        // .attr("height", 10)
        // .attr("fill", "green")





















    }
    )
};

choropleth();