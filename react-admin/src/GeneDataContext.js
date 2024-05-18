import React, { useState } from 'react';

const GeneDataContext = React.createContext({
  geneData: [],
  isLoading: false,
  updateGeneData: () => {}, // Function to update geneData
});

export const GeneDataContextProvider = ({ children }) => {
  const [geneData, setGeneData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateGeneData = (newGeneData) => {
    setGeneData(newGeneData);
  };

  return (
    <GeneDataContext.Provider value={{ geneData, isLoading, updateGeneData }}>
      {children}
    </GeneDataContext.Provider>
  );
};

export default GeneDataContext;
