'use strict';

require('mixin-job-target')(Spawn.prototype);

Spawn.prototype.spawnCreep = function(body, memory) {
    memory = memory || {};
    memory.pending_creation = true;
    memory.spawn_id = this.id;

    if(this.isBusy()){
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
        this.isBusy(true);
        console.log(this.name, 'spawning', result, memory.role);
    }
    return result;
};

Spawn.prototype.isBusy = function(value){
    // if this.spawning is null still not sure if it is busy
    if(this.spawning !== null){
        return true;
    }
    if (value !== void 0) {
        this.busy = value;
    }
    return this.busy;

};
