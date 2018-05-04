const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export function formatDate(date) {
  return date.toLocaleDateString('en', dateOptions)
}
