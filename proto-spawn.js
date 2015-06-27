'use strict';

Spawn.prototype.spawnCreep = function(body, memory) {
    memory = memory || {};
    memory.pending_creation = true;
    memory.spawn_id = this.id;

    if(this.spawning){
        return ERR_BUSY;
    }

    var result = this.createCreep(body, null, memory);
        var error;
        if(result === ERR_NOT_ENOUGH_ENERGY){
            // do nothing
            return result;
            // result = 'ERR_NOT_ENOUGH_ENERGY';
        }
        else if(result === ERR_NOT_OWNER){
            error = 'ERR_NOT_OWNER';
        }
        else if(result === ERR_NAME_EXISTS){
            error = 'ERR_NAME_EXISTS';
        }
        else if(result === ERR_BUSY){
            error = 'ERR_BUSY';
        }
        else if(result === ERR_INVALID_ARGS){
            error = 'ERR_INVALID_ARGS';
        }

    if(error){
        console.log('SPAWN ERROR', this.room.name, this.name, 'cannot create', memory.role, error);
    } else {
        this.busy(false);
        console.log(this.name, 'spawning', result, memory.role);
    }
    return result;
};

Spawn.prototype.busy = function(value){
    if(this.spawning !== null){
        return false;
    }
    if (value !== void 0) {
        this.busy = value;
    }
    return this.busy = value;

};
