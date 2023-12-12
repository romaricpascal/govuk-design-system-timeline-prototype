module.exports = {
  DATE_FORMAT: new Intl.DateTimeFormat(
  'en-gb',
  {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }
)
}
