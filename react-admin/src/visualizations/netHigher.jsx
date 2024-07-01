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
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (data && data.nodes && data.nodes.length > 0) {
      console.log(data.nodes);
      const lastNodeGroup = data.nodes[data.nodes.length -1].group;

      const color = d3.scaleSequential()
        .domain([1,lastNodeGroup])
        .interpolator(d3.interpolateTurbo);

      const links = data.links.map(d => ({...d}));
      const nodes = data.nodes.map(d => ({...d}));
      
      const pathwayNames = data.pathwayNames;

      // Calculate the domain of the x and y coordinates
      const xDomain = d3.extent(nodes, d => d.x);
      const yDomain = d3.extent(nodes, d => d.y);

      // Calculate the width and height of the domain
      const domainWidth = xDomain[1] - xDomain[0];
      const domainHeight = yDomain[1] - yDomain[0];

      const svg = d3.select(ref.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [xDomain[0], yDomain[0], domainWidth, domainHeight])
        .attr("style", "max-width: 100%; height: auto;");

      const g = svg.append("g");

      const link = g.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll()
        .data(links)
        .join("line")
          .attr("stroke-width", d => Math.sqrt(d.value*0.3));

      const node = g.append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
          .attr("r", 1) // Increase base size of nodes from 5 to 7
          .attr("fill", d => {
            const rgbColorValue = d3.rgb(color(d.group));
            const hexColorValue = `#${rgbColorValue.r.toString(16).padStart(2, '0')}${rgbColorValue.g.toString(16).padStart(2, '0')}${rgbColorValue.b.toString(16).padStart(2, '0')}`;
            return hexColorValue;
          });

      node.append("title")
          .text(d => d.id);

      // Add pathway circles
      const pathwayData = d3.groups(nodes, d => d.group);
      // Add pathway circles
      const pathwayCircles = svg.append("g")
      .selectAll("circle")
      .data(pathwayData)
      .join("circle")
      .attr("fill", "transparent") // Set initial fill color to be transparent
      .attr("stroke", d => {
        const rgbColorValue = d3.rgb(color(d[0]));
        const hexColorValue = `#${rgbColorValue.r.toString(16).padStart(2, '0')}${rgbColorValue.g.toString(16).padStart(2, '0')}${rgbColorValue.b.toString(16).padStart(2, '0')}`;
        return hexColorValue;
      }) 
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.5)
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
        .attr("r", 4); // Increase size to 10

        // Change fill color to visible when hovered
        d3.select(this)
          .attr("fill", d => {
            const rgbColorValue = d3.rgb(color(d[0]));
            const hexColorValue = `rgba(${rgbColorValue.r}, ${rgbColorValue.g}, ${rgbColorValue.b}, 0.1)`; // Low opacity fill
            return hexColorValue;
          });
      })
      .on("mouseout", function (d) {
        const tooltip = d3.select("#tooltip");
        tooltip.transition().duration(200).style("opacity", 0);
        node.transition().duration(200).attr("r", 1); // Revert size to 1

        // Change fill color back to transparent when not hovered
        d3.select(this)
          .attr("fill", "transparent");
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
        .force("charge", d3.forceManyBody()) // Adjust this value to change the gravity
        // .force("center", d3.forceCenter(width / 2, height / 2))
        // .force("collide", d3.forceCollide().radius(function(d) {
        //   return d.radius + 100;
        // }));
        .force("x", d3.forceX(width/2))
        .force("y", d3.forceY(height/2));

      // Create a lookup table of group centers
        const groupCenters = {};
        pathwayData.forEach(d => {
          groupCenters[d[0]] = {x: d3.mean(d[1], node => node.x), y: d3.mean(d[1], node => node.y)};
        });

        // Add a custom force to the simulation
        simulation.force("group", function(alpha) {
          //Update group centers
          pathwayData.forEach(d => {
            groupCenters[d[0]] = {x: d3.mean(d[1], node => node.x), y: d3.mean(d[1], node => node.y)};
          });
          // For each node...
          nodes.forEach(function(d) {
            // Get the center of the node's group
            const center = groupCenters[d.group];

            // Calculate the difference between the node's position and the group center
            const dx = center.x - d.x;
            const dy = center.y - d.y;

            // Adjust the node's position towards the group center
            d.vx += dx * alpha*3;
            d.vy += dy * alpha*3;
          });
        });


      // Set the position attributes of links and nodes each time the simulation ticks.
      // Set the position attributes of links and nodes each time the simulation ticks.
      simulation.on("tick", () => {
        // Update group centers
        pathwayData.forEach(d => {
          groupCenters[d[0]] = {x: d3.mean(d[1], node => node.x), y: d3.mean(d[1], node => node.y)};
        });
        link
          .attr("x1", d => Math.max(30, Math.min(width - 30, d.source.x))) // Adjust these values to limit the links' movement to the edge
          .attr("y1", d => Math.max(30, Math.min(height - 30, d.source.y))) // Adjust these values to limit the links' movement to the edge
          .attr("x2", d => Math.max(30, Math.min(width - 30, d.target.x))) // Adjust these values to limit the links' movement to the edge
          .attr("y2", d => Math.max(30, Math.min(height - 30, d.target.y))); // Adjust these values to limit the links' movement to the edge

        node
          .attr("cx", d => Math.max(30, Math.min(width - 30, d.x))) // Adjust these values to limit the nodes' movement to the edge
          .attr("cy", d => Math.max(30, Math.min(height - 30, d.y))); // Adjust these values to limit the nodes' movement to the edge

        pathwayCircles
          .attr("cx", d => Math.max(30, Math.min(width - 30, d3.mean(d[1], node => node.x)))) // Adjust these values to limit the pathway circles' movement to the edge
          .attr("cy", d => Math.max(30, Math.min(height - 30, d3.mean(d[1], node => node.y)))) // Adjust these values to limit the pathway circles' movement to the edge
          .attr("r", d => d3.max(d[1], node => Math.hypot(node.x - d3.mean(d[1], node => node.x), node.y - d3.mean(d[1], node => node.y))));
      });

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
