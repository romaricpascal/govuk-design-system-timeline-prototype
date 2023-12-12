const {DATE_FORMAT} = require('./util/date.js');

module.exports = { 
  getServicePhasesEvents() {
    const servicePhases = require('../service-phases.json');

    const servicePhasesEvents = servicePhases.map(servicePhase => {
      return {
        ...servicePhase,
        time: DATE_FORMAT.format(new Date(servicePhase.datetime))
      }
    })

    return {
      servicePhasesEvents,
    }
  }
}
