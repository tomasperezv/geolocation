'use strict';

/* global describe, it, window, beforeEach, afterEach, Geolocation, google */

const expect = require('expect.js');
const sinon = require('sinon');

/**
 * Unit tests for the PathFinder object
 * @see ../src/path-finder.js
 */
describe('PathFinder', () => {
  /**
   * @method beforeEach
   */
  beforeEach(() => {
    global.Geolocation = {};

    // Mock the google.maps.geometry object
    global.google = {
      maps: {
        geometry: {
          spherical: {
            computeDistanceBetween: () => {}
          }
        }
      }
    };
  });

  /**
   * @method afterEach
   */
  afterEach(() => {
    delete global.Geolocation;
    delete global.google;
  });

  describe('Detect geolocation information', () => {
    it('Computing distances', () => {
      sinon.spy(global.google.maps.geometry.spherical, 'computeDistanceBetween');

      const PathFinder = require('../src/path-finder');
      const pathFinder = new PathFinder();

      expect(global.google.maps.geometry.spherical.computeDistanceBetween.calledOnce).to.be(false);

      pathFinder.computeDistance();
      expect(global.google.maps.geometry.spherical.computeDistanceBetween.calledOnce).to.be(true);

      global.google.maps.geometry.spherical.computeDistanceBetween.restore();
    });
  });

  describe('Filter a path', () => {
    /**
     * @type {Number} DISTANCE
     */
    const DISTANCE = 5;

    it('Checks path length', () => {
      const PathFinder = require('../src/path-finder');
      const pathFinder = new PathFinder();

      // Empty paths are not computed
      expect(() => {
        pathFinder.filterPathByDistance([], DISTANCE);
      }).to.throwException((e) => {
        expect(e).to.be.an(Error);
      });

      // Paths with only one element are not computed
      expect(() => {
        pathFinder.filterPathByDistance([{}], DISTANCE);
      }).to.throwException((e) => {
        expect(e).to.be.an(Error);
      });
    });

    it('Filtering paths by distance', () => {
      // Fake the return calls by the computeDistanceBetween method
      sinon.stub(global.google.maps.geometry.spherical, 'computeDistanceBetween', () => 2);

      const PathFinder = require('../src/path-finder');
      const pathFinder = new PathFinder();
      const path = ['a', 'b', 'c', 'd'];

      const filteredPath = pathFinder.filterPathByDistance(path, 4);
      expect(filteredPath).to.eql(['b', 'c', 'd']);

      global.google.maps.geometry.spherical.computeDistanceBetween.restore();
    });
  });
});
