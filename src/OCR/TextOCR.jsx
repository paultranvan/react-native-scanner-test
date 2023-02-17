import React from 'react';
import {Text} from 'react-native';

export const TextOCR = ({OCRResult}) => {
  if (OCRResult?.length > 0) {
    return OCRResult?.map(block => {
      return block.lines.map(line => {
        return <Text>{line.text}</Text>;
      });
    });
  } else {
    return null;
  }
};
