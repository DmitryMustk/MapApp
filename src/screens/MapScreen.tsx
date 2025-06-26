import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Marker, Yamap } from 'react-native-yamap-plus';

const MapScreen = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Разрешение на геолокацию',
            message: 'Приложению нужно разрешение для доступа к местоположению',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Ошибка', 'Нет разрешения на доступ к геопозиции');
        return;
      }

      Geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Ошибка при получении локации:', error);
          Alert.alert('Ошибка', 'Не удалось получить текущую геопозицию');
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          forceRequestLocation: true,
          showLocationDialog: true,
        }
      );
    };

    fetchLocation();
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <Yamap
          style={styles.map}
          initialRegion={{
            lat: location.latitude,
            lon: location.longitude,
            zoom: 14,
          }}
        >
          <Marker point={{ lat: location.latitude, lon: location.longitude }} scale={5} />
        </Yamap>
      ) : (
        <Text style={styles.loadingText}>Загрузка карты...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MapScreen;
