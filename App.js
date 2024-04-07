import React, { useEffect } from 'react';
import { globalStyles } from './src/theme/GlobalStyle';
import { TouchableOpacity, View } from 'react-native';
import { startBackgroundLocation, stopBackgroundLocation, subscribeLocation } from './src/utils/Location';


const App = () => {


  useEffect(() => {
    subscribeLocation()
  }, [])


  return (
    <>
      <View style={globalStyles.mainContainer}>

        <TouchableOpacity style={{ width: "100%", height: 100, backgroundColor: "red" }}
          onPress={() => {
            stopBackgroundLocation()
          }}
        >

        </TouchableOpacity>


        <TouchableOpacity style={{ width: "100%", height: 100, backgroundColor: "green" }}
          onPress={() => {
            startBackgroundLocation().then(() => {

            })
          }}
        >

        </TouchableOpacity>

      </View>
    </>
  );
};

export default App;