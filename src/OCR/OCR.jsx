import React, {useState, useEffect} from 'react';
import MlkitOcr from 'react-native-mlkit-ocr';
import {SafeAreaView, View, StyleSheet, ScrollView} from 'react-native';
import {ImageOCR} from './ImageOCR';
import {TextOCR} from './TextOCR';
import {AttributesResultOCR} from './AttributesResultOCR';

export const OCR = ({uri, imgSize}) => {
  const [OCRResult, setOCRResult] = useState(null);

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
        <View style={styles.textView}>
          <TextOCR OCRResult={OCRResult} />
        </View>
        <View style={styles.imageView}>
          <ImageOCR
            OCRResult={OCRResult}
            imgURI={uri}
            originalWidth={imgSize?.width}
            originalHeight={imgSize?.height}
          />
        </View>
      </ScrollView>
      <AttributesResultOCR OCRResult={OCRResult} imgSize={imgSize} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    borderColor: '#ccc',
  },
  textView: {
    paddingLeft: 20,
    paddingBottom: 20,
  },
  imageView: {
    //alignItems: 'center',
    //justifyContent: 'center',
    // backgroundColor: 'red',
    height: '100%',
  },
});
