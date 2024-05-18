import React, { useEffect, useRef, useContext, useState } from 'react';
import * as d3 from 'd3';
import MyContext from '../MyContext';


function NetHigher({ data }) {
  const ref = useRef();
  const { updateSelectedNodes, updateSelectedPathway } = useContext(MyContext);
  const [selectedPathway, setSelectedPathway] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);

  useEffect(() => {
    updateSelectedNodes(selectedNodes);
    updateSelectedPathway(selectedPathway);
  }, [selectedPathway]);

  useEffect(() => {
    console.log('NetHigher rendered');
    const width = 928*2;
    const height = 600*2;

    if (data && data.nodes && data.nodes.length > 0) {
      console.log(data.nodes);
      const lastNodeGroup = data.nodes[data.nodes.length -1].group;

      const color = d3.scaleSequential()
        .domain([1,lastNodeGroup])
        .interpolator(d3.interpolateTurbo);

      const links = data.links.map(d => ({...d}));
      const nodes = data.nodes.map(d => ({...d}));
      
      const pathwayNames = data.pathwayNames;

      const svg = d3.select(ref.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

      const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll()
        .data(links)
        .join("line")
          .attr("stroke-width", d => Math.sqrt(d.value));

      const node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
          .attr("r", 7) // Increase base size of nodes from 5 to 7
          .attr("fill", d => {
            const rgbColorValue = d3.rgb(color(d.group));
            const hexColorValue = `#${rgbColorValue.r.toString(16).padStart(2, '0')}${rgbColorValue.g.toString(16).padStart(2, '0')}${rgbColorValue.b.toString(16).padStart(2, '0')}`;
            return hexColorValue;
          });

      node.append("title")
          .text(d => d.id);

      // Add pathway circles
      const pathwayData = d3.groups(nodes, d => d.group);
      const pathwayCircles = svg.append("g")
        .selectAll("circle")
        .data(pathwayData)
        .join("circle")
        .attr("fill", d => {
          const rgbColorValue = d3.rgb(color(d[0]));
          const hexColorValue = `rgba(${rgbColorValue.r}, ${rgbColorValue.g}, ${rgbColorValue.b}, 0.1)`; // Low opacity fill
          return hexColorValue;
        })
          .attr("stroke", d => {
            const rgbColorValue = d3.rgb(color(d[0]));
            const hexColorValue = `#${rgbColorValue.r.toString(16).padStart(2, '0')}${rgbColorValue.g.toString(16).padStart(2, '0')}${rgbColorValue.b.toString(16).padStart(2, '0')}`;
            return hexColorValue;
          }) // Set color of circle to be the same as the majority of the nodes that belong to them
          .attr("stroke-width", 3)
          // .lower() // put circles behind nodes

          .on("mouseover", function (d, event) {
            const group = d3.select(this).datum()[0];
            const pathway = pathwayNames[group];
            const tooltip = d3.select("#tooltip");
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`Pathway: ${pathway}`)
                .style("left", `${event.pageX}px`)
                .style("top", `${event.pageY}px`);
            //Increase size of nodes inside pathway circle.
            node.filter(n => n.group === group)
            .transition()
            .duration(200)
            .attr("r", 10); // Increase size to 10
        })
          .on("mouseout", function (d) {
            const tooltip = d3.select("#tooltip");
            tooltip.transition().duration(200).style("opacity", 0);
            node.transition().duration(200).attr("r", 7); // Revert size to 7
        })
          .on("click", function (event, d) {
            const group = d3.select(this).datum()[0];
            const pathway = pathwayNames[group];
            const pathwayName = pathway;
            const selectedNodes = node.filter(n => n.group === group)
            if (pathwayName) {
              
              // Extract names from selectedNodes
              const selectedNodesData = selectedNodes.data();
              const geneNames = selectedNodesData.map(node => node.id);
              setSelectedNodes(geneNames);
              setSelectedPathway(pathwayName);
              console.log(selectedNodes);
              console.log(selectedPathway);
    
            }
          });
        
  
        // Create force simulation
        const simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id))
          .force("charge", d3.forceManyBody(1000))
          .force("center", d3.forceCenter(width / 2, height / 2));
  
        // Set the position attributes of links and nodes each time the simulation ticks.
        simulation.on("tick", () => {
          link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
  
            node
            .attr("cx", d => Math.max(5, Math.min(width - 5, d.x))) // Adjust radius, width, and height as needed
            .attr("cy", d => Math.max(5, Math.min(height - 5, d.y))) // Adjust radius, width, and height as needed
  
          pathwayCircles
            .attr("cx", d => d3.mean(d[1], node => node.x))
            .attr("cy", d => d3.mean(d[1], node => node.y))
            .attr("r", d => d3.max(d[1], node => Math.hypot(node.x - d3.mean(d[1], node => node.x), node.y - d3.mean(d[1], node => node.y))));
        })
      }
  }, []);
    

  return (
    <div>
      <div id="tooltip" style={{ position: 'absolute', padding: '10px', background: 'rgba(0, 0, 0, 0.7)', color: '#fff', borderRadius: '5px', pointerEvents: 'none', opacity: 0 }}></div>
      <svg ref={ref} />
      <div>
      {selectedNodes.join(', ')}
      </div>
      <div>
      {selectedPathway}
      </div>
    </div>
  );
}

export default NetHigher;
