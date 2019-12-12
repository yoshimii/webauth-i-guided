module.exports = function restricted(req, res, next) {
    const { username, password } = req.headers;

    if (username && password) {
        Users.findBy({ username })
          .first()
          .then(user => {
            const hash = bcrypt.hashSync(user.password, 8);
            // we override the password with the hash
            user.password = hash;
            if (user && bcrypt.compareSync(password, user.password)) {
              res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
              res.status(401).json({ message: 'You cannot pass!!' });
            }
          })
          .catch(error => {
            res.status(500).json(error);
          });
      } else {
        res.status(400).json({ message: 'please provide credentials' });
      }
}