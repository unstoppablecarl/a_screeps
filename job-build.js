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
            return {
                role: 'tech',
                type: 'build',
                target: site,
            };
        });
    },
};

module.exports = job_build;
