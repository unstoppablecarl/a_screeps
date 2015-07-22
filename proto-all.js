'use strict';

require('proto-creep');
require('proto-flag');
require('proto-room');
require('proto-spawn');
require('proto-room-position');
require('proto-structure');

require('mixin-job-target')(Source.prototype);
Source.prototype.isSource = true;



require('mixin-job-target')(ConstructionSite.prototype);
ConstructionSite.prototype.isConstructionSite = true;


