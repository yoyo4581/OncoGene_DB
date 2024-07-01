import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

function SankeyChart({ data }) {
    const ref = useRef();
    useEffect(() => {
        if (!data || !data.nodes || !data.links || data.nodes.length === 0 || data.links.length === 0) {
            return;
        }

        const width = window.innerWidth;
        const height = window.inner;

        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height]);

        const sankeyInstance = sankey()
            .nodeId(d => d.name)
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[1, 5], [width - 1, height - 5]]);

        const { nodes, links } = sankeyInstance({
            nodes: data.nodes.map(d => Object.assign({}, d)),
            links: data.links.map(d => Object.assign({}, d))
        });

        svg.append("g")
            .selectAll("rect")
            .data(nodes)
            .join("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", "blue");

        svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "gray")
            .selectAll("g")
            .data(links)
            .join("path")
            .attr("d", sankeyLinkHorizontal())
            .attr("stroke-width", d => Math.max(1, d.width));

        svg.append("g")
            .style("font", "10px sans-serif")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr("y", d => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
            .text(d => d.name);
    }, [data]);

    return (
        <div>
            <svg ref={ref} />
        </div>
    );
}

export default SankeyChart;
