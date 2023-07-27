import React, {createContext, useMemo, useState} from 'react';
import {papersDefinition} from '../OCR/papers';

export const SelectedPaperContext = createContext();

export const SelectedPaperProvider = ({children}) => {
  const [paperFace, setPaperFace] = useState('front');
  const [autoDetect, setAutoDetect] = useState(true);

  const names = useMemo(() => {
    return papersDefinition.map(paper => paper.name);
  }, []);
  const [paperName, setPaperName] = useState(names[0]);

  return (
    <SelectedPaperContext.Provider
      value={{
        paperName,
        setPaperName,
        paperFace,
        setPaperFace,
        autoDetect,
        setAutoDetect,
        names,
      }}>
      {children}
    </SelectedPaperContext.Provider>
  );
};
