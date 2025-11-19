import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useThemeColors } from '../../context/ThemeContext';
import { Reward } from '../../services/storage';
import { styles } from './styles';

export default function RewardsScreen() {
  const { rewards, currentUser, redeemReward } = useAuth();
  const colors = useThemeColors();

  const renderItem = ({ item }: { item: Reward }) => {
    const disabled = (currentUser?.pointBalance ?? 0) < item.cost;

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderWidth: 0,
            borderColor: 'transparent'
          }
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>

        {item.description ? (
          <Text style={[styles.desc, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        ) : null}

        <Text style={[styles.cost, { color: colors.primary }]}>
          {item.cost} pontos
        </Text>

        <TouchableOpacity
          disabled={disabled}
          onPress={() => redeemReward(item.id)}
          style={[
            styles.button,
            {
              backgroundColor: disabled ? colors.border : colors.primary,
              opacity: disabled ? 0.6 : 1
            }
          ]}
        >
          <Text style={styles.buttonText}>
            {disabled ? 'Pontos insuficientes' : 'Resgatar'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: 70 }]}>
      <Text style={[styles.header, { color: colors.text }]}>
        Prêmios Disponíveis
      </Text>

      <FlatList
        data={rewards}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text
            style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 30 }}
          >
            Nenhum prêmio cadastrado.
          </Text>
        }
      />
    </View>
  );
}
