import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Stack, Typography, Divider } from '@mui/material';
import CustomButton from '../../share/components/CustomButton';
import NoteEditModal from './components/NoteEditModal';
import Axios from '../../share/AxiosInstance';
import Cookies from 'js-cookie';
import { format } from 'fecha';
import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import GlobalContext from '../../share/context/GlobalContext';
import { useContext } from 'react';

const Note = () => {
  const navigate = useNavigate();
  const [note, setNote] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const{ noteId } = useParams();
  const { setStatus } = useContext(GlobalContext);

  useEffect(() => {
    // 1. call API to get a note
    const userToken = Cookies.get('UserToken');
      Axios.get(`/note/${noteId}`, { headers: { Authorization: `Bearer ${userToken}` 
} }).then((res) => {
        // 2. if success, set note to state
        setNote(res.data.data);
      });
  }, []);

  const handleNoteEditOpen = () => {
    setOpenEdit(true);
  };
  const handleNoteEditClose = () => {
    setOpenEdit(false);
  };

    // Delete Note
    const handleDelete = async () => {
      try {
        const userToken = Cookies.get('UserToken');
        const response = await Axios.delete(`/note/${note.id}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
  
        if (response.data.success) {
          // TODO: show status of success here
          setStatus({
            severity:'success',
            msg:'Delete note successfully'
          });
          navigate(-1);
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

  
  

 
  return (
    <Container maxWidth="md">
      <NoteEditModal note={note} open={openEdit} handleClose={handleNoteEditClose} setNote={setNote} />
      <Stack direction="row" justifyContent="space-between" alignItems="center" marginBottom={6}>
        <Typography fontSize={30}>{note.title}</Typography>
        <Typography fontSize={16} color="grey" fontWeight={300}>
          {note.updatedAt && format(new Date(note.updatedAt), 'DD/MM/YYYY hh:mm A')}
        </Typography>
      </Stack>
      <Typography fontSize={18} fontWeight={300} marginBottom={8}>
        {note.description}
      </Typography>
      <Divider light />
      <Stack direction="row" justifyContent="space-between" alignItems="center" marginTop={4}>
        <CustomButton text="Back" handle={() => navigate(-1)} fontSize={18} />
        <Stack direction="row" spacing={2}>
          <CustomButton text="Edit" handle={handleNoteEditOpen} fontSize={18} />
          <CustomButton text="Delete" handle={handleDelete} fontSize={18} />
        </Stack>
      </Stack>
    </Container>
  );
};

export default Note;
