const DBModel = require('./db');

class User extends DBModel {

  constructor() {
    super('users');
  }

  validate(username, password) {
    return this.findOne({
      email: username,
      password: password
    })
  }

}

module.exports = new User();