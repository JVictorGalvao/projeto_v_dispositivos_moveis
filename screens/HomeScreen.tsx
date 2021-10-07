/* eslint no-console: "off" */
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { ScreenContainer } from '../components/ScreenContainer';
import { Separator } from '../components/Separator';
import api from '../service/api';
import { RootStackScreenProps } from '../types';

interface ILocation {
  coords: any;
  mocked?: boolean;
  timestamp: number;
}

interface IEstabelecimentos {
  cod_cnes: number;
  cod_munic: number;
  dsc_adap_defic_fisic_idosos: string;
  dsc_bairro: string;
  dsc_cidade: string;
  dsc_endereco: string;
  dsc_equipamentos: string;
  dsc_estrut_fisic_ambiencia: string;
  dsc_medicamentos: string;
  dsc_telefone: number;
  nom_estab: string;
  vlr_latitude: number;
  vlr_longitude: number;
}

export default function HomeScreen({
  navigation,
}: RootStackScreenProps<'Home'>) {
  const [location, setLocation] = useState<ILocation>();
  const [errorMsg, setErrorMsg] = useState('');
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [city, setCity] = useState<string | null>('');
  const [estabelecimentos, setEstabelecimentos] = useState<IEstabelecimentos[]>(
    []
  );
  const [selectedLanguage, setSelectedLanguage] = useState();

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
      // console.log(place);
      place.map((place) => setCity(place.subregion));
    })();
  }, []);

  useEffect(() => {
    api
      .get(`/estabelecimentos-saude?dsc_cidade=${city}`)
      .then((response) => setEstabelecimentos(response.data));
  }, [city]);

  let text = 'Waiting..';
  console.log(location);
  // console.log(estabelecimentos);
  estabelecimentos.sort(() => {});

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location.coords);
  }

  return (
    <ScreenContainer>
      <Separator vertical size={256} />

      <Picker
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
      >
        {estabelecimentos.map((estab) => (
          <Picker.Item label={estab.nom_estab} />
        ))}
      </Picker>

      <Text>{text}</Text>
      <Text>{latitude}</Text>
      <Text>{longitude}</Text>
      <Text>{city}</Text>
    </ScreenContainer>
  );
}
