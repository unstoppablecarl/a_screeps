require('proto-creep');
require('proto-flag');
require('proto-room');
require('proto-spawn');
require('proto-room-position');

require('mixin-job-target')(Structure.prototype);
require('mixin-job-target')(Source.prototype);
require('mixin-job-target')(Energy.prototype);
require('mixin-job-target')(ConstructionSite.prototype);
