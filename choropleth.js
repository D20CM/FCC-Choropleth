let choropleth = function(){
    Promise.all([fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"), fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")])
    
    // .then(responses => Promise.all(responses.map(response => response.json)))
    .then(function (responses) {
    return Promise.all(responses.map(function (response) {
		return response.json();
	}))
})
    .then(data =>{
  
        

        let usMap = data[0];
        let eduData = data[1];

        console.log(usMap);
        console.log(eduData);
      

        const h = 900;
        const w = 1200;
        const padding = 0;

        let maparea = d3.select("appContainer")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h)
        
        maparea.append("path")
























    }
    )
};

choropleth();