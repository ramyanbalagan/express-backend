const jwt = require('jsonwebtoken');
const secretKey = process.env.KEY; // Replace this with your secret key

// Function to generate a JWT token for demonstration purposes
const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email
    // Add more user-specific data as needed
  };
  const options = {
    expiresIn: '30d', // Token expiration time
  };
  return jwt.sign(payload, secretKey, options);
};

const authenticateJWT = (req, res, next) => {
  // Check if the request has an "Authorization" header with a valid token
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify the token
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: err.message });
    }

    // Attach the authenticated user to the request object
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateJWT,
  generateToken,
};
