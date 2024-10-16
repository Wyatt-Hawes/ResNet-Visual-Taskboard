import React from 'react';
import {ResNetTicket} from './types';
export const TicketContext = React.createContext({
  tickets: [],
  setTickets: (newVal) => {},
});

export const LanesContext = React.createContext({
  lanes: ['New Unsorted', 'Client Updated'],
  setLanes: (newval) => {},
});

export const LoginContext = React.createContext({
  loggedIn: false,
  setLoggedIn: (newVal) => {},
});
