import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);
  
  const fetchNotes = async () => {
    try {
      const res = await axios.get('/api/notes/get');
      setNotes(res.data);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required");
      return;
    }
    setError(null);

    try {
      const res = await axios.post('/api/notes/create', { title, content });
      setNotes([res.data, ...notes]);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create note");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/notes/delete/${id}`);
      setNotes(notes.filter(note => note._id !== id));
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleUpdate = async (id) => {
    if (!editTitle || !editContent) return;
    try {
      const res = await axios.put(`/api/notes/update/${id}`, { 
        title: editTitle, 
        content: editContent 
      });
      setNotes(notes.map(note => {
  if (note._id === id) {
    return res.data; 
  } else {
    return note;     
  }
}));

      cancelEdit();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />
      <div className="p-4 max-w-5xl mx-auto">
        <div className="bg-gray-800 p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-white">Create a Note</h2>
          {error && <div className="text-red-400 mb-2">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Title"
              className="p-3 border border-gray-600 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Content"
              className="p-3 border border-gray-600 bg-gray-900 text-white placeholder-gray-500 min-h-[120px] focus:outline-none focus:border-gray-400 transition-colors"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button type="submit" className="bg-gray-700 border border-gray-600 text-white p-3 font-bold hover:bg-gray-600 transition-colors mt-2">
              Submit Note
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-white">Your Notes</h2>

          <div className="flex flex-wrap gap-4">
            {notes.map(note => (
              <div key={note._id} className="bg-gray-800 p-5 border border-gray-700 flex-grow basis-[calc(50%-1rem)] lg:basis-[calc(33.333%-1rem)] flex flex-col justify-between">
                {editingId === note._id ? (
                  <div className="flex flex-col gap-3 h-full">
                    <input
                      type="text"
                      className="p-2 border border-gray-600 bg-gray-900 text-white focus:outline-none focus:border-gray-400"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea
                      className="p-2 border border-gray-600 bg-gray-900 text-white min-h-[100px] focus:outline-none focus:border-gray-400 flex-grow"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    ></textarea>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleUpdate(note._id)} className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white px-3 py-2 font-bold flex-1 transition-colors">Save</button>
                      <button onClick={cancelEdit} className="bg-gray-900 hover:bg-gray-700 border border-gray-600 text-white px-3 py-2 font-bold flex-1 transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 break-words">{note.title}</h3>
                      <p className="text-gray-300 whitespace-pre-wrap break-words">{note.content}</p>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                      <button onClick={() => startEdit(note)} className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Edit</button>
                      <button onClick={() => handleDelete(note._id)} className="text-red-400 hover:text-red-300 transition-colors text-sm font-bold ml-auto">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {notes.length === 0 && (
              <p className="text-gray-400">No notes yet. Create one above!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;  