
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
          isHit = this._checkPolygonCollision(obj1, obj2);
        }
      }
      if (isHit) {
        obj1.isHit = true;
        obj1.emit('hit', obj2);
        obj2.isHit = true;
        obj2.emit('hit', obj1);
        this.collisions.push([obj1, obj2]);
      } else {
        if (obj1.isHit) { // if it was hit
          obj1.isHit = false;
          obj1.emit('leaveHit');
        }
        if (obj2.isHit) { // if it was hit
          obj2.isHit = false;
          obj2.emit('leaveHit');
        }
      }
    }
  }
};

CollisionDetection.prototype._checkPolygonCollision = function(obj1, obj2) {
  var points1 = obj1.points,
      points2 = obj2.points,
      axis, i, l, projection1, projection2;

  for (i = 0, l=points1.length; i<l; ++i) {
    axis = points1[i].clone().sub(points1[(i == points1.length-1 ? 0 : (i+1))]).rightNormal();
    projection1 = obj1.project(axis);
    projection2 = obj2.project(axis);
    if (!this._doProjectionsOverlap(projection1, projection2)) {
      return false;
    }
  }

  for (i = points2.length; i--; ) {
    axis = points2[i].clone().sub(points2[(i == points2.length-1 ? 0 : (i+1))]).rightNormal();
    projection1 = obj1.project(axis);
    projection2 = obj2.project(axis);
    if (!this._doProjectionsOverlap(projection1, projection2)) {
      return false;
    }
  }
  return true;
};

CollisionDetection.prototype._doProjectionsOverlap = function(projection1, projection2) {
  return (projection1[0] <= projection2[1] && projection1[1] >= projection2[0])
      || (projection2[0] <= projection1[1] && projection2[1] >= projection1[0]);
};

CollisionDetection.prototype.getCollisions = function() {
  return this.collisions;
};

if (typeof module !== 'undefined') {
  module.exports = CollisionDetection;
}
