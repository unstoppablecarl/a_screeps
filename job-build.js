'use strict';

var job_helpers = require('job-helpers');

var job_build = {
    name: 'build',
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
            return;
        }

        if(creep.energy === 0){
            if(job_helpers.findEnergy(creep, job)){
                return;
            }
        }

        // do not stand on top of target
        if(!creep.pos.isNearTo(target)){
            var move = creep.moveTo(target);

            var moveOK = (
                move === OK ||
                move === ERR_TIRED ||
                move === ERR_NO_PATH
            );

            if(!moveOK){
                job.end();
                return;
            }
        }

        var action = creep.build(target);
        var actionOK = (
            action === OK ||
            action === ERR_NOT_IN_RANGE ||
            action === ERR_NOT_ENOUGH_ENERGY
        );

        if(!actionOK){
            job.end();
        }
    },

    getJobs: function(room) {
        var buildJobLimit = false;
        // var maxBuildJobs = room.jobCountMax('build');

        // if(_.isNumber(maxBuildJobs)){
        //     var activeBuildJobs = room.jobList().all(function(job){
        //         return job.type() === 'build';
        //     }).length;

        //     if(activeBuildJobs >= maxBuildJobs) {
        //         return [];
        //     }
        //     buildJobLimit = maxBuildJobs - activeBuildJobs;
        // }

        var jobs = [];
        var getPriority = this.getPriority;

        var sites = room.constructionSites().forEach(function(site){
            var currentCount = site.targetOfJobTypeCount('build');

            if(currentCount >= 3){
                return;
            }
            var adjacentTiles = site.pos.adjacentEmptyTileCount();
            if(adjacentTiles > 3){
                adjacentTiles = 3;
            }

            if(currentCount >= adjacentTiles){
                return;
            }

            var jobsToAdd = adjacentTiles - currentCount;

            for (var i = 0; i < jobsToAdd; i++) {

                jobs.push({
                    role: 'tech',
                    type: 'build',
                    target: site,
                    priority: getPriority(room, site)
                });
            }
        });
        // if(buildJobLimit !== false){
        //     jobs = _.sortBy(jobs, function(job){
        //         return job.priority;
        //     }).reverse().slice(0, buildJobLimit);
        // }

        return jobs;
    },

    getJobPriority: function(job){

        var target = job.target();
        if(!target){
            return 0;
        }

        return this.getPriority(job.room, target);
    },

    getPriority: function(room, target){
        var priority = 0.5;

        var progress = target.progress / target.progressTotal;
        var buildPriority = room.buildPriority(target.structureType);

        var range = target.pos.getRangeTo(Game.spawns.Spawn1) / 100;
        // average
        var buildJobPriority = (progress + buildPriority + (range * 3)) / 5;

        // move one decimal over
        priority += buildJobPriority * 0.1;

        return priority;
    },
};

module.exports = job_build;
