import { useEffect, useState, useContext } from 'react';
import { Stack, Container, Typography, Grid } from '@mui/material';
import CustomButton from '../../share/components/CustomButton';
import NoteCard from './components/NoteCard';
import NoteCreateModal from './components/NoteCreateModal';
import Axios from '../../share/AxiosInstance';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import GlobalContext from '../../share/context/GlobalContext';

const Home = ({}) => {
  const [openCreate, setOpenCreate] = useState(false);
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();  
  const {user, setStatus} = useContext(GlobalContext);


  useEffect(() => {
    const userToken = Cookies.get('UserToken');
    if (userToken !== undefined && userToken !== 'undefined') {
      Axios.get('/notes', { headers: { Authorization: `Bearer ${userToken}` } }).then((res) => {
        setNotes(res.data.data);
      });
    }
  }, []);


  const handleNoteCreateOpen = () => {
    // TODO: check if user is logged in before open modal
    if(!user){
      setStatus({
        msg: "You must login to create note",
        severity: "error",
      });
    }
    else {
      setOpenCreate(true);
    }
    setTimeout(() => setStatus(), 1000);
  };

  

  
  const handleNoteCreateClose = () => {
    setOpenCreate(false);
  };

  return (
    <Container maxWidth="md">
      <NoteCreateModal open={openCreate} handleClose={handleNoteCreateClose} setNotes={setNotes} />
      <Stack direction="row" justifyContent="space-between" alignItems="center" marginBottom={4}>
        <Typography fontSize={30}>Your notes</Typography>
        <CustomButton text="Create note" handle={handleNoteCreateOpen} fontSize={18} />
      </Stack>
      {user ? (
        notes.length === 0 ? (
          <Typography textAlign="center" fontSize={18} color="white" fontWeight={300} marginTop={8}>
            No note to show... <br />
            Let's create a new note.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {notes.map((note, index) => (
              <Grid item xs={4} key={index}>
                <NoteCard title={note.title} date={note.updatedAt} handleClick={() => navigate(`/note/${note.id}`)} />
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        <Typography textAlign="center" fontSize={18} color="white" fontWeight={300} marginTop={8}>
          No note to show... <br />
          Please login to create a new note.
        </Typography>
      )}
    </Container>
  );
};

export default Home;
