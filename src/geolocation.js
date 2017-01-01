/*jslint browser: true*/

/**
 * Wraps functionality related with navigator.geolocation capabilities.
 *
 * @namespace Geolocation
 * @module Geolocation.Detector
 * @test ../test/test.detector.js
 */
var Geolocation = (function(namespace) {
  "use strict";

  /**
   * @constructor
   */
  const Detector = function() {
    /**
     * @type {Boolean} _isEnabled
     */
    this._isEnabled = !!navigator.geolocation;

    /**
     * Used to cache the last determined position
     * @type {Object} _position
     */
    this._position = null;
  };

  /**
   * @method getPosition
   * @return {Object}
   */
  Detector.prototype.getPosition = function() {
    return this._position;
  };

  /**
   * @method assertIsEnabled
   * @private
   * @throws Error
   */
  Detector.prototype._assertIsEnabled = function() {
    if (!this._isEnabled) {
      throw new Error('Couldn\'t access to Geolocation information.');
    }
  };

  /**
   * Uses navigator.geoloation API to determine the current user's position.
   *
   * @return {Promise}
   * @method detect
   * @public
   */
  Detector.prototype.detect = function() {

    this._assertIsEnabled();

    const self = this;
    const promise = new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition((position) => {
        // Update the current position
        self._position = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        resolve(position);
      }, () => {
        reject();
      });
    });

    return promise;
  };

  /**
   * @method getPositionCoordinates
   * @return {LatLng}
   * @public
   */
  Detector.prototype.getPositionCoordinates = function() {
    return new google.maps.LatLng(this._position.latitude, this._position.longitude);
  };

  /**
   * Detect user's current address based on the current position
   *
   * @method detectAddress
   * @return {Promise}
   * @public
   */
  Detector.prototype.detectAddress = function() {

    const self = this;
    const promise = new Promise((resolve, reject) => {

      const geocoder = new google.maps.Geocoder();

      const currentPosition = self.getPositionCoordinates();
      geocoder.geocode({ 'latLng': currentPosition }, (results, status) => {

        if (results.length > 0) {
          resolve(results[results.length-1].formatted_address);
        } else {
          reject();
        }

      });

    });

    return promise;

  };

  // Augment the Geolocation namespace by adding the Detector object
  namespace.Detector = new Detector();
  return namespace;

})(Geolocation || {});

if (typeof module !== 'undefined') {
  module.exports = Geolocation.Detector;
}
