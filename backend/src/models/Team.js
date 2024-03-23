const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamID: {
    type: String,
    required: true,
    unique: true
  },
  teamName: {
    type: String,
    required: true
  },
  runs: {
    type: Number,
    default: 0
  },
  overs: {
    type: Number,
    default: 0
  },
  wickets: {
    type: Number,
    default: 0
  },
  players: [{
    type: String,
    required: true
  }],
  target: {
    type: Number,
    default: 0
  }
});

const Team = mongoose.model('Team', teamSchema);

//only work on replica sets
// Team.watch().
// on('change', data => console.log(data));


module.exports = Team;
