
var CollisionDetection = CollisionDetection || require(__dirname + '/../libs/collision_detection');
var Collidable = Collidable || require(__dirname + '/../libs/collidable');
var Vector = Vector || require(__dirname + '/../libs/vector');

var getRect = function(x1, y1, x2, y2) {
  return new Collidable.Rectangle({
    position: new Vector(x1, y1),
    width: x2-x1,
    height: y2-y1
  });
};

var getCircle = function(x, y, r) {
  return new Collidable.Circle({
    position: new Vector(x, y),
    radius: r
  });
};

var getPolygon = function() {
  var poly = new Collidable.Polygon({
    points: [].slice.call(arguments)
  });
  poly.calculateBoundingBox();
  return poly;
};

describe(CollisionDetection, function() {
  it("can be instantiated", function(done) {
    var detector = new CollisionDetection();
    expect(detector.constructor).toEqual(CollisionDetection);
    done();
  });

  it("has method for getting number of Elements on it", function(done) {
    var detector = new CollisionDetection();
    expect(typeof detector.countElements).toEqual('function');
    done();
  });

  it("#countElements is 0 if no elements are inserted", function(done) {
    var detector = new CollisionDetection();
    expect(detector.countElements()).toEqual(0);
    done();
  });

  it("takes some objects as arguments", function(done) {
    var detector = new CollisionDetection({ test: 1 }, { test: 2 });
    expect(detector.countElements()).toEqual(2);
    done();
  });

  it("can take an array of objects as arguments", function(done) {
    var detector = new CollisionDetection([{ test: 1 }, { test: 2 }]);
    expect(detector.countElements()).toEqual(2);
    done();
  });

  it("can take an array and more objects as arguments", function(done) {
    var detector = new CollisionDetection([{ test: 1 }, { test: 2 }], { test: 3 });
    expect(detector.countElements()).toEqual(3);
    done();
  });

  it("#addObjects method adds more objects to test with", function(done) {
    var detector = new CollisionDetection([{ test: 1 }, { test: 2 }]);
    detector.addObjects({ test: 3 });
    expect(detector.countElements()).toEqual(3);
    done();
  });

  it("#add is an alias for #addObjects", function(done) {
    var detector = new CollisionDetection();
    expect(detector.add).toEqual(detector.addObjects);
    done();
  });

  it("#removeObject method removes objects again", function(done) {
    var a = { test: 1 },
        b = { test: 2 };
    var detector = new CollisionDetection([a, b]);
    detector.remove(a);
    expect(detector.countElements()).toEqual(1);
    done();
  });

  it("#removeObject does not remove similar objects", function(done) {
    var a = { test: 1 },
        b = { test: 2 };
    var detector = new CollisionDetection([a, b]);
    detector.remove({ test: 1 });
    expect(detector.countElements()).toEqual(2);
    done();
  });

  describe('#getCollisions', function() {
    it("has a getCollisions method", function(done) {
      var detector = new CollisionDetection();
      expect(typeof detector.getCollisions).toEqual('function');
      done();
    });

    it("returns list of colliding objects", function(done) {
      var detector = new CollisionDetection();
      expect(detector.getCollisions().constructor).toEqual(Array);
      done();
    });

    it("is empty when not tested yet", function(done) {
      var detector = new CollisionDetection();
      expect(detector.getCollisions().length).toEqual(0);
      done();
    });

    it("is empty if only one object is registered", function(done) {
      var detector = new CollisionDetection(getCircle(0,0, 3));
      detector.test();
      expect(detector.getCollisions().length).toEqual(0);
      done();
    });

    it("is empty if no collisions are found", function(done) {
      var detector = new CollisionDetection(getCircle(0,0, 3), getCircle(6,0, 2));
      detector.test();
      expect(detector.getCollisions().length).toEqual(0);
      done();
    });

    it("includes both colliding objects", function(done) {
      var circle1 = getCircle(0,0, 3),
          circle2 = getCircle(4,0, 3),
          detector = new CollisionDetection(circle1, circle2);
      detector.test();
      expect(detector.getCollisions()[0].length).toEqual(2);
      expect(detector.getCollisions()[0]).toContain(circle1);
      expect(detector.getCollisions()[0]).toContain(circle2);
      done();
    });
  });

  describe('#test', function() {
    it("has a test method for the real collision checking", function(done) {
      var detector = new CollisionDetection();
      expect(typeof detector.test).toEqual('function');
      done();
    });


    it("finds collisions on circles", function(done) {
      var detector = new CollisionDetection(getCircle(0,0, 3), getCircle(4,0, 3));
      detector.test();
      expect(detector.getCollisions().length).toEqual(1);
      done();
    });

    it("finds no collisions on not touching circles", function(done) {
      var detector = new CollisionDetection(getCircle(0,0, 3), getCircle(6,0, 3));
      detector.test();
      expect(detector.getCollisions().length).toEqual(0);
      done();
    });

    it("finds slightly touching circles", function(done) {
      var detector = new CollisionDetection(getCircle(0,0, 3), getCircle(5.9999,0, 3));
      detector.test();
      expect(detector.getCollisions().length).toEqual(1);
      done();
    });


    it("finds collisions on rectangles", function(done) {
      var detector = new CollisionDetection(getRect(0,0, 3,3), getRect(2,2, 4,4));
      detector.test();
      expect(detector.getCollisions().length).toEqual(1);
      done();
    });

    it("finds no collisions on not touching rectangles", function(done) {
      var detector = new CollisionDetection(getRect(0,0, 3,3), getRect(3.0001,3, 4,4));
      detector.test();
      expect(detector.getCollisions().length).toEqual(0);
      done();
    });

    it("finds slightly touching rectangles", function(done) {
      var detector = new CollisionDetection(getRect(0,0, 3,3), getRect(3,3, 4,4));
      detector.test();
      expect(detector.getCollisions().length).toEqual(1);
      done();
    });

    it("finds containing rectangles", function(done) {
      var detector = new CollisionDetection(getRect(0,0, 3,3), getRect(1,1, 2,2));
      detector.test();
      expect(detector.getCollisions().length).toEqual(1);
      done();
    });

    it("finds big rectangle with small rectangle cutting through", function(done) {
      var detector = new CollisionDetection(getRect(0,0, 3,3), getRect(-1,1, 4,2));
      detector.test();
      expect(detector.getCollisions().length).toEqual(1);
      done();
    });


    it("finds collisions on polygons", function(done) {
      var detector = new CollisionDetection(
        getPolygon(new Vector(0,0), new Vector(3,3), new Vector(0,3)),
        getPolygon(new Vector(1,0), new Vector(1,2), new Vector(3,0))
      );
      detector.test();
      expect(detector.getCollisions().length).toEqual(1);
      done();
    });

    xit("finds no collisions if polygons only intersect in bounding box", function(done) {
      var detector = new CollisionDetection(
        getPolygon(new Vector(0,0), new Vector(3,3), new Vector(0,3)),
        getPolygon(new Vector(3,0), new Vector(3,2), new Vector(2,0))
      );
      detector.test();
      expect(detector.getCollisions().length).toEqual(0);
      done();
    });
  });

  it('calls isHit method on every hit object', function(done) {
    var hitCircle1 = getCircle(0,0, 3),
        hitCircle2 = getCircle(4,0, 3),
        notHitCircle = getCircle(14,0, 3);
    spyOn(hitCircle1, 'isHit');
    spyOn(hitCircle2, 'isHit');
    spyOn(notHitCircle, 'isHit');
    var detector = new CollisionDetection(hitCircle1, hitCircle2, notHitCircle);
    detector.test();
    expect(hitCircle1.isHit).toHaveBeenCalledWith(hitCircle2);
    expect(hitCircle2.isHit).toHaveBeenCalledWith(hitCircle1);
    expect(notHitCircle.isHit).not.toHaveBeenCalled();
    done();
  });

});
