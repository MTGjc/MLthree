import webgazer from 'webgazer';

// Set up WebGazer.js
webgazer.setRegression('ridge')
webgazer.setTracker('clmtrackr')
webgazer.showPredictionPoints(true)
webgazer.begin()

// Start the tracking loop
let trackingLoop = setInterval(function() {
  let prediction = webgazer.getCurrentPrediction();
  if (prediction) {
    console.log(prediction);
  }
}, 100);
