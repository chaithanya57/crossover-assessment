import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {ArticleContext} from '../context/ArticleContext';

const LoginScreen = ({navigation}) => {
  const {loginUser, getAllUsers} = useContext(ArticleContext);
  const users = getAllUsers();

  const handleLogin = userId => {
    loginUser(userId);
    navigation.reset({
      index: 0,
      routes: [{name: 'ArticlesList'}],
    });
  };

  const renderUser = ({item}) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => handleLogin(item.id)}>
      <View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>{item.name[0]}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <Text style={styles.loginArrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Articles & Co-Authors</Text>
        <Text style={styles.subtitle}>Select a user to login</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={user => user.id}
        renderItem={renderUser}
        contentContainerStyle={styles.usersList}
        scrollEnabled={false}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Demo: ADVANCED Feature</Text>
        <Text style={styles.footerSubtext}>
          Article locking enabled • Concurrent editing prevention
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#082434',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3a5a6c',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7dd3fc',
  },
  usersList: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f3a52',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a5a6c',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1a7f9a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: '#999',
  },
  loginArrow: {
    fontSize: 24,
    color: '#1a7f9a',
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#3a5a6c',
  },
  footerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7dd3fc',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#999',
  },
});

export default LoginScreen;
