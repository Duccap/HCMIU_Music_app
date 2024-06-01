const User = require('../models/user');

exports.renderHomepage = function(req, res) {
    res.render('homepage', { user: req.user });
}


exports.getLogin = function(req, res) {
    res.render('login');
}
exports.postLogin = function(req, res) {
  const { username, password } = req.body;

  User.findOne({ where: { username: username } })
    .then(user => {
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }

      if (user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }

      // Create session or set authentication token
      req.session.user = user;
      req.session.isLoggedIn = true;
      // or
      // const token = generateAuthToken(user);
      // res.header('x-auth-token', token);
      
      return res.json({ success: true, message: 'Login successful!' });
    })
    .catch(error => {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    });
};
