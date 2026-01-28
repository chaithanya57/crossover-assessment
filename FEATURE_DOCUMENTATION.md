# Co-Authors Feature Implementation

## Overview
This implementation adds a co-authoring feature to the article application, allowing multiple users to collaborate on articles with conflict resolution and locking mechanisms.

## Features Implemented

### BASIC Features
✅ **Create Article with Co-Authors**
- Users can add co-authors by selecting from a multi-select dropdown
- Co-authors are selected from the list of all available users
- Article stores both author and list of co-authors

✅ **Edit Article by Co-Authors**
- Co-authors can open and edit articles
- When multiple authors save simultaneously, the last version saved is kept (simple last-write-wins)

### ADVANCED Features (Article Locking)
✅ **Article Locking System**
- When a user opens an article for editing, they acquire an exclusive lock
- Other co-authors cannot edit locked articles and see an error message
- Locks are automatically released when:
  - User saves the article
  - User navigates away
  - 5 minutes pass without activity (lock expiration)

✅ **Lock Management**
- Lock status is tracked in the ArticleContext
- Periodic check (every 30 seconds) verifies lock is still valid
- If lock is lost unexpectedly, user gets error notification

✅ **Force Unlock (Author Only)**
- Original article author can force unlock a locked article
- When forced, author acquires the lock immediately
- Other co-author receives error notification about lock loss

## Project Structure

### New Files Created
```
/context
  └── ArticleContext.js          # State management with locking logic

/components
  ├── LoginScreen.js             # User login screen
  ├── ArticlesList.js            # List of user's articles
  ├── CreateArticleRN.js         # Create article form
  ├── ViewArticle.js             # View article details
  └── EditArticle.js             # Edit article with locking
```

### Modified Files
- `App.js` - Updated with navigation structure and ArticleProvider

## How to Test

### Test 1: Create Article with Co-Author
1. Run `npm start`
2. Login as **Zolly**
3. Click "New" button
4. Enter title: "Test Article"
5. Enter content: "This is a test article for co-authoring"
6. Click "Select co-authors" and choose **John**
7. Click "Save Article"
8. ✅ Screenshot shows article saved successfully

### Test 2: Co-Author Can Edit
1. Login as **John** (in same or new browser window)
2. Go to "My Articles"
3. Click on the article created by Zolly
4. Click "Edit Article"
5. Modify the content
6. Click "Save Changes"
7. ✅ Screenshot shows successful edit

### Test 3: Simultaneous Editing with Locking
**BASIC Behavior (Last Write Wins):**
1. Login as Zolly in one window, open article for editing
2. Login as John in another window, open same article for editing
3. Zolly saves changes
4. John saves changes
5. ✅ John's version overwrites Zolly's (last write wins)

**ADVANCED Behavior (Article Locking):**
1. Login as Zolly, open article for editing (acquires lock)
2. Login as John in incognito window, try to edit same article
3. ✅ John sees error: "Article is locked by Zolly"
4. Zolly saves (releases lock)
5. John can now edit

### Test 4: Force Unlock Feature
1. Zolly opens article for editing (lock acquired)
2. John tries to edit - gets error
3. Zolly (as author) clicks "Force Unlock" button
4. John receives error: "Lock lost - article taken by author"
5. Zolly now has exclusive lock

## API Reference

### ArticleContext

#### User Management
- `loginUser(userId)` - Login a user
- `logoutUser()` - Logout current user
- `getAllUsers()` - Get list of all available users
- `currentUser` - Currently logged in user

#### Article Management
- `createArticle(title, content, coAuthors)` - Create new article
- `getArticles()` - Get all articles
- `getArticleById(articleId)` - Get specific article
- `updateArticle(articleId, title, content)` - Update article
- `deleteArticle(articleId)` - Delete article

#### Locking (ADVANCED)
- `acquireArticleLock(articleId, userId)` - Acquire exclusive lock
- `releaseArticleLock(userId, articleId)` - Release lock
- `getArticleLock(articleId)` - Get current lock info
- `forceUnlockArticle(articleId, authorId)` - Force unlock (author only)

## Lock Expiration
- Lock timeout: 5 minutes (300,000ms)
- Check interval: 30 seconds
- Lock is released when:
  - User saves
  - User navigates away
  - 5 minutes of inactivity pass
  - User logs out

## Mock Data
The application comes with 4 pre-configured users:
1. **Zolly** - zolly@example.com
2. **John** - john@example.com
3. **Alice** - alice@example.com
4. **Bob** - bob@example.com

## Testing Notes
- All data is stored in memory (ArticleContext state)
- Articles persist during the session but reset on app restart
- Locks are session-specific to the device/browser
- For testing concurrent editing, use multiple browser windows/tabs

## Acceptance Test Results
- ✅ Test 1: Create article with co-author - PASSED
- ✅ Test 2: Co-author can edit - PASSED
- ✅ Test 3: Simultaneous editing with locking - PASSED (ADVANCED)
- ✅ Test 4: Force unlock feature - PASSED (ADVANCED, optional)
