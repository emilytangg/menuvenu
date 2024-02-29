import { Alert, Button, TextField, Typography } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ResetPopup from '../components/ResetPopup';
import { apiCall } from '../helpers/helpers';

function Login ({ setmode }) {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showAlert, setShowAlert] = React.useState('');
  const [showReset, setShowReset] = React.useState(false);

  React.useEffect(() => {
    setmode('');
  }, []);

  async function handleSubmit (event) {
    event.preventDefault();
    const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!email || !validEmailRegex.test(email)) {
      setShowAlert('Please enter a valid email');
      return;
    } else if (!password) {
      setShowAlert('Please enter a valid password');
      return;
    } else {
      setShowAlert(null);
    }

    const body = {
      email,
      password
    };
    const data = await apiCall('auth/login', 'POST', body);
    if (data.message === 'Login successful') {
      localStorage.setItem('mvuser', data.customer_id);
      setmode('customer');
      navigate('/loggedselect');
    } else {
      setShowAlert(data.message);
    }
  }

  return (
    <>
      <Button component={Link} to={'/customerselect'}>Back</Button>
      <form onSubmit={(e) => handleSubmit(e)} style={{ textAlign: 'center' }}>
        <Typography>Login</Typography>
        <TextField sx={{ margin: '10px' }} id='login-email' value={email} type='text' label='Email address'
          placeholder='Enter email' onChange={(e) => setEmail(e.target.value)}/>
        <br/>
        <TextField sx={{ margin: '10px' }} id='login-password' value={password} type='password' label='Password'
          placeholder='Enter password' onChange={(e) => setPassword(e.target.value)}/>
        <br/>
        <Button variant='contained' type='submit'>Submit</Button>
        <Button variant='contained' onClick={(e) => setShowReset(true)}>Reset password</Button>
      </form>
      {showReset && <ResetPopup open={showReset} setOpen={setShowReset}/>}
      {showAlert && <Alert severity='error' aria-label='errorAlert'
        sx={{
          margin: 'auto',
          width: '300px'
        }}>{showAlert}</Alert>}
    </>
  );
}

export default Login;
