
var Vector = Vector || require(__dirname + '/vector');
var CollisionDetection = function() {
  this.objects = [];
  this.collisions = [];
  this.addObjects.apply(this, arguments);
};

CollisionDetection.prototype.add =
CollisionDetection.prototype.addObjects = function() {
  for (var i=0, l=arguments.length; i<l; ++i) {
    if (arguments[i]) {
      if (arguments[i].constructor == Array) {
        this.objects.push.apply(this.objects, arguments[i]);
      } else {
        this.objects.push(arguments[i]);
      }
    }
  }
};

CollisionDetection.prototype.remove =
CollisionDetection.prototype.removeObject = function(obj) {
  for (var i=this.objects.length; i--;) {
    if (this.objects[i] === obj) {
      this.objects.splice(i, 1);
      break;
    }
  }
};

CollisionDetection.prototype.countElements = function() {
  return this.objects.length;
};

/**
 * @TODOs:
    Polygon checks, polygon vs circle, polygon vs rectangle, rectangle vs circle, etc..
 */
CollisionDetection.prototype.test = function() {
  var objects = this.objects,
      distance, i, j, obj1, obj2, isHit, p1, p2, isPolygonCheck;
  this.collisions = [];
  for (i=objects.length; i--;) {
    for (j=i; j--;) {
      obj1 = objects[i];
      obj2 = objects[j];
      isHit = false;
      if (obj1.collisionType === 'circle' && obj2.collisionType === 'circle') {
        distance = new Vector(obj1.position.x, obj1.position.y).distanceTo(new Vector(obj2.position.x, obj2.position.y));
        isHit = (distance < obj1.radius + obj2.radius);
      } else {//if (obj1.collisionType === 'rectangle' && obj2.collisionType === 'rectangle') {
        p1 = obj1.position;
        p2 = obj2.position;
        isPolygonCheck = obj1.collisionType === 'polygon' && obj2.collisionType === 'polygon';
        if (isPolygonCheck) {
          p1.clone().add(obj1.offset);
          p2.clone().add(obj2.offset);
        }
        isHit = (p1.y + obj1.height >= p2.y)
             && (p1.y <= p2.y + obj2.height)
             && (p1.x + obj1.width >= p2.x)
             && (p1.x <= p2.x + obj2.width);
        if (isHit && isPolygonCheck) {

        }
      }
      if (isHit) {
        obj1.emit('hit', obj2);
        obj2.emit('hit', obj1);
        this.collisions.push([obj1, obj2]);
      }
    }
  }
};

CollisionDetection.prototype.getCollisions = function() {
  return this.collisions;
};

if (typeof module !== 'undefined') {
  module.exports = CollisionDetection;
}
