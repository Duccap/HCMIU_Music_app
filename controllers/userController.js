const User = require('../models/user');

exports.getLogin = (req, res) => {
    res.render('login');
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username: username } });

        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        // Set session data
        req.session.user = user;
        req.session.isLoggedIn = true;

        return res.redirect('/');
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error during logout');
        }
        res.redirect('/');
    });
};
