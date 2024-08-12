// import React, { useState, useEffect, useRef } from "react";
// import { Canvas } from "@react-three/fiber";
// import * as THREE from "three";
// import { OrbitControls, Stats, Stars, Cloud, Environment, TransformControls, GizmoHelper, GizmoViewport } from "@react-three/drei";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
// import { initializeApp } from "firebase/app";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import "./App.css";
// import GroundPlaneComponent from './GroundPlaneComponent';
// import GridHelperComponent from "./GridHelperComponent";
// import GizmoHelperComponent from "./CustomGizmoHelper";
// import CameraHelperComponent from "./CameraHelperComponent"; // Import CameraHelperComponent
// //import ModelMoveHelper from './ModelMoveHelper'; 

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyD98xV7NlyYF9ApnNC5bhSBRfM9XM0KomA",
//   authDomain: "module10-a4aa9.firebaseapp.com",
//   projectId: "module10-a4aa9",
//   storageBucket: "module10-a4aa9.appspot.com",
//   messagingSenderId: "564621044983",
//   appId: "1:564621044983:web:d4dab97e3d6a39bd7af7f2",
//   measurementId: "G-RDH0ENDLYV"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);
// const firestore = getFirestore(app);

// const App = () => {
//   const [modelBlob, setModelBlob] = useState(null);
//   const [compressedModelBlob, setCompressedModelBlob] = useState(null);
//   const [previewModelUrl, setPreviewModelUrl] = useState(null);
//   const [file, setFile] = useState(null);
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [isCompressed, setIsCompressed] = useState(false);
//   const [backgroundIndex, setBackgroundIndex] = useState(0);
//   const [backgroundColor, setBackgroundColor] = useState("#ffffff");
//   const [complementaryColor, setComplementaryColor] = useState("#000000");
//   const [lightType, setLightType] = useState("ambient");
//   const [lightColor, setLightColor] = useState("#ffffff");
//   const [lightIntensity, setLightIntensity] = useState(1);
//   const [shadowsEnabled, setShadowsEnabled] = useState(true);
//   const [shadowIntensity, setShadowIntensity] = useState(1);
//   const [exposureEnabled, setExposureEnabled] = useState(true);
//   const [exposureIntensity, setExposureIntensity] = useState(1);
//   const [cameraType, setCameraType] = useState('perspective'); // Default to perspective
//   const [gridEnabled, setGridEnabled] = useState(true); // New state for grid visibility
//   const [isTransforming, setIsTransforming] = useState(false); // New state for transforming
//   const [isPanelVisible, setIsPanelVisible] = useState(false); // State for panel visibility
//   const [isPanel2Visible, setIsPanel2Visible] = useState(false);
//   const [isHelpVisible, setIsHelpVisible] = useState(false);
    
//   const sceneRef = useRef();
//   const modelRef = useRef(); 
//   const cameraRef = useRef();

//   useEffect(() => {
//     const fetchModelUrl = async () => {
//       const docRef = doc(firestore, "models", "currentModel");
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setPreviewModelUrl(docSnap.data().url);
//       }
//     };
//     fetchModelUrl();
//   }, [firestore]);

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       const fileURL = URL.createObjectURL(selectedFile);
//       setPreviewModelUrl(fileURL);
//       setFile({
//         ...selectedFile,
//         name: "newcompressed",
//       });
//       setIsCompressed(false);
//     }
//   };

//   const handleCompressModel = async () => {
//     if (!isModelLoaded) {
//       alert("Please wait for the model to finish loading.");
//       return;
//     }

//     if (sceneRef.current) {
//       const exporter = new GLTFExporter();
//       const options = {
//         binary: true,
//         truncateDrawRange: true,
//         forcePowerOfTwoTextures: true,
//         includeCustomExtensions: true,
//         dracoOptions: {
//           compressionLevel: 7,
//           encoderMethod: "edgebreaker",
//           quantizationBits: 14,
//         },
//       };

//       try {
//         const result = await new Promise((resolve, reject) => {
//           exporter.parse(
//             sceneRef.current,
//             (gltf) => resolve(gltf),
//             (error) => reject(error),
//             options
//           );
//         });

