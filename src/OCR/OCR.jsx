import React, {useState, useEffect, useContext} from 'react';
import MlkitOcr from 'react-native-mlkit-ocr';
import {SafeAreaView, View, StyleSheet, ScrollView} from 'react-native';
import {ImageOCR} from './ImageOCR';
import {TextOCR} from './TextOCR';
import {AttributesResultOCR} from './AttributesResultOCR';
import {SelectedPaperContext} from '../providers/SelectPaperProvider';

export const OCR = ({uri, imgSize}) => {
  const [OCRResult, setOCRResult] = useState(null);
  const {paperName, paperFace, autoDetect} = useContext(SelectedPaperContext);
  console.log('paper name from context : ', paperName)

  useEffect(() => {
    const processOCR = async () => {
      if (uri) {
        console.log('process OCR from image');
        let startTime = performance.now();
        const result = await MlkitOcr.detectFromUri(uri);
        let endTime = performance.now();
        console.log(`OCR took ${endTime - startTime} ms.`);
        setOCRResult(result);
      }
    };

    processOCR();
  }, [uri]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.attributesView}>
          <AttributesResultOCR
            OCRResult={OCRResult}
            imgSize={imgSize}
            paperName={paperName}
            paperFace={paperFace}
            autoDetect={autoDetect}
          />
        </View>
        <View style={styles.textView}>
          <ImageOCR
            OCRResult={OCRResult}
            imgURI={uri}
            originalWidth={imgSize?.width}
            originalHeight={imgSize?.height}
          />
        </View>
        <View style={styles.textView}>
          <TextOCR OCRResult={OCRResult} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    borderColor: '#ccc',
    flex: 1,
  },
  textView: {
    paddingBottom: 20,
    borderWidth: 1,
  },
  imageView: {
    //alignItems: 'center',
    //justifyContent: 'center',
    // backgroundColor: 'red',
    // height: '50%',
  },
  attributesView: {
    borderWidth: 1,
  },
});
