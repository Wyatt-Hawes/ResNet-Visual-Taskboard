import React from 'react';
import {IconButton} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TextField from '@mui/material/TextField';
import {URL} from './types';
import {LanesContext} from './contexts';

export default function AddLaneButton() {
  const [laneText, setLaneText] = React.useState('');
  const {setLanes} = React.useContext(LanesContext);

  // This is what sends the request to the server to add the lane
  function AddLane(lane: string) {
    fetch(URL + `/v0/lane?lane=${lane}`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('user')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        setLanes(json.lanes);
        setLaneText('');
      })
      .catch((err) => {
        console.log('ERROR:', err);
      });
  }

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Lane Name"
        variant="outlined"
        value={laneText}
        onChange={(event) => {
          setLaneText(event.target.value);
        }}
        component="form"
        onSubmit={(event) => {
          AddLane(laneText);
          event.preventDefault();
        }}
        inputProps={{style: {color: 'white'}}}
        sx={{
          '& .MuiOutlinedInput-root': {
            // Target the root element
            '& fieldset': {
              // Target the fieldset element within the root
              borderColor: 'white', // Set your desired outline color
            },
          },
        }}
      />
      <IconButton
        onClick={() => {
          console.log('adding:', laneText);
          AddLane(laneText);
        }}
      >
        <AddCircleOutlineIcon fontSize="large" style={{color: 'white'}} />
      </IconButton>
    </>
  );
}
