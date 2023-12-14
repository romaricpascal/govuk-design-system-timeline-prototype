const {DATE_FORMAT} = require('./util/date.js');

module.exports = { 
  getEvents() {
    const servicePhases = require('../service-phases.json')
    const general = require('../events.json')

    const serviceEvents = servicePhases.map(servicePhase => {
      return {
        ...servicePhase,
        time: DATE_FORMAT.format(new Date(servicePhase.datetime)),
        type: 'phase',
        classes: 'app-phase'
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

    const eventsPerPhases = {};
    // Sort the service phases to help bucket the events
    servicePhases.sort(ascending('datetime'));
    // Bucket the events in each service event
    for(const event of generalEvents) {
      const servicePhaseOfEvent = getServicePhase(event, servicePhases);
      event.servicePhase = servicePhaseOfEvent;
      eventsPerPhases[servicePhaseOfEvent.title] = (eventsPerPhases[servicePhaseOfEvent.title] ?? 0) + 1;
    }

    return {
      eventsPerPhases,
      events: [...serviceEvents, ...generalEvents]
    }
  }
}

function getServicePhase(event, servicePhases) {
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


// Comparator for sorting an array by ascending order of the given property
function ascending(propertyName) {
  return (a,b) => a[propertyName] > b[propertyName] ? 1 : a[propertyName] < b[propertyName] ? -1 : 0
}
