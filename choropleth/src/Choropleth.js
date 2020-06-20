import React, {useEffect} from 'react'
import * as d3 from 'd3' 
import * as topojson from 'topojson-client'
import './Choropleth.css'


function Choropleth(props) {
    // Reasonable numbers that will be superceded when map function is called
    let bachelorMin = 100 
    let bachelorMax = 0

    // Numbers matter again
    let colors = d3.schemeBlues[6]
    let colorScale = d3.scaleOrdinal()
                    .domain([bachelorMin, bachelorMax])
                    .range(colors)

    function map(el, countyCollection) {
        el.selectAll('path')
          .data(countyCollection.features)
          .enter()
          .each(function(d) {
             let currObj = props.educData.find(obj => obj.fips === d.id)
             bachelorMin = Math.min(bachelorMin, currObj.bachelorsOrHigher)
             bachelorMax = Math.max(bachelorMax, currObj.bachelorsOrHigher) 
  
             d3.select(this)
               .append('path')
               .attr('class', 'county')
               .attr('data-fips', () => currObj.fips)
               .attr('data-education', () => currObj.bachelorsOrHigher)
               .attr('d', d3.geoPath())
               .style('fill', () => colorScale(currObj.bachelorsOrHigher))
               .style('stroke', 'black')
               .on('mouseover', () => handleMouseOver(currObj.bachelorsOrHigher, currObj.state, currObj.area_name))
               .on('mouseout', () => handleMouseOut())
        })
    }

    function legend(el) {
        let width = 600
        let height = 20
        let tickValues = []

        let legend = el.append('g')
                       .attr('transform', 'translate(300, -30)')
                       .attr('id', 'legend')
                       .style('font-size', '1em')

        let scale = d3.scaleLinear()
                      .domain([bachelorMin, bachelorMax])
                      .range([bachelorMin, width])
        
        legend.selectAll('rect')
              .data(colors)
              .enter()
              .append('rect')
              .attr('class', 'choropleth--legend-color')
              .attr('width', width / colors.length)
              .attr('height', height)
              .attr('x', (d,i) =>  {
                  tickValues.push( scale.invert( (width / colors.length) * i) )
                  return (width / colors.length) * i
              })
              .attr('fill', (d, i) => colors[i])

        legend.call(d3.axisBottom(scale)
              .tickPadding(-25)
              .tickSize(0)
              .tickValues(tickValues))
              .select('.domain')
              .remove()
    }

    function tooltip(el, bachelors, state, county) {
        let width = '80'
        let xPos = d3.event.pageX - width / 2  
        let yPos = d3.event.pageY + 20 
        
        let tooltip = el.append('aside')
                   .attr('id', 'tooltip')
                   .attr('class', 'choropleth--tooltip')
                   .attr('width', width)
                   .style('top', yPos + 'px')
                   .style('left', xPos + 'px')
                   .attr('data-education', bachelors)
                   .html(`<h2>${county}, ${state}</h2><br />
                          <h3>Educated: ${bachelors}</h3>`)  
    }

    function handleMouseOver(bachelors, state, county) {
        d3.select('.choropleth')
          .call(tooltip, bachelors, state, county)
    }

    function handleMouseOut(ev) {
        d3.select('#tooltip').remove()
    }
    useEffect(() => {
        if (props.countyData !== null && props.educData !== null) {
            let countyCollection = topojson.feature(props.countyData, 'counties')

            let chart = d3.select('.choropleth--chart')
                          .append('g')
                          .attr('transform', 'translate(50, 80)')
                          .attr('id', 'choropleth--chart-container')
                          .call(map, countyCollection)
                          .call(legend)
        }
    })

    return(
        <figure className="choropleth">
            <figcaption className="choropleth--header">
                <h2 id="title" className="choropleth--title">
                    {props.title}
                </h2>
                <p id="description" className="choropleth--description">
                    {props.desc}
                </p>
            </figcaption>
            <svg className="choropleth--chart"
                 viewBox='0 0 1000 700'
            >
            </svg>
            <footer className="choropleth--footer">
                <span className="choropleth--footer-link">
                    Source:
                    <a href={props.attrSrc} > {props.attr}</a>
                </span>
            </footer>
        </figure>
    )
}

export default Choropleth