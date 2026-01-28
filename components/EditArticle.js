import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native';
import {ArticleContext} from '../context/ArticleContext';

const EditArticle = ({route, navigation}) => {
  const {articleId} = route.params;
  const {
    getArticleById,
    updateArticle,
    currentUser,
    acquireArticleLock,
    releaseArticleLock,
    getArticleLock,
    forceUnlockArticle,
  } = useContext(ArticleContext);

  const [article, setArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showLockError, setShowLockError] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockedByUser, setLockedByUser] = useState(null);
  const lockCheckInterval = useRef(null);

  const checkLockStatus = useCallback(
    articleData => {
      // Check if user can edit this article
      const isAuthor = articleData.author.id === currentUser?.id;
      const isCoAuthor = articleData.coAuthors.some(
        ca => ca.id === currentUser?.id,
      );

      if (!isAuthor && !isCoAuthor) {
        Alert.alert(
          'Access Denied',
          'You are not authorized to edit this article',
        );
        navigation.goBack();
        return;
      }

      // Try to acquire lock (ADVANCED feature)
      const lockResult = acquireArticleLock(articleId, currentUser.id);

      if (!lockResult.success) {
        // Article is locked by someone else
        const locker =
          articleData.coAuthors.find(ca => ca.id === lockResult.lockedBy) ||
          (articleData.author.id === lockResult.lockedBy
            ? articleData.author
            : null);

        setIsLocked(true);
        setLockedByUser(locker);
        setShowLockError(true);
        return;
      }

      // Lock acquired successfully
      setIsLocked(false);

      // Set up periodic lock refresh and expiry check
      lockCheckInterval.current = setInterval(() => {
        const currentLock = getArticleLock(articleId);
        if (!currentLock) {
          // Lock expired or released
          setShowLockError(true);
          setIsLocked(true);
          Alert.alert(
            'Lock Lost',
            'Your lock on this article has been released. You cannot continue editing.',
            [{text: 'OK', onPress: () => navigation.goBack()}],
          );
        }
      }, 30000); // Check every 30 seconds
    },
    [articleId, currentUser, acquireArticleLock, getArticleLock, navigation],
  );

  useEffect(() => {
    const articleData = getArticleById(articleId);
    if (articleData) {
      setArticle(articleData);
      setTitle(articleData.title);
      setContent(articleData.content);

      // Check if can edit (for ADVANCED feature)
      checkLockStatus(articleData);
    }
  }, [articleId, getArticleById, checkLockStatus]);

  useEffect(() => {
    return () => {
      if (lockCheckInterval.current) {
        clearInterval(lockCheckInterval.current);
      }
      // Release lock when leaving
      if (currentUser) {
        releaseArticleLock(currentUser.id, articleId);
      }
    };
  }, [articleId, currentUser, releaseArticleLock]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation Error', 'Please fill in title and content');
      return;
    }

    updateArticle(articleId, title, content);
    releaseArticleLock(currentUser.id, articleId);

    Alert.alert('Success', 'Article updated successfully!', [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
  };

  const handleForceUnlock = () => {
    if (article.author.id !== currentUser?.id) {
      Alert.alert('Error', 'Only the original author can force unlock');
      return;
    }

    const result = forceUnlockArticle(articleId, currentUser.id);
    if (result.success) {
      Alert.alert('Success', 'Article lock released and acquired by you');
      setIsLocked(false);
      setShowLockError(false);
      checkLockStatus(article);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  if (!article) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading article...</Text>
      </View>
    );
  }

  const isAuthor = article.author.id === currentUser?.id;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Edit Article</Text>

        {/* Lock Status Display */}
        {isLocked && (
          <View style={styles.lockWarning}>
            <Text style={styles.lockWarningText}>
              🔒 This article is locked by{' '}
              {lockedByUser?.name || 'another user'}
            </Text>
          </View>
        )}

        {/* Article Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Author:</Text>
          <Text style={styles.infoText}>{article.author.name}</Text>

          {article.coAuthors.length > 0 && (
            <>
              <Text style={styles.infoLabel}>Co-Authors:</Text>
              {article.coAuthors.map(ca => (
                <Text key={ca.id} style={styles.infoText}>
                  • {ca.name} ({ca.email})
                </Text>
              ))}
            </>
          )}
        </View>

        {/* Title Field */}
        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter article title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            editable={!isLocked}
          />
        </View>

        {/* Content Field */}
        <View style={styles.section}>
          <Text style={styles.label}>Content *</Text>
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Write your article content here..."
            placeholderTextColor="#999"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={8}
            editable={!isLocked}
          />
        </View>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version: {article.version}</Text>
          <Text style={styles.versionText}>
            Last updated: {article.updatedAt?.toLocaleDateString() || 'N/A'}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {!isLocked && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}

          {isAuthor && (
            <TouchableOpacity
              style={[styles.unlockButton, !isLocked && styles.hidden]}
              onPress={handleForceUnlock}>
              <Text style={styles.unlockButtonText}>Force Unlock (Author)</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>
              {isLocked ? 'Go Back' : 'Cancel'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Lock Error Modal */}
      <Modal
        visible={showLockError && isLocked}
        transparent
        animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Article Locked</Text>
            <Text style={styles.modalText}>
              This article is currently being edited by {lockedByUser?.name}.
              You cannot make changes until they finish editing.
            </Text>
            {isAuthor && (
              <TouchableOpacity
                style={styles.forceUnlockButton}
                onPress={handleForceUnlock}>
                <Text style={styles.forceUnlockText}>
                  Force Unlock (Author Only)
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setShowLockError(false);
                navigation.goBack();
              }}>
              <Text style={styles.modalCloseText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    marginTop: 8,
  },
  lockWarning: {
    backgroundColor: '#5a3a2a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  lockWarningText: {
    color: '#ffb3b3',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#0f3a52',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7dd3fc',
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#3a5a6c',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    backgroundColor: '#0f3a52',
    fontSize: 14,
  },
  contentInput: {
    minHeight: 150,
    textAlignVertical: 'top',
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
  buttonContainer: {
    marginBottom: 32,
  },
  saveButton: {
    backgroundColor: '#1a7f9a',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  unlockButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hidden: {
    display: 'none',
  },
  cancelButton: {
    backgroundColor: '#3a5a6c',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#0f3a52',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
    lineHeight: 20,
  },
  forceUnlockButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  forceUnlockText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: '#3a5a6c',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  modalCloseText: {
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

export default EditArticle;
