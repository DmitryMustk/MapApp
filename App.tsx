import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CodeInputScreen from './src/screens/CodeInputScreen';
import PhoneInputScreen from './src/screens/PhoneInputScreen';
// import { YANDEX_MAPS_API_KEY } from '@env';
import MapScreen from './src/screens/MapScreen';
import { YamapInstance } from 'react-native-yamap-plus';


YamapInstance.init("9150afc1-ddbf-4ecf-8097-de77ed7a1182");

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PhoneInput">
        <Stack.Screen name="PhoneInput" component={PhoneInputScreen} options={{ title: 'Ввод телефона' }} />
        <Stack.Screen name="CodeInput" component={CodeInputScreen} options={{ title: 'Ввод кода' }} />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Карта' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
