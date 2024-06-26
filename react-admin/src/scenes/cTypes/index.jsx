import { Box, useTheme, Autocomplete, TextField } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import MyContext from '../../MyContext';
import React, { useContext } from 'react';
import { useEffect } from 'react';


const Types = () => {
    const theme = useTheme();

    // const labels = useLabels();
    // const [dataLabels, setDataLabels] = useState([]);
    // const [primaryType, setPrimaryType] = useState([]);
    // const [secondaryTypes, setSecondaryTypes] = useState([]);
    // const [classification, setClassification] = useState([]);
    // const [location, setLocation] = useState([]);
    // const [selectedIds, setSelectedIds] = useState([]);

    const context = useContext(MyContext);
    const {labels, dataLabels, setDataLabels, primaryType,
        setPrimaryType, secondaryTypes, setSecondaryTypes, classification,
        setClassification, location, setLocation, selectedIds, setSelectedIds, experimentsCount, publicationsCount
    } = context;

    useEffect(() => {
      // Replace null values with 'Null'
      const updatedLabels = labels.map(label => {
          for (let key in label) {
              if (label[key] === null) {
                  label[key] = 'Null';
              }
          }
          return label;
      });
      setDataLabels(updatedLabels);
  }, [labels]);

  

    const resetDependentStates = (newPrimaryType, newSecondaryTypes, newClassification) => {
      setPrimaryType(newPrimaryType);
      setSecondaryTypes(newSecondaryTypes);
      setClassification(newClassification);
      setLocation([]);
      setSelectedIds(dataLabels.filter(label => newPrimaryType.includes(label['Primary Cancer Type']) && newSecondaryTypes.includes(label['Secondary Cancer Type']) && newClassification.includes(label['Classification'])).map(label => label ? label['_id'] : 'None'));
    };

    const primaryTypes = [...new Set(dataLabels?.map(label => label ? label['Primary Cancer Type'] : 'None')) ?? []];

    const secondaryTypesOptions = [...new Set(primaryType.length > 0 ? dataLabels?.filter(label => primaryType.includes(label['Primary Cancer Type'])).map(label => label ? label['Secondary Cancer Type'] : 'None') : [])].filter(Boolean);

    const classificationOptions = [...new Set(primaryType.length > 0 && secondaryTypes.length > 0 ? dataLabels?.filter(label => primaryType.includes(label['Primary Cancer Type']) && secondaryTypes.includes(label['Secondary Cancer Type'])).map(label => label ? label['Classification'] : 'None') : [])].filter(Boolean);
    
    const locationOptions = [...new Set(primaryType.length > 0 && secondaryTypes.length > 0 && classification.length > 0 ? dataLabels?.filter(label => primaryType.includes(label['Primary Cancer Type']) && secondaryTypes.includes(label['Secondary Cancer Type']) && classification.includes(label['Classification'])).map(label => label ? label['Location'] : 'None') : [])].filter(Boolean);



    useEffect(() => {
      // Reset secondaryTypes, classification, and location when primaryType changes
      resetDependentStates(primaryType, [], []);
    }, [primaryType]);
    
    useEffect(() => {
      // Reset classification and location when secondaryTypes changes
      resetDependentStates(primaryType, secondaryTypes, []);
    }, [secondaryTypes]);
    
    useEffect(() => {
      // Reset location when classification changes
      resetDependentStates(primaryType, secondaryTypes, classification);
    }, [classification]);
    
    return (
        <Box m="20px">
            {/* <div>Selected IDs: {selectedIds.join(', ')}</div> */}
            <Box mb={5}>
                <Header title="Select Cancer Dataset" subtitle="" />
                    <Autocomplete
                        multiple
                        options={primaryTypes}
                        value={primaryType}
                        onChange={(event, newValue) => {
                            setPrimaryType(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Primary Cancer Type" />}
                    />
            </Box>
            <Box mb={5}>
                <Autocomplete
                    multiple
                    options={secondaryTypesOptions}
                    value={secondaryTypes}
                    onChange={(event, newValue) => {
                        setSecondaryTypes(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Secondary Cancer Types" />}
                />
            </Box>
            <Box mb={5}>
                <Autocomplete
                    multiple
                    options={classificationOptions}
                    value={classification}
                    onChange={(event, newValue) => {
                        setClassification(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Classification" />}
                />
            </Box>
            <Box mb={5}>
                <Autocomplete
                    multiple
                    options={locationOptions}
                    value={location}
                    onChange={(event, newValue) => {
                        setLocation(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Location" />}
                />
            </Box>
            <Box mb={5}>
                <div style={{ fontSize: 'small' }}>
                        <div>Number of Experiments: {experimentsCount}</div>
                        <div>Number of Publications: {publicationsCount}</div>
                </div>
            </Box>
        </Box>
    );
};


export default Types;