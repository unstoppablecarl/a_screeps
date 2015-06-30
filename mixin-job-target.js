'use strict';

var targetOfJobIds = function(){
    if(this.memory.target_of_job_ids === undefined){
        this.memory.target_of_job_ids = [];
    }
    return this.memory.target_of_job_ids;
};

var targetOfJobs = function(filter){
    var ids = this.targetOfJobIds();
    var result = ids.map(function(id){
        this.room.jobsActive().all(function(job){
            console.log('job', job);
            return job.id === id;
        });
    });
    if(filter){
        result = result.filter(filter);
    }
    return result;
};

var setTargetOfJob = function(id){
    if(this.memory.target_of_job_ids === undefined){
        this.memory.target_of_job_ids = [];
    }

    // prevent duplicates
    if(this.memory.target_of_job_ids.indexOf(id) === -1){
        this.memory.target_of_job_ids.push(id);
    }
};

var removeTargetOfJob = function(id){
    if(this.memory.target_of_job_ids === undefined){
        return;
    }
    var index = this.memory.target_of_job_ids.indexOf(id);
    if(index !== -1){
        this.memory.target_of_job_ids.splice(1, index);
    }
};

var isTargetOfJobId = function(id) {
    if(this.memory.target_of_job_ids === undefined){
        return false;
    }
    return this.memory.target_of_job_ids.indexOf(id) !== -1;
};

var isTargetOfJobType = function(type) {
    var ids = this.targetOfJobIds();
    for (var i = 0; i < ids.length; i++) {
       var id = ids[i];
       var active = this.room.jobsActive();
       var job = active.get(id);
       if(job){
            if(job.type() === type){
                return true;
            }
       }
    }
    return false;
};

var jobTarget = function(obj){
    obj.targetOfJobIds = targetOfJobIds;
    obj.targetOfJobs = targetOfJobs;
    obj.setTargetOfJob = setTargetOfJob;
    obj.removeTargetOfJob = removeTargetOfJob;
    obj.isTargetOfJobId = isTargetOfJobId;
    obj.isTargetOfJobType = isTargetOfJobType;
};


module.exports = jobTarget;