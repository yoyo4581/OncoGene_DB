import {useState, useEffect} from 'react';
import Axios from "axios";

export default function useQuery(primaryType, secondaryType, classification, location) {
    const [listOfIds, setListOfIds] = useState([]);

    useEffect(() => {
        Axios.get(`http://localhost:3001/getIds?primaryType=${primaryType}&secondaryType=${secondaryType}&classification=${classification}&location=${location}`).then((response) => {
            setListOfIds(response.data)
        });
    }, [primaryType, secondaryType, classification, location]);

    return listOfIds;
}

export function useQueryId(ids) {
    const [queryData, setQueryData] = useState([]);

    useEffect(() => {
        if (ids && ids.length > 0) { // Only make the requests if ids are provided
            Promise.all(ids.map(id => 
                Axios.get(`http://localhost:3001/getQuery/${id}`)
            )).then((responses) => {
                const data = responses.map(response => response.data);
                setQueryData(data);
            });
        }
    }, [ids]); // Run this effect whenever the ids change

    return queryData;
}
