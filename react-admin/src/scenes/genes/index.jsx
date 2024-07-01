import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import MyContext from '../../MyContext';
import React, { useMemo } from 'react';
import {Typography} from "@mui/material";
import { useContext, useState, useEffect } from 'react';
import { useGeneData } from "../../data/GeneData";
import SankeyChart from '../../visualizations/sankey';
import ArchChart from "../../visualizations/arcChart";
import executeNMatch from "../../data/pathwayData";

function Genes() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // get selectedExpids, geneNames data and this will be updated
  const {selectedExpIds, updateGeneNames, geneNames} = useContext(MyContext);

  // acquire the geneData be doing a call with expIds
  const geneData = useGeneData(selectedExpIds);
  const flattenedGeneData = useMemo(() => geneData.geneData.flat(), [geneData]);
  // if the geneData changes then update the flattenedGeneData and its traformation
  const flatData = useMemo(() => flattenedGeneData.map(gene => [
    ...gene.Keywords,
    ...gene.Abstract,
    ...gene.Body,
    ...(gene.Abbreviations ? gene.Abbreviations : [])
  ]).flat(), [flattenedGeneData]);

  const uniqueSet = useMemo(() => new Set(flatData), [flatData]);
  const uniqueData = useMemo(() => Array.from(uniqueSet), [uniqueSet]);
  const trimmedList = useMemo(() => uniqueData.map(item => item.replace(/[-.]$/g, '')), [uniqueData]);

  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [prevTrimmedList, setPrevTrimmedList] = useState();

  // if the gene list data has been changed do an operation that cleans it up.
  useEffect(() => {
    if (JSON.stringify(trimmedList) !== JSON.stringify(prevTrimmedList)) {
      updateGeneNames(trimmedList);
      setPrevTrimmedList(trimmedList);
    }
  }, [trimmedList, prevTrimmedList]);

  console.log('Rendering PathNet with geneNames:', geneNames);
  const [pathData, setPathData] = useState(null); // Initialize state
  const [prevGeneNames, setPrevGeneNames] = useState(null);

  useEffect(() => {
    // Update prevGeneNames before calling the function
    setPrevGeneNames(geneNames);

    // Fetch data when component mounts
    executeNMatch(geneNames).then(data => {
      setPathData(data);
    });
  }, [geneNames]); // Add geneNames to the dependency array

  if (!pathData) {
    return <div>Loading...</div>; // Loading state
  }
  console.log('pathData', pathData);

  if (pathData && pathData.length === 0){
    return <div>Genes Not Found in KG database...</div>; // Loading state
  }
  console.log('pathData', pathData);

  console.log(flattenedGeneData);
  // Initialize an empty array for nodes and links
  let linksBuild = [];

  pathData.forEach((item) => {
    let source = item._fields[0];
    let targets = item._fields[2];
    let value = item._fields[3].low;

    targets.forEach((target) => {
      if (geneNames.includes(source) && geneNames.includes(target)) {
        linksBuild.push({source: source, target: target, value: value});
      }
    });
  });

  // Initialize a set for node names
  let nodeNames = new Set();

  console.log('flattenedGeneData',flattenedGeneData);

  let nodesGrouped = [];

  flattenedGeneData.forEach((item, i) => {
    item["Body"].forEach((gene) => {
      if (geneNames.includes(gene)){
      nodesGrouped.push({id:gene, group:i});
      }
    });
  });

  console.log('nodesGrouped', nodesGrouped);

  let data = {nodes: nodesGrouped, links: linksBuild};
  console.log('data', data);

  const columns = [
    { field: "Keywords", headerName: "Keywords", flex: 1 },
    { field: "Abstract", headerName: "Abstract", flex: 1},
    { field: "Abbreviations", headerName: "Abbreviations", flex: 1},
    {
      field: "Body",
      headerName: "Body",
      flex: 3,
      cellClassName: "name-column--cell",
    },
  ];
  return (
    <Box m="20px">
      <Header
        title="Gene Data"
        subtitle="Gene Data extracted from PubMed resources"
      />
      {/* <Button onClick={() => setTriggerUpdate(!triggerUpdate)}
      sx={{
        backgroundColor: 'green',
        color: 'white',
        '&:hover': {
          backgroundColor: 'darkred',
        }
      }}>Update Gene Names</Button> */}
      {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Box height="100vh"> */}
            <ArchChart data={data} />
        {/* </Box>
    </div> */}
    </Box>
    
  )};
  

export default Genes;