//         const blob = new Blob([result], { type: "application/octet-stream" });
//         setCompressedModelBlob(blob);
//         setIsCompressed(true);
//         await uploadToFirebase(blob);
//         alert("Model compressed and uploaded successfully!");
//       } catch (error) {
//         console.error("Error compressing GLB:", error);
//         alert("Error compressing GLB: " + error.message);
//       }
//     }
//   };

//   const uploadToFirebase = async (blob) => {
//     try {
//       const storageRef = ref(storage, `compressed-models/${file.name}`);
//       const snapshot = await uploadBytes(storageRef, blob);
//       const downloadURL = await getDownloadURL(snapshot.ref);
//       await setDoc(doc(firestore, "models", "currentModel"), { url: downloadURL });
//       console.log('Uploaded and URL saved to Firestore!');
//       alert('Uploaded and URL saved to Firestore!');
//     } catch (error) {
//       console.error("Error uploading to Firebase:", error);
//       alert("Error uploading to Firebase: " + error.message);
//     }
//   };

//   const handleExportGLB = async () => {
//     if (!isModelLoaded) {
//       alert("Please wait for the model to finish loading.");
//       return;
//     }

//     const exporter = new GLTFExporter();
//     const options = isCompressed
//       ? {
//           binary: true,
//           truncateDrawRange: false,
//           forcePowerOfTwoTextures: false,
//           includeCustomExtensions: false,
//           dracoOptions: {
//             encoderMethod: "edgebreaker",
//             quantizationBits: 14,
//           },
//         }
//       : {
//           binary: true,
//           truncateDrawRange: false,
//           forcePowerOfTwoTextures: false,
//           includeCustomExtensions: false,
//         };

//     try {
//       const result = await new Promise((resolve, reject) => {
//         exporter.parse(
//           sceneRef.current,
//           (gltf) => resolve(gltf),
//           (error) => reject(error),
//           options
//         );
//       });

//       const blob = new Blob([result], { type: "application/octet-stream" });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `model_${isCompressed ? "compressed_" : ""}${Date.now()}.glb`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error exporting GLB:", error);
//       alert("Error exporting GLB: " + error.message);
//     }
//   };

//   const Model = ({ url, sceneRef, onModelLoad }) => {
//     const [model, setModel] = useState(null);


//     useEffect(() => {
//       if (url) {
//         const loader = new GLTFLoader();
//         const dracoLoader = new DRACOLoader();
//         dracoLoader.setDecoderPath("/draco/");

//         loader.setDRACOLoader(dracoLoader);

//         loader.load(
//           url,
//           (gltf) => {
//             setModel(gltf.scene);
//             sceneRef.current = gltf.scene;
//             modelRef.current = gltf.scene; // Set the model reference here
//             if (onModelLoad) {
//               onModelLoad();
//             }
//           },
//           undefined,
//           (error) => {
//             console.error("An error happened while loading the model:", error);
//             alert("An error happened while loading the model: " + error.message);
//           }
//         );
//       }
//     }, [url, onModelLoad, sceneRef]);

//     useEffect(() => {
//       if (model) {
//         model.traverse((child) => {
//           if (child.isMesh) {
//             child.castShadow = shadowsEnabled;
//             child.receiveShadow = shadowsEnabled;
//           }
//         });
//       }
//     }, [model, shadowsEnabled]);

//     return model ? (<TransformControls object={model} onMouseDown={() => setIsTransforming(true)}
//     onMouseUp={() => setIsTransforming(false)} > <primitive object={model} position={[0, -1, 0]} /> </TransformControls>): null; // Adjust position here
//   };

//   const backgrounds = [
//     <Stars />,
//     <Cloud />,
//     <Environment files="path/to/your/background.jpg" />, // Add your background image here
//     // Add more backgrounds here as needed
//   ];

//   const toggleBackground = () => {
//     setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
//   };

//   const handleBackgroundColorChange = (event) => {
//     const color = event.target.value;
//     setBackgroundColor(color);
//     setComplementaryColor(getComplementaryColor(color));
//   };

//   const getComplementaryColor = (color) => {
//     const rgb = hexToRgb(color);
//     const complementaryRgb = rgb.map((c) => 255 - c);
//     return rgbToHex(complementaryRgb);
//   };

//   const hexToRgb = (hex) => {
//     const bigint = parseInt(hex.slice(1), 16);
//     return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
//   };

