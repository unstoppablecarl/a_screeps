'use strict';

require('mixin-job-target')(Energy.prototype);

Energy.prototype.isEnergy = true;


Energy.prototype.energyToBeCollected = function(){
    return this.targetOfJobs(function(job){
        return (
            job.type() === 'energy_collect' &&
            job.source()
        );
    }).reduce(function(total, job){
        var source = job.source();
        return total + (source.carryCapacity - source.carry.energy);
    }, 0);
};