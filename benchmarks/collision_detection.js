/**
some resultes so far:

1:
  circle vs circle x 1,603 ops/sec ±0.43% (93 runs sampled)
  AABB x 1,601 ops/sec ±0.82% (93 runs sampled)
  SAT x 1,622 ops/sec ±0.38% (96 runs sampled)
*/

var Benchmark = require('benchmark');
var CollisionDetection = require(__dirname + '/../libs/collision_detection');
var Collidable = require(__dirname + '/../libs/collidable');
var Vector = require(__dirname + '/../libs/vector');

var generateConvexPolygon = function(radius, numEdges) {
  var points = [],
      rotationSteps = 360/ numEdges,
      minX = 0,
      minY = 0,
      ar, br, v;
  while (numEdges--) {
    ar = (Math.random() * radius/3) - 5;
    br = (Math.random() * rotationSteps/3) - 5;
    v = new Vector(radius + ar, 0);
    v.rotate(numEdges * rotationSteps + br);
    minX = Math.min(minX, v.x);
    minY = Math.min(minY, v.y);
    points.push(v);
  }
  for (var i=points.length;i--;) {
    points[i].x -= minX;
    points[i].y -= minY;
  }
  return points;
};


var suite = new Benchmark.Suite(),

    rects = [],
    polygons = [],
    circles = [];

for (var i =0; i<100; ++i) {
  rects.push(new Collidable.Rectangle({
    position: new Vector(Math.random() * 500, Math.random() * 500),
    width: Math.random() * 100,
    height: Math.random() * 100,
  }));
}
for (var i =0; i<100; ++i) {
  polygons.push(new Collidable.Polygon({
    position: new Vector(Math.random() * 500, Math.random() * 500),
    points: generateConvexPolygon(5 + Math.random() * 10, Math.round(5 + Math.random() * 10))
  }));
}
for (var i =0; i<100; ++i) {
  circles.push(new Collidable.Circle({
    position: new Vector(Math.random() * 500, Math.random() * 500),
    radius: Math.random() * 10
  }));
}

var DetectorCircles = new CollisionDetection(circles);
var DetectorPolygons = new CollisionDetection(polygons);
var DetectorRectangles = new CollisionDetection(rects);


suite
.add('circle vs circle', function() {
  DetectorCircles.test();
})
.add('AABB', function() {
  DetectorCircles.test();
})
.add('SAT', function() {
  DetectorCircles.test();
})
.on('cycle', function(event, bench) {
  console.log(String(bench));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run();
