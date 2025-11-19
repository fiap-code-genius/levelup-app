import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useThemeColors, useTheme } from '../../context/ThemeContext';
import RoomView from './components/RoomView';
import { styles } from './styles';

export default function HomeScreen() {
  const { currentUser } = useAuth();
  const colors = useThemeColors();
  const { toggleTheme, mode } = useTheme();

  if (!currentUser) return null;

  const level = currentUser.level;

  const safePointBalance = Number.isFinite(currentUser.pointBalance)
    ? currentUser.pointBalance
    : 0;

  const safeTotalPoints = Number.isFinite(currentUser.totalPoints)
    ? currentUser.totalPoints
    : safePointBalance;

  const levelThresholds = [0, 900, 1800, 3200, 6000];

  const nextLevel = Math.min(level + 1, 5);
  const currentLevelPoints = levelThresholds[level - 1] ?? 0;
  const nextLevelPoints =
    level < 5 ? levelThresholds[nextLevel - 1] : levelThresholds[4];

  const progress =
    safeTotalPoints >= nextLevelPoints || level === 5
      ? 1
      : Math.max(
          0,
          Math.min(
            (safeTotalPoints - currentLevelPoints) /
              (nextLevelPoints - currentLevelPoints || 1),
            1,
          ),
        );

  const pointsToNext =
    level === 5 ? 0 : Math.max(0, nextLevelPoints - safeTotalPoints);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: 85 }]}>
      <Text style={[styles.welcome, { color: colors.text }]}>
        Olá, {currentUser.fullName} :)
      </Text>

      <Text style={[styles.points, { color: colors.primary }]}>
        Pontos disponíveis para resgate: {safePointBalance}
      </Text>

      <RoomView level={level} colors={colors} />

      <View style={{ width: '100%', paddingHorizontal: 16, marginTop: 20 }}>
        <Text style={{ color: colors.text, marginBottom: 6, fontSize: 14 }}>
          Progresso para o nível {nextLevel}:
        </Text>

        <View
          style={{
            width: '100%',
            height: 14,
            backgroundColor: colors.card,
            borderRadius: 10,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              backgroundColor: colors.primary,
            }}
          />
        </View>

        <Text
          style={{
            color: colors.textSecondary,
            marginTop: 6,
            fontSize: 13,
          }}
        >
          {level === 5
            ? 'Você já alcançou o nível máximo.'
            : pointsToNext > 0
            ? `Faltam ${pointsToNext} pontos para o nível ${nextLevel}!`
            : `Você pode subir de nível em breve.`}
        </Text>

        <Text
          style={{
            color: colors.text,
            marginTop: 10,
            fontSize: 14,
            fontWeight: '500',
          }}
        >
          Você já acumulou {safeTotalPoints} pontos!
        </Text>
      </View>
    </View>
  );
}
