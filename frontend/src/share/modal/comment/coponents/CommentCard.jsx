import { Button, Card, TextField, Typography } from '@mui/material';
import React, { useCallback, useState, useContext, useEffect } from 'react';
import GlobalContext from '../../../context/GlobalContext';
import { AxiosError } from 'axios';
import Axios from '../../../AxiosInstance';
import Cookies from 'js-cookie';

const CommentCard = ({ comment = { id: -1, msg: '' }, setComments = () => { } }) => {
  const { user, setStatus } = useContext(GlobalContext);
  const [isConfirm, setIsConfirm] = useState(false);
  const [functionMode, setFunctionMode] = useState('update');
  const [msg, setMsg] = useState(comment.msg);
  const [msgError, setMsgError] = useState('');

  // const [msgs, setMsgs] = useState([]);

  // useEffect(() => {
  //   setMsg(comment.msg);
  // }, [comment.msg]);

  const submit = useCallback(async () => {
    if (functionMode === 'update') {
      // TODO implement update logic
      if (!validateForm()) return;
      try {
        // 2. call API to update note
        const userToken = Cookies.get('UserToken');
        const response = await Axios.patch(
          '/comment',
          {
            text: msg,
            commentId: comment.id,
          },
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
        // 3. if successful, update note in state and close modal
        if (response.data.success) {
          setStatus({ severity: 'success', msg: 'Update comment successfully' });
          setComments((comments) => comments.map((c) => (c.id === comment.id ? { ...c, msg: response.data.data.text } : c)));
          cancelAction();
        }
      } catch (error) {
        // 4. if update note failed, check if error is from calling API or not
        if (error instanceof AxiosError && error.response) {
          setStatus({ severity: 'error', msg: error.response.data.error });
        } else {
          setStatus({ severity: 'error', msg: error.message });
        }
      }
      // console.log('update');
    } else if (functionMode === 'delete') {
      // TODO implement delete logic
      try {
        // 1. call API to delete note
        const userToken = Cookies.get('UserToken');
        const response = await Axios.delete('/comment', {
          headers: { Authorization: `Bearer ${userToken}` },
          data: { commentId: comment.id }
        }
        );
        // 2. if successful, set status and remove note from state
        if (response.data.success) {
          setStatus({ severity: 'success', msg: 'Delete comment successfully' });
          setComments((comments) => comments.filter((c) => c.id !== comment.id));
          cancelAction();
        }
      } catch (error) {
        // 3. if delete note failed, check if error is from calling API or not
        if (error instanceof AxiosError && error.response) {
          setStatus({ severity: 'error', msg: error.response.data.error });
        } else {
          setStatus({ severity: 'error', msg: error.message });
        }
      }
      // console.log('delete');
    } else {
      // TODO setStatus (snackbar) to error
      console.log('error');
    }
  }, [functionMode, msg]);

  const validateForm = () => {
    let isValid = true;
    //check user
    if (!msg) {
      setMsgError('Comment is required');
      isValid = false;
    }
    return isValid;
  }

  const changeMode = (mode) => {
    setFunctionMode(mode);
    setIsConfirm(true);
  };

  const cancelAction = () => {
    setFunctionMode('');
    setIsConfirm(false);
  };

  return (
    <Card sx={{ p: '1rem', m: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {!(isConfirm && functionMode == 'update') ? (
        <Typography sx={{ flex: 1 }}>{comment.msg}</Typography>
      ) : (
        <TextField sx={{ flex: 1 }}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          error={msgError !== ''}
          helperText={msgError} />
      )}
      {!isConfirm ? (
        <Button onClick={() => changeMode('update')} variant="outlined" color="info">
          update
        </Button>
      ) : (
        <Button onClick={submit} variant="outlined" color="success">
          confirm
        </Button>
      )}
      {!isConfirm ? (
        <Button onClick={() => changeMode('delete')} variant="outlined" color="error">
          delete
        </Button>
      ) : (
        <Button onClick={cancelAction} variant="outlined" color="error">
          cancel
        </Button>
      )}
    </Card>
  );
};

export default CommentCard;