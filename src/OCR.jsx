import React, {useState, useEffect} from 'react';
import MlkitOcr from 'react-native-mlkit-ocr';
import {launchImageLibrary} from 'react-native-image-picker';
import {SafeAreaView, Image, View, Text, StyleSheet} from 'react-native';

export const OCR = ({uri}) => {
  const [OCRResult, setOCRResult] = useState(null);
  const [imgDimensions, setImgDimensions] = useState(null);

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
      console.log('img width : ', img.width);
      console.log('img height : ', img.height);
      setImgDimensions({width: img.width, height: img.height});
      setOCRResult(await MlkitOcr.detectFromUri(img.uri));
    } catch (e) {
      console.error(e);
    }
  };

  const getFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      async response => {
        await processImageResponse(response);
      },
    );
  };

  console.log('result : ', OCRResult);

  if (!uri && !OCRResult) {
    return getFromGallery();
  }

  if (uri && !imgDimensions) {
    Image.getSize(uri, (width, height) => {
      console.log('width : ', width);
      console.log('height : ', height);
      setImgDimensions({width, height});
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {!!OCRResult?.length &&
        OCRResult?.map(block => {
          return block.lines.map(line => {
            return (
              <View key={line.text} style={{paddingLeft: 20}}>
                <Text>{line.text}</Text>
              </View>
            );
          });
        })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  scroll: {
    flex: 1,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 2,
  },
});
