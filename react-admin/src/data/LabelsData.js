import {useState, useEffect} from 'react';
import Axios from "axios";

export default function useLabels() {
    const [listOfLabels, setListOfLabels] = useState([]);

    useEffect(() => {
        Axios.get(`${baseUrl}/getLabels`).then((response) => {
            setListOfLabels(response.data)
        });
    }, []);

    return listOfLabels;
}
