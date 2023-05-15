import { useState, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Fab } from '@mui/material';
import Narbar from './Navbar';
import AuthModal from '../modal/auth/AuthModal';
import CommentModal from '../modal/comment/CommentModal';
import SnackBarMessage from '../SnackBarMessage';
import GlobalContext from '../context/GlobalContext';
import { QueryClientProvider } from 'react-query';
import { QueryClient } from 'react-query';

const Layout = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [status, setStatus] = useState();
  const handleOpen = () => setOpenLoginModal(true);
  const handleClose = () => setOpenLoginModal(false);

  const handleCommentOpen = () => setOpenCommentModal(true);
  const handleCommentClose = () => setOpenCommentModal(false);
  const [user, setUser] = useState();
  const queryClient = new QueryClient();
  const globalContextValue = useMemo(() => {
    return {
        user,
        setUser,
        setStatus,
    };
}, [user]);

  const generatekey = () => {
    return Math.random();
  };

  return (
    <GlobalContext.Provider value={globalContextValue}>
      <QueryClientProvider client={queryClient}>
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg,#FFFEE0, #FFC8DD, #C2D3FF, #D7FFF5)',
        backgroundSize: '300% 300%',
        animation: 'gradient 15s ease infinite',
        $: {
          '@keyframes gradient': {
            '0%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
            '100%': {
              backgroundPosition: '0% 50%',
            },
          },
        },
      }}
    >
      <Fab
        onClick={handleCommentOpen}
        sx={{
          position: 'fixed',
          background: '#FFFFFF80',
          bottom: '2.5rem',
          right: '5rem',
        }}
        variant="extended"
      >
        Comment
      </Fab>
      <Container maxWidth="xl">
        <Narbar handleOpen={handleOpen} />
        <Outlet />
      </Container>
      <AuthModal open={openLoginModal} handleClose={handleClose} setStatus={setStatus} setUser={setUser} />
      <CommentModal open={openCommentModal} handleClose={handleCommentClose} />
      {status ? (
        <SnackBarMessage key={generatekey()} open={status.open} severity={status.severity} message={status.msg} />
      ) : null}
    </Box>
    </QueryClientProvider>
    </GlobalContext.Provider>
  );
};

export default Layout;
