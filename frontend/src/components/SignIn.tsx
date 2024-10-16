//https://github.com/mui/material-ui/blob/v5.16.1/docs/data/material/getting-started/templates/sign-in/SignIn.tsx

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {URL} from './types';
import {LoginContext} from './contexts';

export default function SignIn() {
  const {setLoggedIn} = React.useContext(LoginContext);

  React.useEffect(() => {
    const logIn = localStorage.getItem('user');
    if (!logIn) {
      localStorage.clear();
      setLoggedIn(false);
      return;
    }
    setLoggedIn(true);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    fetch(URL + '/v0/login', {
      method: 'POST',
      body: JSON.stringify({
        username: data.get('Username'),
        password: data.get('password'),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        localStorage.setItem('user', json.accessToken);
        setLoggedIn(true);
      })
      .catch((err) => {
        setLoggedIn(false);
        alert('Error logging in, please try again');
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="user"
            label="Username"
            name="Username"
            autoComplete="Username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
