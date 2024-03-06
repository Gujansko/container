const generateGoogleMapsLink = (
  start,
  end,
  waypoints = [],
  travelMode = "bicycling"
) => {
  let link =
    "https://www.google.com/maps/dir/?api=1&origin=" +
    encodeURIComponent(start) +
    "&destination=" +
    encodeURIComponent(end);

  if (waypoints.length > 0) {
    let waypointsString = waypoints
      .map(function (waypoint) {
        return encodeURIComponent(waypoint);
      })
      .join("|");

    link += "&waypoints=" + waypointsString;
  }

  link += "&travelmode=" + travelMode;

  return link;
};

export default generateGoogleMapsLink;
