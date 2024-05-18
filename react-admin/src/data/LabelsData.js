import {useState, useEffect} from 'react';
import Axios from "axios";

export default function useLabels() {
    const [listOfLabels, setListOfLabels] = useState([]);

    useEffect(() => {
        Axios.get("http://localhost:3001/getLabels").then((response) => {
            setListOfLabels(response.data)
        });
    }, []);

    return listOfLabels;
}
