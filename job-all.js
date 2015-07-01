'use strict';

var jobs = {
    attack: require('job-attack'),
    build: require('job-build'),
    energy_collect: require('job-energy-collect'),
    energy_deliver: require('job-energy-deliver'),
    energy_store: require('job-energy-store'),
    harvest: require('job-harvest'),
    move_to: require('job-move-to'),
    repair: require('job-repair'),
    upgrade_room_controller: require('job-upgrade-room-controller'),
    idle: require('job-idle'),
};

module.exports = jobs;