import React, {useState, useContext, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import {ArticleContext} from '../context/ArticleContext';

const CreateArticle = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCoAuthors, setSelectedCoAuthors] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {createArticle, currentUser, getAllUsers} = useContext(ArticleContext);
  const allUsers = getAllUsers();

  // Filter users (exclude current user)
  const availableUsers = useMemo(() => {
    return allUsers.filter(u => u.id !== currentUser?.id);
  }, [allUsers, currentUser]);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery) {
      return availableUsers;
    }
    return availableUsers.filter(
      u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [availableUsers, searchQuery]);

  const toggleCoAuthor = user => {
    setSelectedCoAuthors(prev => {
      const exists = prev.find(u => u.id === user.id);
      if (exists) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation Error', 'Please fill in title and content');
      return;
    }

    const article = createArticle(title, content, selectedCoAuthors);

    if (article) {
      Alert.alert(
        'Success',
        `Article "${article.title}" created successfully!`,
        [
          {
            text: 'OK',
            onPress: () => {
              setTitle('');
              setContent('');
              setSelectedCoAuthors([]);
              navigation.goBack();
            },
          },
        ],
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create New Article</Text>

      {/* Title Field */}
      <View style={styles.section}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter article title"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
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
          numberOfLines={6}
        />
      </View>

      {/* Co-Authors Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Co-Authors (ADVANCED)</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowUserModal(true)}>
          <Text style={styles.selectButtonText}>
            {selectedCoAuthors.length === 0
              ? 'Select co-authors...'
              : `${selectedCoAuthors.length} selected`}
          </Text>
        </TouchableOpacity>

        {/* Selected Co-Authors Display */}
        {selectedCoAuthors.length > 0 && (
          <View style={styles.selectedAuthorsContainer}>
            {selectedCoAuthors.map(author => (
              <View key={author.id} style={styles.selectedAuthorTag}>
                <Text style={styles.selectedAuthorText}>{author.name}</Text>
                <TouchableOpacity onPress={() => toggleCoAuthor(author)}>
                  <Text style={styles.removeButton}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save Article</Text>
      </TouchableOpacity>

      {/* User Selection Modal */}
      <Modal
        visible={showUserModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowUserModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Co-Authors</Text>
            <TouchableOpacity onPress={() => setShowUserModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search Field */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name or email..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Users List */}
          <FlatList
            data={filteredUsers}
            keyExtractor={u => u.id}
            renderItem={({item}) => {
              const isSelected = selectedCoAuthors.some(u => u.id === item.id);
              return (
                <TouchableOpacity
                  style={[
                    styles.userItem,
                    isSelected && styles.userItemSelected,
                  ]}
                  onPress={() => toggleCoAuthor(item)}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                  </View>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              );
            }}
          />

          {/* Done Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setShowUserModal(false)}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#082434',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    marginTop: 16,
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
    minHeight: 120,
    textAlignVertical: 'top',
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#3a5a6c',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#0f3a52',
  },
  selectButtonText: {
    color: '#ccc',
    fontSize: 14,
  },
  selectedAuthorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  selectedAuthorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a5a7f',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedAuthorText: {
    color: '#fff',
    fontSize: 12,
    marginRight: 8,
  },
  removeButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#1a7f9a',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#082434',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a5a6c',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  searchInput: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#3a5a6c',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    backgroundColor: '#0f3a52',
    fontSize: 14,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f5a6f',
  },
  userItemSelected: {
    backgroundColor: '#1a3a4f',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  userEmail: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    color: '#1a7f9a',
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#1a7f9a',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateArticle;