//   const rgbToHex = (rgb) => {
//     const hex = rgb
//       .map((c) => c.toString(16).padStart(2, "0"))
//       .join("")
//       .toUpperCase();
//     return `#${hex}`;
//   };

//   const handleLightTypeChange = (event) => {
//     setLightType(event.target.value);
//   };

//   const handleLightColorChange = (event) => {
//     setLightColor(event.target.value);
//   };

//   const handleLightIntensityChange = (event) => {
//     setLightIntensity(parseFloat(event.target.value));
//   };

//   const handleToggleShadows = () => {
//     setShadowsEnabled((prev) => !prev);
//   };

//   const handleShadowIntensityChange = (event) => {
//     setShadowIntensity(parseFloat(event.target.value));
//   };

//   const handleToggleExposure = () => {
//     setExposureEnabled((prev) => !prev);
//   };

//   const handleExposureIntensityChange = (event) => {
//     setExposureIntensity(parseFloat(event.target.value));
//   };

//   const handleCameraTypeChange = (event) => {
//     setCameraType(event.target.value);
//   };

//   const saveSettings = async () => {
//     try {
//       const docRef = doc(firestore, "settings", "sceneSettings");
//       await setDoc(docRef, {
//         lightType,
//         lightColor,
//         lightIntensity,
//         shadowsEnabled,
//         shadowIntensity,
//         exposureEnabled,
//         exposureIntensity,
//         backgroundColor,
//       });
//       alert("Settings saved successfully!");
//     } catch (error) {
//       console.error("Error saving settings:", error);
//       alert("Error saving settings: " + error.message);
//     }
//   };

//   //const modelRef = useRef(); // Ref for the model

//   const HelpPanel = () => (
//     <div className="help-panel">
//       <h2>Heyy, We got you covered xD</h2>
//       <p><strong>Here's all the things you can do ;D</strong></p>
//       <p><strong>File Upload:</strong> Upload and view 3D models in GLB or GLTF format.</p>
//       <p><strong>Model Compression:</strong> Compress and upload the model to Firebase for better performance.</p>
//       <p><strong>Model Export:</strong> Export the model as GLB for downloading.</p>
//       <p><strong>Background:</strong> Change the scene background or color, and adjust its complement.</p>
//       <p><strong>Lighting:</strong> Select light type (ambient, directional, spot), color, and intensity. Enable or disable shadows and exposure.</p>
//       <p><strong>Grid:</strong> Toggle the visibility of the grid in the scene.</p>
//       <p><strong>Camera:</strong> Switch between perspective and orthographic camera views.</p>
//       <p><strong>Settings:</strong> Save and load scene settings to Firebase.</p>
//       <button onClick={() => setIsHelpVisible(false)}>Close</button>
//     </div>
//   );  

//   useEffect(() => {
//     const fetchSettings = async () => {
//       const docRef = doc(firestore, "settings", "sceneSettings");
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setLightType(data.lightType);
//         setLightColor(data.lightColor);
//         setLightIntensity(data.lightIntensity);
//         setShadowsEnabled(data.shadowsEnabled);
//         setShadowIntensity(data.shadowIntensity);
//         setExposureEnabled(data.exposureEnabled);
//         setExposureIntensity(data.exposureIntensity);
//         setBackgroundColor(data.backgroundColor);
//         setComplementaryColor(getComplementaryColor(data.backgroundColor));
//       }
//     };
//     fetchSettings();
//   }, [firestore]);

//   const handlePanelClick = (e) => {
//     e.stopPropagation();
//   };

//   const togglePanel = () => {
//     setIsPanelVisible(!isPanelVisible);
//   };

//   const togglePanel2 = () => {
//     setIsPanel2Visible(!isPanel2Visible);
//     if (isPanelVisible) {
//       setIsPanelVisible(false); // Hide Panel if it's visible
//     }
//   };

