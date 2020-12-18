

//------------------------1. PREPARATION-------------------------//
        //-----------------------------SVG-------------------------------//
        const width = 1200;
        const height = 500;
        const margin = 5;
        const padding = 0;
        const adj = 30;
        // we are appending SVG first
        const svg = d3
            .select("div#container")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr(
                "viewBox",
                "-" +
                adj +
                " -" +
                adj +
                " " +
                (width + adj * 3) +
                " " +
                (height + adj * 3)
            )
            .attr("class", "secondviz")
             
            .style("padding", padding)
            .style("margin", margin)
            .classed("svg-content", true);

        //-----------------------------DATA------------------------------//

        const timeConv = d3.timeParse("%m/%d/%Y");
        const dataset = d3.csv("./data/data-Commercial_Vehicle_Street.csv");
        dataset.then(function (data) {
            const slices = data.columns.slice(1).map(function (id) {
                return {
                    id: id,
                    values: data.map(function (d) {
                        return {
                            date: timeConv(d.date),
                            measurement: +d[id],
                        };
                    }),
                };
            });

            //console.log("Column headers", data.columns);
            //console.log("Column headers without date", data.columns.slice(1));
            // returns the sliced dataset
            //console.log("Slices", slices);
            // returns the first slice
            //console.log("First slice", slices[0]);
            // returns the array in the first slice
            //console.log("A array", slices[0].values);
            // returns the date of the first row in the first slice
            //console.log("Date element", slices[0].values[0].date);
            // returns the array's length
            //console.log("Array length", slices[0].values.length);

            //----------------------------SCALES-----------------------------//
            const xScale = d3.scaleTime().range([20, width]);
            const yScale = d3.scaleLinear().rangeRound([height, 0]);
            xScale.domain(
                d3.extent(data, function (d) {
                    return timeConv(d.date);
                })
            );
            yScale.domain([
                0,
                d3.max(slices, function (c) {
                    return d3.max(c.values, function (d) {
                        return d.measurement + 4;
                    });
                }),
            ]);

            //-----------------------------AXES------------------------------//

            const yaxis = d3.axisLeft().ticks(slices[0].values.extent).scale(yScale);

            const xaxis = d3
                .axisBottom()
                .ticks(d3.timeMonth.every(1))
                .tickFormat(d3.timeFormat("%b %d"))
                .scale(xScale);

            //----------------------------LINES------------------------------//

            const line = d3
                .line()
                .x(function (d) {
                    return xScale(d.date);
                })
                .y(function (d) {
                    return yScale(d.measurement);
                });

            // id's 
            let id = 0;
            const ids = function () {
                return "line-" + id++;
            };

            //---------------------------TOOLTIP----------------------------//

            const tooltip = d3
                .select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0)
                .style("position", "absolute");

            //-------------------------2. DRAWING----------------------------//

            //-----------------------------AXES------------------------------//
            //CHANGED THE PADDING --> TRANSLATE
            // usually done at the top
            svg
                .append("g")
                .attr("class", "axis")
                .attr("transform", "translate(-10," + height + ")")
                .call(xaxis);

            svg
                .append("g")
                .attr("class", "axis")
                .attr("transform", "translate(10," + 0 + ")")
                .call(yaxis)

            svg
                .append("text")
                .attr("dy", ".75em")
                .attr("y", 0)
                .attr("x", "8em")
                .style("text-anchor", "end")
                .style("font-weight", "bolder")
                .text("Calls per Day");

            // VERTICAL EVENT -------------------------------------

            //var =  xScale(timeConv("03/11/2020"))

            //VERTICAL LINE: COVID---------------------------------
            //-------------------------------------------------
            svg
                .append("line")
                .style("stroke", "#2D2D34")
                .style("stroke-width", 3)
                .style("opacity", .5)
                .attr("x1", xScale(timeConv("03/11/2020")))
                //change the line link to date
                .attr("y1", 0)
                .attr("x2", xScale(timeConv("03/11/2020")))
                .attr("y2", height);

            svg
                .append("text")
                .style("fill", "#04151F")
                .attr("dx", xScale(timeConv("03/11/2020")) + 8)
                .attr("dy", "10px")
                .attr("y1", 0)
                .text("Beginning of COVID Lockdown");

            //VERTICAL LINE: GEORGE FLOYD---------------------------
            //------------------------------------------------
            svg
                .append("line")
                .style("stroke", "#04151F")
                .style("stroke-width", 3)
                .style("opacity", .5)
                .attr("x1", xScale(timeConv("05/25/2020")))
                .attr("y1", 0)
                .attr("x2", xScale(timeConv("05/25/2020")))
                .attr("y2", height);

            svg
                .append("text")
                .style("fill", "#04151F")
                .attr("dx", xScale(timeConv("05/25/2020")) + 8)
                .attr("dy", 10)
                .attr("y1", 0)
                .text("Killing of George Floyd");

            //----------------------------LINES------------------------------//

            const lines = svg.selectAll("lines").data(slices).enter().append("g");
            // class IDs
            lines
                .append("path")
                .attr("class", ids)
                .attr("d", function (d) {
                    return line(d.values);
                });

            d3.selectAll("path").attr("opacity", 1);

            // lines
            //     .append("text")
            //     .attr("class", "Instances_label")
            //     .datum(function(d) {
            //         return {
            //             id: d.id,
            //             value: d.values[d.values.length - 1],
            //         };
            //     })
            //     //.attr("transform", function(d) {
            //     //       return "translate(" + (xScale(d.value.date) + 10)
            //     //      + "," + (yScale(d.value.measurement) + 5 ) + ")"; })
            //     //NEW
            //     .attr("y", function(d) {
            //         return yScale(d.value.measurement);
            //     })
            //     .attr("x", width - 200)
            //     .text(function(d) {
            //         return d.id;
            //     });

            // lines
            //     .append("text")
            //     .attr("class", "Instances_label")
            //     .datum(function(d) {
            //         return {
            //             id: d.id,
            //             value: d.values[0],
            //         };
            //     })
            //     //.attr("transform", function(d) {
            //     //       return "translate(" + (xScale(d.value.date) + 10)
            //     //      + "," + (yScale(d.value.measurement) + 5 ) + ")"; })
            //     //NEW
            //     .attr("y", function(d) {
            //         //console.log(d.value.measurement)
            //         return yScale(d.value.measurement);
            //     })
            //     .attr("x", 0)
            //     .text(function(d) {
            //         return d.id;
            //     });

            //adding IDs to each line class 


            //---------------------------POINTS-----------------------------//

            // lines
            //     .selectAll("points")
            //     .data(function(d) {
            //         //debugger
            //         let startDate = timeConv("05/01/2020");
            //         let endDate = timeConv("08/01/2020");
            //         return d.values.filter(item => (item.date >= startDate) && (item.date <= endDate));
            //     })
            //     .enter()
            //     .append("circle")
            //     .attr("class",ids) //added 
            //     .attr("cx", function(d) {
            //         return xScale(d.date);
            //     })
            //     .attr("cy", function(d) {
            //         return yScale(d.measurement);
            //     })
            //     .attr("r", 1)
            //     //.attr("class", "point")
            //     .style("opacity", 1);

            //     console.log("points")







            // --------------LEGEND -----------------
            //make legend and select on click --> selectAll make all lines opacity .2, selectAll 'line-1' opacity 1
            //outside the lines

            //legend -----------street-----------------

            var button1 = false
            var button2 = false
            var button3 = false

            svg
                .append("circle")
                .attr("class", "street")
                .attr("cx", 1000)
                .attr("cy", 10)
                .attr("r", 10)
                .style("fill", "#279AF1")
                .on("click", function (d) {
                    if (button1 == false) {
                        d3.selectAll("path")
                            .style("opacity", .2)
                        d3.select(".line-2")
                            .style("opacity", 1)
                        button1 = true
                    } else {
                        button1 = false
                        d3.selectAll("path")
                            .style("opacity", 1)
                    }
                });


            svg
                .append("text")
                .attr("class", "street")
                .attr("x", 1020)
                .attr("y", 14)
                .text("Street")
                .style("font-size", "15px")


            //legend----------commercial--------------
            svg
                .append("circle")
                .attr("class", "circle-commercial")
                .attr("cx", 1000)
                .attr("cy", 35)
                .attr("r", 10)
                .style("fill", "#548C2F")
                .on("click", function (d) {
                    if (button2 == false) {
                        d3.selectAll("path")
                            .style("opacity", .2)
                        d3.select(".line-1")
                            .style("opacity", 1)
                        button2 = true
                    } else {
                        button2 = false
                        d3.selectAll("path")
                            .style("opacity", 1)
                    }
                });
            svg
                .append("text")
                .attr("x", 1020)
                .attr("y", 36)
                .text("Commercial")
                .style("font-size", "15px")
                .style("fill", "#442220")
                .attr("alignment-baseline", "middle");

            //legend--------vehicle------------------
            svg
                .append("circle")
                .attr("class", "circle-vehicle")
                .attr("cx", 1000)
                .attr("cy", 60)
                .attr("r", 10)
                .style("fill", "#D74E09")
                .on("click", function (d) {
                    if (button3 == false) {
                        d3.selectAll("path")
                            .style("opacity", .2)
                        d3.select(".line-0")
                            .style("opacity", 1)
                        button3 = true
                    } else {
                        button3 = false
                        d3.selectAll("path")
                            .style("opacity", 1)
                    }
                });


            svg
                .append("text")
                .attr("x", 1020)
                .attr("y", 61)
                .text("Vehicles")
                .style("font-size", "15px")
                .style("fill", "#442220")
                .attr("alignment-baseline", "middle");

            // const circleStreet = d3.select('.circle-street').attr('opacity', 0.1);
            // circleStreet.on("click", function(d) {
            //     // .call(circleStreet)
            // })

            //---------------------------EVENTS-----------------------------//

            lines
                .selectAll("circles")
                .data(function (d) {
                    return d.values;
                })
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return xScale(d.date);
                })
                .attr("cy", function (d) {
                    return yScale(d.measurement);
                })
                .attr("r", 10)
                .style("opacity", 0)
                .on("mouseover", function (d) {
                    tooltip.transition().delay(0).duration(200).style("opacity", 1);

                    tooltip
                        .html(
                            "# of Noise Complaints: " +
                            d.measurement +
                            "<br/>" +
                            (d.date.getMonth() + 1) +
                            "/" +
                            d.date.getDate() +
                            "/" +
                            d.date.getFullYear()
                        )
                        .style("left", d3.event.pageX + 25 + "px")
                        .style("top", d3.event.pageY + "px")
                        .style("background","whitesmoke");

                    //add this
                    const selection = d3.select(this).raise();

                    selection
                        .transition()
                        .delay("20")
                        .duration("200")
                        .attr("r", 6)
                        .style("opacity", 1)
                        .style("fill", "#ed3700");
                })

                .on("mouseout", function (d) {
                    tooltip.transition().duration(10).style("opacity", 0);

                    //add this
                    const selection = d3.select(this);

                    selection
                        .transition()
                        .delay("20")
                        .duration("200")
                        .attr("r", 10)
                        .style("opacity", 0);
                });
        });