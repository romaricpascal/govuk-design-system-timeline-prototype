# GOV.UK Design System timeline prototype

Prototype of a timeline tracing the different events in the life of the Design System

## How it works

There are two main views:

* `index.html` for the initial timeline
* `release.html` for pages showing a specific release, with its own timeline
  + This could likely be renamed to `event.html` and made generic to render any kind of event based on some structured content in the event's data (eg. image, html, ...)  

### Rendering timelines

Both rely on an [`appTimeline` macro](app/views/components/timeline/macro.njk), which is a port of the [HMRC Timeline](https://design.tax.service.gov.uk/hmrc-design-patterns/timeline/) component we can [adapt to our needs](app/views/components/timeline/template.njk):

* It now accepts a `url` field for each of its event, which if present will render the heading as a link.

### Data provided to the views

For lack of understanding how [`app/data/session-data-defaults.js`](app/data/session-data-defaults.js) was meant to be used, the data for the different events is collected in an Express middleware in [`app/routes.js`](app/routes.js).

That middleware then delegates the loading of the events to individual functions related to a specific kind of events (eg. GitHub releases, Service phases...) to avoid merging everything together. These loading functions are responsible for:

* loading a JSON file with raw data (used the same name as the JS file for easy association)
* transforming the raw data into the shape expected by the Timeline component
  + Formating date entries is one of the key things

### [IN PROGRESS] Filtering the initial timeline

As the number of types of events will grow, we're looking at letting people filter the timeline.

#### (Totally scrappable) plan for filtering

**The actual filtering based on query parameters is not implemented yet** That's likely the first step to go for and:

* add a `type` to each `event`
* filter events based on a `type[]` query parameter in the URL
* see if we want other parameters (eg. `before`/`after` for dates, for example)

> Given we're using the Prototype Kit, we can implement this server-side in the Prototype Kit for now. For the final version, we could see that filtering as an enhancement, which would let us implement it in JavaScript, allowing the site to be hosted statically/integrated in our team docs.

Regarding how that parameter gets filled, the visual shape of it is up for discussion. Implementation wise, we'll likely want a `<form>` in any case, to easily combine filtering options.

For now, the `index.html` implements the layout and [Filter component](https://design-patterns.service.justice.gov.uk/components/filter/) from [MoJ's Filter a list pattern](https://design-patterns.service.justice.gov.uk/patterns/filter-a-list/).

We're not tied to either:

* If we don't like the Filter component, I believe that the layout of the Filter a list pattern can host anything in its filter column. To be tested though.
* If we don't need that hideable filter column, we can also pick a completely custom layout.

### [Future] Content rendering

Both pages of the prototype are very unconstrained regarding what we display and in which order:

* we're in total control of the markup of the pages themselves
* beyond the heading-time-content order of the timeline events (which we could still modify), the `content` is raw HTML, so we can put whatever we want in there, including [Detail components](https://design-system.service.gov.uk/components/details/) if we fancy collapsing some info.
  + We can also modify the template of the component if we want some entries to look slightly different or make the rendering more systematic and based on specific data from the `events` objects.




