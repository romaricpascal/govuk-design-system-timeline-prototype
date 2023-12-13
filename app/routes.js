//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter()

const { getGitHubReleasesEvents } = require('./data/sources/github-releases.js');
const { getEvents } = require('./data/sources/events.js');

// Add your routes here
router.use((req,res,next) => {
  // Grab the individual lists of events and make them available to the views
  Object.assign(res.locals, getGitHubReleasesEvents())
  Object.assign(res.locals, getEvents())

  // Merge all the events into one list, to be sorted in the templates
  res.locals.allEvents = [...res.locals.events]

  next();
})

router.get('/release', (req, res, next) => {
  res.locals.release = res.locals.allEvents.filter(event => event.id == req.query.version)[0];

  next();
})
