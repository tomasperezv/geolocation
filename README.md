# Geolocation

Library for retrieving geolocation information, computing distances and paths over geographic coordinates.

It provides an abstraction layer based on promises on top of the Google Maps API and the Geolocation HTML API.

## Basic usage

The library provides the object `Geolocation` that contains the different utilities.

### Geolocation.Detector

Wraps functionality related with the `navigator.geolocation` API.

- Detect user's position

```javascript
Geolocation.Detector.detect()
  .then((position) => {
    console.log(position.coords.latitude);  // e.g. 60.34
    console.log(position.coords.longitude); // e.g. 18.23
  });
```

- Detect user's address

```javascript
Geolocation.Detector.detectAddress()
  .then((address) => {
    console.log(address); // e.g. 'Calle Domingo Pardo, 11, 28035 Madrid, Spain'
  });
```

- Obtain last computed position

```javascript
Geolocation.Detector.getPositionCoordinates(); // e.g. { cords: { longitude: 60.45, latitude: 18.23 } }
```

### Geolocation.PathFinder

Provides several different utilities to perform operations such as computing distances between coordinates.

- Compute distance between 2 points: returning the length of the shortest path.

```javascript
const origin = new google.maps.LatLng(40.4811241,-3.7207215);
const destination = new google.maps.LatLng(40.4822748,-3.7181358)

const distance = Geolocation.PathFinder.computeDistance(origin, destination); // 253.6543534046843 (meters)
```

- Given a path composed by geographic points, filter it based on the distance passed as argument so the returned path distance is less or equal to the distance.

```javascript
const path = [
  new google.maps.LatLng(40.4811241,-3.7207215),
  new google.maps.LatLng(40.4822748,-3.7181358),
  new google.maps.LatLng(40.4806753,-3.7138657)
];

const newPath = Geolocation.PathFinder.filterPathByDistance(path, 500); // Reduce the list of points to a path of 500 meters.
```

- Given a path composed by geographic points, filter it based on the arrival time passed as argument so the returned path distance is less or equal to the distance.

```javascript
const path = [
  new google.maps.LatLng(40.4811241,-3.7207215),
  new google.maps.LatLng(40.4822748,-3.7181358),
  new google.maps.LatLng(40.4806753,-3.7138657)
];

// Compose a new path based on an estimated arrival time and a base speed of 50 km/h
const newPath = Geolocation.PathFinder.filterPathByArrivalTime(path, 50, 'Sun Feb 24 2016 10:52:36 GMT+0100');
```

## Run the tests

```javascript
npm test
```
## Linter

```javascript
eslint ./src/ ./test/
```
