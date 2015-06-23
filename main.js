'use strict';
require('proto-creep');
require('proto-flag');
require('proto-room');
require('proto-spawn');


var neededRoles;
for (var roomName in Game.rooms) {
    var room = Game.rooms[roomName];

    var availableSpawns = room.find(FIND_MY_SPAWNS, function(spawn) {
        return !spawn.spawning;
    });

    if (availableSpawns.length) {

        neededRoles = room.getMostNeededRoles();

        if (neededRoles && neededRoles.length) {
            availableSpawns.forEach(function(spawn) {
                var needed = neededRoles.shift();
                var newRole = needed.role;
                var assignedFlag = needed.flag;

                spawn.spawnCreep(newRole, null, assignedFlag);
            });
        } else {
            room.populationCapped(true);
        }
    }

    _.each(room.find(FIND_MY_CREEPS), function(creep) {

        if (creep.pendingCreation()) {
            creep.init();
        }

        creep.act();
    });

    for(var k in Memory.creeps){
        var memCreep = Memory.creeps[k];
        if(!memCreep.pending_creation && !Game.creeps[k]){
            Memory.creeps[k] = undefined;
        }
    }
}
