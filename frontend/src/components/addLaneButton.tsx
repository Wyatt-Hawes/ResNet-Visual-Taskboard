import React from 'react';
import {IconButton} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TextField from '@mui/material/TextField';
import {URL} from './types';
import {LanesContext} from './contexts';

export default function AddLaneButton() {
  const [laneText, setLaneText] = React.useState('');
  const [abrtxt, setAbrtxt] = React.useState('');
  const {setLanes, setAbbreviations} = React.useContext(LanesContext);

  // This is what sends the request to the server to add the lane
  function AddLane(lane: string, abbreviation: string) {
    // If either are empty, dont send the request
    if(!lane || !abbreviation){
      return;
    }
    fetch(URL + `/v0/lane?lane=${lane}&abbreviation=${abbreviation}`, {
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
        setAbbreviations(json.abbreviations);
        setLaneText('');
        setAbrtxt('');
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
          AddLane(laneText, abrtxt);
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
      <TextField
        id="outlined-basic"
        label="Abbreviation"
        variant="outlined"
        value={abrtxt}
        
        onChange={(event) => {
          setAbrtxt(event.target.value);
        }}
        component="form"
        onSubmit={(event) => {
          AddLane(laneText, abrtxt);
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
          AddLane(laneText, abrtxt);
        }}
      >
        <AddCircleOutlineIcon fontSize="large" style={{color: 'white'}} />
      </IconButton>
    </>
  );
}
