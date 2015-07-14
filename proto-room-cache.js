'use strict';

// functions starting with 'get' are cached values with a forceRefresh param


Room.prototype.getIdleFlags = function(forceRefresh){
    if(forceRefresh || this._idle_flags === undefined){
        var flagIds = this.getIdleFlagIds(forceRefresh);
        this._idle_flags = this.flags(function(flag){
            return flag.role() === 'idle';
        });
    }
    return this._idle_flags;
};
