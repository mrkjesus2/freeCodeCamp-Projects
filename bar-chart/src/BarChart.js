import React, {useEffect} from 'react'
import * as d3 from 'd3'
import './BarChart.css'

/**
 * 
 * @param {title} props String used as the title
 * @param {data} props Array of the data to be plotted
 * @param {width} props Number with no unit
 * @param {height} props Number with no unit
 * @param {props.padding} props Number with no unit
 * @param {props.barMargin} props Number with no unit
 * 
 */
function BarChart(props) {
    const dates = []
    const values = []
    let tooltip = null

    props.data.map(item => {
        dates.push(item[0])
        values.push(item[1])
    })

    const scale = (props.height - props.padding)  / d3.max(values, (d) => d)
    const barWidth = (props.width - props.padding) / values.length - props.barMargin

    const xScale = d3.scaleTime()
                     .domain([d3.min(dates, (d) => new Date(d)), 
                              d3.max(dates, (d) => new Date(d))
                            ])
                     .range([0, props.width - props.padding])
 
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(values, (d) => d)])
                     .range([props.height - props.padding, 0])
    
    const xPosCalc = (idx) => {
        console.log(xScale(1996))
        return (idx * (props.width - props.padding) / values.length) + props.padding / 2  + (props.barMargin / 2)
    }

    const yPosCalc = (val) => {
        return props.height - (val * scale) - (props.padding / 2)
    }

    const createBars = (selection) => {
        selection.selectAll('rect')
                .data(values)
                .enter()
                .append('rect')
                .attr('class', 'barchart--bar bar')
                .attr('width', barWidth)
                .attr('height', (d, i) => d * scale)
                .attr('x', (d, i) => xPosCalc(i))
                .attr('y', (d) => yPosCalc(d))
                .attr('data-date', (d, i) => dates[i])
                .attr('data-gdp', (d, i) => values[i])
                .on('mouseover', (d, i) => showToolTip(tooltip, d, i) )
                .on('mouseout', (d) => hideToolTip(tooltip) )

    }

    const createAxes = (selection) => {
        selection.append('g')
            .attr('id', 'y-axis')
            .attr("transform", `translate(${props.padding / 2}, ${props.padding / 2})`)
            .call(d3.axisLeft(yScale))
            
        selection.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(${props.padding / 2}, ${props.height - props.padding / 2})`)
            .call(d3.axisBottom(xScale))
    }
    
    const showToolTip = (selection, val, idx) => {
        let xPos = d3.event.pageX - 50 + 'px'
        let yPos = d3.event.pageY - 100 + 'px'

        selection.attr('data-date', dates[idx])
            .style('top', yPos)
            .style('left', xPos)
            .transition()
            .duration(200)
            .style('opacity', 0.9)
            .text(`gdp: $${val} \ndate: ${new Date(dates[idx]).getMonth()}-${new Date(dates[idx]).getFullYear()}`)
    }

    const hideToolTip = (selection) => {
        selection.transition()
            .duration(350)
            .style('opacity', 0)
    }

    useEffect(() => {
        if (values.length > 0 && dates.length > 0) {
            let chart = d3.select('.barchart')
                          .append('svg')
                          .attr('width', props.width)
                          .attr('height', props.height)
            tooltip = d3.select('.barchart')
                        .append('div')
                        .attr('id', 'tooltip')
                        .attr('class', 'barchart--tooltip')
            createBars(chart)
            createAxes(chart)
        }
    })

    return(
        <figure className="barchart">
            <figcaption id="title" className="barchart--title">
                {props.title}
            </figcaption>
        </figure>
    )
}

export default BarChart

