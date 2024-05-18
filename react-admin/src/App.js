// import { Theme } from '@fullcalendar/core/internal';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider} from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import { Routes, Route } from "react-router-dom";
import Types from "./scenes/cTypes";
import Experiments from "./scenes/experiments";
import Genes from "./scenes/genes";
// import Form from "./scenes/form";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import PathNet from "./scenes/pathwayNet";
// import Geography from "./scenes/geography";
// import Calendar from "./scenes/calendar";
import MyContext from './MyContext';
import useLabels from "./data/LabelsData";
import { useEffect, useState } from 'react';
import useQuery from './data/QueryLabels';
import ChordNet from './scenes/chordNet'




function App() {
  const [theme, colorMode] = useMode();

  const labels = useLabels();
    const [dataLabels, setDataLabels] = useState([]);
    const [primaryType, setPrimaryType] = useState([]);
    const [secondaryTypes, setSecondaryTypes] = useState([]);
    const [classification, setClassification] = useState([]);
    const [location, setLocation] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedExpIds, setSelectedExpIds] = useState([]);
    const [geneNames, setGeneNames] = useState([]);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [selectedPathways, setSelectedPathways] = useState([]);

    const primaryTypes = [];
    const secondaryTypesOptions = [];
    const classificationOptions = [];
    const locationOptions = [];

    // Define a function to update geneNames
    const updateGeneNames = (newGeneNames) => {
      setGeneNames(newGeneNames);
    };

    const updateSelectedNodes = (newSelectedNodes) =>{
      setSelectedNodes(newSelectedNodes);
    }

    const updateSelectedPathway = (newSelectedNodes) =>{
      setSelectedPathways(newSelectedNodes);
    }

  return (
    <MyContext.Provider value={{ labels, dataLabels, setDataLabels, primaryType, setPrimaryType, primaryTypes, secondaryTypes, setSecondaryTypes, secondaryTypesOptions, classification, classificationOptions, setClassification, location, setLocation, locationOptions, selectedIds, setSelectedIds,
      selectedExpIds, setSelectedExpIds, geneNames, setGeneNames, updateGeneNames, updateSelectedNodes, selectedNodes, selectedPathways, setSelectedPathways, updateSelectedPathway}}>
      <ColorModeContext.Provider value = {colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <Sidebar />
            <main className="content">
              <Topbar />
              <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/cTypes' element={<Types />} />
                <Route path='/genes' element={<Genes />} />
                <Route path='/experiments' element={<Experiments />} />
                {/* <Route path='/form' element={<Form />} /> */}
                <Route path='/pathwayNet' element={<PathNet />} />
                <Route path='/chordNet' element={<ChordNet />} />
                {/* <Route path='/line' element={<Line />} /> */}
                {/* <Route path='/faq' element={<FAQ />} /> */}
                {/* <Route path='/geography' element={<Geography />} /> */}
                {/* <Route path='/calendar' element={<Calendar />} /> */}

              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </MyContext.Provider>
  );
}

export default App;
