import React, {createContext, useState, useCallback} from 'react';

export const ArticleContext = createContext();

// Mock users database
const MOCK_USERS = [
  {id: '1', name: 'Zolly', email: 'zolly@example.com'},
  {id: '2', name: 'John', email: 'john@example.com'},
  {id: '3', name: 'Alice', email: 'alice@example.com'},
  {id: '4', name: 'Bob', email: 'bob@example.com'},
];

// Mock articles database
const MOCK_ARTICLES = [];

export const ArticleProvider = ({children}) => {
  const [articles, setArticles] = useState(MOCK_ARTICLES);
  const [currentUser, setCurrentUser] = useState(null);
  const [articleLocks, setArticleLocks] = useState({}); // { articleId: { userId, timestamp, isActive } }

  // User authentication
  const loginUser = useCallback(userId => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      return user;
    }
  }, []);

  const logoutUser = useCallback(() => {
    if (currentUser) {
      // Release any locks held by this user
      setArticleLocks(prev => {
        const updated = {...prev};
        Object.keys(updated).forEach(id => {
          if (updated[id]?.userId === currentUser.id) {
            delete updated[id];
          }
        });
        return updated;
      });
    }
    setCurrentUser(null);
  }, [currentUser]);

  const getAllUsers = useCallback(() => {
    return MOCK_USERS;
  }, []);

  // Article management
  const createArticle = useCallback(
    (title, content, coAuthors = []) => {
      if (!currentUser) return null;

      const article = {
        id: Date.now().toString(),
        title,
        content,
        author: currentUser,
        coAuthors, // Array of user objects
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      };

      setArticles(prev => [...prev, article]);
      return article;
    },
    [currentUser],
  );

  const getArticles = useCallback(() => {
    return articles;
  }, [articles]);

  const getArticleById = useCallback(
    articleId => {
      return articles.find(a => a.id === articleId);
    },
    [articles],
  );

  const updateArticle = useCallback((articleId, title, content) => {
    setArticles(prev =>
      prev.map(article =>
        article.id === articleId
          ? {
              ...article,
              title,
              content,
              updatedAt: new Date(),
              version: article.version + 1,
            }
          : article,
      ),
    );
  }, []);

  const deleteArticle = useCallback(articleId => {
    setArticles(prev => prev.filter(a => a.id !== articleId));
    // Release lock if exists
    setArticleLocks(prev => {
      const updated = {...prev};
      if (updated[articleId]) {
        delete updated[articleId];
      }
      return updated;
    });
  }, []);

  // Article locking (ADVANCED feature)
  const acquireArticleLock = useCallback(
    (articleId, userId) => {
      const existingLock = articleLocks[articleId];

      // Check if article is already locked by someone else
      if (
        existingLock &&
        existingLock.isActive &&
        existingLock.userId !== userId
      ) {
        return {success: false, lockedBy: existingLock.userId};
      }

      // Acquire lock
      setArticleLocks(prev => ({
        ...prev,
        [articleId]: {
          userId,
          timestamp: Date.now(),
          isActive: true,
        },
      }));

      return {success: true};
    },
    [articleLocks],
  );

  const releaseArticleLock = useCallback((userId, articleId = null) => {
    setArticleLocks(prev => {
      const updated = {...prev};

      if (articleId) {
        // Release specific article lock
        if (updated[articleId]?.userId === userId) {
          delete updated[articleId];
        }
      } else {
        // Release all locks held by user
        Object.keys(updated).forEach(id => {
          if (updated[id]?.userId === userId) {
            delete updated[id];
          }
        });
      }

      return updated;
    });
  }, []);

  const getArticleLock = useCallback(
    articleId => {
      const lock = articleLocks[articleId];
      if (!lock || !lock.isActive) return null;

      // Check if lock has expired (5 minutes = 300000ms)
      const lockAge = Date.now() - lock.timestamp;
      if (lockAge > 300000) {
        // Lock expired, remove it
        releaseArticleLock(lock.userId, articleId);
        return null;
      }

      return lock;
    },
    [articleLocks, releaseArticleLock],
  );

  const forceUnlockArticle = useCallback(
    (articleId, authorId) => {
      const article = getArticleById(articleId);
      if (!article || article.author.id !== authorId) {
        return {success: false, error: 'Only original author can force unlock'};
      }

      const currentLock = articleLocks[articleId];
      if (currentLock) {
        releaseArticleLock(currentLock.userId, articleId);
        // Acquire lock for the author
        acquireArticleLock(articleId, authorId);
        return {success: true, formerLockHolder: currentLock.userId};
      }

      return {success: false, error: 'No active lock'};
    },
    [articleLocks, getArticleById, releaseArticleLock, acquireArticleLock],
  );

  const value = {
    // User management
    currentUser,
    loginUser,
    logoutUser,
    getAllUsers,

    // Article management
    createArticle,
    getArticles,
    getArticleById,
    updateArticle,
    deleteArticle,

    // Article locking
    acquireArticleLock,
    releaseArticleLock,
    getArticleLock,
    forceUnlockArticle,
  };

  return (
    <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>
  );
};
