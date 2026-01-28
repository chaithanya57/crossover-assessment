import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ArticleProvider, ArticleContext} from './context/ArticleContext';

import LoginScreen from './components/LoginScreen';
import ArticlesList from './components/ArticlesList';
import CreateArticle from './components/CreateArticleRN';
import ViewArticle from './components/ViewArticle';
import EditArticle from './components/EditArticle';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: '#0f3a52',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  cardStyle: {
    backgroundColor: '#082434',
  },
};

function AppNavigator() {
  const {currentUser} = useContext(ArticleContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {!currentUser ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
        ) : (
          <>
            <Stack.Screen
              name="ArticlesList"
              component={ArticlesList}
              options={{title: 'Articles'}}
            />
            <Stack.Screen
              name="CreateArticle"
              component={CreateArticle}
              options={{title: 'Create Article'}}
            />
            <Stack.Screen
              name="ViewArticle"
              component={ViewArticle}
              options={{title: 'Article'}}
            />
            <Stack.Screen
              name="EditArticle"
              component={EditArticle}
              options={{title: 'Edit Article'}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <ArticleProvider>
      <AppNavigator />
    </ArticleProvider>
  );
}

export default App;
