import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddLaneButton from './addLaneButton';
import LogoutButton from './LogoutButton';

export default function TopBar() {
  // This is the bar at the top of the page
  return (
    <AppBar
      position="static"
      style={{width: '100%', margin: '0px', padding: '0px'}}
    >
      <Toolbar>
        <LogoutButton />
        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
          Visual Taskboard
        </Typography>

        {/** Here is the add lane button, go into the file to see it */}
        <AddLaneButton />
      </Toolbar>
    </AppBar>
  );
}
