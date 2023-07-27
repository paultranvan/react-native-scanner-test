/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SelectedPaperProvider} from './src/providers/SelectPaperProvider';
import StartScanner from './src/StartScanner';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <SelectedPaperProvider>
        <StartScanner />
      </SelectedPaperProvider>
    </SafeAreaView>
  );
}

export default App;
