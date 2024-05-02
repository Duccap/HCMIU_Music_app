exports.renderHomepage = function(req, res) {
    res.render('homepage',{user: false});
}

exports.renderLogin = function(req, res) {
    res.render('login');
}
exports.loginHandler = function(req, res) {
    const { username, password } = req.body;
  
    // Log the username and password to the console
    console.log('Username:', username);
    console.log('Password:', password);
    setTimeout(() => {res.redirect('/');}, 1500);
};