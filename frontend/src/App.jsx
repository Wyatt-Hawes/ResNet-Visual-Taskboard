import TopBar from './components/TopBar';
import TicketTable from './components/table';
import './App.css';
import React from 'react';
import {TicketContext, LanesContext, LoginContext} from './components/contexts';
import SignIn from './components/SignIn';

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  const [tickets, setTickets] = React.useState([]);
  const [lanes, setLanes] = React.useState(['New Unsorted', 'Client Updated']);
  const [abbreviations, setAbbreviations] = React.useState({'New Unsorted':'nu', 'Client Updated': 'cu'})
  const [loggedIn, setLoggedIn] = React.useState(false);

  return (
    <TicketContext.Provider value={{tickets, setTickets}}>
      <LanesContext.Provider value={{lanes, setLanes, abbreviations, setAbbreviations}}>
        <LoginContext.Provider value={{loggedIn, setLoggedIn}}>
          {loggedIn ? (
            <>
              <TopBar />
              <TicketTable />
            </>
          ) : (
            <SignIn />
          )}
        </LoginContext.Provider>
      </LanesContext.Provider>
    </TicketContext.Provider>
  );
}

export default App;
