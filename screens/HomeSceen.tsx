import { useRoute } from '@react-navigation/native';
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
  nome: string;
  idade_minima: number;
}

export default function HomeScreen({
  navigation,
}: RootStackScreenProps<'Home'>) {
  const route = useRoute();
  const nascimento = new Date(route.params.dataNasc);
  const idade = formatDistanceToNowStrict(nascimento, {
    locale: ptBR,
    addSuffix: false,
  });
  const idadeGrupo = parseInt(idade.replace(/[^0-9]/g, ''), 10);
  //   const idadeGrupo = 44;
  const [grupos, setGrupos] = useState<IGrupos[]>([]);

  useEffect(() => {
    api
      .get('/grupos-atendimentos')
      .then((response) => setGrupos(response.data));
  }, []);

  const grupoAtendimento = grupos.filter(
    (elem) => elem.idade_minima <= idadeGrupo
  );

  return (
    <ScreenContainer>
      <Card elevation={0}>
        <Card.Title title="Bem vindo(a)" titleStyle={{ fontSize: 18 }} />
        <Card.Content>
          <Title style={{ fontSize: 24 }}>{route?.params?.nome}</Title>
          <Title>{`Idade: ${idade}`}</Title>
          <Title
            style={{ fontSize: 18 }}
          >{`Grupo de atendimento: ${grupoAtendimento[0].nome}`}</Title>
          <Separator vertical size={8} />
          <Divider />
        </Card.Content>
      </Card>
      <Separator vertical size={64} />
      <Card onPress={() => navigation.navigate('Localizacao')}>
        <Card.Title title="Postos de vacinação próximos" />
      </Card>
      <Separator vertical size={36} />
      <Card onPress={() => navigation.navigate('Localizacao')}>
        <Card.Title title="Agendamento" />
      </Card>
    </ScreenContainer>
  );
}
