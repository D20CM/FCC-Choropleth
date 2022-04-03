let choropleth = function () {
  Promise.all([
    fetch(
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
    ),
    fetch(
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
    ),
  ])

    // .then(responses => Promise.all(responses.map(response => response.json)))
    .then(function (responses) {
      return Promise.all(
        responses.map(function (response) {
          return response.json();
        })
      );
    })
    .then((data) => {
      let usMap = data[0];
      let eduData = data[1];

      console.log(usMap);
      console.log(eduData);
      // console.log(usMap.objects.counties.geometries[0].id)
      // console.log(eduData[0].fips)

      const h = 500;
      const w = 1000;
      const padding = 100;
      let projection = d3
        .geoIdentity()
        .fitSize([w, h], topojson.feature(usMap, usMap.objects.counties));
      console.log(projection);
      const path = d3.geoPath(projection);
      const eduArray = eduData.map((item) => item.bachelorsOrHigher);
      console.log(eduArray);

      const colorScale = d3
        .scaleThreshold()
        .domain([3, 12, 21, 30, 39, 48, 57, 66])
        .range([
          "#ffffff",
          "#defeff",
          "#b5e9eb",
          "#76d8db",
          "#52c3c7",
          "#32a4a8",
          "#158b8f",
          "#005261",
        ]);

      // console.log(typeof(eduData[2].fips))
      // console.log(typeof(1005))
      // console.log((eduData[2].fips))
      // console.log((1005))

      let countyIndex = function (countyId) {
        // return eduData index of the county object which has the id we're looking for
        for (let i = 0; i < eduData.length; i++) {
          if (eduData[i].fips == countyId) {
            // console.log(i);
            return i;
          }
        }
      };

      // countyIndex(1005);

      let tooltip = d3
        .select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("visibility", "hidden")
        .style("position", "absolute")
        .style("z-index", "10");
      // .style("background","#fff3e0")

      let maparea = d3
        .select("#appContainer")
        .append("svg")
        // .attr("width", w)
        // .attr("height", h)
        .attr("viewBox", `0 0 1000 500`)
        .attr("id", "maparea");

      maparea
        .selectAll("path")
        .data(topojson.feature(usMap, usMap.objects.counties).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", (d, i) =>
          colorScale(
            eduData[countyIndex(usMap.objects.counties.geometries[i].id)]
              .bachelorsOrHigher
          )
        )
        .attr("class", "county")
        .attr("style", "stroke:#a6a6a6;stroke-width:0.1")
        .attr("data-fips", (d, i) => usMap.objects.counties.geometries[i].id)
        .attr("countyIndex", (d, i) =>
          countyIndex(usMap.objects.counties.geometries[i].id)
        )
        .attr(
          "data-education",
          (d, i) =>
            eduData[countyIndex(usMap.objects.counties.geometries[i].id)]
              .bachelorsOrHigher
        )
        .attr(
          "data-area",
          (d, i) =>
            eduData[countyIndex(usMap.objects.counties.geometries[i].id)]
              .area_name
        )
        .attr(
          "data-state",
          (d, i) =>
            eduData[countyIndex(usMap.objects.counties.geometries[i].id)].state
        )
        .attr("viewBox", "0 0 200 100")
        // .attr("preserveAspectRatio", "xMinYMin")
        .on("mouseover", function (e, d) {
          let area = eduData[countyIndex(d.id)].area_name;
          let state = eduData[countyIndex(d.id)].state;
          let education = eduData[countyIndex(d.id)].bachelorsOrHigher;

          tooltip.text(area + ", " + state + ": " + education + "%");
          return tooltip
            .style("visibility", "visible")
            .attr("data-education", education);
        })
        .on("mousemove", function (event, d) {
          return tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })

        .on("mouseout", function () {
          return tooltip.style("visibility", "hidden");
        });

      // maparea
      // .selectAll("path")
      // .data(topojson.feature(usMap, usMap.objects.states).features)
      // .enter()
      // .append("path")
      // .attr("d", path)
      // .attr("class", "states")
      // .attr("style","stroke:#1e2120;stroke-width:0.4")

      let legend = function () {
        // lh = 100
        // lw = 200
        // const eduArray = eduData.map(item => item.bachelorsOrHigher)
        let boxwidth = 40;
        const legendArray = [3, 12, 21, 30, 39, 48, 57, 66];
        let legendArraySlice = legendArray.slice(0, legendArray.length - 1);
        console.log(legendArraySlice);

        const colorScale = d3
          .scaleThreshold()
          .domain([12, 21, 30, 39, 48, 57, 66])
          .range([
            "#defeff",
            "#b5e9eb",
            "#76d8db",
            "#52c3c7",
            "#32a4a8",
            "#158b8f",
            "#005261",
          ]);

        const xLegend = d3.scaleLinear().domain([3, 66]).range([0, 280]);

        const xAxis = d3
          .axisBottom()
          .scale(xLegend)
          .ticks(8)
          .tickSize(12)
          .tickValues(legendArray)
          .tickFormat("");

        let legend = d3
          .select("svg")
          .append("svg")
          .attr("id", "legend")
          .attr("width", legendArraySlice.length * boxwidth + 40)
          .attr("height", 40)
          .attr("x", w * 0.5)
          .attr("y", 0)
          // .style("background-color", "pink")
          .attr("z-index", 100);
        //   .attr("transform", "translate(270, -570)");

        legend
          .selectAll("rect")
          .data(legendArraySlice)
          .enter()
          .append("rect")
          .attr("class", "legend-box")
          .attr("x", (d, i) => 10 + boxwidth * i)
          .attr("y", 0)
          .attr("height", 10)
          .attr("width", boxwidth)
          .attr("fill", (d, i) => colorScale(d));

        legend
          .selectAll("text")
          .data(legendArray)
          .enter()
          .append("text")
          .attr("class", "axis-text")
          .attr("x", (d, i) => 10 + boxwidth * i - 5)
          .attr("y", 22)
          .text((item) => item + "%");

        legend.append("g").attr("transform", "translate(10, 0)").call(xAxis);
      };

      legend();
    });
};

choropleth();
