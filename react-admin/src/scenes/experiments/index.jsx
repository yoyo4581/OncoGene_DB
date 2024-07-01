import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import MyContext from '../../MyContext';
import React, { useContext, useState, useEffect } from 'react';
import useQuery from '../../data/QueryLabels';
import { useQueryId } from "../../data/QueryLabels";
import { useGeneData } from "../../data/GeneData";
import Genes from '../genes'; 
import GeneDataContext from '../../GeneDataContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

function checkForDuplicates(data) {
  const ids = data.map(item => item._id);
  const uniqueIds = [...new Set(ids)];

  if (ids.length !== uniqueIds.length) {
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    return `Duplicate IDs found: ${duplicates.join(', ')}`;
  } else {
    return 'No duplicate IDs found.';
  }
}


const Exp = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const context = useContext(MyContext);
  const {selectedIds} = context;

  const {selectedExpIds, setSelectedExpIds} = context;
  const queryData = useQueryId(selectedIds || []);
  const flattenedQueryData = queryData.flat();


  const duplicateMessage = checkForDuplicates(flattenedQueryData);

  const [myGeneData, setMyGeneData] = useState([]);
  const [myIsLoading, setMyIsLoading] = useState(true);

// Fetch gene data and update myGeneData and myIsLoading here...

  // Call useGeneData at the top level of your component
  // const geneData = useGeneData(queryData);

  // useEffect(() => {
  //   // Use geneData inside useEffect
  //   console.log(geneData);
  // }, [selectedIds, geneData]); // Add geneData as a dependency

  
  const columns = [
    { field: "Query Terms", headerName: "Query Terms" },
    {
      field: "Method",
      headerName: "Experimental Methods",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "GEO",
      headerName: "GEO ID",
      width: 100,
      renderCell: (params) => (
        <div>{params.row.value.GEO}</div>
      ),
    },
    {
      field: "PubMedIds",
      headerName: "PubMedIds",
      width: 100,
      renderCell: (params) => (
        <div>{params.row.value.PubMedIds}</div>
      ),
    },
    {
      field: "UID",
      headerName: "UID",
      width: 100,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      renderCell: (params) => (
        <div>{params.row.value.title}</div>
      ),
    },
    {
        field: "Summary",
        headerName: "Summary",
        flex: 1,
    },
  ];

  return (
      <Box m="20px">
        {/* <div style={{ display: 'flex', justifyContent: 'center'}}> */}
          <Header
            title="Experimental Data"
            subtitle="List of Experimental Methods and Source Publications"
          />
        {/* </div> */}
        <Typography variant="h6">{queryData.ids}</Typography>
        {/* Rest of your code... */}
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`
            },
          }}
        >
          <DataGrid  
          checkboxSelection={true}
            rows={flattenedQueryData}
            columns={columns}
            getRowId={(row) => row._id}
            onRowSelectionModelChange={(ids) => {
              setSelectedExpIds(ids);
            }}
            checkboxSelectionProps={{
              value: selectedIds,
            }}
          />
          <pre style={{ fontSize: 10 }}>
            {JSON.stringify(selectedExpIds, null, 4)}
          </pre>
        </Box>
      </Box>
  );
};

export default Exp;