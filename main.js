'use strict';

require('proto-creep');
require('proto-flag');
require('proto-room');
require('proto-spawn');

for (var roomName in Game.rooms) {
    var room = Game.rooms[roomName];

    var availableSpawns = _.filter(room.spawns, function(spawn){
        return !spawn.spawning;
    });

    if(availableSpawns.length){
        var neededRoles = room.getMostNeededRoles();

        if (neededRoles) {
            availableSpawns.forEach(function(spawn){
                var newCreepRole = neededRoles.pop();
                spawn.spawnCreep(newCreepRole);
            });
        } else {
            room.populationCapped(true);
        }
    }

    for (var name in room.creeps) {
        var creep = Game.creeps[name];
        creep.act();
    }
}
