const fs = require('fs');
const path = require('path');

let lanes = ['New Unsorted', 'Client Updated'];
let abbreviations = {'New Unsorted': 'nu', 'Client Updated': 'cu'}
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

  const data2 = fs.readFileSync(
    path.resolve(__dirname, '../../taskboard_abbreviations.json'),
    {
      encoding: 'utf-8',
      flag: 'r',
    }
  );
  let abr = JSON.parse(data2);
  console.log('Abbreviations updated:', Object.keys(abr).length);
  abbreviations = abr;
  return {'lanes':l, 'abbreviations':abr};
}

// Save lanes to JSON file
function save() {
  fs.writeFileSync(
    path.resolve(__dirname, '../../taskboard_lanes.json'),
    JSON.stringify(lanes)
  );
  fs.writeFileSync(    
    path.resolve(__dirname, '../../taskboard_abbreviations.json'),
    JSON.stringify(abbreviations));
}

exports.getLanes = () => {
  return {'lanes': lanes, 'abbreviations': abbreviations};
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

  const data2 = fs.readFileSync(
    path.resolve(__dirname, '../../taskboard_abbreviations.json'),
    {
      encoding: 'utf-8',
      flag: 'r',
    }
  );
  let abr = JSON.parse(data2);
  console.log('Abbreviations updated:', abr.length);
  abbreviations = abr;
  return {'lanes':l, 'abbreviations':abr};
};

exports.get = async (req, res) => {
  res.status(200).json({
    'lanes': lanes,
    'abbreviations': abbreviations
  });
};

// Move a lane to occur at a specific index
exports.move = async (req, res) => {
  const {position, lane, abbreviation} = req.query;

  // Lane doesnt exist, add it
  if (!lanes.includes(lane)) {
    lanes.push(lane);
    abbreviations[lane] = abbreviation.toLowerCase();
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
    'lanes': lanes,
    'abbreviations': abbreviations
  });
  save();
};

// Delete an entire lane
exports.delete = async (req, res) => {
  const {lane} = req.query;

  if (!lanes.includes(lane)) {
    res.status(200).json({
      'lanes': lanes,
      'abbreviations': abbreviations
    });
  }

  const index = lanes.indexOf(lane);
  lanes.splice(index, 1);
  delete abbreviations[lane];
  res.status(200).json({
    'lanes': lanes,
    'abbreviations': abbreviations
  });
  save();
};

exports.saveLanes = () => {
  fs.writeFileSync(
    path.resolve(__dirname, '../../taskboard_lanes.json'),
    JSON.stringify(lanes)
  );

  fs.writeFileSync(    
    path.resolve(__dirname, '../../taskboard_abbreviations.json'),
    JSON.stringify(abbreviations));
};