//   return (
//     <div className="App">
//       {/* Main Content */}
//       <div className="canvas-container">
//         <Canvas
//           shadows={true}
//           camera={{ position: [0, 2, 5], fov: 75 }}
//           style={{ backgroundColor }}
//           ref={cameraRef}
//         >
//           <ambientLight
//             intensity={lightType === "ambient" ? lightIntensity : 0.1}
//             color={lightColor}
//           />
//           {lightType === "directional" && (
//             <directionalLight
//               position={[5, 10, 5]}
//               intensity={lightIntensity}
//               color={lightColor}
//             />
//           )}
//           {lightType === "spot" && (
//             <spotLight
//               position={[15, 20, 5]}
//               intensity={lightIntensity}
//               color={lightColor}
//             />
//           )}
//           <GizmoHelper alignment="bottom-right" margin={[10, 10]} scale={1}>
//             <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
//           </GizmoHelper>
//           <OrbitControls enabled={!isTransforming} enableDamping dampingFactor={0.25} rotateSpeed={0.5} />
//           <Stats />
//           {backgrounds[backgroundIndex]}
//           <Model url={previewModelUrl} sceneRef={sceneRef} onModelLoad={() => setIsModelLoaded(true)} />
//           <GridHelperComponent position={{ x: 0.1, y: -1.8, z: 0.41 }} visible={gridEnabled} color={complementaryColor} />
//           <GizmoHelperComponent />
//           <GroundPlaneComponent />
//           <CameraHelperComponent cameraType={cameraType} />
//         </Canvas>
//       </div>
  
//       {/* UI Controls */}
//       <div id="toggle-button" onClick={togglePanel} className="toggle-button">
//         {isPanelVisible ? 'Hide Panel' : 'Show Panel'}
      
//         <div id="panel" className={`panel ${isPanelVisible ? 'show' : 'hidden'}`}>
//           <div className="ui">
//             <div className="file-input-wrapper">
//               <input type="file" id="file-input" className="file-input" accept=".glb, .gltf" onChange={handleFileChange} />
//               <label htmlFor="file-input" className="file-input-label button">Choose File</label>
//             </div>
//             <button className="button" onClick={handleCompressModel}>Compress & Upload</button>
//             <button className="button" onClick={handleExportGLB}>Export GLB</button>
//             <button className="button background-btn" onClick={toggleBackground}>Change Background</button>
//             <label htmlFor="background-color">Background Color:</label>
//             <input
//               type="color"
//               id="background-color"
//               value={backgroundColor}
//               onChange={handleBackgroundColorChange}
//             />
//           </div>
//         </div>
//       </div>
      
  
//         {/* Settings Panel */}
//       <div id="toggle-button2" onClick={togglePanel2} className="toggle-button2">
//         {isPanel2Visible ? 'Hide Panel2' : 'Show Panel2'}

//         <div id="panel2" className={`panel2 ${isPanel2Visible ? 'show' : 'hidden'}`}
//          onClick={handlePanelClick}
//          >
//           <div className="light-settings">
//             <h2>LIGHT SETTINGS</h2>
//             <label htmlFor="light-type">Light Type:</label>
//             <select
//               id="light-type"
//               value={lightType}
//               onChange={handleLightTypeChange}
//             >
//               <option value="ambient">Ambient Light</option>
//               <option value="directional">Directional Light</option>
//               <option value="spot">Spot Light</option>
//             </select>
//             <label htmlFor="light-color">Light Color:</label>
//             <input
//               type="color"
//               id="light-color"
//               value={lightColor}
//               onChange={handleLightColorChange}
//             />
//             <label htmlFor="light-intensity">Light Intensity:</label>
//             <input
//               type="range"
//               id="light-intensity"
//               min={0}
//               max={2}
//               step={0.1}
//               value={lightIntensity}
//               onChange={handleLightIntensityChange}
//             />
//             <button className="button" onClick={handleToggleShadows}>
//               {shadowsEnabled ? "Disable Shadows" : "Enable Shadows"}
//             </button>
//             {shadowsEnabled && (
//               <>
//                 <label htmlFor="shadow-intensity">Shadow Intensity:</label>
//                 <input
//                   type="range"
//                   id="shadow-intensity"
//                   min={0}
//                   max={1}
//                   step={0.1}
//                   value={shadowIntensity}
//                   onChange={handleShadowIntensityChange}
//                 />
//               </>
//             )}
//             <button className="button" onClick={handleToggleExposure}>
//               {exposureEnabled ? "Disable Exposure" : "Enable Exposure"}
//             </button>
//             {exposureEnabled && (
//               <>
//                 <label htmlFor="exposure-intensity">Exposure Intensity:</label>
//                 <input
//                   type="range"
//                   id="exposure-intensity"
//                   min={0}
//                   max={2}
//                   step={0.1}
//                   value={exposureIntensity}
//                   onChange={handleExposureIntensityChange}
//                 />
//               </>
//             )}
//             <label htmlFor="camera-type">Camera Type:</label>
//             <select
//               id="camera-type"
//               value={cameraType}
//               onChange={handleCameraTypeChange}
//             >
//               <option value="perspective">Perspective Camera</option>
//               <option value="orthographic">Orthographic Camera</option>
//             </select>
//             <button onClick={() => setGridEnabled(!gridEnabled)} className="button">Toggle Grid</button>
//             <button onClick={saveSettings} className="button">
//               Save Settings
//             </button>
//           </div>
//         </div>
//       </div>

