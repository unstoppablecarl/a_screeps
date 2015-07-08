'use strict';

var job_build = {
    name: 'build',
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
            return;
        }

        var result = creep.build(target);
        if(result !== OK){
            if(result === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            } else {
                job.end();
            }
        }

    },
    getJobs: function() {
        // @TODO assign multiple builders to single site if space permits
        var sites = this.room.constructionSites(function(site){

            return !site.isTargetOfJobType('build');
        });

        return sites.map(function(site){

            var priority = 0.5;

            if(site){
                var progress = site.progress / site.progressTotal;
                var buildPriority = this.room.buildPriority(site.structureType);
                // average
                var buildJobPriority = (progress + buildPriority) / 2;
                // move one decimal over
                priority += buildJobPriority * 0.1;
            }

            return {
                role: 'tech',
                type: 'build',
                target: site,
                priority: priority
            };
        });
    },
};

module.exports = job_build;
