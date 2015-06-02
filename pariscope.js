// title: pARiscope
// author: Stuart P. Bentley
// license: MIT
// URL: https://github.com/stuartpb/pariscope.jscad/blob/master/pariscope.js
// revision: 0.0.0
// tags: Google Cardboard,AR

/* global linear_extrude polygon union square circle color */

// parameters //

// optics
var phoneToLenses = 2;
var lensRadius = 1;

// head measurements
var browDepth = 3.5;
var cheekDepth = 1.5;

// phone measurements
var phoneWidth = 6;
var phoneLength = 2.5;
var phoneThickness = 0.4;

// material measurements
var rubberbandWidth = 0.5;
var rubberbandCutThickness = 0.05;
var cardboardThickness = 0.1;
var plexiglassThickness = 0.1;

// structural measurements
var rubberbandLoopWidth = 0.2;

// design //
function main() {

  // materials
  function cardboard(shape){
      return color([0.75, 0.5, 0.25],
        linear_extrude({height: cardboardThickness}, shape));
  }
  function plexiglass(shape){
      return color([0.75, 0.75, 0.95, 0.2],
        linear_extrude({height: plexiglassThickness}, shape));
  }
  function shinyCardboard(shape){
      return color([0.75, 0.75, 0.75],
        linear_extrude({height: cardboardThickness}, shape));
  }

  // derived measurements
  var totalHeight = phoneLength + phoneToLenses + phoneThickness + phoneLength;

  // derived shapes
  var sideParallelogram = polygon([
      [0,0],
      [-phoneLength,phoneLength],
      [-phoneLength,totalHeight],
      [0,totalHeight-phoneLength]]);
  var sideBlinders = polygon([
      [0,0],
      [0, phoneLength],
      [browDepth, phoneLength],
      [cheekDepth,0]]);
  var side = union(sideParallelogram, sideBlinders);

  var faceplate = square([phoneWidth, phoneLength])
    .subtract([
      circle({r: lensRadius, center: true})
        .translate([phoneWidth*1/4, phoneLength/2]),
      circle({r: lensRadius, center: true})
        .translate([phoneWidth*3/4, phoneLength/2])
    ]);
  function slot(trans) {
    return square([rubberbandWidth,rubberbandCutThickness])
     .translate(trans);
  }
  var headplate = square([phoneWidth,phoneToLenses+phoneThickness])
    .subtract([
      slot([0, phoneToLenses]),
      slot([0, phoneToLenses + rubberbandLoopWidth]),
      slot([phoneWidth - rubberbandWidth, phoneToLenses]),
      slot([phoneWidth - rubberbandWidth,
        phoneToLenses + rubberbandLoopWidth])
    ]).translate([0,phoneLength]);
  var back = union(faceplate, headplate);

  var brim = square([phoneWidth,browDepth]);

  var front = square([phoneWidth,phoneToLenses + phoneThickness])
    .subtract([
      slot([0, phoneToLenses]),
      slot([0, phoneToLenses + rubberbandLoopWidth]),
      slot([phoneWidth - rubberbandWidth, phoneToLenses]),
      slot([phoneWidth - rubberbandWidth,
        phoneToLenses + rubberbandLoopWidth])
    ]);

  var opticSurface = square([phoneWidth,
    Math.sqrt(phoneLength*phoneLength*2)]);

  var mirror = shinyCardboard(opticSurface);
  var viewport = plexiglass(opticSurface);

  return union(
      cardboard(side).rotateX(90),
      cardboard(side).rotateX(90)
        .translate([0,phoneWidth+cardboardThickness,0]),
      cardboard(back).rotateX(90).rotateZ(90),
      cardboard(brim).rotateZ(90).rotateY(180)
        .translate([0,0,phoneLength]),
      cardboard(front).rotateX(90).rotateZ(-90)
        .translate([-phoneLength,phoneWidth,phoneLength]),
      viewport.translate([0,0,-plexiglassThickness]).rotateZ(90).rotateY(45),
      mirror.rotateZ(90).rotateY(45)
        .translate([0,0,phoneToLenses+phoneLength+phoneThickness])
  ).center([true,true,false]);
}
