import React, { useEffect, useRef, useState } from 'react';
import { Box, Button } from "@mui/material";
import * as d3 from 'd3';

function ArchChart({ data }) {
    const ref = useRef();
    const [order, setOrder] = useState('by name');
    const width = window.innerWidth;
    const step = 14;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 20;
    const marginLeft = 130;

    // Calculate degree outside of the orders object
    const degree = d3.rollup(
        data.links.flatMap(({ source, target, value }) => [
            { node: source, value },
            { node: target, value }
        ]),
        (v) => d3.sum(v, ({ value }) => value),
        ({ node }) => node
    );

    // Use degree inside the orders object
    const orders = {
        "by name": d3.sort(data.nodes.map((d) => d.id)),
        "by group": d3.sort(data.nodes, ({group}) => group, ({id}) => id).map(({id}) => id),
        "by degree": d3.sort(data.nodes, ({id}) => degree.get(id), ({id}) => id).map(({id}) => id)
    };

    useEffect(() => {
        if (!data || !data.nodes || !data.links || data.nodes.length === 0 || data.links.length === 0) {
            return;
        }
        // Clear the SVG element
        d3.select(ref.current).selectAll("*").remove();
    
        const height = (data.nodes.length - 1) * step + marginTop + marginBottom;
        const y = d3.scalePoint(data.nodes.map(d => d.id), [marginTop, height - marginBottom]);
    
        const color = d3.scaleOrdinal()
            .domain(data.nodes.map(d => d.group).sort(d3.ascending))
            .range(d3.schemeCategory10)
            .unknown("#aaa");
    
        const groups = new Map(data.nodes.map(d => [d.id, d.group]));
        function samegroup({ source, target }) {
            return groups.get(source) === groups.get(target) ? groups.get(source) : null;
        }
    
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");
    
        const Y = new Map(data.nodes.map(({id}) => [id, y(id)]));
    
        // Add an arc for each link.
        function arc(d) {
            const y1 = Y.get(d.source);
            const y2 = Y.get(d.target);
            const r = Math.abs(y2 - y1) / 2;
            return `M${marginLeft},${y1}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} ${marginLeft},${y2}`;
        }
    
        // A function that updates the positions of the labels and recomputes the arcs
        // when passed a new order.
        function update(order, y, label, path, Y, marginLeft) {
            y.domain(order);
            
            // Add an arc for each link.
            function arc(d) {
                const y1 = Y.get(d.source);
                const y2 = Y.get(d.target);
                const r = Math.abs(y2 - y1) / 2;
                return `M${marginLeft},${y1}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} ${marginLeft},${y2}`;
            }
            label
                .sort((a, b) => d3.ascending(Y.get(a.id), Y.get(b.id)))
                .transition()
                .duration(750)
                .delay((d, i) => i * 20) // Make the movement start from the top.
                .attrTween("transform", d => {
                const i = d3.interpolateNumber(Y.get(d.id), y(d.id));
                // console.log('marginLeft', marginLeft);
                // console.log('Y.get(d.id)', Y.get(d.id));
                // console.log('y(d.id)', y(d.id));
                return t => {
                    const y = i(t);
                    Y.set(d.id, y);
                    return `translate(${marginLeft},${y})`;
                }
                });
    
            path.transition()
                .duration(750 + data.nodes.length * 20) // Cover the maximum delay of the label transition.
                .attrTween("d", d => () => arc(d));
        }
        const path = svg.insert("g", "*")
            .attr("fill", "none")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(data.links)
            .join("path")
            .attr("stroke", d => color(samegroup(d)))
            .attr("d", arc);

        // Add a text label and a dot for each node
        const label = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(data.nodes)
            .join("g")
            .attr("transform", d => `translate(${marginLeft},${Y.get(d.id)})`)
            .call(g => g.append("text")
                .attr("x", -6)
                .attr("dy", "0.35em")
                .attr("fill", d => d3.lab(color(d.group)).darker(2))
                .text(d => d.id))
            .call(g => g.append("circle")
                .attr("r", 3)
                .attr("fill", d => color(d.group)));

        // Add invisible rects that update the class of the elements on mouseover.
        label.append("rect")
            .attr("fill", "none")
            .attr("width", marginLeft + 40)
            .attr("height", step)
            .attr("x", -marginLeft)
            .attr("y", -step / 2)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("pointerenter", (event, d) => {
                svg.classed("hover", true);
                label.classed("primary", n => n === d);
                label.classed("secondary", n => data.links.some(({source, target}) => (
                    n.id === source && d.id == target || n.id === target && d.id === source
                )));
                path.classed("primary", l => l.source === d.id || l.target === d.id).filter(".primary").raise();
            })
            .on("pointerout", () => {
                svg.classed("hover", false);
                label.classed("primary", false);
                label.classed("secondary", false);
                path.classed("primary", false).order();
            });
        
        // Add styles for the hover interaction.
        svg.append("style").text(`
            .hover text { fill: #aaa; }
            .hover g.primary text { font-weight: bold; fill: #333; }
            .hover g.secondary text { fill: #333; }
            .hover path { stroke: #ccc; }
            .hover path.primary { stroke: #333; }
        `);
        if (orders[order]){
            update(orders[order], y, label, path, Y, marginLeft);
        }
    }, [data, order]);

    return (
        <div>
            <Box m="20px">
                <select value={order} onChange={e => setOrder(e.target.value)}>
                    <option value="by name">By Name</option>
                    <option value="by group">By Group</option>
                    <option value="by degree">By Degree</option>
                </select>
            </Box>
            <svg ref={ref} width="100%" height="100%" />
        </div>
    );
}

export default ArchChart;
