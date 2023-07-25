import React, {createContext, useState} from 'react';
import {papersDefinition} from '../OCR/papers';

export const SelectedPaperContext = createContext();

const names = papersDefinition.map(paper => paper.name);

export const SelectedPaperProvider = ({children}) => {
  const [paperName, setPaperName] = useState(names[0]);
  const [paperFace, setPaperFace] = useState('front');
  const [autoDetect, setAutoDetect] = useState(true);

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
