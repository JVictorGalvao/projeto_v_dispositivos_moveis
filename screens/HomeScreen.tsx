import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { ScreenContainer } from '../components/ScreenContainer';
import { Separator } from '../components/Separator';
import { RootStackScreenProps } from '../types';

interface ILocation {
  coords: any;
  mocked?: boolean;
  timestamp: number;
}
export default function HomeScreen({
  navigation,
}: RootStackScreenProps<'Home'>) {
  const [location, setLocation] = useState<ILocation>();
  const [errorMsg, setErrorMsg] = useState('');
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [city, setCity] = useState<string | null>('');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const backPerm = await Location.requestBackgroundPermissionsAsync();
      console.log(backPerm);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);

      const place = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log(place);
      place.map((place) => setCity(place.district));
    })();
  }, []);

  let text = 'Waiting..';
  console.log(location);

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location.coords);
  }

  return (
    <ScreenContainer>
      <Separator vertical size={256} />
      <Text>{text}</Text>
      <Text>{latitude}</Text>
      <Text>{longitude}</Text>
      <Text>{city}</Text>
    </ScreenContainer>
  );
}
