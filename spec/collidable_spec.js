
var Vector = require(__dirname + '/../libs/vector');
var Collidable = require(__dirname + '/../libs/collidable');

describe(Collidable, function() {
  it("Instance of abstract class Collidable has 'none' as collision type", function(done) {
    var obj = new Collidable();
    expect(obj.collisionType).toEqual('none');
    done();
  });

  describe(Collidable.Rectangle, function() {
    it("has 'rectangle' as collision type", function(done) {
      var obj = new Collidable.Rectangle();
      expect(obj.collisionType).toEqual('rectangle');
      done();
    });

    it("has a position of top left coordinates", function(done) {
      var obj = new Collidable.Rectangle();
      expect(obj.position.constructor).toEqual(Vector);
      done();
    });

    it("can take the top left position as constructor arguments", function(done) {
      var obj = new Collidable.Rectangle({ position: new Vector(4,3) });
      expect(obj.position.x).toEqual(4);
      expect(obj.position.y).toEqual(3);
      done();
    });

    it("has a width", function(done) {
      var obj = new Collidable.Rectangle();
      expect(obj.width).toEqual(0);
      done();
    });

    it("can take the width as constructor arguments", function(done) {
      var obj = new Collidable.Rectangle({ width: 12 });
      expect(obj.width).toEqual(12);
      done();
    });

    it("has a height", function(done) {
      var obj = new Collidable.Rectangle();
      expect(obj.height).toEqual(0);
      done();
    });

    it("can take the height as constructor arguments", function(done) {
      var obj = new Collidable.Rectangle({ height: 14 });
      expect(obj.height).toEqual(14);
      done();
    });
  });

  describe(Collidable.Circle, function() {
    it("has 'circle' as collision type", function(done) {
      var obj = new Collidable.Circle();
      expect(obj.collisionType).toEqual('circle');
      done();
    });

    it("has a position of the middle point", function(done) {
      var obj = new Collidable.Circle();
      expect(obj.position.constructor).toEqual(Vector);
      done();
    });

    it("can take the middle point position as constructor arguments", function(done) {
      var obj = new Collidable.Circle({ position: new Vector(4,3) });
      expect(obj.position.x).toEqual(4);
      expect(obj.position.y).toEqual(3);
      done();
    });

    it("has a radius", function(done) {
      var obj = new Collidable.Circle();
      expect(obj.radius).toEqual(0);
      done();
    });

    it("radius can be set through constructor arguments", function(done) {
      var obj = new Collidable.Circle({ radius: 10 });
      expect(obj.radius).toEqual(10);
      done();
    });
  });

  describe(Collidable.Polygon, function() {
    it("has 'polygon' as collision type", function(done) {
      var obj = new Collidable.Polygon();
      expect(obj.collisionType).toEqual('polygon');
      done();
    });

    it("has a position for top left coordinates", function(done) {
      var obj = new Collidable.Polygon();
      expect(obj.position.constructor).toEqual(Vector);
      done();
    });

    it("has an array of points defining the polygon", function(done) {
      var obj = new Collidable.Polygon();
      expect(obj.points.constructor).toEqual(Array);
      done();
    });

    it("has a width defining a boundingBox", function(done) {
      var obj = new Collidable.Polygon();
      expect(obj.width).toEqual(0);
      done();
    });

    it("has a height defining a boundingBox", function(done) {
      var obj = new Collidable.Polygon();
      expect(obj.height).toEqual(0);
      done();
    });

    describe('#calculateBoundingBox', function() {
      var obj;
      beforeEach(function() {
        obj = new Collidable.Polygon({ points: [ new Vector(3,3), new Vector(2,3), new Vector(2,1) ] });
        obj.calculateBoundingBox();
      });

      it("can calculate width and height", function(done) {
        expect(obj.width).toEqual(1);
        expect(obj.height).toEqual(2);
        done();
      });

      it("sets x and y offset if polygon does not start start on x=0 and y=0", function(done) {
        expect(obj.offset.constructor).toEqual(Vector);
        expect(obj.offset.x).toEqual(2);
        expect(obj.offset.y).toEqual(1);
        done();
      });
    });
  });
});
