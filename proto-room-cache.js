'use strict';

// functions starting with 'get' are cached values with a forceRefresh param


Room.prototype.getIdleFlagIds = function(forceRefresh){

    if(forceRefresh || this.memory.idle_flag_ids === undefined){
        this.memory.idle_flags_ids = this.flags(function(flag){
            return flag.role() === 'idle';
        }).map(function(flag){
            return flag.id;
        });
        this._idle_flags = undefined;
    }
    return this.memory.idle_flags_ids;
};

Room.prototype.getIdleFlags = function(forceRefresh){
    if(forceRefresh || this._idle_flags === undefined){
        var flagIds = this.getIdleFlagIds(forceRefresh);
        this._idle_flags = flagIds.map(function(id){
            return Game.getObjectById(id);
        });
    }
    return this._idle_flags;
};