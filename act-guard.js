'use strict';

module.exports = function(creep) {

    var target = creep.room.findClosest(FIND_HOSTILE_CREEPS);
    creep.moveTo(target);
    creep.attack(target);

};
