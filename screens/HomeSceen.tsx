/* eslint-disable no-else-return */
import { RouteProp, useRoute } from '@react-navigation/native';
// eslint-disable-next-line import/no-duplicates
import { formatDistanceToNowStrict } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { ptBR } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { Card, Divider, Title } from 'react-native-paper';
import { ScreenContainer } from '../components/ScreenContainer';
import { Separator } from '../components/Separator';
import api from '../service/api';
import { RootStackScreenProps } from '../types';

interface IGrupos {
  id: number;
  nome: string;
  idade_minima: number;
}
type IRotas = {
  Home: {
    id: number;
    nome: string;
    dataNasc: string;
    email: string;
  };
};

export default function HomeScreen({
  navigation,
}: RootStackScreenProps<'Home'>) {
  const route = useRoute<RouteProp<IRotas, 'Home'>>();
  function toDate(dateStr) {
    const parts = dateStr.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  const nascimento = toDate(route.params.dataNasc);
  const idade = formatDistanceToNowStrict(nascimento, {
    locale: ptBR,
  });
  const idadeGrupo = parseInt(idade.replace(/[^0-9]/g, ''), 10);
  const [grupos, setGrupos] = useState<IGrupos>();

  console.log(Date.parse('1997-07-20'));
  useEffect(() => {
    (async () => {
      const grupos = await api
        .get('/grupos-atendimentos')
        .then((response) =>
          response.data.filter((elem) => elem.idade_minima <= idadeGrupo)
        );
      await setGrupos(grupos[0]);
    })();
  }, [idadeGrupo]);
  return (
    <ScreenContainer>
      <Card elevation={0}>
        <Card.Title title="Bem vindo(a)" titleStyle={{ fontSize: 18 }} />
        <Card.Content>
          <Title style={{ fontSize: 24 }}>{route?.params?.nome}</Title>
          <Title>{`Idade: ${idade}`}</Title>
          <Title
            style={{ fontSize: 18 }}
          >{`Grupo de atendimento: ${grupos?.nome}`}</Title>
          <Separator vertical size={8} />
          <Divider />
        </Card.Content>
      </Card>
      <Separator vertical size={64} />
      <Card onPress={() => navigation.navigate('Localizacao')}>
        <Card.Title title="Postos de vacina????o pr??ximos" />
      </Card>
      <Separator vertical size={36} />
      <Card
        onPress={() =>
          navigation.navigate('Agendamento', {
            id: route.params.id,
            grupo_atendimento_id: grupos?.id,
            grupo_atendimento_nome: grupos?.nome,
            idade: idadeGrupo,
          })
        }
      >
        <Card.Title title="Marcar agendamento" />
      </Card>
      <Separator vertical size={36} />
      <Card
        onPress={() =>
          navigation.navigate('Agendamentos', {
            tela: false,
            id: route.params.id,
            grupos_id: grupos?.id,
          })
        }
      >
        <Card.Title title="Meus agendamentos" />
      </Card>
    </ScreenContainer>
  );
}
