/* global google */

/**
 * PathFinder is used to compute distance between geographic points,
 * it can be used to filter journey waypoints list based on their distance
 * to the current user's position.
 *
 * @namespace Geolocation
 * @module Geolocation.PathFinder
 * @test ../../../test/test.path-finder.js
 */
const Geolocation = (function(namespace) {
  'use strict';

  /**
   * @constructor
   */
  const PathFinder = function() {
  };

  /**
   * Compute the distance between two points using the google maps geometry tools.
   *
   * @param {Object} origin
   * @param {Object} destination
   * @return {Number} [meters]
   * @method computeDistance
   * @public
   */
  PathFinder.prototype.computeDistance = function(origin, destination) {
    return google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
  };

  /**
   * Given a path composed by geographic points, filter it based on the
   * arrival time passed as argument so the returned path distance is less or
   * equal to the distance.
   *
   * @param {Array} path
   * @param {Number} speed (km/h)
   * @param {Date} arrival
   * @method filterPathByArrivalTime
   * @return {Array}
   * @public
   */
  PathFinder.prototype.filterPathByArrivalTime = function(path, speed, arrival) {
    const arrivalDate = new Date(arrival);
    const currentDate = new Date();

    const seconds = (arrivalDate.getTime() - currentDate.getTime())/1000;
    const metersSecond = (speed * 1000)/3600;
    const distance = (metersSecond * seconds);

    return this.filterPathByDistance(path, distance);
  };

  /**
   * Given a path composed by geographic points, filter it based on the
   * distance passed as argument so the returned path distance is less or
   * equal to the distance.
   *
   * @param {Array} path
   * @param {Number} distance
   * @method filterPathByDistance
   * @return {Array}
   * @public
   */
  PathFinder.prototype.filterPathByDistance = function(path, distance) {
    if (path.length < 2) {
      throw new Error('We can not filter a path with less than 1 point.');
    }

    const numPoints = path.length;

    let i;
    let origin = path[numPoints-1];
    let destination = path[numPoints-2];
    let filteredPath = [];

    // Insert the two last points of the path
    let currentDistance = this.computeDistance(origin, destination);
    filteredPath.push(origin);
    filteredPath.push(destination);

    // Now continue the path, starting by the previous point, until we reach the distance
    for (i = numPoints - 2; i >= 1 && currentDistance < distance; i--) {
      origin = path[i];
      destination = path[i-1];
      currentDistance += this.computeDistance(origin, destination);
      filteredPath.push(destination);
    }

    // We traversed the path in reverse order, so we need to set the right order
    // for further processing.
    filteredPath = filteredPath.reverse();

    return filteredPath;
  };

  // Augment the namespace by adding the PathFinder object
  namespace.PathFinder = PathFinder; // eslint-disable-line no-param-reassign
  return namespace;
})(global.Geolocation || {}); // eslint-disable-line no-use-before-define

module.exports = Geolocation.PathFinder;
