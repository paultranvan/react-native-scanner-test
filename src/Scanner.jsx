import React, {useState, useEffect} from 'react';
import DocumentScanner from 'react-native-document-scanner-plugin';
import {ScannerResult} from './ScannerResult.jsx';

export const Scanner = () => {
  const [scannedImage, setScannedImage] = useState();

  const scanDocument = async () => {
    // start the document scanner
    const {scannedImages} = await DocumentScanner.scanDocument({
      maxNumDocuments: 1,
      letUserAdjustCrop: true,
    });

    // get back an array with scanned image file paths
    if (scannedImages?.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0]);
    }
  };

  useEffect(() => {
    // call scanDocument on load
    scanDocument();
  }, []);

  if (scannedImage) {
    return <ScannerResult scannedImage={scannedImage} />;
  }
  return null;
};
