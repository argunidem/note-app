import { createContext, useState, useContext, useEffect } from 'react';
import ToggleContext from './ToggleContext';

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const { setShowForm } = useContext(ToggleContext);

  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({
    id: 0,
    title: '',
    message: '',
  });

  useEffect(() => {
    getNotes();
  }, []);

  const url = 'https://tet-api.onrender.com/notes';

  const getNotes = async () => {
    const res = await fetch(`${url}?_sort=id&_order=desc`);
    const data = await res.json();
    setNotes(data);
    setLoading(false);
  };

  const addNote = async (newNote) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    });
    const data = await res.json();

    setNotes([data, ...notes]);
  };

  const deleteNote = async (id) => {
    await fetch(`${url}/${id}`, {
      method: 'DELETE',
    });

    setNotes(notes.filter((item) => item.id !== id));
  };

  const updateNote = async (id, updatedNote) => {
    const res = await fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNote),
    });

    const data = await res.json();

    setNotes(notes.map((item) => (item.id === id ? data : item)));
  };

  const changeHandler = (e) => {
    const { value, name } = e.target;

    setNote({
      ...note,
      [name]: value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // setNotes([...notes, note]);
    addNote(note);
    setNote({
      title: '',
      message: '',
    });
    setShowForm((prev) => !prev);
  };

  return (
    <NoteContext.Provider
      value={{
        note,
        notes,
        loading,
        changeHandler,
        submitHandler,
        deleteNote,
        updateNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export default NoteContext;
