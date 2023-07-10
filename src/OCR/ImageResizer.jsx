import ImageResizer from '@bam.tech/react-native-image-resizer';

export const normalizeImageSize = async (imageUri, width, height) => {
  try {
    const {uri} = await ImageResizer.createResizedImage(
      imageUri,
      width,
      height,
      'JPEG',
      100,
    );
    return uri;
  } catch (err) {
    console.error('Failed to resize image', err);
    return null;
  }
};
