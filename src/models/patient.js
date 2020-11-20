const DBModel = require('./db');

class Patient extends DBModel {

  constructor() {
    super('Patient');
  }

  validate(Username, Password) {
    return this.findOne({
      Email: Username,
      Password: Password
    })
  }

}

module.exports = new Patient();