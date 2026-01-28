import React, { useState } from 'react';

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coAuthors, setCoAuthors] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const coAuthorsArray = coAuthors.split(',').map(email => email.trim());
    console.log('Article submitted:', { title, content, coAuthors: coAuthorsArray });
    alert('Article saved! Check console for co-authors.');
  };

  return (
    <div>
      <h2>Create Article</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label><br/>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /><br/><br/>

        <label>Content:</label><br/>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea><br/><br/>

        <label>Co-Authors (comma-separated emails):</label><br/>
        <input
          type="text"
          value={coAuthors}
          onChange={(e) => setCoAuthors(e.target.value)}
        /><br/><br/>

        <button type="submit">Save Article</button>
      </form>
    </div>
  );
};

export default CreateArticle;
