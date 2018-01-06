var path = require('path');

// Express libs
var express = require('express'),
    app = express();

// Middlewares
var bodyParser = require('body-parser'),
    cors = require('cors');

// Routes
var validate = require('./routes/validate'),
    login = require('./routes/login'),
    textChannels = require('./routes/text_channels'),
    textChannelMessage = require('./routes/text_channel_message'),
    simpleStats = require('./routes/simple_stats'),
    presence = require('./routes/presence'),
    adminUsers = require('./routes/admin_users'),
    dm = require('./routes/dm'),
    users = require('./routes/users'),
    voip = require('./routes/voip'),
    profile = require('./routes/profile'),
    giveAways = require('./routes/give_aways');

// Apply middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(require('./middlewares/auth'));
app.use('/gmlive', express.static(path.join(__dirname, 'src/express/gmlive')));

/**
 * Init the express server providing needed references
 * @param {*} bot Bot client reference
 * @param {*} dmLog In-memory reference to current DM bot logs
 * @param {*} db In memory database
 */
const run = function(bot, dmLog, db) {
  // Use each route
  validate(app);
  login(app, db);
  textChannels(app, bot);
  textChannelMessage(app, bot);
  simpleStats(app, bot);
  presence(app, bot);
  adminUsers(app, db);
  dm(app, bot, dmLog);
  users(app, bot);
  voip(app, db);
  profile(app, db);
  giveAways(app, db);

  // Run the server
  app.listen(8080, function () {
    console.log('Express server listening on 8080.');
  });
};

module.exports.run = run;
