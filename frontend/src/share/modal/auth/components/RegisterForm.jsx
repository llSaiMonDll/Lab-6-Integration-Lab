import { Box, Link, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useContext } from 'react';
import GlobalContext from '../../../context/GlobalContext';
import { useMutation } from 'react-query';
import Axios from '../../../AxiosInstance';

const RegisterForm = ({ setIsLogin = () => {} }) => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [rePasswordError, setRePasswordError] = useState('');
  const { setUser, setStatus } = useContext(GlobalContext);

  const registerMutation = useMutation (() =>
    Axios.post('/register', {
      username,
      email,
      password,
    }),
    {
      onSuccess: (data) => {
        if(data.data.success) {
          setEmailError('');
          setPasswordError('');
          setUsernameError('');
          setRePasswordError('');
          setIsLogin(true);
          setStatus({msg: data.data.msg,severity: 'success',
        });
        }
      },
      onError: (error) => {
        setPassword('');
        setRePassword('');
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
    if(!validateForm()) return;
      registerMutation.mutate();
  };

  const validateForm = () => {
    let isValid = true;
    // check user
    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    }
    // check email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }
    // check password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    if (!rePassword) {
      setRePasswordError('Confirm password is required');
    }
    if (password !== rePassword) {
      setPasswordError('Password is not match');
      setRePassword('');
      setPassword('');
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
        p: 5,
      }}
    >
      <Typography fontSize="1.25rem" fontWeight="400">
        CSC105 integration!
      </Typography>
      <Typography fontSize="2.5rem" fontWeight="700">
        Register
      </Typography>
      <TextField
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        error={usernameError !== ''}
        helperText={usernameError}
        label="Username"
        placeholder="Type your username"
      />
      <TextField
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        error={emailError !== ''}
        helperText={emailError}
        label="Email"
        placeholder="Type your email"
      />
      <TextField
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        error={passwordError !== ''}
        helperText={passwordError}
        type="password"
        label="Password"
        placeholder="Type your password"
      />
      <TextField
        value={rePassword}
        onChange={(e) => setRePassword(e.target.value)}
        fullWidth
        error={rePasswordError !== ''}
        helperText={rePasswordError}
        type="password"
        label="Confirm password"
        placeholder="Type your password"
      />
      <Link color="#999999" sx={{ alignSelf: 'end', cursor: 'pointer' }} onClick={() => setIsLogin(true)}>
        Already have an account?
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
        Sign up
      </button>
    </Box>
  );
};

export default RegisterForm;
