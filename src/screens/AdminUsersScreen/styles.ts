import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16
  },
  card: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 14
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center'
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600'
  },
  button: {
    marginTop: 6,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700'
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  name: {
    fontSize: 16,
    fontWeight: '600'
  },
  email: {
    fontSize: 13,
    marginTop: 2
  },
  role: {
    fontSize: 12,
    marginTop: 2
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '700'
  }
});
