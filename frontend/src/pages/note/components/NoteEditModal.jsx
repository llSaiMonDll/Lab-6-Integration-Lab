import { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import Axios from '../../../share/AxiosInstance';
import { useContext } from 'react';
import GlobalContext from '../../../share/context/GlobalContext';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const NoteEditModal = ({ note = {}, open = false, handleClose = () => {}, setNote = () => {} }) => {
  const [newNote, setNewNote] = useState(note);
  const [error, setError] = useState({});
  const { user, setStatus } = useContext(GlobalContext);

  useEffect(() => {
    setNewNote(note);
  }, [note]);

  const submit = async () => {
    if (!validateForm()) return;
    try {
      const userToken = Cookies.get('UserToken');
      const response = await Axios.patch(
        '/note',
        {
          title: newNote.title,
          description: newNote.description,
          noteId: newNote.id,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      if (response.data.success) {
        // TODO: show status of success here
        setStatus({severity:'success',msg:'Update note successfully' });
        setNote(response.data.data);
        resetAndClose();
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // TODO: show status of error from AxiosError here
        setStatus({
          severity:'error',
          msg:error.response.data.error
        });
      } else {
        // TODO: show status of other errors here
        setStatus({
          severity:'error',
          msg:error.message
        });
      }
    }
  };

  const resetAndClose = () => {
    setNewNote(note);
    setError({});
    handleClose();
  };

  const handleChange = (e) => {
    setNewNote({
      ...newNote,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const error = {};
    if (!newNote.title) error.title = 'Title is required';
    if (!newNote.description) error.description = 'Description is required';
    setError(error);

    if (Object.keys(error).length) return false;
    return true;
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={resetAndClose}>
      <DialogTitle>Edit Note</DialogTitle>
      <DialogContent>
        <TextField
          required
          margin="dense"
          id="title"
          name="title"
          label="Title"
          fullWidth
          variant="outlined"
          value={newNote.title}
          onChange={handleChange}
          error={!!error.title}
          helperText={error.title}
        />
        <TextField
          required
          multiline
          margin="dense"
          id="description"
          name="description"
          label="Description"
          placeholder="Write your note here..."
          fullWidth
          value={newNote.description}
          onChange={handleChange}
          error={!!error.description}
          helperText={error.description}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={resetAndClose} color="error" sx={{ textTransform: 'capitalize' }}>
          Cancel
        </Button>
        <Button onClick={submit} type="submit" sx={{ textTransform: 'capitalize' }}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteEditModal;
