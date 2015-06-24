'use strict';
require('proto-all');

var cpu = require('cpu');

cpu.start('all');
for (var roomName in Game.rooms) {
    var room = Game.rooms[roomName];

    _.each(room.find(FIND_MY_CREEPS), function(creep) {

        if (creep.pendingCreation()) {
            creep.init();
        }

        creep.act();
    });

    room.act();
}

if(Game.time % 5 === 0){
    for(var k in Memory.creeps){
        var memCreep = Memory.creeps[k];
        if(!memCreep.pending_creation && !Game.creeps[k]){
            Memory.creeps[k] = undefined;
        }
    }
}

cpu.end();
cpu.report();
cpu.shutdown();