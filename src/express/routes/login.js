const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const key = process.env.GMBOTAUTH;
const adminUsage = require('../lib/adminUsage');

module.exports = function(app, db) {
  app.post('//login', function (req, res) {
    let name, password;
    try {
      name = req.body.name;
      password = req.body.password;
    } catch(e) {
      res.status(400).send({
        error: 'Bad request'
      });
      return;
    }

    db.admins.findOne({ name: name }, function(err, docs) {
      if (err !== null) {
        console.log(err);
        res.status(500).send({
          error: 'Server error: ' + err
        });
      } else {
        if (docs === null) {
          res.status(404).send({
            error: 'Not found'
          });
        } else {
          bcrypt.compare(password, docs.password, function(err, result) {
            if (err !== undefined) {
              res.status(500).send({
                error: 'Server error ' + err
              });
            } else {
              if (result) {
                jwt.sign({ user: name }, key, { expiresIn: '24h' }, function(err, token) {
                  if (err) {
                    res.status(500).send({
                      error: 'Server error ' + err
                    });
                  } else {
                    adminUsage.log(name, Date.now(), 'Logged in');
                    res.send({
                      token: token
                    });
                  }
                });
              } else {
                res.status(401).send({
                  error: 'Unauthorized'
                });
              }
            }
          });
        }
      }
    });
  });
};