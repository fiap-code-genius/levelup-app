import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { styles } from './styles';

type Props = {
  level: number;
  colors: any;
};

const MAX_LEVEL = 5;

function getRoomImage(level: number): ImageSourcePropType {
  const lvl = Math.min(Math.max(level, 1), MAX_LEVEL);

  switch (lvl) {
    case 1: return require('../../../../../assets/rooms/room1.png');
    case 2: return require('../../../../../assets/rooms/room2.png');
    case 3: return require('../../../../../assets/rooms/room3.png');
    case 4: return require('../../../../../assets/rooms/room4.png');
    case 5:
    default:
      return require('../../../../../assets/rooms/room5.png');
  }
}

export default function RoomView({ level, colors }: Props) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderWidth: 0,
          borderColor: 'transparent'
        }
      ]}
    >
      <Image source={getRoomImage(level)} style={styles.image} resizeMode="cover" />

      <Text style={[styles.caption, { color: colors.textMuted }]}>
        Complete as tarefas para evoluir seu quarto e resgate prêmios para melhorar seu ambiente em home office.
      </Text>
    </View>
  );
}
