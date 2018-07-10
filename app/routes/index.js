const eventRoutes = require('./event_routes');

module.exports = function(app, db) {
  eventRoutes(app, db);
  // Other route groups could go here, in the future
};