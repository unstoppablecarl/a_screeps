'use strict';

Spawn.prototype.spawnCreep = function(body, memory) {
    memory = memory || {};
    memory.pending_creation = true;
    memory.spawn_id = this.id;

    var result = this.createCreep(body, null, memory);
    if (result !== OK) {
        if(result === ERR_NOT_ENOUGH_ENERGY){
            // do nothing
        }
        else if(result === ERR_NOT_OWNER){
            result = 'ERR_NOT_OWNER';
        }
        else if(result === ERR_NAME_EXISTS){
            result = 'ERR_NAME_EXISTS';
        }
        else if(result === ERR_BUSY){
            result = 'ERR_BUSY';
        }
        else if(result === ERR_INVALID_ARGS){
            result = 'ERR_INVALID_ARGS';
        }
        console.log('SPAWN ERROR', this.room.name, this.name, 'cannot create', memory.role, result);
    } else {
        console.log(this.name, 'spawning', result, memory.role);
    }
    return result;
};
