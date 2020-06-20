import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import './HeatMap.css'

function HeatMap(props) {
    let svgEl = useRef({})
    let toolTip = d3.select('.heatmap--tooltip')
    let [minSize, setMinSize] = useState(0)
    let timer = useRef(null)

    let legendHeight = 20
    let baseTemp = props.data ? props.data.baseTemperature : null

    const XMIN = props.data ? d3.min(props.data.monthlyVariance, (d) => d.year) : null
    const XMAX = props.data ? d3.max(props.data.monthlyVariance, (d) => d.year) : null
    const YMIN = props.data ? d3.min(props.data.monthlyVariance, (d) => d.month) : null
    const YMAX = props.data ? d3.max(props.data.monthlyVariance, (d) => d.month) : null
    const MINTEMP = props.data ? d3.min(props.data.monthlyVariance, (d) => baseTemp + d.variance) : null
    const MAXTEMP = props.data ? d3.max(props.data.monthlyVariance, (d) => baseTemp + d.variance) : null
  
    const COLORSCALE = d3.scaleSequential()
                         .domain([MAXTEMP, MINTEMP])
                         .interpolator(d3.interpolateRdBu)

    let getMonthName = (num) => {
        let date = new Date(0)
        date.setUTCMonth(num)
        return d3.timeFormat('%B')(date)
    }
    
    let createChart = (el) => {
        let width = svgEl.current.clientWidth - props.padding / 2
        let height = svgEl.current.clientHeight - props.padding / 2 - legendHeight * 2

        const XSCALE = d3.scaleLinear()
                         .domain([XMIN, XMAX])
                         .range([0, width])

        const YSCALE = d3.scaleLinear()
                         .domain([YMIN - 0.5, YMAX + 0.5])
                         .range([0, height])

        let xAxis = d3.axisBottom(XSCALE)
                      .tickFormat(d3.format('d'))

        let yAxis = d3.axisLeft(YSCALE)
                      .tickFormat( (d) => getMonthName(d))

        el.selectAll('rect')
          .data(props.data.monthlyVariance)
          .enter()
          .append('rect')
          .attr('class', 'heatmap--cell cell')
          .attr('data-month', (d) => d.month - 1)
          .attr('data-year', (d) => d.year)
          .attr('data-temp', (d) => d.variance)
          .attr('width', XSCALE(XMIN + 1))
          .attr('height', YSCALE(YMIN) * 2)
          .style('fill', (d) => COLORSCALE(baseTemp + d.variance))
          .attr('x', (d,i) => XSCALE(d.year) )
          .attr('y', (d,i) => YSCALE(d.month) - YSCALE(1) )
          .on('mouseover', (d) => handleMouseOver(d))
          .on('mouseout', (d) => handleMouseOut(d))

        el.append('g')
             .attr('id', 'x-axis')
             .attr('class', 'heatchart--axis')
               .attr('transform', `translate(0, ${height})`)
             .call(xAxis)

        el.append('g')
             .attr('id', 'y-axis')
             .attr('class', 'heatmap--axis')
             .attr('transform', `translate(0, 0)`)
             .call(yAxis)
    }

    let createLegend = (el) => {
        let width = svgEl.current.clientWidth / 8
        let temps = [2,4,6,8,10,12]

        let scale = d3.scaleLinear()
                            .domain(temps)
                            .range([width / temps.length, width * (temps.length - 1) / temps.length])
        
        let legend = el.append('g')
                       .attr('id', 'legend')
                       .attr('class', 'heatmap--legend')
                       .attr('transform', `translate(${props.padding / 2}, ${svgEl.current.clientHeight - props.padding/ 2})`)
        
        legend.selectAll('rect')
            .data(temps)
            .enter()
            .append('rect')
            .attr('width', (d,i) => scale(i + 2) - scale(i))
            .attr('height', legendHeight + 'px')
            .attr('x', (d,i) => scale(i * 2 + 1))
            .attr('fill', (d) => COLORSCALE(d) )

        legend.append('g')
              .attr('class', 'heatmap--axis')
              .attr('transform', `translate(0, ${legendHeight})`)
              .call(d3.axisBottom(scale)
              .ticks(4))
        
    } 

    let handleMouseOver = (data) => {
        let xPos = d3.event.pageX
        let yPos = d3.event.pageY 

        toolTip.style('top', yPos + 20 + 'px')
           .style('left', xPos - 65 + 'px')
           .attr('data-year', data.year)
           .html(`${data.year} - ${getMonthName(data.month)} <br/>
                  ${(baseTemp + data.variance).toFixed(1)} &deg;C`)
           .transition()
           .duration(100)
           .style('opacity', 0.9)
    }

    let handleMouseOut = (ev) => {
        toolTip.transition()
           .duration(350)
           .style('opacity', '0')
    }

    let handleResize = (ev) => {
        let el = document.getElementById('heatmap--chart')
        let min = Math.min(el.clientWidth, el.clientHeight)

        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            d3.select('#heatmap--container').remove()            
            setMinSize(min)
        }, 1000)
    }

    useEffect(() => {
        if (props.data !== null) {
            let chart = d3.select('#heatmap--chart')
                          .append('g')
                          .attr('id', 'heatmap--container')
                          .attr('transform', `translate(70, ${props.padding / 8})`)
            
            createChart(chart)
            createLegend(chart)
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
        
    })

    return (
        <figure className="heatmap">
            <figcaption className="heatmap--header">
                <h2 id="title" className="heatmap--title">
                    {props.title}
                </h2>
                <p id="description" className="heatmap--description">
                    {props.description}&deg;C
                </p>
            </figcaption>
            <svg ref={svgEl}
                 id="heatmap--chart" 
                 className="heatmap--chart"
                //  viewBox='0, 0, 100%, 100%'
                 preserveAspectRatio='xMidYMid'
                 height={props.height}
                 width={props.width}
            >
            </svg>
            <aside id="tooltip" className="heatmap--tooltip"></aside>
        </figure>
    )
}

export default HeatMap
