/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { RouteProp, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import haversineDistance from 'haversine-distance';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Appbar, Button, Dialog, Portal, TextInput } from 'react-native-paper';
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
  distancia: number;
}
type IRota = {
  Agendamento: {
    id: number;
    grupo_atendimento_id: number;
    grupo_atendimento_nome: string;
    idade: number;
  };
};
export default function AgendamentoScreen({
  navigation,
}: RootStackScreenProps<'Agendamento'>) {
  const route = useRoute<RouteProp<IRota, 'Agendamento'>>();
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState<ILocation>();
  const [errorMsg, setErrorMsg] = useState('');
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [city, setCity] = useState<string | null>('');
  const [estabelecimentos, setEstabelecimentos] = useState<IEstabelecimentos[]>(
    []
  );
  const [selectedEstabelec, setSelectedEstabelec] = useState();
  const [selectedDose, setSelectedDose] = useState();
  const [agendado, setAgendado] = useState(false);
  const [check, setCheck] = useState([]);
  const [error, setError] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);

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

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode: string) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const agendar = () => {
    api
      .post('/agendamentos', {
        usuario_id: route.params.id,
        grupo_atendimento_id: route.params.grupo_atendimento_id,
        estabelecimento_cnes: selectedEstabelec,
        data: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        hora: `${date.getHours()}:${date.getMinutes()}`,
        dose: selectedDose,
        status: 'AGENDADO',
      })
      .then(() =>
        navigation.navigate('Agendamentos', {
          tela: true,
          id: route.params.id,
          grupos_id: route.params.grupo_atendimento_id,
        })
      );
  };

  useEffect(() => {
    api
      .get(`/agendamentos`)
      .then((response) =>
        setCheck(
          response.data.filter((elem) => elem.usuario_id === route.params.id)
        )
      );
  }, [route.params.id]);

  const checaAgendamento = () => {
    const verifica = check.map((agend) => agend.status === 'AGENDADO');
    const teste = verifica.some((a) => a === true);
    if (teste === true) {
      setError(true);
    } else {
      setAgendado(true);
    }
  };
  const hideDialog = () => setError(false);
  return (
    <>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Agendamento" />
      </Appbar.Header>
      <ScreenContainer>
        <Separator vertical size={32} />
        <TextInput
          label="Grupo de Atendimento"
          mode="outlined"
          disabled
          value={route.params.grupo_atendimento_nome}
        />
        <Separator vertical size={12} />
        <TextInput
          label="Data de Atendimento"
          mode="outlined"
          onFocus={() => {
            showDatepicker();
          }}
          value={`${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`}
        />
        <Separator vertical size={12} />
        <TextInput
          label="Hora de Atendimento"
          mode="outlined"
          onFocus={() => {
            showTimepicker();
          }}
          value={`${date.getHours()}:${date.getMinutes()}`}
        />
        <Separator vertical size={32} />
        <Picker
          selectedValue={selectedEstabelec}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedEstabelec(itemValue)
          }
        >
          {estabelecimentos.map((estab, index) => (
            <Picker.Item
              key={index.toString()}
              label={estab.nom_estab}
              value={estab.cod_cnes}
            />
          ))}
        </Picker>
        <Separator vertical size={32} />
        <Picker
          selectedValue={selectedDose}
          onValueChange={(itemValue, itemIndex) => setSelectedDose(itemValue)}
        >
          <Picker.Item label="Primeira dose" value="PRIMEIRA" />
          <Picker.Item label="Segunda dose" value="SEGUNDA" />
          <Picker.Item label="Dose de reforço" value="REFORÇO" />
          <Picker.Item label="Dose única" value="ÚNICA" />
        </Picker>
        <Separator vertical size={64} />
        <Button
          mode="contained"
          onPress={() => (agendado ? agendar() : checaAgendamento())}
        >
          Agendar
        </Button>
        <Portal>
          <Dialog visible={error} onDismiss={hideDialog}>
            <Dialog.Title>Você já tem um agendamento</Dialog.Title>

            <Dialog.Actions>
              <Button onPress={hideDialog}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour
            display="default"
            onChange={onChange}
          />
        )}
      </ScreenContainer>
    </>
  );
}
