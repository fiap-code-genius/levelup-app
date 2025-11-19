import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16
  },
  taskCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 12
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  taskDesc: {
    fontSize: 13,
    marginBottom: 8
  },
  taskPoints: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  button: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14
  }
});
