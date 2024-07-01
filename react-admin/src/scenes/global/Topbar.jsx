import { Box, IconButton, useTheme} from "@mui/material";
import {useContext} from "react";
import {ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon  from "@mui/icons-material/DarkModeOutlined";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import  NotificationsOutlinedIcon  from "@mui/icons-material/NotificationsOutlined";
import  SettingsOutlinedIcon  from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon  from "@mui/icons-material/PersonOutlined";
import SearchIcon  from "@mui/icons-material/Search";
import MyContext from "../../MyContext";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Tooltip, Typography } from "@mui/material";


const Topbar = ({ selected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode= useContext(ColorModeContext);
    console.log("selected", selected);
    const getTooltipText = () => {
        switch (selected) {
            case "Select Cancer Types":
                return "The following is a drop-down selection to navigate data in the OncoGeneDB database. Data inside the database is organized based on NIH definition of cancers, and consists of primary, secondary, classification, and location to characterize each cancer type. These labels are used to parse information from GEO. The text below the grid tells you the available data identified from the cancer labels specified. A user has the ability to include more than one cancer type for further investigation.";
            case "Select Experiments":
                return "The following is a checkbox grid that retains a user's selection. The information present is the experimental data recovered from GEO along with relevant information. A user can use the checkbox interface to select experiments, most likely those with similar methods, to recover and download valuable data. Further, an experiment with a PubMed publication shown may have been parsed successfully as seen in the columns, and gene meta-data information is available for view in the subsequent tab.";
            case "Preview Genes Data":
                return "Here is an arc diagram visualization of all genes parsed from PubMed papers tied to experiments selected by the user. Furthermore, each gene is sent to a KG-database that holds pathway information, and a single neighbor hop is investigated. If any gene parsed has a neighboring gene in direct interaction with it, then an arc is formed. This information can be grouped using the drop down menu, by alphabetical name, by group (publication which the data came from), and by degree (the amount of incoming/outgoing relationships).";
            case "Pathway Network Chart":
                return "This is a Force Directed Network Hierarchy plot. The gene data previewed in the last tab, is used in a search on the KG-database to perform a neighboring search. The gene along with its neighbor is returned (unlike the arc chart the neighbor does not have to be included in the publication). So we are previewing a network chart of all genes directly interacting with genes from our publication. These genes are grouped into circles called pathway circles. Pathway circles are hoverable and selectable, hovering over the circle gives you its pathway name, selecting it tells you the genes inside it. Before moving on to the scope-search make sure you select a pathway by clicking on it."
            case "Scope-Search ChordDiagram":
                return "This is a Chord Diagram, specifically showing the pathway overlap. This chord diagram shows inter-pathway (between) interactions and intra-pathway (within) interactions along with the number of them if you hover over a ribbon. The chord diagram specifically navigates the pathway selected in the network chart diagram. In essence this visualization explores a subject pathway's reach or involvement with other pathways. There is a slider below the controls the scope of the depth first search, as the scope increases expect more pathways to arise. The significance of pathway overlap decreases as the scope increases.";
          // ... other cases ...
          default:
            return "";
        }
    };

    return (<Box display="flex" justifyContent="space-between" p={2}>
        {/* Search Bar */}
        <Box 
            display="flex" 
            backgroundColor={colors.primary[400]} 
            borderRadius="3px"
        >
            <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
            <IconButton type="button" sx={{ p: 1}}>
                <SearchIcon />
            </IconButton>
        </Box>

    {/* ICONS */}
    <Box display="flex">
        <Tooltip title={<Typography style={{ fontSize: "1.5em" }}>{getTooltipText()}</Typography>}>
            <IconButton>
                <HelpOutlineIcon />
            </IconButton>
        </Tooltip>
        <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode ==='dark' ? (
                <DarkModeOutlinedIcon />
            ) : (
                <LightModeOutlinedIcon />
            )}
        </IconButton>
        {/* <IconButton>
            <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
            <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
            <PersonOutlinedIcon />
        </IconButton> */}

    </Box>
    </Box>);
}

export default Topbar;