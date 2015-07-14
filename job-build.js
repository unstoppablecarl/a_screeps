'use strict';

var job_energy_collect = require('job-energy-collect');


var job_build = {
    name: 'build',
    act: function(creep, job){
        var target = job.target();

        if(!target){
            job.end();
            return;
        }

        if(creep.energy === 0){
            // get own energy in case of emergency
            if(
                !creep.isTargetOfJobType('energy_deliver', true) &&
                !creep.room.idleCreeps('carrier').length
            ){
                job_energy_collect.startEnergyCollect(creep);
                return;
            }

            // meet delivery
            if(this._meetEnergyCarrier(creep, job)){
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

    _meetEnergyCarrier: function(creep, job){
        var jobSettings = job.settings() || {};

        var carrier;

        if(jobSettings.energy_deliver_carrier_id){
            carrier = Game.getObjectById(jobSettings.endnergy_deliver_carrier_id);
        }
        else{
            var carriers = creep.targetOfJobs().filter(function(job){
                return (
                    job.type() === 'energy_deliver' &&
                    job.active() &&
                    job.source()
                );
            }).map(function(job){
                return job.source();
            });

            if(carriers.length === 1){
                carrier = carriers[0];
            } else {
                carrier = creep.pos.findClosestByRange(carriers);
            }

            if(carrier){
                jobSettings.energy_deliver_carrier_id = carrier.id;
            }
        }

        if(!carrier){
            return false;
        }

        var move = creep.moveTo(carrier);

        var moveOK = (
            move === OK ||
            move === ERR_TIRED ||
            move === ERR_NO_PATH
        );

        if(!moveOK){
            job.end();
            return false;
        }

        return true;
    },

    getJobs: function(room) {
        var buildJobLimit = false;
        var maxBuildJobs = room.jobCountMax('build');

        if(_.isNumber(maxBuildJobs)){
            var activeBuildJobs = room.jobList().all(function(job){
                return job.type() === 'build';
            }).length;

            if(activeBuildJobs >= maxBuildJobs) {
                return [];
            }
            buildJobLimit = maxBuildJobs - activeBuildJobs;
        }

        var jobs = [];

        var sites = room.constructionSites().forEach(function(site){
            var currentCount = site.targetOfJobTypeCount('build');
            var adjacentTiles = site.pos.adjacentEmptyTileCount();

            if(adjacentTiles > 3){
                adjacentTiles = 3;
            }

            if(currentCount >= adjacentTiles){
                return;
            }

            var priority = 0.5;

            var allocationRatio = 1 - (currentCount / adjacentTiles);
            var progress = site.progress / site.progressTotal;
            var buildPriority = room.buildPriority(site.structureType);

            // average
            var buildJobPriority = (progress + buildPriority) / 2;
            // move one decimal over
            priority += buildJobPriority * 0.1;

            var jobsToAdd = adjacentTiles - currentCount;

            for (var i = 0; i < jobsToAdd; i++) {

                jobs.push({
                    role: 'tech',
                    type: 'build',
                    target: site,
                    priority: priority
                });
            }
        });

        if(buildJobLimit !== false){
            jobs = _.sortBy(jobs, function(job){
                return job.priority;
            }).reverse().slice(0, buildJobLimit);
        }

        return jobs;
    },
};

module.exports = job_build;
