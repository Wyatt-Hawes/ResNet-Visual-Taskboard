import React from 'react';
import {ResNetTicket} from './types';
export const TicketContext = React.createContext({
  tickets: [] as ResNetTicket[],
  setTickets: (newVal) => {},
});

export const LanesContext = React.createContext({
  lanes: ['New Unsorted', 'Client Updated'],
  abbreviations: {'New Unsorted': 'nu', 'Client Updated':'cu'},
  setLanes: (newval) => {},
  setAbbreviations: (newval)=>{}
});

export const LoginContext = React.createContext({
  loggedIn: false,
  setLoggedIn: (newVal) => {},
});
