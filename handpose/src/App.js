//import logo from './logo.svg';
import React, {useRef, useEffect} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import './App.css';
import { drawHand } from './utilitiesForHand';

import * as THREE from 'three';
import { Canvas, useThree } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";
import {PerspectiveCamera} from 'three';

// function CustomCamera(props) {
//   const { setDefaultCamera } = useThree();
//   const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
//   setDefaultCamera(camera);
//   return <perspectiveCamera ref={props.ref} {...props} />;
// }


function App() {
  const webcamRef =useRef(null);
  const canvasRef =useRef(null);

  const camera = useRef()
  const controls = useRef()

  const runHandpose = async () =>{
    const net = await handpose.load();
    console.log('handpose loaded');

    setInterval(()=>{detect(net)}, 100)
  }
  
  const detect =async (net) => {
    if(
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !==null &&
      webcamRef.current.video.readyState === 4
    ){
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);
      console.log(hand);

      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  }

  runHandpose();

  useEffect(() => {
    const webgazer = window.webgazer;
    webgazer.setGazeListener((data,clock)=>{
      console.log(data,clock)
    }).begin()
  }, []);


  const Floor = () => {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, -2, 0]}>
        <planeBufferGeometry args={[100, 100]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    );
  };


  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef}
          style={{
            position:"absolute",
            marginLeft:"auto",
            marginRight:"auto",
            left:0,
            right:0,
            textAlign:"center",
            zindex: 9,
            width:640,
            height:480
          }}
        />
        <canvas ref={canvasRef}
          style={{
            position:"absolute",
            marginLeft:"auto",
            marginRight:"auto",
            left:0,
            right:0,
            textAlign:"center",
            zindex: 9,
            width:640,
            height:480
          }}
        />
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <perspectiveCamera
            ref={camera}
            position={[0, 0, 5]}
            onUpdate={(self) => self.updateProjectionMatrix()}
          />
          <OrbitControls maxPolarAngle={Math.PI / 2} minPolarAngle={0} />
          <directionalLight intensity={0.5} />
          <Floor />
          {/* <CustomCamera /> */}
        </Canvas>

      </header>
    </div>
  );
}

export default App;
