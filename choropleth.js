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
        console.log(usMap.objects.counties.geometries[0].id)
        console.log(eduData[0].fips)

        const h = 900;
        const w = 1200;
        const padding = 0;
        let projection = d3.geoMercator();  
        const path = d3.geoPath();

        // console.log(typeof(eduData[2].fips))
        // console.log(typeof(1005))
        // console.log((eduData[2].fips))
        // console.log((1005))

        let countyIndex = function(countyId){
            // return eduData index of the county object which has the id we're looking for
            for (let i=0; i<eduData.length; i++){
                if (eduData[i].fips == countyId){
                    // console.log(i);
                    return i;
                }
              
            }
            
        }        

        countyIndex(1005);


        let tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("visibility", "hidden")
        .style("position", "absolute")
        .style("z-index","10")
        // .style("background","#fff3e0")
  

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
        .attr("class", "county")
        .attr("data-fips",(d,i) => usMap.objects.counties.geometries[i].id)
        .attr("countyIndex", (d,i) => countyIndex(usMap.objects.counties.geometries[i].id))
        .attr("data-education", (d,i) => eduData[countyIndex(usMap.objects.counties.geometries[i].id)].bachelorsOrHigher)
        .attr("data-area", (d,i) => eduData[countyIndex(usMap.objects.counties.geometries[i].id)].area_name)
        .attr("data-state", (d,i) => eduData[countyIndex(usMap.objects.counties.geometries[i].id)].state)
        .on("mouseover", function(e,d,){
          
            let area = eduData[countyIndex(d.id)].area_name
            let state = eduData[countyIndex(d.id)].state
            let education = eduData[countyIndex(d.id)].bachelorsOrHigher
            
            tooltip.text(area + ", " + state + ": " + education + "%")
            return tooltip
                    .style("visibility", "visible")
                  
                    
        })

        .on("mousemove", function(event, d){
          return tooltip
                  .style("top", (event.pageY-10)+"px")
                  .style("left",(event.pageX+10)+"px");
        })
    
      .on("mouseout", function(){
          return tooltip
                  .style("visibility", "hidden");
      });























    }
    )
};

choropleth();

