'use strict';

/* global describe, it, window, beforeEach, afterEach, Geolocation, google */

const expect = require('expect.js');

/**
 * Unit tests for the Geolocation object
 * @see ../src/geolocation.js
 */
describe('Geolocation', () => {
  /**
   * @type {Number} LATITUDE
   */
  const LATITUDE = 60.34;

  /**
   * @type {Number} LONGITUDE
   */
  const LONGITUDE = 18.23;

  /**
   * @type {String} ADDRESS
   */
  const ADDRESS = 'Calle Domingo Pardo, 11, 28035 Madrid, Spain';

  /**
   * @method beforeEach
   */
  beforeEach(() => {
    // Simulate the Geolocation namespace
    global.Geolocation = {};

    // Mock object for the navigation.geolocation feature, that way
    // we can run the tests isolated without external dependencies.
    global.navigator = {
      geolocation: {
        getCurrentPosition: (callback) => {
          const position = {
            coords: {
              latitude: LATITUDE,
              longitude: LONGITUDE
            }
          };

          callback(position);
        }
      }
    };

    // Mock the Geocoder object that we'll use for retrieving candidate addressess
    global.google = {
      maps: {}
    };

    global.google.maps.Geocoder = function() {};
    global.google.maps.Geocoder.prototype.geocode = (position, callback) => {
      callback([
        {
          formatted_address: ADDRESS,
          geometry: {
            location: {
              lat: 40.4753402,
              lng: -3.719688000000019
            },
            location_type: 'ROOFTOP',
            viewport: {
              south: 40.4739912197085,
              west: -3.721036980291501,
              north: 40.4766891802915,
              east: -3.7183390197085373
            }
          },
          place_id: 'ChIJr9Wlu5UpQg0RidDkIsItxNA',
          types: [
            'street_address'
          ]
        }
      ]);
    };

    google.maps.LatLng = function() {};
  });

  /**
   * @method afterEach
   */
  afterEach(() => {
    // Remove created objects to avoid colliding with other tests execution.
    delete global.navigator;
    delete global.Geolocation;
    delete global.google;
  });

  describe('Detect geolocation information', () => {
    it('Browser without geolocation capability', () => {
      delete global.navigator.geolocation;
      const Geolocation = require('../src/geolocation');

      expect(() => {
        expect(Geolocation._isEnabled).to.be(false);
        Geolocation.detect();
      }).to.throwException((e) => {
        expect(e).to.be.an(Error);
        expect(Geolocation._isEnabled).to.be(false);
      });
    });

    it('Browser with geolocation capability', (done) => {
      const Geolocation = require('../src/geolocation');
      Geolocation._isEnabled = true;

      Geolocation.detect()
      .then((position) => {
        expect(Geolocation._isEnabled).to.be(true);
        expect(position.coords.latitude).to.be(LATITUDE);
        expect(position.coords.longitude).to.be(LONGITUDE);
        done();
      });
    });
  });

  describe('Obtain address information', () => {
    it('Browser with geolocation capability', (done) => {
      const Geolocation = require('../src/geolocation');
      Geolocation._isEnabled = true;

      Geolocation.detectAddress()
      .then((address) => {
        expect(address).to.be(ADDRESS);
        done();
      });
    });
  });
});
