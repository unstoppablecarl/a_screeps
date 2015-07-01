'use strict';
require('proto-all');
// return;
var cpu = require('cpu');

cpu.start('all');
//
//


// var room = Game.rooms[''];

var room = Game.rooms.sim;
_.each(room.creeps(), function(creep) {
    creep.act();
});

room.act();

if (Game.time % 5 === 0) {
    for (var k in Memory.creeps) {
        var memCreep = Memory.creeps[k];
        if (!Game.creeps[k] && !(memCreep && memCreep.pending_creation)) {
            delete Memory.creeps[k];
        }
    }
}

cpu.end();
cpu.report();
cpu.shutdown();
