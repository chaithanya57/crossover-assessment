import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import {ArticleContext} from '../context/ArticleContext';

const ViewArticle = ({route, navigation}) => {
  const {articleId} = route.params;
  const {getArticleById, currentUser, deleteArticle} =
    useContext(ArticleContext);

  const [article, setArticle] = useState(null);

  useEffect(() => {
    const articleData = getArticleById(articleId);
    if (articleData) {
      setArticle(articleData);
    } else {
      Alert.alert('Error', 'Article not found', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    }
  }, [articleId, getArticleById, navigation]);

  const canEdit =
    article &&
    (article.author.id === currentUser?.id ||
      article.coAuthors.some(ca => ca.id === currentUser?.id));

  const canDelete = article && article.author.id === currentUser?.id;

  const handleEdit = () => {
    if (canEdit) {
      navigation.navigate('EditArticle', {articleId});
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Article',
      'Are you sure you want to delete this article?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteArticle(articleId);
            navigation.goBack();
          },
          style: 'destructive',
        },
      ],
    );
  };

  if (!article) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading article...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>{article.title}</Text>

        {/* Author Info */}
        <View style={styles.authorInfo}>
          <Text style={styles.authorLabel}>By {article.author.name}</Text>
          <Text style={styles.dateText}>
            {article.createdAt?.toLocaleDateString() || 'N/A'}
          </Text>
        </View>

        {/* Co-Authors */}
        {article.coAuthors.length > 0 && (
          <View style={styles.coAuthorsSection}>
            <Text style={styles.coAuthorsLabel}>Co-Authors:</Text>
            {article.coAuthors.map(ca => (
              <Text key={ca.id} style={styles.coAuthorText}>
                • {ca.name}
              </Text>
            ))}
          </View>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Content */}
        <Text style={styles.content}>{article.content}</Text>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version {article.version}</Text>
          <Text style={styles.versionText}>
            Last modified: {article.updatedAt?.toLocaleDateString() || 'N/A'}
          </Text>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        {canEdit && (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Edit Article</Text>
          </TouchableOpacity>
        )}

        {canDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#082434',
  },
  scrollView: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    marginTop: 8,
  },
  authorInfo: {
    marginBottom: 12,
  },
  authorLabel: {
    fontSize: 14,
    color: '#7dd3fc',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  coAuthorsSection: {
    backgroundColor: '#0f3a52',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#7dd3fc',
  },
  coAuthorsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7dd3fc',
    marginBottom: 8,
  },
  coAuthorText: {
    fontSize: 13,
    color: '#ccc',
    marginVertical: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#3a5a6c',
    marginVertical: 16,
  },
  content: {
    fontSize: 15,
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 20,
  },
  versionInfo: {
    backgroundColor: '#0f3a52',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    marginVertical: 4,
  },
  spacer: {
    height: 80,
  },
  actionBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#0f3a52',
    borderTopWidth: 1,
    borderTopColor: '#3a5a6c',
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#1a7f9a',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#3a5a6c',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default ViewArticle;
