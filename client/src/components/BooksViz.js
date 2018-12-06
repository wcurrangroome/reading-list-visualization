import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import * as d3 from "d3";
import "d3-selection-multi";

const BOOKS_QUERY = gql`
  query BooksQuery($id: String!) {
    books(id: $id) {
      userBooks {
        title
        author
        pageCount
        ratingUser
        pageCount
        ratingAllUsers
        ratingCount
        readDate
        publishDate
      }
    }
  }
`;

const BooksViz = ({ id }) => (
  <Query query={BOOKS_QUERY} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) return <h4>Loading...</h4>;
      if (error) return <h1>Please enter a valid Goodreads UserId</h1>;

      const parseTime = d3.timeParse("%Y-%m-%d");
      const parsedData = data.books.userBooks;
      const w = 1000;
      const h = 500;
      const padding = 50;
      const div = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      const svg = d3
        .select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      const xScale = d3
        //.scaleLinear()
        //.domain([0, d3.max(parsedData, d => d.pageCount)])
        //.range([padding, w - padding]);
        .scaleTime()
        .domain([
          d3.min(parsedData, d => parseTime(d.readDate)),
          d3.max(parsedData, d => parseTime(d.readDate))
        ])
        .range([padding, w - padding]);

      const yScale = d3
        .scaleLinear()
        .domain([0, 5])
        .range([h - padding, padding]);

      const xAxis = d3.axisBottom(xScale);

      const yAxis = d3.axisLeft(yScale);

      svg
        .selectAll("circle")
        .data(parsedData)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cy", d => yScale(parseFloat(d.ratingUser)))
        .attr("cx", d => xScale(parseTime(d.readDate)))
        .attr("r", 5)
        .on("mouseover", function(d) {
          div
            .transition()
            .duration(200)
            .style("opacity", 0.9);
          div
            .html("this is a tooltip")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function(d) {
          div
            .transition()
            .duration(500)
            .style("opacity", 0);
        });

      svg
        .append("g")
        .attr("class", "x-axis axis")
        .attr("transform", `translate(0, ${h - padding} )`)
        .call(xAxis);

      svg
        .append("g")
        .attr("class", "y-axis axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis);

      /*
      svg
        .selectAll("text")
        .data(parsedData)
        .enter()
        .append("text")
        .text(d => d.title)
        .attr("y", d => yScale(parseFloat(d.ratingUser)))
        .attr("x", d => xScale(parseTime(d.readDate)))
        .attr("font-size", "10px");
      */

      return <svg className="chart-body" />;
    }}
  </Query>
);

export default BooksViz;
