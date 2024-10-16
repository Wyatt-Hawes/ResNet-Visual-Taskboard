import React from 'react';
import {IconButton} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import {LoginContext} from './contexts';

export default function LogoutButton() {
  const {setLoggedIn} = React.useContext(LoginContext);
  return (
    <IconButton
      onClick={() => {
        setLoggedIn(false);
        localStorage.clear();
      }}
    >
      <LogoutIcon fontSize="large" style={{color: 'white'}} />
    </IconButton>
  );
}
