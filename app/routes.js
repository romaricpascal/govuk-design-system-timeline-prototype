//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter()

const DATE_FORMAT = new Intl.DateTimeFormat(
  'en-gb',
  {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }
)

// Add your routes here
router.use((req, res, next) => {
  const githubReleases = require('./data/github-releases.json');

  const releaseEvents = githubReleases.map(release => ({
    title: `Released ${release.name}`,
    datetime: release.created_at,
    time: DATE_FORMAT.format(new Date(release.created_at)),
    content: '<p class="govuk-body">We released a new version of GOV.UK Frontend</p>'
  }));

  res.locals.releaseEvents = releaseEvents;

  next();
})
