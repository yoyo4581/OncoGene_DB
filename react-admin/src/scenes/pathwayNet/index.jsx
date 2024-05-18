import { Box } from "@mui/material";
import Header from "../../components/Header";
import MyContext from '../../MyContext';
import executeNMatch from "../../data/pathwayData";
import NetHigher from '../../visualizations/netHigher';
import { useContext, useState, useEffect } from 'react';
import {Typography} from "@mui/material";

const PathNet = () => {

    const {geneNames} = useContext(MyContext);
    console.log('Rendering PathNet with geneNames:', geneNames);
    const [pathData, setPathData] = useState(null); // Initialize state
    const [prevGeneNames, setPrevGeneNames] = useState(null);

    useEffect(() => {
        // Fetch data when component mounts
        executeNMatch(geneNames).then(data => {
            setPathData(data);
            setPrevGeneNames(prevGeneNames); // Update state when data is fetched
        });
    }, [prevGeneNames]); // Dependency array

    if (!pathData) {
        return <div>Loading...</div>; // Loading state
    }

    const transformedData = pathData ? pathData.map(item => {
        return {
            Gene: item._fields[item._fieldLookup.Gene],
            pathway: item._fields[item._fieldLookup.pathway],
            neighbors: item._fields[item._fieldLookup.neighbors],
            count: item._fields[item._fieldLookup.count].low
        };
    }) : [];

    let data = transformedData;

    let nodes = [];
    let links = [];
    let pathwayGroupIds = {};
    let linkValues = {};
    let groupId = 1;
    let addedNodes = new Set();

    for (let item of data) {
        let pathway = item.pathway;

        if (!(pathway in pathwayGroupIds)) {
            pathwayGroupIds[pathway] = groupId;
            groupId++;
        }

        let pathwayGroupId = pathwayGroupIds[pathway];
        let gene = item.Gene;

        // nodes.push({id: gene, group: pathwayGroupId});
        if (!addedNodes.has(gene)) { // Check if the gene has been added
            nodes.push({id: gene, group: pathwayGroupId});
            addedNodes.add(gene); // Add the gene to the set of added nodes
        }

        let neighbors = item.neighbors;

        for (let neighbor of neighbors) {
            if (!addedNodes.has(neighbor)) { // Check if the neighbor has been added
                nodes.push({id: neighbor, group: pathwayGroupId});
                addedNodes.add(neighbor); // Add the neighbor to the set of added nodes
            }

            let link = {source: gene, target: neighbor};

            let linkString = JSON.stringify(link);

            if (linkString in linkValues) {
                linkValues[linkString]++;
            } else {
                linkValues[linkString] = 1;
            }

            links.push({source: gene, target: neighbor, value: linkValues[linkString]});
        }
    }

    let finaldata = {
        nodes: nodes,
        links: links,
        pathwayNames: {}
    };

    for (let item of data) {
        let pathway = item.pathway;
        let pathwayGroupId = pathwayGroupIds[pathway];
        finaldata.pathwayNames[pathwayGroupId] = pathway;
    }
    
    return (
        <Box m="20px">
            <Header title="Pathway Network Chart" subtitle="Network display of Pathways" />
            {/* <Typography variant="h6">Gene data: {JSON.stringify({finaldata})}</Typography> */}
            <Box height="100vh">
                <NetHigher data={finaldata} />
            </Box>
        </Box>
    );
}

export default PathNet;