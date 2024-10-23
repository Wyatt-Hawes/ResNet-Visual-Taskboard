import Paper from '@mui/material/Paper';
import {IconButton, Typography} from '@mui/material';
import * as React from 'react';
import {ResNetTicket} from './types';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {ticketURL, URL as fetchURL} from './types';
import EastIcon from '@mui/icons-material/East';
import {LanesContext, LoginContext, TicketContext} from './contexts';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

export default function Ticket(props: {ticket: ResNetTicket}) {
  const [openMenu, setOpenMenu] = React.useState(null); // Holds the clicked ticket element
  const {lanes} = React.useContext(LanesContext);
  const {setTickets} = React.useContext(TicketContext);

  const currentDate = new Date();

  // We need to adjust the time for the timezone that the ServiceNow API is using, + 6h 30m
  currentDate.setHours(currentDate.getHours() + 6);
  currentDate.setMinutes(currentDate.getMinutes() + 30);

  const responded = new Date(props.ticket.sys_updated_on); // Turns the client responded time into a Date object
  const timeDifference = currentDate.getTime() - responded.getTime(); // Gets difference in milliseconds

  const URL = ticketURL + props.ticket.number;

  // This open and closes the menu
  // This function is called onClick below
  const handleClick = (event) => {
    if (!openMenu) {
      setOpenMenu(event.currentTarget);
    }
  };

  function moveTicketTo(lane) {
    // Here is the actual request that tells the server to move the ticket
    fetch(
      fetchURL +
        `/v0/ticket?number=${encodeURIComponent(
          props.ticket.number
        )}&lane=${encodeURIComponent(lane)}`,
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
      //This here sets the displayed tickets to be the response JSON from the server
      .then((json) => {
        setTickets(json.tickets);
      })
      .catch((err) => {
        console.log('ERROR:', err);
      });
    setOpenMenu(null);
  }

  return (
    <Paper
      sx={{
        width: '275px',
        border: 'solid',
        borderWidth: '2px',
        borderColor: '#757575',
        borderRadius: '0px',
        padding: '5px',

        // If client responded, Yellow border takes priority over
        // stale ticket color.
        // ? is 'if true', : is 'if false'
        backgroundColor: 
          props.ticket.is_red ? '#ff6565' 
          : props.ticket.client_responded
          ? 'yellow' // client responded color
          : props.ticket.is_stale
          ? 'lightblue' // stale color
          : '-moz-initial', // default color
      }}
      elevation={3}
      onClick={handleClick}
    >
      <Grid2 container spacing={0}>
        {/**Here is the ticket number */}
        <Grid2 xs={10}>
          <Typography fontWeight={'bold'}>{props.ticket.number}</Typography>
        </Grid2>
        <Grid2 xs={1}>
          <IconButton
            // Opens the ticket URL in a new window
            onClick={(event) => {
              window.open(URL, '_blank');

              // This prevents unwanted default behavior
              event.stopPropagation();
            }}
          >
            <OpenInNewIcon />
          </IconButton>
        </Grid2>

        {/**This is the ticket short description */}
        <Grid2 xs={11}>
          <Typography align="left">{props.ticket.short_description}</Typography>
        </Grid2>

        {/**This is the days since last updated counter */}
        <Typography sx={{position: 'absolute', bottom: '6px', right: '20px'}}>
          {formatTimeDifference(timeDifference)}
        </Typography>
      </Grid2>

      {/** This is the menu when you click on a ticket */}
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
        {/**Maps the lanes as selectable options */}
        {lanes.map((lane) => (
          <MenuItem
            key={lane}
            onClick={() => {
              moveTicketTo(lane);
            }}
          >
            <Typography fontSize={'medium'} sx={{verticalAlign: 'center'}}>
              <EastIcon fontSize="small" />
              {lane}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
}

// Helper function to turn milliseconds into times, order prio of Days, Hours, Minutes, Seconds
function formatTimeDifference(milliseconds): string {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(milliseconds / day);
  const hours = Math.floor((milliseconds % day) / hour);
  const minutes = Math.floor((milliseconds % hour) / minute);
  const seconds = Math.floor((milliseconds % minute) / second);
  let result = '';
  if (days > 0) {
    result += `${days}d `;
    return result.trim();
  }
  if (hours > 0) {
    result += `${hours}h `;
    return result.trim();
  }
  if (minutes > 0) {
    result += `${minutes}m `;
    return result.trim();
  }
  if (seconds > 0) {
    result += `${seconds}s`;
    return result.trim();
  }

  return result.trim();
}
