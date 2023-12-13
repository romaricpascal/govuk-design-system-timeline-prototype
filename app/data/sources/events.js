const {DATE_FORMAT} = require('./util/date.js');

module.exports = { 
  getEvents() {
    const servicePhases = require('../service-phases.json')
    const general = require('../events.json')

    const serviceEvents = servicePhases.map(servicePhase => {
      return {
        ...servicePhase,
        time: DATE_FORMAT.format(new Date(servicePhase.datetime)),
        classes: 'app-phase'
      }
    })

    const generalEvents = general.map(generalEvent => {
      return {
        ...generalEvent,
        time: DATE_FORMAT.format(new Date(generalEvent.datetime)),
        classes: 'app-event',
        url: generalEvent.events ? `/release?version=${generalEvent.id}` : `event?id=${generalEvent.id}`
      }
    })


    return {
      events: [...serviceEvents, ...generalEvents]
    }
  }
}
