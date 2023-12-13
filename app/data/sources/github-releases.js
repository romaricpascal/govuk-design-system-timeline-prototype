const {DATE_FORMAT} = require('./util/date.js');

module.exports = {
  /**
   * Shape the raw date from GitHub API into objects that can be used
   * by the HMRC Frontend Timeline component
   * 
   * @returns {{
   *   releases: Array<AppTimelineEvent>,
   *   releasesByVersion: {string: Array<AppTimelineEvent>}
   * }}
   */
  getGitHubReleasesEvents() {
    const githubReleases = require('../github-releases.json');
    
    // First, we can shape most of the data into an event-shaped object
    // with some extra keys to help rendering/filtering 
    const releases = githubReleases.map(githubRelease => {

      const formattedReleaseDate = DATE_FORMAT.format(new Date(githubRelease.created_at));
      const parent = getReleaseParent(githubRelease.tag_name);

      const release = {
        // Data expected by the component
        title: `We released ${githubRelease.name}`,
        datetime: githubRelease.created_at,
        time: formattedReleaseDate,
        url: `/release?version=${githubRelease.tag_name}`,
        // Extra metadata for rendering or filtering in the view
        parent,
        version: githubRelease.tag_name,
        classes: 'app-release'
      }

      return release;
    })

    // To save lookups when rendering a single release's timeline
    // we can store the list of child releases in each release
    // First computing an index of the releases by parent release
    const releasesIndexedByParent = index(releases, {by: 'parent'});
    // Then making the association, each release receiving its list of children
    // and rendering it as content
    releases.forEach(release => {
      release.children = releasesIndexedByParent[release.version] 
      release.content = release.children ? release.children.map(child => child.version).join(', ') : 'No children'
    })

    // To save running through the list of release 
    // when finding a specific release to render,
    // we can store an index of the releases by version
    const releasesByVersion = index(releases, {by: 'version'})

    return {
      releases,
      releasesByVersion
    }
  }
}

/**
 * Indexes objects of the given list according to the given property
 * @template {Object} Item
 * @param {Item[]} list 
 * @param {{by: string}} options
 * @returns {{string: Item[]}} An object whose keys are the unique values for the given property, and values arrays of each of the items for which property has that specific value
 */
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

/**
 * Returns the parent version for the given release.
 * 
 * A release's parent is:
 * - for 0.x, 1.0.0
 * - for pre-releases, the actual release they're a pre-release for
 * - for minor releases, the major release
 * - for patch releases, the minor release
 * 
 * @param {string} version
 * @returns 
 */
function getReleaseParent(version) {
  const [versionNumber,preReleaseVersionNumber] = version.split('-');
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

/**
 * Data expected by this app's Timeline component,
 * extending that of HMRC Frontend
 * 
 * @typedef {HMRCTimlineEvent} AppTimelineEvent
 * @property {string} [url] - If present, render the heading as a link to this URL
 */

/**
 * Data expected by HMRC Frontend's Timeline component
 * for its individual events
 * 
 * @typedef {Object} HMRCTimlineEvent
 * @property {string} title - The title that'll go in the heading
 * @property {string} [content] - HTML for the content of the event
 * @property {string} time - The date/time displayed for the event
 * @property {string} datetime - The value of the `datetime` attribute of the `<time>` tag that wraps the displayed time
 */
