"use strict"

/**
 *  An implementation of a vector
 * @TODO: fasten up with prototype
 */
var Vector = function(x, y) {
  this.x = x ? x : 0;
  this.y = y ? y : 0;

  this.clone = function() {
    return new Vector(this.x, this.y);
  };

  this.add = function(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  };

  this.sub = function(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  };

  this.dotProduct = function(v) {
    return this.x * v.x + this.y * v.y;
  };

  /** returns the right hand normal of vector */
  this.rightNormal = function() {
    return new Vector(-this.y, this.x);
  };

  /** returns the left hand normal of vector */
  this.leftNormal = function() {
    return new Vector(this.y, -this.x);
  };

  this.skalar = function(a) {
    this.x *= a;
    this.y *= a;
    return this;
  };

  this.length = function() {
    return this.distanceTo({ x: 0, y: 0 });
  };

  this.distanceTo = function(v) {
    return Math.sqrt(Math.pow(this.x - v.x,2) + Math.pow(this.y - v.y,2));
  };

  this.equals = function(v) {
    return this.x === v.x && this.y === v.y;
  };

  this.toJSON = function() {
    return { x: this.x, y: this.y };
  };

  this.normalize = function(toLength) {
    if (typeof toLength === 'undefined') { toLength = 1; }
    this.skalar(toLength / this.length());
    return this;
  };

  this.rotate = function(degree) {
    degree = degree * (Math.PI / 180.0);
    var nx = Math.cos(degree) * this.x - Math.sin(degree) * this.y,
        ny = Math.sin(degree) * this.x + Math.cos(degree) * this.y;
    this.x = nx;
    this.y = ny;
    return this;
  };
};

if (typeof module !== 'undefined') {
  module.exports = Vector;
}
