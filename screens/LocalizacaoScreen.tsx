/* eslint-disable no-return-assign */
/* eslint no-console: "off" */
import * as Location from 'expo-location';
import haversineDistance from 'haversine-distance';
import React, { useEffect, useState } from 'react';
import { Appbar, List } from 'react-native-paper';
import { ScreenContainer } from '../components/ScreenContainer';
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
  distancia: number;
}

export default function LocalizacaoScreen({
  navigation,
}: RootStackScreenProps<'Localizacao'>) {
  const [location, setLocation] = useState<ILocation>();
  const [errorMsg, setErrorMsg] = useState('');
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [city, setCity] = useState<string | null>('');
  const [estabelecimentos, setEstabelecimentos] = useState<IEstabelecimentos[]>(
    []
  );

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
      place.map((place) => setCity(place.subregion));
    })();
  }, []);
  useEffect(() => {
    api
      .get(`/estabelecimentos-saude?dsc_cidade=${city}`)
      .then((response) => setEstabelecimentos(response.data));
  }, [city]);

  // adiciona a distancia no objeto estabelecimentos
  estabelecimentos.forEach(
    (estab) =>
      (estab.distancia = haversineDistance(
        { latitude: latitude, longitude: longitude },
        { latitude: estab.vlr_latitude, longitude: estab.vlr_longitude }
      ))
  );
  // organiza os estabelecimentos por distancia
  estabelecimentos.sort((a, b) => a.distancia - b.distancia);

  return (
    <>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Locais de vacinação" />
      </Appbar.Header>
      <ScreenContainer>
        {estabelecimentos.map((estab) => (
          <List.Item
            title={estab.nom_estab}
            descriptionNumberOfLines={2}
            description={`${
              estab.dsc_endereco
            } \nDistância: ${estab.distancia.toFixed(2)} metros`}
            left={() => <List.Icon icon="map-marker-radius-outline" />}
          />
        ))}
      </ScreenContainer>
    </>
  );
}
