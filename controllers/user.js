exports.renderHomepage = function(req, res) {
    res.render('homepage', { user: req.user });
}


exports.renderLogin = function(req, res) {
    res.render('login');
}
exports.checkLogin = async function(req, res) {
    const { username, password } = req.body;

    try{
      const user = await User.findByUsername(username);
      if (!user){
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }
      if(!password != password){
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }
      
      // set user session or token
      req.session.user = user;
      res.json({ success: true, message: 'Login successful!', user });
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error.' });
      }
  
};
