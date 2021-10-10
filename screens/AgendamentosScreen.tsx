/* eslint-disable no-else-return */
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Appbar, Card, Paragraph, Title } from 'react-native-paper';
import { ScreenContainer } from '../components/ScreenContainer';
import { Separator } from '../components/Separator';
import api from '../service/api';
import { RootStackScreenProps } from '../types';

type IRotas = {
  Agendamentos: {
    tela?: boolean;
    id: number;
    grupos_id: number | undefined;
  };
};

interface IAgendamentos {
  usuario_id: number;
  grupo_atendimento_id: number;
  estabelecimento_cnes: number;
  data: string;
  hora: string;
  dose: string;
  status: string;
  id: number;
}
interface IUsuario {
  id: number;
  nome: string;
}

interface IGrupos {
  id: number;
  nome: string;
  idade_minima: number;
}

export default function AgendamentosScreen({
  navigation,
}: RootStackScreenProps<'Agendamentos'>) {
  const route = useRoute<RouteProp<IRotas, 'Agendamentos'>>();
  const [agendamentos, setAgendamentos] = useState<IAgendamentos[]>([]);
  const [usuario, setUsuario] = useState<IUsuario>();
  const [grupo, setGrupo] = useState<IGrupos>();
  const [estabelecimentos, setEstabelecimentos] = useState([]);

  useEffect(() => {
    (async () => {
      const agendamentos = await api
        .get(`/agendamentos`)
        .then((response) =>
          response.data.filter((elem) => elem.usuario_id === route.params.id)
        );
      await setAgendamentos(agendamentos);
    })();
  }, [route.params.id]);

  useEffect(() => {
    (async () => {
      const usuario = await api
        .get(`/users`)
        .then((response) =>
          response.data.filter((elem) => elem.id === route.params.id)
        );
      await setUsuario(usuario[0]);
    })();
  }, [route.params.id]);

  useEffect(() => {
    (async () => {
      const grupo = await api
        .get(`/grupos-atendimentos`)
        .then((response) =>
          response.data.filter((elem) => elem.id === route.params.grupos_id)
        );
      await setGrupo(grupo[0]);
    })();
  }, [route.params.grupos_id]);

  useEffect(() => {
    (async () => {
      await api
        .get(`/estabelecimentos-saude`)
        .then((response) => setEstabelecimentos(response.data));
    })();
  }, []);

  const local = agendamentos.map((agend) =>
    estabelecimentos.find(
      (estab) => estab.cod_cnes === agend.estabelecimento_cnes
    )
  );
  return (
    <>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.BackAction
          onPress={
            route.params.tela
              ? () => navigation.pop(2)
              : () => navigation.goBack()
          }
        />
        <Appbar.Content title="Meus agendamentos" />
      </Appbar.Header>
      <ScreenContainer>
        {agendamentos.map((agend, index) => (
          <>
            <Card key={agend.id.toString()}>
              <Card.Content key={agend.id.toString()}>
                <Title>{usuario?.nome}</Title>
                <Paragraph>{`Local: ${local[index]?.nom_estab}`}</Paragraph>
                <Paragraph>{`Grupo de atendimento: ${grupo?.nome}`}</Paragraph>
                <Paragraph>{`DOSE: ${agend.dose}`}</Paragraph>
                <Title>{agend.status}</Title>
              </Card.Content>
            </Card>
            <Separator vertical size={16} />
          </>
        ))}
      </ScreenContainer>
    </>
  );
}
