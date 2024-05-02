exports.renderHomepage = function(req, res) {
    res.render('homepage', { user: req.user });
}


exports.renderLogin = function(req, res) {
    res.render('login');
}
exports.loginHandler = function(req, res) {
    const { username, password } = req.body;
  
    console.log('Username:', username);
    console.log('Password:', password);

    if (username === "test" && password === "password") {
      return res.json({ success: true, message: 'Login successful!' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
};
