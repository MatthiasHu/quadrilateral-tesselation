"use strict";

var tau = 2*Math.PI;

var canvas;
var ctx;

var handles =
  [ [200, 120]
  , [220, 250]
  , [250, 270]
  , [290, 150]
  ];


function onLoad() {
  canvas = document.getElementById("my canvas");
  ctx = canvas.getContext("2d");

  canvas.addEventListener("mousedown",
    function(event) {onMouseDown(event);});
  canvas.addEventListener("mousemove",
    function(event) {onMouseMove(event);});

  draw();
}

function onMouseDown(e) {
  snapHandle(e.offsetX, e.offsetY);
  draw();
}
function onMouseMove(e) {
  if (e.buttons == 1) {
    snapHandle(e.offsetX, e.offsetY);
    draw();
  }
}

function snapHandle(x, y) {
  var closest_dist = 100;
  var closest = -1;
  for (var i = 0; i<handles.length; i++) {
    var d = dist([x, y], handles[i]);
    if (d < closest_dist) {
      closest_dist = d;
      closest = i;
    }
  }
  if (closest >= 0) {
    handles[closest] = [x, y];
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // tessellation
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#f3f3f3";
  var n = 20;
  var d1 =
    [ handles[2][0] - handles[0][0]
    , handles[2][1] - handles[0][1]
    ];
  var d2 =
    [ handles[3][0] - handles[1][0]
    , handles[3][1] - handles[1][1]
    ];
  for (var i = -n; i<=n; i++) {
    for (var j = -n; j<=n; j++) {
      var d = [i*d1[0] + j*d2[0], i*d1[1] + j*d2[1]]

      var a1 = plus(d, handles[0]);
      var a2 = plus(d, handles[1]);
      var a3 = plus(d, handles[2]);
      var a4 = plus(d, handles[3]);

      ctx.beginPath();
      ctx.moveTo(a1[0], a1[1]);
      ctx.lineTo(a2[0], a2[1]);
      ctx.lineTo(a3[0], a3[1]);
      ctx.lineTo(a4[0], a4[1]);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  // handles
  ctx.fillStyle = "#f00";
  for (var h of handles) {
    ctx.beginPath();
    ctx.arc(h[0], h[1], 5, 0, tau);
    ctx.fill();
  }
}


function plus(v, w) {
  return [v[0]+w[0], v[1]+w[1]];
}

function dist(a, b) {
  return Math.sqrt((b[0]-a[0])*(b[0]-a[0]) + (b[1]-a[1])*(b[1]-a[1]));
}
