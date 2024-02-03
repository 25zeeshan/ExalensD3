/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import useResizeObserver from "./useResizeObserver";

const TImeSeries = (props) => {
  const { width, height, data } = props;

  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const svgRef = useRef();

  useEffect(() => {
    const drawChart = () => {
      console.log("drawing");
      const margin = { top: 10, right: 50, bottom: 50, left: 50 };

      const svg = d3.select(svgRef.current);

      // Remove any existing chart elements
      svg.selectAll("*").remove();

      // Adjust dimensions with margins
      const innerWidth = dimensions.width - margin.left - margin.right;
      const innerHeight = dimensions.height - margin.top - margin.bottom;

      // Set up scales and axes with margins
      // const xScale = d3
      //   .scaleTime()
      //   .domain(d3.extent(data, (d) => d.date))
      //   .range([0, innerWidth]);

      const xScale = d3
        .scaleTime()
        .domain([
          d3.min(data, (d) => d3.timeYear.offset(d.date, -1)), // Start 4 years before the minimum date
          d3.max(data, (d) => d.date),
        ])
        .range([0, innerWidth]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => +d.value)])
        .range([innerHeight, 0]);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // Draw x-axis
      svg
        .append("g")
        .attr("class", "x-axis")
        .attr(
          "transform",
          `translate(${margin.left}, ${dimensions.height - margin.bottom})`
        )
        .call(xAxis);

      // Draw y-axis
      svg
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(yAxis);

      // Set line coordinates
      const line = d3
        .line()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.value));

      console.log(data);

      // Draw the line
      svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

      const zoomBehavior = d3
        .zoom()
        .scaleExtent([0.5, 3])
        .translateExtent([
          [0, 0],
          [dimensions.width, dimensions.height],
        ])
        .on("zoom", handleZoom);

      svg.call(zoomBehavior);

      function handleZoom(event) {
        const new_xScale = event.transform.rescaleX(xScale);
        const new_yScale = event.transform.rescaleY(yScale);

        // Update axes
        svg.select(".x-axis").call(xAxis.scale(new_xScale));
        svg.select(".y-axis").call(yAxis.scale(new_yScale));

        // Update line
        svg.select(".line").attr(
          "d",
          line.x((d) => new_xScale(d.date)).y((d) => new_yScale(d.value))
        );
      }
    };

    if (data.length > 0 && dimensions.width > 0 && dimensions.height > 0) {
      drawChart();
    }
  }, [data, dimensions, height, width]);

  return (
    <div ref={containerRef} style={{ width, height, padding:'50px' }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: `1px solid gray`}}
      />
    </div>
  );
};

export default TImeSeries;
