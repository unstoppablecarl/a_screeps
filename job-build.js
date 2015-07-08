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
    getJobs: function(room) {
        var jobs = [];

        // @TODO assign multiple builders to single site if space permits
        var sites = room.constructionSites().forEach(function(site){
            var currentCount = site.isTargetOfJobTypeCount('build');
            var adjacentTiles = site.pos.adjacentEmptyTileCount();
            if(currentCount < adjacentTiles){
                var priority = 0.5;

                var allocationRatio = 1 - (currentCount / adjacentTiles);
                var progress = site.progress / site.progressTotal;
                var buildPriority = room.buildPriority(site.structureType);
                // average
                var buildJobPriority = (progress + buildPriority + allocationRatio) / 3;
                // move one decimal over
                priority += buildJobPriority * 0.1;

                jobs.push({
                    role: 'tech',
                    type: 'build',
                    target: site,
                    priority: priority
                });
            }
        });

        return jobs;
    },
};

module.exports = job_build;
