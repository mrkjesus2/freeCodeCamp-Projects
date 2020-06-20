import React, {useEffect} from 'react'
import * as d3 from 'd3'
import './ScatterPlot.css'
import { scaleOrdinal, color } from 'd3'


function ScatterPlot(props) {
    let tooltip
    let xScale = d3.scaleLinear()
                   .domain([d3.min(props.data, (d) => parseInt(d.Year) - 1), d3.max(props.data, (d) => parseInt(d.Year) + 1)])
                   .range([0, props.width - props.padding])

    let yScale = d3.scaleTime()
                   .domain([d3.max(props.data, (d) => d.Seconds * 1000), d3.min(props.data, (d) => d.Seconds * 1000)])
                   .range([props.height - props.padding, 0])

    let colorScale = scaleOrdinal(d3.schemeCategory10)
 
    let createDots = (selection) => {        
        selection.selectAll('circle')
            .data(props.data)
            .enter()
            .append('circle')
            .attr('id', 'dot')
            .attr('class', 'scatterplot--dot dot')
            .attr('data-xvalue', (d) => d.Year)
            .attr('data-yvalue', (d) => {
                return new Date(0,0,0,0, Math.floor(d.Seconds/60), d.Seconds % 60) 
            })
            .attr('cx', (d) => xScale(d.Year) + props.padding / 2 )
            .attr('cy', (d) => yScale(d.Seconds * 1000) + props.padding / 2 )
            .attr('r', 5)
            .style('fill', (d) => {
                return colorScale(d.Doping !== '')
            })
            .on('mouseover', (d) => handleMouseOver(d) )
            .on('mouseout', (d) => handleMouseOut(d) )
    }

    let createAxes = (selection) => {
        selection.append('g')
                 .attr('id', 'x-axis')
                 .attr('class', 'scatterplot--x-axis')
                 .attr('transform', `translate(${props.padding / 2}, ${props.height - props.padding / 2})`)
                 .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))
        
        selection.append('g')
                 .attr('id', 'y-axis')
                 .attr('class', 'scatterplot--y-axis')
                 .attr('transform', `translate(${props.padding / 2}, ${props.padding / 2})`)
                 .call(d3.axisLeft(yScale).tickFormat(d3.utcFormat('%M:%S')))
    }

    let createLegend = (selection) => {
        let legend = selection.selectAll('#legend')
                            .data(colorScale.domain())
                            .enter()
                            .append('g')
                            .attr('id', 'legend')
                            .attr('class', 'scatterplot--legend')                 
                            .attr('width', '80')
                            .attr('height', '60')
                            .attr('x', props.width / 2)
                            .attr('y', props.padding / 2)
                
        legend.append('text')
              .attr('x', () => props.width - 120 + 'px')
              .attr('y', (d, i) => props.height / 2 + i * 15 + 'px')
              .text((d) => {
                  return d ? 'Doping Allegations' : 'No Allegations'
              })
 
        legend.selectAll('rect')
              .data(colorScale.domain())
              .enter()         
              .append('rect')
              .attr('width', '0.7em')
              .attr('height', '0.7em')
              .attr('x', () => props.width - 20 + 'px')
              .attr('y', (d, i) => (props.height / 2 + i * 15) - 8 + 'px')
              .attr('fill', colorScale)
    }

    let handleMouseOver = (obj) => {
        tooltip.attr('data-year', obj.Year)
               .style('top', d3.event.pageY + 10 + 'px')
               .style('left', d3.event.pageX - 40 + 'px')
               .html(`${obj.Name}<br>Time: ${obj.Time} <br>Placed: ${obj.Place}
                      <br><br>${obj.Doping}`)
               .style('opacity', 0.9)
               .style('width', '120px')
               .style('height', 'auto')
    }

    let handleMouseOut = (obj) => {
        tooltip.style('opacity', 0)
               .style('width', 0)
               .style('height', 0)
    }

    useEffect(() => {
        if(props.data.length > 0) {
            let plot = d3.select('.scatterplot')
                        .append('svg')
                        .attr('id', 'scatterplot')
                        .attr('width', props.width)
                        .attr('height', props.height)

            tooltip = d3.select('.scatterplot')
                        .append('aside')
                        .attr('id', 'tooltip')
                        .attr('class', 'scatterplot--tooltip')

            createDots(plot)
            createAxes(plot)
            createLegend(plot)
        }
    })

    return (
        <figure className="scatterplot">
            <figcaption id="title" className="scatterplot--title">
                {props.title}
            </figcaption>
        </figure>
    )
}

export default ScatterPlot