const jwt = require('jsonwebtoken');

// This is an example of how to add the function part of an endpoint, whatever you want to respond back with, send it back in the JSON
// Remember to update the openapi.yaml in the api folder to add the new endpoint
exports.login = async (req, res) => {
  const {username, password} = req.body;
  const USER = process.env.ACCOUNT_NAME;
  const PASS = process.env.ACCOUNT_PASSWORD;
  const secret = process.env.SECRET;

  if (username !== USER || password !== PASS) {
    res.status(401).send('Invalid Login');
    return;
  }

  const accessToken = jwt.sign({username: USER}, secret, {
    expiresIn: '12h',
    algorithm: 'HS256',
  });
  res.status(200).json({accessToken: accessToken});
};

exports.check = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const secret = process.env.SECRET;

  const token = authHeader.split(' ')[1];
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      res.status(403);
      return;
    }
    req.userToken = user;
    next();
  });
};
