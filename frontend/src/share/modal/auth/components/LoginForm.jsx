import { Box, Link, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useContext } from 'react';
import GlobalContext from '../../../context/GlobalContext';
import { useMutation } from 'react-query';
import Axios from '../../../AxiosInstance';

const LoginForm = ({ handleClose = () => {}, setIsLogin = () => {} }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [usernameOrEmailError, setUsernameOrEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { setUser, setStatus } = useContext(GlobalContext);

  const loginMutation = useMutation (() => 
    Axios.post('/login', {
      usernameOrEmail,
      password,
    }),
    {
      onSuccess: (data) => {
        if(data.data.success) {
          setUser({
            username: data.data.username,
            email: data.data.email,
          });
          handleClose();
          setStatus({
            msg: data.data.msg,
            severity: 'success',
          });
        }
      },
      onError: (error) => {
        setUsernameOrEmail('');
        setPassword('');
        if(error instanceof AxiosError)
          if(error.response)
            return setStatus({
              msg: error.response.data.error,
              severity: 'error',
            });
            return setStatus({
              msg: error.message,
              severity: 'error',
            });
      },
    }
  );

  const handleSubmit = () => {
    if(!validateForm()) return ;
      loginMutation.mutate();
  };

  const validateForm = () => {
    let isValid = true;
    if (!usernameOrEmail) {
      setUsernameOrEmailError('Username or email is required');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    return isValid;
  };
  return (
    <Box
      sx={{
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 4,
      }}
    >
      <Typography fontSize="1.25rem" fontWeight="400">
        CSC105 integration!
      </Typography>
      <Typography fontSize="2.5rem" fontWeight="700">
        Login
      </Typography>
      <TextField
        value={usernameOrEmail}
        onChange={(e) => setUsernameOrEmail(e.target.value)}
        fullWidth
        error={usernameOrEmailError !== ''}
        helperText={usernameOrEmailError}
        label="Username or Email"
        placeholder="Type your username or email"
      />
      <TextField
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        error={passwordError !== ''}
        helperText={passwordError}
        label="Password"
        type="password"
        placeholder="Type your password"
      />
      <Link color="#999999" sx={{ alignSelf: 'end', cursor: 'pointer' }} onClick={() => setIsLogin(false)}>
        No account?
      </Link>
      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '.25rem',
          fontSize: '1.5rem',
          borderRadius: '8px',
          border: 'none',
          background: 'linear-gradient(90deg, black 50%, white 50%)',
          backgroundSize: '200% 100%',
          backgroundPosition: '100% 0%',
          transition: 'all .2s ease-in-out',
        }}
        onMouseOver={(e) => {
          e.target.style.color = 'white';
          e.target.style.backgroundPosition = '0% 0%';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = 'black';
          e.target.style.backgroundPosition = '100% 0%';
        }}
      >
        Login
      </button>
    </Box>
  );
};

export default LoginForm;
