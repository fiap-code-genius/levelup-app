import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useThemeColors } from '../../context/ThemeContext';
import { Reward } from '../../services/storage';
import { styles } from './styles';

export default function AdminRewardsScreen() {
  const { rewards, createReward, deleteReward } = useAuth();
  const colors = useThemeColors();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');

  const handleCreate = async () => {
    if (!title || !cost) return;

    const c = Number(cost);
    if (isNaN(c) || c <= 0) return;

    await createReward({
      title: title.trim(),
      description: description.trim() || undefined,
      cost: c
    });

    setTitle('');
    setDescription('');
    setCost('');
  };

  const renderItem = ({ item }: { item: Reward }) => (
    <View style={[styles.rewardRow, { borderColor: colors.border }]}>
      <View style={styles.rewardInfo}>
        <Text style={[styles.rewardTitle, { color: colors.text }]}>{item.title}</Text>

        {item.description ? (
          <Text style={[styles.rewardDesc, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        ) : null}

        <Text style={[styles.rewardCost, { color: colors.primary }]}>
          {item.cost} pts
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.deleteButton, { borderColor: colors.danger }]}
        onPress={() => deleteReward(item.id)}
      >
        <Text style={[styles.deleteText, { color: colors.danger }]}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: 70 }]}>
      <Text style={[styles.title, { color: colors.text }]}>Prêmios</Text>

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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Cadastrar prêmio</Text>

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Título"
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Descrição (opcional)"
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Custo (pontos)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={cost}
          onChangeText={setCost}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleCreate}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rewards}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
