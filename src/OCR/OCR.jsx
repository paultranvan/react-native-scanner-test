import React, {useState, useEffect} from 'react';
import MlkitOcr from 'react-native-mlkit-ocr';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  NativeModules,
} from 'react-native';
import {ImageOCR} from './ImageOCR';
import {TextOCR} from './TextOCR';

export const OCR = ({uri}) => {
  const [OCRResult, setOCRResult] = useState(null);
  const [imgDimensions, setImgDimensions] = useState(null);
  const [imgURI, setImgURI] = useState(uri);

  useEffect(() => {
    const processOCR = async () => {
      if (uri) {
        const result = await MlkitOcr.detectFromUri(uri);
        setOCRResult(result);
      }
    };

    processOCR();
  }, [uri]);

  const processImageResponse = async response => {
    if (!response.assets || response.assets.length < 1) {
      throw new Error('No image in response');
    }
    try {
      const img = response.assets[0];
      const result = await MlkitOcr.detectFromUri(img.uri);
      console.log('img : ', img);
      setImgURI(img.uri);
      setOCRResult(result);
      setImgDimensions({width: img.width, height: img.height});
    } catch (e) {
      console.error(e);
    }
  };

  const getFromGallery = async () => {
    return launchImageLibrary(
      {
        mediaType: 'photo',
      },
      async response => {
        await processImageResponse(response);
      },
    );
  };

  if (!imgURI && !OCRResult) {
    getFromGallery();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.textView}>
          <TextOCR OCRResult={OCRResult} />
        </View>
        <View style={styles.imageView}>
          <ImageOCR
            OCRResult={OCRResult}
            imgURI={imgURI}
            originalWidth={imgDimensions?.width}
            originalHeight={imgDimensions?.height}
          />
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
