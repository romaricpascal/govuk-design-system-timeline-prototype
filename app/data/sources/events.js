const {DATE_FORMAT} = require('./util/date.js');
const {index, ascending} = require('./util/array.js');

module.exports = { 
  getEvents() {
    const servicePhases = require('../service-phases.json')
    const general = require('../events.json')

    const serviceEvents = servicePhases.map(servicePhase => {
      return {
        ...servicePhase,
        time: DATE_FORMAT.format(new Date(servicePhase.datetime)),
        type: 'phase',
        classes: 'app-phase',
        events: []
      }
    })

    const generalEvents = general.map(generalEvent => {
      return {
        ...generalEvent,
        time: DATE_FORMAT.format(new Date(generalEvent.datetime)),
        type: 'event',
        classes: 'app-event',
        url: generalEvent.events ? `/release?version=${generalEvent.id}` : `event?id=${generalEvent.id}`
      }
    })

    // Sort the service phases to help bucket the events
    serviceEvents.sort(ascending('datetime'));
    // Bucket the events in each service event
    for(const event of generalEvents) {
      const serviceEvent = getServicePhaseEvent(event, serviceEvents);
      event.servicePhase = serviceEvent;
      serviceEvent.events.push(event)
    }

    return {
      eventsPerPhases: index(generalEvents, {by: item => item.servicePhase.title}),
      events: [...serviceEvents, ...generalEvents],
      serviceEvents
    }
  }
}

function getServicePhaseEvent(event, servicePhases) {
  let servicePhase = {title: 'Discovery'};
  // Iterate until we hit the service phase whose date is after this one
  for(const currentServicePhase of servicePhases) {
    if (currentServicePhase.datetime > event.datetime) {
      return servicePhase;
    }
    servicePhase = currentServicePhase;
  }

  return servicePhase 
}



