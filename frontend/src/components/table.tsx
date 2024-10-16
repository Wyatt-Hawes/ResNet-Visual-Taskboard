import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {List, ListItem} from '@mui/material';
import {ResNetTicket, URL} from './types';
import Ticket from './ticket';
//import {lanes} from './types';
import {TicketContext, LanesContext, LoginContext} from './contexts';
import TableHeader from './tableHeader';

export default function TicketTable() {
  const {tickets, setTickets} = React.useContext(TicketContext);
  const {setLoggedIn} = React.useContext(LoginContext);
  const {lanes, setLanes} = React.useContext(LanesContext);

  const [ticketCount, setTicketCount] = React.useState({});

  const updateFrequencyMS = 1500;

  React.useEffect(() => {
    fetchTickets();
    fetchLanes();
    setInterval(() => {
      fetchTickets();
      fetchLanes();
    }, updateFrequencyMS);
  }, []);

  React.useEffect(()=>{
      updateTicketCount();
  },[tickets])

  function fetchTickets() {
    fetch(URL + '/v0/ticket', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('user')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    })
      .then((res) => {
        if (res.status == 401) {
          setLoggedIn(false);
          localStorage.clear();
        }
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        setTickets(json.tickets);
      })
      .catch((err) => {
        setLoggedIn(false);
        console.log('ERROR:', err);
      });
  }

  function fetchLanes() {
    fetch(URL + '/v0/lane', {
      method: 'GET',
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

  function updateTicketCount(){
    const tc = {};
    tickets.forEach((ticket)=>{
      if(!tc[ticket.lane]){
        tc[ticket.lane] = 0;
      }
      tc[ticket.lane]++;
    })
    setTicketCount(tc);
  }

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{
          width: `${275 * lanes.length}px`,
        }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            {lanes.map((lane) => (
              <TableHeader key={lane} lane={lane} ticketCounts={ticketCount}></TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/**iterate through the all the lanes */}
          <TableRow>
            {lanes.map((lane) => (
              <TableCell
                // VerticalAlign: 'text-bottom' does similar to alignContent, it just fixes ticket positions on Wilson
                sx={{paddingTop: '0px',paddingLeft:'1px',paddingRight:'1px', width: '100px', alignContent: 'baseline', verticalAlign: 'text-bottom'}}
                key={'ticket section ' + lane}
              >
                {/**Now iterate through the tickets */}
                <List key={'list section ' + lane} >
                  {tickets.map((ticket: ResNetTicket, index) => {
                    if (ticket.lane == lane) {
                      return (
                        <ListItem key={ticket.number} sx={{padding:'1px'}}>
                          {/**Pass ticket down */}
                          <Ticket ticket={ticket} />
                        </ListItem>
                      );
                    }
                    return <span key={lane + ' ' + index}></span>;
                  })}
                </List>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