//       <div id="help-button" onClick={() => setIsHelpVisible(!isHelpVisible)} className="help-button">
//         {isHelpVisible ? 'Hide Help' : 'Show Help'}
//       </div>
//       {isHelpVisible && <HelpPanel />}
//     </div>
//   );
// };

// export default App;

//----------------------------------

import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Stats, Stars, Cloud, Environment, TransformControls, GizmoHelper, GizmoViewport } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import "./App.css";
import GroundPlaneComponent from './GroundPlaneComponent';
import GridHelperComponent from "./GridHelperComponent";
import GizmoHelperComponent from "./CustomGizmoHelper";
import CameraHelperComponent from "./CameraHelperComponent"; // Import CameraHelperComponent
//import ModelMoveHelper from './ModelMoveHelper'; 

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD98xV7NlyYF9ApnNC5bhSBRfM9XM0KomA",
  authDomain: "module10-a4aa9.firebaseapp.com",
  projectId: "module10-a4aa9",
  storageBucket: "module10-a4aa9.appspot.com",
  messagingSenderId: "564621044983",
  appId: "1:564621044983:web:d4dab97e3d6a39bd7af7f2",
  measurementId: "G-RDH0ENDLYV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

const App = () => {
  const [modelBlob, setModelBlob] = useState(null);
  const [compressedModelBlob, setCompressedModelBlob] = useState(null);
  const [previewModelUrl, setPreviewModelUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCompressed, setIsCompressed] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [complementaryColor, setComplementaryColor] = useState("#000000");
  const [lightType, setLightType] = useState("ambient");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [lightIntensity, setLightIntensity] = useState(1);
  const [shadowsEnabled, setShadowsEnabled] = useState(true);
  const [shadowIntensity, setShadowIntensity] = useState(1);
  const [exposureEnabled, setExposureEnabled] = useState(true);
  const [exposureIntensity, setExposureIntensity] = useState(1);
  const [cameraType, setCameraType] = useState('perspective'); // Default to perspective
  const [gridEnabled, setGridEnabled] = useState(true); // New state for grid visibility
  const [isTransforming, setIsTransforming] = useState(false); // New state for transforming
  const [isPanelVisible, setIsPanelVisible] = useState(false); // State for panel visibility
  const [isPanel2Visible, setIsPanel2Visible] = useState(false);
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  
  const sceneRef = useRef();
  const modelRef = useRef(); 
  const cameraRef = useRef();

  useEffect(() => {
    const fetchModelUrl = async () => {
      const docRef = doc(firestore, "models", "currentModel");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPreviewModelUrl(docSnap.data().url);
      }
    };
    fetchModelUrl();
  }, [firestore]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setPreviewModelUrl(fileURL);
      setFile({
        ...selectedFile,
        name: "newcompressed",
      });
      setIsCompressed(false);
    }
  };

  const handleCompressModel = async () => {
    if (!isModelLoaded) {
      alert("Please wait for the model to finish loading.");
      return;
    }

    if (sceneRef.current) {
      const exporter = new GLTFExporter();
      const options = {
        binary: true,
        truncateDrawRange: true,
        forcePowerOfTwoTextures: true,
        includeCustomExtensions: true,
        dracoOptions: {
          compressionLevel: 7,
          encoderMethod: "edgebreaker",
          quantizationBits: 14,
        },
      };

      try {
        const result = await new Promise((resolve, reject) => {
          exporter.parse(
            sceneRef.current,
            (gltf) => resolve(gltf),
            (error) => reject(error),
            options
          );
        });

        const blob = new Blob([result], { type: "application/octet-stream" });
        setCompressedModelBlob(blob);
        setIsCompressed(true);
        await uploadToFirebase(blob);
        alert("Model compressed and uploaded successfully!");
      } catch (error) {
        console.error("Error compressing GLB:", error);
        alert("Error compressing GLB: " + error.message);
      }
    }
  };

  const uploadToFirebase = async (blob) => {
    try {
      const storageRef = ref(storage, `compressed-models/${file.name}`);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await setDoc(doc(firestore, "models", "currentModel"), { url: downloadURL });
      console.log('Uploaded and URL saved to Firestore!');
      alert('Uploaded and URL saved to Firestore!');
    } catch (error) {
      console.error("Error uploading to Firebase:", error);
      alert("Error uploading to Firebase: " + error.message);
    }
  };

  const handleExportGLB = async () => {
    if (!isModelLoaded) {
      alert("Please wait for the model to finish loading.");
      return;
    }

    const exporter = new GLTFExporter();
    const options = isCompressed
      ? {
          binary: true,
          truncateDrawRange: false,
          forcePowerOfTwoTextures: false,
          includeCustomExtensions: false,
          dracoOptions: {
            encoderMethod: "edgebreaker",
            quantizationBits: 14,
          },
        }
      : {
          binary: true,
          truncateDrawRange: false,
          forcePowerOfTwoTextures: false,
          includeCustomExtensions: false,
        };

    try {
      const result = await new Promise((resolve, reject) => {
        exporter.parse(
          sceneRef.current,
          (gltf) => resolve(gltf),
          (error) => reject(error),
          options
        );
      });

      const blob = new Blob([result], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `model_${isCompressed ? "compressed_" : ""}${Date.now()}.glb`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting GLB:", error);
      alert("Error exporting GLB: " + error.message);
    }
  };

  const Model = ({ url, sceneRef, onModelLoad }) => {
    const [model, setModel] = useState(null);


    useEffect(() => {
      if (url) {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");

        loader.setDRACOLoader(dracoLoader);

        loader.load(
          url,
          (gltf) => {
            setModel(gltf.scene);
            sceneRef.current = gltf.scene;
            modelRef.current = gltf.scene; // Set the model reference here
            if (onModelLoad) {
              onModelLoad();
            }
          },
          undefined,
          (error) => {
            console.error("An error happened while loading the model:", error);
            alert("An error happened while loading the model: " + error.message);
          }
        );
      }
    }, [url, onModelLoad, sceneRef]);

    useEffect(() => {
      if (model) {
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = shadowsEnabled;
            child.receiveShadow = shadowsEnabled;
          }
        });
      }
    }, [model, shadowsEnabled]);

    return model ? (<TransformControls object={model} onMouseDown={() => setIsTransforming(true)}
    onMouseUp={() => setIsTransforming(false)} > <primitive object={model} position={[0, -1, 0]} /> </TransformControls>): null; // Adjust position here
  };

  const backgrounds = [
    <Stars />,
    <Cloud />,
    <Environment files="path/to/your/background.jpg" />, // Add your background image here
    // Add more backgrounds here as needed
  ];

  const toggleBackground = () => {
    setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
  };

  const handleBackgroundColorChange = (event) => {
    const color = event.target.value;
    setBackgroundColor(color);
    setComplementaryColor(getComplementaryColor(color));
  };

  const getComplementaryColor = (color) => {
    const rgb = hexToRgb(color);
    const complementaryRgb = rgb.map((c) => 255 - c);
    return rgbToHex(complementaryRgb);
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const rgbToHex = (rgb) => {
    const hex = rgb
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
    return `#${hex}`;
  };

  const handleLightTypeChange = (event) => {
    setLightType(event.target.value);
  };

  const handleLightColorChange = (event) => {
    setLightColor(event.target.value);
  };

  const handleLightIntensityChange = (event) => {
    setLightIntensity(parseFloat(event.target.value));
  };

  const handleToggleShadows = () => {
    setShadowsEnabled((prev) => !prev);
  };

  const handleShadowIntensityChange = (event) => {
    setShadowIntensity(parseFloat(event.target.value));
  };

  const handleToggleExposure = () => {
    setExposureEnabled((prev) => !prev);
  };

  const handleExposureIntensityChange = (event) => {
    setExposureIntensity(parseFloat(event.target.value));
  };

  const handleCameraTypeChange = (event) => {
    setCameraType(event.target.value);
  };

  const saveSettings = async () => {
    try {
      const docRef = doc(firestore, "settings", "sceneSettings");
      await setDoc(docRef, {
        lightType,
        lightColor,
        lightIntensity,
        shadowsEnabled,
        shadowIntensity,
        exposureEnabled,
        exposureIntensity,
        backgroundColor,
      });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings: " + error.message);
    }
  };

  //const modelRef = useRef(); // Ref for the model

  const HelpPanel = () => (
    <div className="help-panel">
      <h2>Heyy, We got you covered xD</h2>
      <p><strong>Here's all the things you can do ;D</strong></p>
      <p><strong>File Upload:</strong> Upload and view 3D models in GLB or GLTF format.</p>
      <p><strong>Model Compression:</strong> Compress and upload the model to Firebase for better performance.</p>
      <p><strong>Model Export:</strong> Export the model as GLB for downloading.</p>
      <p><strong>Background:</strong> Change the scene background or color, and adjust its complement.</p>
      <p><strong>Lighting:</strong> Select light type (ambient, directional, spot), color, and intensity. Enable or disable shadows and exposure.</p>
      <p><strong>Grid:</strong> Toggle the visibility of the grid in the scene.</p>
      <p><strong>Camera:</strong> Switch between perspective and orthographic camera views.</p>
      <p><strong>Settings:</strong> Save and load scene settings to Firebase.</p>
      <button onClick={() => setIsHelpVisible(false)}>Close</button>
    </div>
  );  

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(firestore, "settings", "sceneSettings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLightType(data.lightType);
        setLightColor(data.lightColor);
        setLightIntensity(data.lightIntensity);
        setShadowsEnabled(data.shadowsEnabled);
        setShadowIntensity(data.shadowIntensity);
        setExposureEnabled(data.exposureEnabled);
        setExposureIntensity(data.exposureIntensity);
        setBackgroundColor(data.backgroundColor);
        setComplementaryColor(getComplementaryColor(data.backgroundColor));
      }
    };
    fetchSettings();
  }, [firestore]);

  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const togglePanel2 = () => {
    setIsPanel2Visible(!isPanel2Visible);
    if (isPanelVisible) {
      setIsPanelVisible(false); // Hide Panel if it's visible
    }
  };

  const toggleViewMode = () => {
    setViewOnly(!viewOnly);
  };

  return (
    <div className={`App ${viewOnly ? 'view-only' : ''}`}>
      {/* Main Content */}
      <div className="canvas-container">
        <Canvas
          shadows={true}
          camera={{ position: [0, 2, 5], fov: 75 }}
          style={{ backgroundColor }}
          ref={cameraRef}
        >
          <ambientLight
            intensity={lightType === "ambient" ? lightIntensity : 0.1}
            color={lightColor}
          />
          {lightType === "directional" && (
            <directionalLight
              position={[5, 10, 5]}
              intensity={lightIntensity}
              color={lightColor}
            />
          )}
          {lightType === "spot" && (
            <spotLight
              position={[15, 20, 5]}
              intensity={lightIntensity}
              color={lightColor}
            />
          )}
          <GizmoHelper alignment="bottom-right" margin={[10, 10]} scale={1}>
            <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
          </GizmoHelper>
          <OrbitControls enabled={!isTransforming} enableDamping dampingFactor={0.25} rotateSpeed={0.5} />
          <Stats />
          {backgrounds[backgroundIndex]}
          <Model url={previewModelUrl} sceneRef={sceneRef} onModelLoad={() => setIsModelLoaded(true)} />
          <GridHelperComponent position={{ x: 0.1, y: -1.8, z: 0.41 }} visible={gridEnabled} color={complementaryColor} />
          <GizmoHelperComponent />
          <GroundPlaneComponent />
          <CameraHelperComponent cameraType={cameraType} />
        </Canvas>
      </div>
  
      {/* UI Controls */}
      {!viewOnly && (
        <>
          <div id="toggle-button" onClick={togglePanel} className="toggle-button">
            {isPanelVisible ? 'Hide Panel' : 'Show Panel'}
          
            <div id="panel" className={`panel ${isPanelVisible ? 'show' : 'hidden'}`}
             onClick={handlePanelClick}>
              <div className="ui">
                <div className="file-input-wrapper">
                  <input type="file" id="file-input" className="file-input" accept=".glb, .gltf" onChange={handleFileChange} />
                  <label htmlFor="file-input" className="file-input-label button">Choose File</label>
                </div>
                <button className="button" onClick={handleCompressModel}>Compress & Upload</button>
                <button className="button" onClick={handleExportGLB}>Export GLB</button>
                <button className="button background-btn" onClick={toggleBackground}>Change Background</button>
                <label htmlFor="background-color">Background Color:</label>
                <input
                  type="color"
                  id="background-color"
                  value={backgroundColor}
                  onChange={handleBackgroundColorChange}
                />
              </div>
            </div>
          </div>
    
          {/* Settings Panel */}
          <div id="toggle-button2" onClick={togglePanel2} className="toggle-button2">
            {isPanel2Visible ? 'Hide Panel2' : 'Show Panel2'}

            <div id="panel2" className={`panel2 ${isPanel2Visible ? 'show' : 'hidden'}`}
            onClick={handlePanelClick}
            >
              <div className="light-settings">
                <h2>LIGHT SETTINGS</h2>
                <label htmlFor="light-type">Light Type:</label>
                <select
                  id="light-type"
                  value={lightType}
                  onChange={handleLightTypeChange}
                >
                  <option value="ambient">Ambient Light</option>
                  <option value="directional">Directional Light</option>
                  <option value="spot">Spot Light</option>
                </select>
                <label htmlFor="light-color">Light Color:</label>
                <input
                  type="color"
                  id="light-color"
                  value={lightColor}
                  onChange={handleLightColorChange}
                />
                <label htmlFor="light-intensity">Light Intensity:</label>
                <input
                  type="range"
                  id="light-intensity"
                  min={0}
                  max={2}
                  step={0.1}
                  value={lightIntensity}
                  onChange={handleLightIntensityChange}
                />
                <button className="button" onClick={handleToggleShadows}>
                  {shadowsEnabled ? "Disable Shadows" : "Enable Shadows"}
                </button>
                {shadowsEnabled && (
                  <>
                    <label htmlFor="shadow-intensity">Shadow Intensity:</label>
                    <input
                      type="range"
                      id="shadow-intensity"
                      min={0}
                      max={1}
                      step={0.1}
                      value={shadowIntensity}
                      onChange={handleShadowIntensityChange}
                    />
                  </>
                )}
                <button className="button" onClick={handleToggleExposure}>
                  {exposureEnabled ? "Disable Exposure" : "Enable Exposure"}
                </button>
                {exposureEnabled && (
                  <>
                    <label htmlFor="exposure-intensity">Exposure Intensity:</label>
                    <input
                      type="range"
                      id="exposure-intensity"
                      min={0}
                      max={2}
                      step={0.1}
                      value={exposureIntensity}
                      onChange={handleExposureIntensityChange}
                    />
                  </>
                )}
                <label htmlFor="camera-type">Camera Type:</label>
                <select
                  id="camera-type"
                  value={cameraType}
                  onChange={handleCameraTypeChange}
                >
                  <option value="perspective">Perspective Camera</option>
                  <option value="orthographic">Orthographic Camera</option>
                </select>
                <button onClick={() => setGridEnabled(!gridEnabled)} className="button">Toggle Grid</button>
                <button onClick={saveSettings} className="button">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div id="help-button" onClick={() => setIsHelpVisible(!isHelpVisible)} className="help-button">
        {isHelpVisible ? 'Hide Help' : 'Show Help'}
      </div>
      {isHelpVisible && <HelpPanel />}

      <div id="view-only-button" onClick={toggleViewMode} className="view-only-button">
        {viewOnly ? 'Edit Mode' : 'View Only'}
      </div>
    </div>
    );
};

export default App;

