import {Box, Menu, MenuItem, TableCell, Typography} from '@mui/material';
import React from 'react';
import {LanesContext} from './contexts';
import {URL} from './types';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function TableHeader(props: {lane: string}) {
  const [openMenu, setOpenMenu] = React.useState(null);
  const {lanes, setLanes} = React.useContext(LanesContext);
  const handleClick = (event) => {
    if (!openMenu) {
      setOpenMenu(event.currentTarget);
    }
  };

  function moveLane(lane: string, position: number) {
    fetch(
      URL +
        `/v0/lane?lane=${encodeURIComponent(
          lane
        )}&position=${encodeURIComponent(position)}`,
      {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${localStorage.getItem('user')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        setLanes(json.lanes);
      })
      .catch((err) => {
        console.log('ERROR:', err);
      });
  }

  function deleteLane(lane: string) {
    fetch(URL + `/v0/lane?lane=${encodeURIComponent(lane)}`, {
      method: 'DELETE',
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
      })
      .catch((err) => {
        console.log('ERROR:', err);
      });
  }

  return (
    <>
      <TableCell
        sx={{width: '275px', textAlign: 'center', fontSize: '20pt'}}
        key={props.lane}
        onClick={handleClick}
        style={{width: '275px'}}
      >
        {props.lane}
      </TableCell>
      <Menu
        id="simple-menu"
        anchorEl={openMenu}
        open={Boolean(openMenu)}
        onClose={() => {
          setOpenMenu(null);
        }}
        onClick={() => {
          setOpenMenu(null);
        }}
        sx={{width: '300px'}}
        style={{maxHeight: '400px'}}
      >
        <MenuItem
          onClick={() => {
            moveLane(props.lane, 0);
          }}
          sx={{
            borderStyle: 'dashed',
            borderColor: 'black',
            borderWidth: '1px',
            margin: '5px',
            marginLeft: '12px',
            marginRight: '15px',
          }}
        >
          <Typography>{' Move Here'}</Typography>
        </MenuItem>
        {lanes.map((lane, index) => [
          <MenuItem key={lane} disabled>
            <Typography
              fontSize={'medium'}
              sx={{verticalAlign: 'center'}}
              fontWeight={'bold'}
              style={{color: 'black'}}
            >
              {' ' + lane}
            </Typography>
          </MenuItem>,
          <MenuItem
            onClick={() => {
              moveLane(props.lane, index + 1);
            }}
            sx={{
              borderStyle: 'dashed',
              borderColor: 'black',
              borderWidth: '1px',
              margin: '5px',
              marginLeft: '12px',
              marginRight: '15px',
              textAlign: 'center',
              paddingLeft: '25px',
            }}
          >
            <Typography style={{textAlign: 'center'}}>{'Move Here'}</Typography>
          </MenuItem>,
        ])}
        <Box
          sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        >
          <MenuItem
            onClick={() => {
              deleteLane(props.lane);
            }}
          >
            <Typography>
              <DeleteForeverIcon fontSize="large" />
            </Typography>
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
}
