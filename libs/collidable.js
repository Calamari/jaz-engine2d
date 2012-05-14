
var Vector = Vector || require(__dirname + '/vector');

var Collidable = function() {
  this.collisionType = 'none'
};

Collidable.Rectangle = function(config) {
  config = config || {};
  this.collisionType = 'rectangle';
  this.position = config.position || new Vector();
  this.width = config.width || 0;
  this.height = config.height || 0;

  this.isHit = function() {};
};

Collidable.Circle = function(config) {
  config = config || {};
  this.collisionType = 'circle';
  this.position = config.position || new Vector();
  this.radius = config.radius || 0;

  this.isHit = function() {};
};

Collidable.Polygon = function(config) {
  config = config || {};
  this.collisionType = 'polygon';
  this.position = config.position || new Vector();
  this.points = config.points || [];
  this.width = 0;
  this.height = 0;

  this.isHit = function() {};
};

Collidable.Polygon.prototype.calculateBox = function() {
  var points = this.points,
      minX = points[0].x,
      minY = points[0].y,
      maxX = points[0].x,
      maxY = points[0].y;
  for (var i=points.length;i--;) {
    minX = Math.min(minX, points[i].x);
    minY = Math.min(minY, points[i].y);
    maxX = Math.max(maxX, points[i].x);
    maxY = Math.max(maxY, points[i].y);
  }
  this.width = maxX - minX;
  this.height = maxY - minY;
  // if the box does not begin with 0,0 coordinates
  this.offset = new Vector(minX, minY);
};

if (typeof module !== 'undefined') {
  module.exports = Collidable;
}