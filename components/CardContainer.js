import React, {useEffect} from 'react';
import {View, Text, FlatList} from 'react-native';
import {useState} from 'react';
import Flashcard from './Flashcard';

function CardContainer() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardCollection = [];

  useEffect(() => {
    fetch('https://cross-platform.rp.devfactory.com/following')
      .then(res => res.json())
      .then(data => setCards(data));
  }, []);

  return (
    <View>
      <FlatList
        data={cards}
        key={({id}) => id}
        renderItem={({item}) => <Text>{item.flashcard_front}</Text>}
      />
    </View>
  );
}

export default CardContainer;
