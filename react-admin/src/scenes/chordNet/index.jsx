import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import MyContext from '../../MyContext';
import executeNMatch from "../../data/pathwayData";
import NetHigher from '../../visualizations/netHigher';
import { useContext, useState, useEffect } from 'react';
import {Typography} from "@mui/material";
import ChordDiagramWithSlider from "../../visualizations/chordScope";
import scopeSearch from "../../data/scopeSearch";

const ChordNet = () => {

    const {selectedNodes, selectedPathways} = useContext(MyContext);
    console.log('Rendering selectedNodes', selectedNodes);
    console.log('Rendering selectedPathways', selectedPathways);

    const [breadthPath, setBreadthPath] = useState(null); // Initialize state
    const [scopeValue, setScopeValue] = useState(3);

    // Function to update data based on slider value
    const updateData = (sliderValue) => {
        // Update data based on the slider value
        // For simplicity, let's just log the value here
        console.log('Slider value:', sliderValue);
        setScopeValue(sliderValue)
    };

    useEffect(() => {
        // Fetch data when component mounts
        // Fetch data when component mounts
        scopeSearch(selectedNodes, scopeValue).then(data => {
            console.log('Data from scopeSearch:', data);
            if (data) {
                setBreadthPath(data.finalArray);
            }
        });
    }, [scopeValue]); // Dependency array

    // Check if breadthPath is null
    if (breadthPath === null) {
        return <div>Loading...</div>; // Or return a loading indicator
    }

    console.log('breadthPath', breadthPath);

    
    return (
        <Box m="20px">
            <Header title="Scope-Search Pathway ChordDiagram" subtitle="Explore Overlapping Pathways in Selected Network Chart." />
            {/* <Typography variant="h6">Gene data: {JSON.stringify({finaldata})}</Typography> */}
            <Box height="50vh">
                {/* Render your chord diagram component with the slider */}
                <ChordDiagramWithSlider data={breadthPath} updateData={updateData} />
            </Box>
        </Box>
    );
}

export default ChordNet;
