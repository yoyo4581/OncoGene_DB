import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

function wrapOnDash(text) {
    text.each(function() {
        var text = d3.select(this),
            parts = text.text().split('-'), // split on dash
            tspan = text.text(null).append("tspan").attr("x", 0).attr("dy", "0em");
        parts.forEach((part, i) => {
            if (i > 0) {
                tspan = text.append("tspan").attr("x", 0).attr("dy", "1.2em").text('-' + part); // adjust dy as needed
            } else {
                tspan.text(part);
            }
        });
    });
}


const ChordDiagramWithSlider = ({ data, updateData }) => {
    const [sliderValue, setSliderValue] = useState(2);
    const ref = useRef();

    // Function to handle slider change
    const handleSliderChange = (event) => {
        const value = parseInt(event.target.value);
        setSliderValue(value);
        updateData(value); // Call the function passed from the parent
    };

    useEffect(() => {
        // Remove old SVG
        d3.select(ref.current).selectAll('*').remove();

    const svgHeight = window.innerHeight *0.7; // 75% of window height
    const width = svgHeight;
    const height = width;
    const innerRadius = Math.min(width, height) * 0.3;
    const outerRadius = innerRadius + 10;
  
    // Compute a dense matrix from the weighted links in data.
    const names = d3.sort(d3.union(data.map(d => d.source), data.map(d => d.target)));
    const index = new Map(names.map((name, i) => [name, i]));
    const matrix = Array.from(index, () => new Array(names.length).fill(0));
    for (const {source, target, value} of data) matrix[index.get(source)][index.get(target)] += value;
  
    const chord = d3.chordDirected()
        .padAngle(10 / innerRadius)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending);
  
    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
  
    const ribbon = d3.ribbonArrow()
        .radius(innerRadius - 1)
        .padAngle(1 / innerRadius);
  
    const colors = d3.quantize(d3.interpolateRainbow, names.length);
  
    const svg = d3.select(ref.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");
  
    // Append a slider
    const slider = svg.append("input")
        .attr("type", "range")
        .attr("min", 1)
        .attr("max", 10) // Set the maximum value based on your requirement
        .attr("value", 1) // Initial value
        .attr("style", "position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);")
        .on("input", function() {
            // Update visualization when slider is adjusted
            updateChordDiagram(this.value);
        });
  
    const chords = chord(matrix);
  
    const group = svg.append("g")
      .selectAll()
      .data(chords.groups)
      .join("g");
  
    group.append("path")
        .attr("fill", d => colors[d.index])
        .attr("d", arc);
  
    group.append("text")
        .each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
        .attr("dy", "0.35em")
        .attr("transform", d => `
            rotate(${(d.angle * 180 / Math.PI - 90)})
            translate(${outerRadius + 5})
            ${d.angle > Math.PI ? "rotate(180)" : ""}
        `)
        .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
        .attr("font-size", "9px") // Adjust the font size here
        .attr("fill", "white") // Adjust the font color here
        .text(d => names[d.index])
        .call(wrapOnDash); // Use the new wrap function

  
    group.append("title")
        .text(d => `${names[d.index]}
  ${d3.sum(chords, c => (c.source.index === d.index) * c.source.value)} outgoing →
  ${d3.sum(chords, c => (c.target.index === d.index) * c.source.value)} incoming ←`);
  
    svg.append("g")
        .attr("fill-opacity", 0.75)
      .selectAll()
      .data(chords)
      .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("fill", d => colors[d.target.index])
        .attr("d", ribbon)
      .append("title")
        .text(d => `${names[d.source.index]} → ${names[d.target.index]} ${d.source.value}`);
  
    function updateChordDiagram(value) {
        // Update your chord diagram based on the slider value
        // You might need to recalculate data or update certain attributes
        // For simplicity, let's just change the color of the first group's arc
        group.select("path")
            .attr("fill", d => colors[(d.index + value) % names.length]); // Cycling through colors based on slider value
    }
  }, [data]);

    return (
        <div>
            <svg ref={ref} />
            <input
                type="range"
                min={1}
                max={10} // Set the maximum value based on your requirement
                value={sliderValue}
                onChange={handleSliderChange}
            />
            <div>
                {'Depth First Search: '+ sliderValue}
            </div>
        </div>
        
    );
};

export default ChordDiagramWithSlider;