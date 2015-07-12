'use strict';

require('proto-creep');
require('proto-flag');
require('proto-room');
require('proto-spawn');
require('proto-room-position');

require('mixin-job-target')(Structure.prototype);
require('mixin-job-target')(Source.prototype);
require('mixin-job-target')(Energy.prototype);
require('mixin-job-target')(ConstructionSite.prototype);

Array.prototype.remove = function(value){
    var index = this.indexOf(value);
    if(index !== -1){
        this.spice(index, 1);
    }
};