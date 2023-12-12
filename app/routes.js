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
  
  res.locals.releases = githubReleases.map(githubRelease => {

    const formattedReleaseDate = DATE_FORMAT.format(new Date(githubRelease.created_at));
    const parent = getReleaseParent(githubRelease);

    const release = {
      title: `Released ${githubRelease.name}`,
      datetime: githubRelease.created_at,
      time: formattedReleaseDate,
      version: githubRelease.tag_name,
      url: `/release?version=${githubRelease.tag_name}`,
      // Extra metadata for rendering or filtering in the view
      parent,
      
    }

    return release;
  })

  const releasesIndexedByParent = index(res.locals.releases, {by: 'parent'});

  res.locals.releases.forEach(release => {
    release.children = releasesIndexedByParent[release.version] 
    release.content = release.children ? release.children.map(child => child.version).join(', ') : 'No children'
  })

  res.locals.releasesByVersion = index(res.locals.releases, {by: 'version'})

  next();
})

router.get('/release', (req, res, next) => {

  res.locals.release = res.locals.releasesByVersion[req.query.version][0];
  
  next();
})

function index(list, {by:property}) {
  const index = {};

  list.forEach(item => {

    const value = item[property];

    if (!index[value]) {
      index[value] = []
    }

    index[value].push(item)
  })
  
  return index;
}

function getReleaseParent(release) {
  const [versionNumber,preReleaseVersionNumber] = release.tag_name.split('-');
  const [major, minor, patch] = versionNumber.split('.');
  if (preReleaseVersionNumber){
    if (major == 'v0') {
      return 'v1.0.0';
    }
    return versionNumber;
  }

  
  if (patch !== '0') {
    return [major, minor, 0].join('.')
  }
  if (minor !== '0') {
    return [major, 0, 0].join('.')
  }
}
