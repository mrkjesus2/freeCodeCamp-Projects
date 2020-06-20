import React, { useEffect } from 'react'
import * as d3 from 'd3'
import './TreeMap.css'


function TreeMap(props) {
    let width = 800
    let height = 500
    let nodes = null
    let categories = []

    let scale = d3.scaleOrdinal()
                .domain([...categories])
                .range(d3.schemeSpectral[9])

    function treeMap(el) {
        let map = d3.treemap()
                    .padding(1)
                    .paddingOuter(0)
                    .size([width, height])(nodes)
        
        let leaf = el.selectAll('g')
                     .data(map.leaves())
                     .join('g')
                     .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`)

        leaf.append('rect')
            .attr('id', d => d.id = d.data.name.replace(/[\W\s]/g, '') + d.data.category)
            .attr('class', 'tile')
            .attr('data-name', d => d.data.name)
            .attr('data-category', d => d.data.category)
            .attr('data-value', d => d.data.value)
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .style('fill', d => scale(d.data.category))
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut)

        leaf.append('clipPath')
            .attr('id', d => d.clipid = d.id + '-clip' )
            .append('rect')
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)

        leaf.append('text')
            .attr('clip-path', d => `url(#${d.clipid}`)
            .style('font-size', '0.6em')
            .selectAll('tspan')
            .data(d => d.data.name.split(' '))
            .join('tspan')
            .text((d) => d)
            .attr('x', 3)
            .attr('y', (d, i) => i * 10 + 10)
    }

    function legend(el) {
        let xPos = (val) => (width / 9) * Math.round(val % 3) 
        let yPos = (val) => Math.floor(val / 3) * 25 

        let container = el.append('g')
                          .attr('id', 'legend')
                          .attr('transform', `translate(${width / 3}, ${height + 50})`)

        let legend = container.selectAll('g')
                          .data(categories)
                          .join('g')
                          .attr('transform', (d,i) => `translate(${xPos(i)}, ${yPos(i)})`)

        legend.append('rect')
              .attr('class', 'legend-item')
              .attr('aria-labeledby', d => d)
              .attr('width', '10')
              .attr('height', '10')
              .style('stroke', 'black')
              .style('fill', d => scale(d))

        legend.append('text')
              .attr('id', d => d)
              .text(d => d)
              .attr('x', '15')
              .attr('y', '10')
    }


    function handleMouseOver(d) {
        // All requirements for test 11 are met here - filed a bug report
        d3.select(this)
            .append('title')
            .attr('id', 'tooltip')
            .attr('data-value', d => d.data.value)
            .text(d => d.data.name + '\n' + d.data.value)
    }

    function handleMouseOut() {
        d3.select(this)
          .select('title')
          .remove()
    }

    useEffect(() => {
        if (props.games != null) {
            props.games.children.forEach(child => {
                categories.push(child.name)
            })

            nodes = d3.hierarchy(props.games)
                      .sum(d => d.value)
                      .sort((a,b) => {
                        return b.height - a.height || b.value - a.value
                    })

            d3.select('.treemap')
              .append('svg')
              .attr('width', '800px')
              .attr('height', '700px')
              .attr('viewbox', '0 0 100 100')
              .style('border', '1px solid black')
              .call(treeMap)
              .call(legend)
            //   .call(tooltip)            
        }
    })

    return (
        <figure className="treemap">
            <figcaption className="treemap--header">
                <h1 id="title" className="treemap--title">
                    {props.title}
                </h1>
                <p id="description" className="treemap--description">
                    {props.desc}
                </p>
            </figcaption>
        </figure>
    )
}

export default TreeMap