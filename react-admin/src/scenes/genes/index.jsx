import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import MyContext from '../../MyContext';
import React, { useMemo } from 'react';
import {Typography} from "@mui/material";
import { useContext, useState, useEffect } from 'react';
import { useGeneData } from "../../data/GeneData";

const Genes = React.memo(function Genes() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {selectedExpIds, updateGeneNames} = useContext(MyContext);

  const geneData = useGeneData(selectedExpIds);
  const flattenedGeneData = useMemo(() => geneData.geneData.flat(), [geneData]);
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

useEffect(() => {
  if (JSON.stringify(trimmedList) !== JSON.stringify(prevTrimmedList)) {
    updateGeneNames(trimmedList);
    setPrevTrimmedList(trimmedList);
  }
}, [trimmedList, prevTrimmedList]);


  // // Call the update function with trimmedList
  // useEffect(() => {
  //   updateGeneNames(trimmedList);
  // }, [trimmedList]);

  // useMemo(() => setGeneNames(trimmedList), [trimmedList]);


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
      <Box
        m="40px 0 0 0"
        height="75vh"
        // ... rest of your styles ...
      >
        <Typography variant="h6">Gene data: {JSON.stringify(trimmedList)}</Typography>
        {/* Add a button that sets triggerUpdate to a new value when clicked */}
        <DataGrid
          rows={flattenedGeneData}
          columns={columns}
          getRowId={(row) => row._id}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
      <Button onClick={() => setTriggerUpdate(!triggerUpdate)}
      sx={{
        backgroundColor: 'green',
        color: 'white',
        '&:hover': {
          backgroundColor: 'darkred',
        }
      }}>Update Gene Names</Button>
    </Box>
  )});
  

export default Genes;