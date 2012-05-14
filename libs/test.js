//= require vector
//= require collision_detection
//= require collidable

var requestAnimFrame = (function() {
  return window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.oRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(callback, fps) {
       return window.setTimeout(callback, 1000/60);
     };
})();

window.addEventListener('DOMContentLoaded', function() {
  var canvasElement = document.getElementById('canvas'),
      context  = canvasElement.getContext('2d');

  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;

  var render = function() {
    context.clearRect(0,0, canvasElement.width, canvasElement.height);


    requestAnimFrame(render);
  };

  render();
}());
