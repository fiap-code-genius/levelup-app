import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Keyboard } from 'react-native';
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

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleCreate = async () => {
    if (!title || !cost) {
      setShowErrorPopup(true);
      return;
    }

    const c = Number(cost);
    if (isNaN(c) || c <= 0) {
      setShowErrorPopup(true);
      return;
    }

    await createReward({
      title: title.trim(),
      description: description.trim() || undefined,
      cost: c
    });

    setTitle('');
    setDescription('');
    setCost('');

    Keyboard.dismiss();
    setShowSuccessPopup(true);
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
          { backgroundColor: colors.card, borderWidth: 0, borderColor: 'transparent' }
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

      {showSuccessPopup && (
        <View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <View
            style={{
              backgroundColor: colors.card,
              padding: 24,
              borderRadius: 12,
              width: '80%',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Prêmio cadastrado!
            </Text>

            <Text style={{ color: colors.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 20 }}>
              O novo prêmio foi registrado com sucesso.
            </Text>

            <TouchableOpacity
              onPress={() => setShowSuccessPopup(false)}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showErrorPopup && (
        <View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <View
            style={{
              backgroundColor: colors.card,
              padding: 24,
              borderRadius: 12,
              width: '80%',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: colors.danger, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Campos obrigatórios
            </Text>

            <Text style={{ color: colors.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 20 }}>
              Preencha título e custo antes de salvar.
            </Text>

            <TouchableOpacity
              onPress={() => setShowErrorPopup(false)}
              style={{
                backgroundColor: colors.danger,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
}
