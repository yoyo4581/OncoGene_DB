import {useState, useEffect} from 'react';
import Axios from "axios";
import baseUrl from '../baseUrl';

export default function useLabels() {
    const [listOfLabels, setListOfLabels] = useState([]);

    useEffect(() => {
        Axios.get(`${baseUrl}/getLabels`).then((response) => {
            setListOfLabels(response.data)
        });
    }, []);

    return listOfLabels;
}

