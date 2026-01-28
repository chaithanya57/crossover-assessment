import React, {useContext, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {ArticleContext} from '../context/ArticleContext';

const ArticlesList = ({navigation}) => {
  const {getArticles, currentUser} = useContext(ArticleContext);
  const articles = getArticles();

  // Filter articles that belong to current user (authored or co-authored)
  const userArticles = useMemo(() => {
    if (!currentUser) {
      return [];
    }
    return articles.filter(
      a =>
        a.author.id === currentUser.id ||
        a.coAuthors.some(ca => ca.id === currentUser.id),
    );
  }, [articles, currentUser]);

  const renderArticle = ({item}) => {
    const isAuthor = item.author.id === currentUser?.id;
    const previewText =
      item.content.substring(0, 60) + (item.content.length > 60 ? '...' : '');

    return (
      <TouchableOpacity
        style={styles.articleCard}
        onPress={() =>
          navigation.navigate('ViewArticle', {articleId: item.id})
        }>
        <View style={styles.cardHeader}>
          <Text style={styles.articleTitle}>{item.title}</Text>
          {isAuthor && <Text style={styles.authorBadge}>Author</Text>}
        </View>
        <Text style={styles.articlePreview}>{previewText}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.authorName}>{item.author.name}</Text>
          {item.coAuthors.length > 0 && (
            <Text style={styles.coAuthorCount}>
              +{item.coAuthors.length} co-author
              {item.coAuthors.length > 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Articles</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateArticle')}>
          <Text style={styles.createButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {userArticles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No articles yet</Text>
          <TouchableOpacity
            style={styles.createArticleButton}
            onPress={() => navigation.navigate('CreateArticle')}>
            <Text style={styles.createArticleButtonText}>
              Create Your First Article
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={userArticles}
          keyExtractor={article => article.id}
          renderItem={renderArticle}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#082434',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a5a6c',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#1a7f9a',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 12,
  },
  articleCard: {
    backgroundColor: '#0f3a52',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a5a6c',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  authorBadge: {
    backgroundColor: '#1a7f9a',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  articlePreview: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 12,
    color: '#7dd3fc',
    fontWeight: '500',
  },
  coAuthorCount: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 20,
  },
  createArticleButton: {
    backgroundColor: '#1a7f9a',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  createArticleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ArticlesList;
