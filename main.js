'use strict';
require('proto-creep');
require('proto-flag');
require('proto-room');
require('proto-spawn');

for (var roomName in Game.rooms) {
    var room = Game.rooms[roomName];

    var availableSpawns = room.find(FIND_MY_SPAWNS, function(spawn){
        return !spawn.spawning;
    });

    if(availableSpawns.length){

        var neededRoles = room.getMostNeededRoles();

        if (neededRoles) {
            availableSpawns.forEach(function(spawn){
                var newCreepRole = neededRoles.pop();
                // spawn.spawnCreep(newCreepRole);
            });
        } else {
            room.populationCapped(true);
        }
    }

    _.each(room.find(FIND_MY_CREEPS), function(creep){
            creep.act();


            if(!creep.flagId()){

            }
    });
}
