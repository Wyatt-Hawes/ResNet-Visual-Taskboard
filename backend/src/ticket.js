const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');
const updateScript = path.resolve(__dirname, '../../ServiceNow.py');
const lane = require('./lane');

let processed_tickets = {};
let lanes = lane.getLanes();

// Run the python script that gets ticket info from ServiceNow API
const pythonScript = spawn('python', [updateScript]);

pythonScript.stderr.on('data',(data)=>{
  console.log(`Script Error:${data}`)
})

// Sync the taskboard with the new data once the script finishes
pythonScript.on('close', () => {
  syncTaskboard();
  saveTaskboard();
});

// Save taskboard every 15 seconds just incase of crashes
setInterval(() => {
  saveTaskboard();
}, 15000);

// Run the python script every 15 seconds to keep taskboard updated with
// The new Tickets
setInterval(() => {
  console.log('-------------------------');
  const pythonScript = spawn('python', [updateScript]);
  pythonScript.on('close', () => {
    syncTaskboard();
    console.log('-------------------------');
  });
}, 15000);

// GET endpoint, Returns all tickets sorted by created date
exports.get = async (req, res) => {
  const t = getTickets();
  res.status(200).json({
    tickets: t,
  });
};

// Moves ticket to another lane
exports.move = async (req, res) => {
  const {number, lane} = req.query;
  processed_tickets[number].lane = lane;
  res.status(200).json({
    tickets: getTickets(),
  });
  saveTaskboard();
};

// Saves taskboard state to file, allows shutdown of taskboard
function saveTaskboard() {
  //Write the processed_tickets to a file
  const d = new Date();
  console.log(
    'saving taskboard:',
    d.toLocaleTimeString('en', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      second: 'numeric',
    })
  );
  lane.saveLanes();
  fs.writeFileSync(
    path.resolve(__dirname, '../../taskboard_state.json'),
    JSON.stringify(processed_tickets)
  );
}

function clearTickets() {
  processed_tickets = {};
}

// Syncs taskboard with all current data & state
function syncTaskboard() {
  lanes = lane.getLanes();
  const saved_state = readTaskboardStateFromFile();
  const allTickets = readAllTicketsFromFile();
  const updatedTickets = readClientUpdatedFromFile();
  const staleTickets = readStaleTicketsFromFile();

  clearTickets();

  // Process all new tickets
  allTickets.forEach((ticket) => {
    // Ticket read already has an existing state, use it instead
    if (saved_state[ticket.number] != undefined) {
      // Reset the updated status of the ticket
      const t = saved_state[ticket.number];
      t.client_responded = false;
      t.is_stale = false;

      // Update short description just incase it was changed
      t.short_description = ticket.short_description;

      if (!lanes.includes(t.lane)) {
        t.lane = 'New Unsorted';
      }
      if (t.lane == undefined) {
        t.lane = 'New Unsorted';
      }

      // Ticket done being processed, add it to the map
      processed_tickets[ticket.number] = t;
      return;
    }

    // If it doesnt exist in the previous state, then it must be a new ticket
    // Set fields for this new ticket
    ticket.lane = 'New Unsorted';
    ticket.client_responded = false;
    ticket.is_stale = false;

    // Finally assign it to map
    processed_tickets[ticket.number] = ticket;
  });

  // Check if any of the tickets are stale
  // Must occur before updatedTickets because updated tickets should override stale.
  staleTickets.forEach((ticket) => {
    // Dont move the lane unless it isnt set for some reason
    if (processed_tickets[ticket.number].lane == undefined) {
      processed_tickets[ticket.number].lane = 'New Unsorted';
    }

    // So it can show up blue
    processed_tickets[ticket.number].is_stale = true;
  });

  // Now go through client updated and update tickets needing to be changed
  updatedTickets.forEach((ticket) => {
    // Set the lane and the client responded
    // This IF check line automatically moves tickets that are in client updated to the client updated lane
    if (processed_tickets[ticket.number].lane == undefined) {
      processed_tickets[ticket.number].lane = 'New Unsorted';
    }

    // So it can show up yellow
    processed_tickets[ticket.number].client_responded = true;
  });

  // Log to show taskboard has finished syncing
  console.log('Taskboard Synced');
}

function readClientUpdatedFromFile() {
  const data = fs.readFileSync(
    path.resolve(__dirname, '../../client_updated.json'),
    {
      encoding: 'utf-8',
      flag: 'r',
    }
  );
  let tickets = JSON.parse(data).result;
  console.log('client updated:', tickets.length);
  return tickets;
}

function readAllTicketsFromFile() {
  const data = fs.readFileSync(path.resolve(__dirname, '../../tickets.json'), {
    encoding: 'utf-8',
    flag: 'r',
  });
  let tickets = JSON.parse(data).result;
  console.log('all tickets:', tickets.length);
  return tickets;
}
function readStaleTicketsFromFile() {
  const data = fs.readFileSync(path.resolve(__dirname, '../../stale.json'), {
    encoding: 'utf-8',
    flag: 'r',
  });
  let tickets = JSON.parse(data).result;
  console.log('stale tickets:', tickets.length);
  return tickets;
}

function readTaskboardStateFromFile() {
  const data = fs.readFileSync(
    path.resolve(__dirname, '../../taskboard_state.json'),
    {
      encoding: 'utf-8',
      flag: 'r',
    }
  );
  let tickets = JSON.parse(data);
  return tickets;
}

function getTickets() {
  let t = Object.values(processed_tickets);
  t = t.sort((first, second) => {
    return (
      new Date(first.sys_created_on).getTime() -
      new Date(second.sys_created_on).getTime()
    );
  });

  // If you want to add more of the ticket attributes, put them here
  // We are filtering them to reduce amount of data getting transferred online
  t = t.map((item) => ({
    //description: item.description,
    number: item.number,
    short_description: item.short_description,
    sys_created_on: item.sys_created_on,
    sys_updated_on: item.sys_updated_on,
    lane: item.lane,
    client_responded: item.client_responded,
    is_stale: item.is_stale,
  }));
  return t;
}
