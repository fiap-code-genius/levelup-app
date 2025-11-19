import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useAuth } from '../../context/AuthContext';
import { useThemeColors } from '../../context/ThemeContext';
import { Reward } from '../../services/storage';
import { styles } from './styles';

export default function RewardsScreen() {
  const { rewards, currentUser, redeemReward } = useAuth();
  const colors = useThemeColors();

  const confettiRef = useRef<ConfettiCannon | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleRedeem = (rewardId: string) => {
    confettiRef.current?.start();
    setShowPopup(true);
    redeemReward(rewardId);
  };

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
          onPress={() => handleRedeem(item.id)}
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
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: 70 }
      ]}
    >
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

      <ConfettiCannon
        ref={confettiRef}
        count={60}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        fadeOut
      />

      <Modal transparent visible={showPopup} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center'
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
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10
              }}
            >
              Resgate realizado!
            </Text>

            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 15,
                textAlign: 'center',
                marginBottom: 20
              }}
            >
              Você receberá mais informações sobre o resgate por e-mail.
            </Text>

            <TouchableOpacity
              onPress={() => setShowPopup(false)}
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
      </Modal>
    </View>
  );
}
