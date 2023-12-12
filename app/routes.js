//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter()

const { getGitHubReleasesEvents } = require('./data/sources/github-releases.js');
const { getServicePhasesEvents } = require('./data/sources/service-phases.js');

// Add your routes here
router.use((req,res,next) => {

  Object.assign(res.locals, getGitHubReleasesEvents())
  Object.assign(res.locals, getServicePhasesEvents())

  res.locals.allEvents = [...res.locals.releases, ...res.locals.servicePhasesEvents]

  next();
})

router.get('/release', (req, res, next) => {

  res.locals.release = res.locals.releasesByVersion[req.query.version][0];
  
  next();
})
