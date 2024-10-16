const fs = require('fs');
const path = require('path');

let lanes = ['New Unsorted', 'Client Updated'];
load();
save();

setInterval(() => {
  save();
}, 15000);

// Load lanes from JSON file
function load() {
  const data = fs.readFileSync(
    path.resolve(__dirname, '../../taskboard_lanes.json'),
    {
      encoding: 'utf-8',
      flag: 'r',
    }
  );
  let l = JSON.parse(data);
  console.log('lanes updated:', l.length);
  if (lanes == []) {
    lanes = ['New Unsorted', 'Client Updated'];
  }
  lanes = l;
  return l;
}

// Save lanes to JSON file
function save() {
  fs.writeFileSync(
    path.resolve(__dirname, '../../taskboard_lanes.json'),
    JSON.stringify(lanes)
  );
}

exports.getLanes = () => {
  return lanes;
};

// Same as load from above but exporting this function
exports.loadLanes = () => {
  const data = fs.readFileSync(
    path.resolve(__dirname, '../../taskboard_lanes.json'),
    {
      encoding: 'utf-8',
      flag: 'r',
    }
  );
  let l = JSON.parse(data);
  console.log('lanes updated:', l.length);
  lanes = l;
  return l;
};

exports.get = async (req, res) => {
  res.status(200).json({
    lanes: lanes,
  });
};

// Move a lane to occur at a specific index
exports.move = async (req, res) => {
  const {position, lane} = req.query;

  // Lane doesnt exist, add it
  if (!lanes.includes(lane)) {
    lanes.push(lane);
    save();
  } else {
    let laneCopy = lanes;
    const index = laneCopy.indexOf(lane);

    // Setting the index to null to prevent any shifting from occurring
    laneCopy.splice(index, 1, null);

    //putting it in the new position
    laneCopy.splice(position, 0, lane);
    laneCopy.splice(laneCopy.indexOf(null), 1);
    lanes = laneCopy;
  }
  res.status(200).json({
    lanes: lanes,
  });
  save();
};

// Delete an entire lane
exports.delete = async (req, res) => {
  const {lane} = req.query;

  if (!lanes.includes(lane)) {
    res.status(200).json({
      lanes: lanes,
    });
  }

  const index = lanes.indexOf(lane);
  lanes.splice(index, 1);
  res.status(200).json({
    lanes: lanes,
  });
  save();
};

exports.saveLanes = () => {
  fs.writeFileSync(
    path.resolve(__dirname, '../../taskboard_lanes.json'),
    JSON.stringify(lanes)
  );
};
