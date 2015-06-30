'use strict';


var Creep = function Creep(){
    this.memory = {};
    this.room = null;
};

require('./../../proto-creep');

module.exports = Creep;