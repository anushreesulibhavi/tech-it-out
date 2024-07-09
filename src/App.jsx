// import React, { useState, useEffect, useRef } from "react";
// import { Canvas, useLoader } from "@react-three/fiber";
// import { OrbitControls, Stats, Stars, Cloud, Environment, useTexture } from "@react-three/drei";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
// import { initializeApp } from "firebase/app";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import "./App.css";

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyD98xV7NlyYF9ApnNC5bhSBRfM9XM0KomA",
//     authDomain: "module10-a4aa9.firebaseapp.com",
//     projectId: "module10-a4aa9",
//     storageBucket: "module10-a4aa9.appspot.com",
//     messagingSenderId: "564621044983",
//     appId: "1:564621044983:web:d4dab97e3d6a39bd7af7f2",
//     measurementId: "G-RDH0ENDLYV"
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
//   const [backgroundIndex, setBackgroundIndex] = useState(0); // New state for background index
//   const [lightType, setLightType] = useState("point");
//   const [lightColor, setLightColor] = useState("#ffffff");
//   const [lightIntensity, setLightIntensity] = useState(1);
//   const [shadowsEnabled, setShadowsEnabled] = useState(true);
//   const [shadowIntensity, setShadowIntensity] = useState(1);
//   const [exposureEnabled, setExposureEnabled] = useState(true);
//   const [exposureIntensity, setExposureIntensity] = useState(1);
//   const sceneRef = useRef();

//   useEffect(() => {
//       const fetchModelUrl = async () => {
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
//         name: "newcompressed", // Setting the file name explicitly
//       });
//       setIsCompressed(false);  // Reset compression state on new file upload
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
//     const options = isCompressed ? {
//       binary: true,
//       truncateDrawRange: false,
//       forcePowerOfTwoTextures: false,
//       includeCustomExtensions: false,
//       dracoOptions: {
//         encoderMethod: "edgebreaker",
//         quantizationBits: 14,
//       },
//     } : {
//       binary: true,
//       truncateDrawRange: false,
//       forcePowerOfTwoTextures: false,
//       includeCustomExtensions: false,
//     };

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
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `model_${isCompressed ? 'compressed_' : ''}${Date.now()}.glb`;
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

//     return model ? <primitive object={model} position={[0, -1, 0]} /> : null; // Adjust position here
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

//   const saveSettings = async () => {
//     try {
//       await setDoc(doc(firestore, "settings", "appSettings"), {
//         lightType,
//         lightColor,
//         lightIntensity,
//         shadowsEnabled,
//         shadowIntensity,
//         exposureEnabled,
//         exposureIntensity,
//       });
//       alert("Settings saved successfully!");
//     } catch (error) {
//       console.error("Error saving settings:", error);
//       alert("Error saving settings: " + error.message);
//     }
//   };

//   useEffect(() => {
//     const fetchSettings = async () => {
//       const docRef = doc(firestore, "settings", "appSettings");
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
//       }
//     };
//     fetchSettings();
//   }, []);

//   return (
//     <div className="App">
//       <div className="canvas-container">
//         <Canvas shadows={shadowsEnabled}>
//           <ambientLight color={lightColor} intensity={lightIntensity} />
//           {lightType === "point" && <pointLight color={lightColor} intensity={lightIntensity}/>}
//           {lightType === "spot" && <spotLight color={lightColor} intensity={lightIntensity} angle={0.3} penumbra={1} position={[5,5,5]} castShadow={shadowsEnabled} />}
//           {lightType === "directional" && <directionalLight color={lightColor} intensity={lightIntensity} position={[5, 5, 5]} castShadow={shadowsEnabled} />}
//           {previewModelUrl && (
//             <Model url={previewModelUrl} sceneRef={sceneRef} onModelLoad={() => setIsModelLoaded(true)} />
//           )}

//           <OrbitControls
//             enableRotate={true}
//             enablePan={true}
//             enableZoom={true}
//             enableTranslate={true}
//             autoRotate={false}
//             minPolarAngle={0}
//             maxPolarAngle={Math.PI}
//           />
//           <Stats />
//           {backgrounds[backgroundIndex]} {/* Display the current background */}
//         </Canvas>
//       </div>
//       <div className="ui">
//         <div className="file-input-wrapper">
//           <label htmlFor="file-input" className="file-input-label">Choose File</label>
//           <input
//             type="file"
//             accept=".glb,.gltf"
//             onChange={handleFileChange}
//             className="file-input"
//             id="file-input"
//           />
//         </div>
//         <button className="upload-btn" onClick={handleCompressModel}>Compress Model</button>
//         <button className="upload-btn" onClick={handleExportGLB}>Export GLB</button>
//         <button className="background-btn" onClick={toggleBackground}>Change Background</button> {/* New button to change background */}
//         <div className="light-settings">
//           <label>
//             Light Type:
//             <select value={lightType} onChange={(e) => setLightType(e.target.value)}>
//               <option value="point">Point Light</option>
//               <option value="spot">Spot Light</option>
//               <option value="directional">Directional Light</option>
//             </select>
//           </label>
//           <label>
//             Light Color:
//             <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} />
//           </label>
//           <label>
//             Light Intensity:
//             <input
//               type="range"
//               min="0"
//               max="10"
//               step="0.1"
//               value={lightIntensity}
//               onChange={(e) => setLightIntensity(e.target.value)}
//             />
//           </label>
//           <label>
//             Shadows Enabled:
//             <input
//               type="checkbox"
//               checked={shadowsEnabled}
//               onChange={(e) => setShadowsEnabled(e.target.checked)}
//             />
//           </label>
//           <label>
//             Shadow Intensity:
//             <input
//               type="range"
//               min="0"
//               max="1"
//               step="0.1"
//               value={shadowIntensity}
//               onChange={(e) => setShadowIntensity(e.target.value)}
//             />
//           </label>
//           <label>
//             Exposure Enabled:
//             <input
//               type="checkbox"
//               checked={exposureEnabled}
//               onChange={(e) => setExposureEnabled(e.target.checked)}
//             />
//           </label>
//           <label>
//             Exposure Intensity:
//             <input
//               type="range"
//               min="0"
//               max="2"
//               step="0.1"
//               value={exposureIntensity}
//               onChange={(e) => setExposureIntensity(e.target.value)}
//             />
//           </label>
//         </div>
//         <button className="save-btn" onClick={saveSettings}>Save Settings</button>
//       </div>
//     </div>
//   );
// };

// export default App;

//-------------------------------------

// import React, { useState, useEffect, useRef } from "react";
// import { Canvas, useLoader } from "@react-three/fiber";
// import { OrbitControls, Stats, Stars, Cloud, Environment, useTexture } from "@react-three/drei";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
// import { initializeApp } from "firebase/app";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import "./App.css";
// import * as THREE from "three";

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyD98xV7NlyYF9ApnNC5bhSBRfM9XM0KomA",
//     authDomain: "module10-a4aa9.firebaseapp.com",
//     projectId: "module10-a4aa9",
//     storageBucket: "module10-a4aa9.appspot.com",
//     messagingSenderId: "564621044983",
//     appId: "1:564621044983:web:d4dab97e3d6a39bd7af7f2",
//     measurementId: "G-RDH0ENDLYV"
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
//   const [backgroundIndex, setBackgroundIndex] = useState(0); // New state for background index
//   const [lightType, setLightType] = useState("point");
//   const [lightColor, setLightColor] = useState("#ffffff");
//   const [lightIntensity, setLightIntensity] = useState(1);
//   const [shadowsEnabled, setShadowsEnabled] = useState(true);
//   const [shadowIntensity, setShadowIntensity] = useState(1);
//   const [exposureEnabled, setExposureEnabled] = useState(true);
//   const [exposureIntensity, setExposureIntensity] = useState(1);
//   const sceneRef = useRef();

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
//         name: "newcompressed", // Setting the file name explicitly
//       });
//       setIsCompressed(false);  // Reset compression state on new file upload
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
//     const options = isCompressed ? {
//       binary: true,
//       truncateDrawRange: false,
//       forcePowerOfTwoTextures: false,
//       includeCustomExtensions: false,
//       dracoOptions: {
//         encoderMethod: "edgebreaker",
//         quantizationBits: 14,
//       },
//     } : {
//       binary: true,
//       truncateDrawRange: false,
//       forcePowerOfTwoTextures: false,
//       includeCustomExtensions: false,
//     };

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
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `model_${isCompressed ? 'compressed_' : ''}${Date.now()}.glb`;
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
//             if (!child.material) return;
//             child.material.needsUpdate = true;
//           }
//         });
//       }
//     }, [model, shadowsEnabled]);

//     return model ? <primitive object={model} position={[0, -1, 0]} /> : null; // Adjust position here
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

//   const saveSettings = async () => {
//     try {
//       await setDoc(doc(firestore, "settings", "appSettings"), {
//         lightType,
//         lightColor,
//         lightIntensity,
//         shadowsEnabled,
//         shadowIntensity,
//         exposureEnabled,
//         exposureIntensity,
//       });
//       alert("Settings saved successfully!");
//     } catch (error) {
//       console.error("Error saving settings:", error);
//       alert("Error saving settings: " + error.message);
//     }
//   };

//   useEffect(() => {
//     const fetchSettings = async () => {
//       const docRef = doc(firestore, "settings", "appSettings");
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
//       }
//     };
//     fetchSettings();
//   }, []);

//   return (
//     <div className="App">
//       <div className="canvas-container">
//         <Canvas
//           shadows
//           camera={{ position: [0, 2, 5], fov: 50 }}
//           gl={{ antialias: true }}
//           onCreated={({ gl, scene }) => {
//             gl.shadowMap.enabled = true;
//             gl.shadowMap.type = THREE.PCFSoftShadowMap;
//             gl.toneMapping = THREE.ACESFilmicToneMapping;
//             gl.toneMappingExposure = exposureEnabled ? exposureIntensity : 1;
//             scene.background = new THREE.Color(0xdddddd);
//           }}
//         >
//           <ambientLight intensity={0.2} />
//           {lightType === "point" && (
//             <pointLight
//               color={lightColor}
//               intensity={lightIntensity}
//               position={[5, 5, 5]}
//               castShadow
//               shadow-mapSize-width={1024}
//               shadow-mapSize-height={1024}
//               shadow-camera-near={0.5}
//               shadow-camera-far={50}
//             />
//           )}
//           {lightType === "spot" && (
//             <spotLight
//               color={lightColor}
//               intensity={lightIntensity}
//               position={[10, 5, 15]}
//               angle={0.3}
//               penumbra={0.2}
//               castShadow
//               shadow-mapSize-width={1024}
//               shadow-mapSize-height={1024}
//               shadow-camera-near={0.5}
//               shadow-camera-far={50}
//             />
//           )}
//           {lightType === "directional" && (
//             <directionalLight
//               color={lightColor}
//               intensity={lightIntensity}
//               position={[15, 5, 10]}
//               castShadow
//               shadow-mapSize-width={1024}
//               shadow-mapSize-height={1024}
//               shadow-camera-left={-10}
//               shadow-camera-right={10}
//               shadow-camera-top={10}
//               shadow-camera-bottom={-10}
//               shadow-camera-near={0.5}
//               shadow-camera-far={50}
//             />
//           )}
//           {previewModelUrl && (
//             <Model url={previewModelUrl} sceneRef={sceneRef} onModelLoad={() => setIsModelLoaded(true)} />
//           )}
//           <OrbitControls
//             enableRotate={true}
//             enablePan={true}
//             enableZoom={true}
//             enableTranslate={true}
//             autoRotate={false}
//             minPolarAngle={0}
//             maxPolarAngle={Math.PI}
//           />
//           <Stats />
//           {backgrounds[backgroundIndex]} {/* Display the current background */}
//         </Canvas>
//       </div>
//       <div className="ui">
//         <div className="file-input-wrapper">
//           <label htmlFor="file-input" className="file-input-label">Choose File</label>
//           <input
//             type="file"
//             accept=".glb,.gltf"
//             onChange={handleFileChange}
//             className="file-input"
//             id="file-input"
//           />
//         </div>
//         <button className="upload-btn" onClick={handleCompressModel}>Compress Model</button>
//         <button className="upload-btn" onClick={handleExportGLB}>Export GLB</button>
//         <button className="background-btn" onClick={toggleBackground}>Change Background</button> {/* New button to change background */}
//         <div className="light-settings">
//           <label>
//             Light Type:
//             <select value={lightType} onChange={(e) => setLightType(e.target.value)}>
//               <option value="point">Point Light</option>
//               <option value="spot">Spot Light</option>
//               <option value="directional">Directional Light</option>
//             </select>
//           </label>
//           <label>
//             Light Color:
//             <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} />
//           </label>
//           <label>
//             Light Intensity:
//             <input
//               type="range"
//               min="0"
//               max="10"
//               step="0.1"
//               value={lightIntensity}
//               onChange={(e) => setLightIntensity(e.target.value)}
//             />
//           </label>
//           <label>
//             Shadows Enabled:
//             <input
//               type="checkbox"
//               checked={shadowsEnabled}
//               onChange={(e) => setShadowsEnabled(e.target.checked)}
//             />
//           </label>
//           <label>
//             Shadow Intensity:
//             <input
//               type="range"
//               min="0"
//               max="1"
//               step="0.1"
//               value={shadowIntensity}
//               onChange={(e) => setShadowIntensity(e.target.value)}
//             />
//           </label>
//           <label>
//             Exposure Enabled:
//             <input
//               type="checkbox"
//               checked={exposureEnabled}
//               onChange={(e) => setExposureEnabled(e.target.checked)}
//             />
//           </label>
//           <label>
//             Exposure Intensity:
//             <input
//               type="range"
//               min="0"
//               max="2"
//               step="0.1"
//               value={exposureIntensity}
//               onChange={(e) => setExposureIntensity(e.target.value)}
//             />
//           </label>
//         </div>
//         <button className="save-btn" onClick={saveSettings}>Save Settings</button>
//       </div>
//     </div>
//   );
// };

// export default App;

//------------------------------------------------------

// import React, { useState, useEffect, useRef } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Stats } from "@react-three/drei";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { initializeApp } from "firebase/app";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import { SketchPicker } from 'react-color';
// import "./App.css";
// import GridHelperComponent from "./GridHelperComponent"; // Import the GridHelperComponent
// import LightSettings from "./LightSettings"; // Import LightSettings

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
//   const [backgroundColor, setBackgroundColor] = useState("#021b25");
//   const [gridColor, setGridColor] = useState("#ffffff");
//   const sceneRef = useRef();
//   const [lightSettings, setLightSettings] = useState({
//     lightType: "ambientLight",
//     lightColor: "#ffffff",
//     lightIntensity: 1,
//     shadowsEnabled: true,
//     shadowSharpness: "sharp",
//     exposureEnabled: true,
//     exposureIntensity: 1,
//   });

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
//     const options = isCompressed ? {
//       binary: true,
//       truncateDrawRange: false,
//       forcePowerOfTwoTextures: false,
//       includeCustomExtensions: false,
//       dracoOptions: {
//         encoderMethod: "edgebreaker",
//         quantizationBits: 14,
//       },
//     } : {
//       binary: true,
//       truncateDrawRange: false,
//       forcePowerOfTwoTextures: false,
//       includeCustomExtensions: false,
//     };

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
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `model_${isCompressed ? 'compressed_' : ''}${Date.now()}.glb`;
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

//         loader.load(
//           url,
//           (gltf) => {
//             setModel(gltf.scene);
//             sceneRef.current = gltf.scene;
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

//     return model ? <primitive object={model} /> : null;
//   };

//   useEffect(() => {
//     const gridColor = backgroundColor === "#021b25" ? "#ffffff" : "#000000";
//     setGridColor(gridColor);
//   }, [backgroundColor]);

//   return (
//     <div className="App">
//       <div className="canvas-container" style={{ backgroundColor }}>
//         <Canvas
//           shadows={lightSettings.shadowsEnabled}
//           camera={{ position: [0, 2, 5] }}
//           gl={{ toneMappingExposure: lightSettings.exposureEnabled ? lightSettings.exposureIntensity : 1 }}
//         >
//           {lightSettings.lightType === "ambientLight" ? (
//             <ambientLight intensity={lightSettings.lightIntensity} color={lightSettings.lightColor} />
//           ) : (
//             <pointLight
//               castShadow={lightSettings.shadowsEnabled}
//               position={[10, 10, 10]}
//               intensity={lightSettings.lightIntensity}
//               color={lightSettings.lightColor}
//               shadow-mapSize-width={lightSettings.shadowSharpness === "sharp" ? 2048 : 1024}
//               shadow-mapSize-height={lightSettings.shadowSharpness === "sharp" ? 2048 : 1024}
//             />
//           )}
//           <GridHelperComponent gridColor={gridColor} />
//           <mesh>
//             <Model url={previewModelUrl} sceneRef={sceneRef} onModelLoad={() => setIsModelLoaded(true)} />
//           </mesh>
//           <OrbitControls />
//           <Stats />
//         </Canvas>
//       </div>
//       <div className="ui">
//         <div className="file-input-wrapper">
//           <label className="file-input-label" htmlFor="file-input">Choose File</label>
//           <input
//             id="file-input"
//             type="file"
//             className="file-input"
//             accept=".glb,.gltf"
//             onChange={handleFileChange}
//           />
//         </div>
//         <button className="upload-btn" onClick={handleCompressModel} disabled={!file}>Compress & Upload Model</button>
//         <button className="upload-btn" onClick={handleExportGLB}>Export GLB</button>
//         <input
//           type="color"
//           value={backgroundColor}
//           onChange={(e) => setBackgroundColor(e.target.value)}
//           style={{ marginTop: "10px" }}
//         />
//         <LightSettings onSettingsChange={(settings) => setLightSettings(settings)} />
//       </div>
//     </div>
//   );
// };

// export default App;

// the above is shravya sent the code grid is there



// import React, { useState, useEffect, useRef } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Stats } from "@react-three/drei";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { initializeApp } from "firebase/app";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import "./App.css";
// import GridHelperComponent from "./GridHelperComponent";
// import LightSettings from "./LightSettings"; // Import LightSettings component

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyD98xV7NlyYF9ApnNC5bhSBRfM9XM0KomA",
//     authDomain: "module10-a4aa9.firebaseapp.com",
//     projectId: "module10-a4aa9",
//     storageBucket: "module10-a4aa9.appspot.com",
//     messagingSenderId: "564621044983",
//     appId: "1:564621044983:web:d4dab97e3d6a39bd7af7f2",
//     measurementId: "G-RDH0ENDLYV"
//   };

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
//   const [lightSettings, setLightSettings] = useState({
//     lightType: "pointLight",
//     lightColor: "#ffffff",
//     lightIntensity: 1,
//     shadowsEnabled: false,
//     shadowIntensity: "sharp",
//     exposureEnabled: false,
//     exposureIntensity: 1,
//   });
//   const [backgroundColor, setBackgroundColor] = useState("#021b25");
//   const [gridColor, setGridColor] = useState("#ffffff");
//   const sceneRef = useRef();

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

//   useEffect(() => {
//     const fetchLightSettings = async () => {
//       const docRef = doc(firestore, "lightSettings", "currentSettings");
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setLightSettings(docSnap.data());
//       }
//     };
//     fetchLightSettings();
//   }, [firestore]);

//   useEffect(() => {
//     const gridColor = backgroundColor === "#021b25" ? "#ffffff" : "#000000";
//     setGridColor(gridColor);
//   }, [backgroundColor]);

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       const fileURL = URL.createObjectURL(selectedFile);
//       setPreviewModelUrl(fileURL);
//       setFile({
//         ...selectedFile,
//         name: "newcompressed",
//       });
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
//     const options = {
//       binary: true,
//       truncateDrawRange: false,
//       forcePowerOfTwoTextures: false,
//       includeCustomExtensions: false,
//       dracoOptions: {
//         encoderMethod: "edgebreaker",
//         quantizationBits: 14,
//       },
//     };

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
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `model_${Date.now()}.glb`;
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

//         loader.load(
//           url,
//           (gltf) => {
//             setModel(gltf.scene);
//             sceneRef.current = gltf.scene;
//             if (onModelLoad) {
//               onModelLoad();
//             }
//           },
//           undefined,
//           (error) => {
//             console.error("Error loading model:", error);
//             alert("Error loading model: " + error.message);
//           }
//         );
//       }
//     }, [url, onModelLoad, sceneRef]);

//     return model ? <primitive object={model} /> : null;
//   };

//   const handleLightSettingsChange = async (newSettings) => {
//     setLightSettings(newSettings);
//     try {
//       await setDoc(doc(firestore, "lightSettings", "currentSettings"), newSettings);
//       console.log("Light settings updated and saved to Firestore!");
//     } catch (error) {
//       console.error("Error updating light settings:", error);
//       alert("Error updating light settings: " + error.message);
//     }
//   };

//   useEffect(() => {
//     const updateLights = () => {
//       if (sceneRef.current) {
//         // Remove existing lights (if any)
//         sceneRef.current.traverse((child) => {
//           if (child.isLight) {
//             sceneRef.current.remove(child);
//           }
//         });

//         // Create new light based on lightSettings
//         let light;
//         switch (lightSettings.lightType) {
//           case "pointLight":
//             light = new THREE.PointLight(lightSettings.lightColor, lightSettings.lightIntensity);
//             break;
//           case "directionalLight":
//             light = new THREE.DirectionalLight(lightSettings.lightColor, lightSettings.lightIntensity);
//             break;
//           case "spotLight":
//             light = new THREE.SpotLight(lightSettings.lightColor, lightSettings.lightIntensity);
//             break;
//           default:
//             light = new THREE.AmbientLight(lightSettings.lightColor, lightSettings.lightIntensity);
//             break;
//         }

//         // Add shadow properties if shadowsEnabled
//         if (lightSettings.shadowsEnabled) {
//           light.castShadow = true;
//           light.shadow.mapSize.width = 2048;
//           light.shadow.mapSize.height = 2048;
//           light.shadow.camera.near = 0.1;
//           light.shadow.camera.far = 1000;
//           light.shadow.camera.fov = 30;

//           // Adjust shadow properties based on shadowIntensity
//           if (lightSettings.shadowIntensity === "soft") {
//             light.shadow.radius = 8;
//             light.shadow.bias = -0.001;
//           } else {
//             light.shadow.radius = 1;
//             light.shadow.bias = -0.0001;
//           }
//         }

//         // Add light to scene
//         light.position.set(10, 10, 10); // Example position, adjust as needed
//         sceneRef.current.add(light);

//         // Handle exposure settings (if needed)
//         // Note: Implementing exposure control depends on your renderer and post-processing setup.
//       }
//     };

//     updateLights();
//   }, [lightSettings]);

//   return (
//     <div className="App">
//       <div className="canvas-container" style={{ backgroundColor }}>
//         <Canvas
//           shadows={true}
//           camera={{ position: [0, 2, 5] }}
//         >
//           <ambientLight intensity={0.5} />
//           <pointLight
//             castShadow={true}
//             position={[10, 10, 10]}
//             intensity={1}
//             color="#ffffff"
//             shadow-mapSize-width={2048}
//             shadow-mapSize-height={2048}
//           />
//           <GridHelperComponent gridColor={gridColor} />
//           <mesh>
//             <Model url={previewModelUrl} sceneRef={sceneRef} onModelLoad={() => setIsModelLoaded(true)} />
//           </mesh>
//           <OrbitControls />
//           <Stats />
//         </Canvas>
//       </div>
//       <div className="ui">
//         <div className="file-input-wrapper">
//           <label className="file-input-label" htmlFor="file-input">Choose File</label>
//           <input
//             id="file-input"
//             type="file"
//             className="file-input"
//             accept=".glb,.gltf"
//             onChange={handleFileChange}
//           />
//         </div>
//         <button className="upload-btn" onClick={handleCompressModel} disabled={!file}>Compress & Upload Model</button>
//         <button className="upload-btn" onClick={handleExportGLB}>Export GLB</button>
//         <input
//           type="color"
//           value={backgroundColor}
//           onChange={(e) => setBackgroundColor(e.target.value)}
//           style={{ marginTop: "10px" }}
//         />
//         <LightSettings
//           currentSettings={lightSettings}
//           onSettingsChange={handleLightSettingsChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default App;


// //----------------

// import React, { useState, useEffect, useRef } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Stats } from "@react-three/drei";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import * as THREE from 'three';
// import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
// import { initializeApp } from "firebase/app";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import "./App.css";
// import GridHelperComponent from "./GridHelperComponent";

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
//   const [lightSettings, setLightSettings] = useState({
//     lightType: "pointLight",
//     lightColor: "#ffffff",
//     lightIntensity: 1,
//     shadowsEnabled: false,
//     shadowIntensity: "sharp",
//     exposureEnabled: false,
//     exposureIntensity: 1,
//   });
//   const [backgroundColor, setBackgroundColor] = useState("#021b25");
//   const [gridColor, setGridColor] = useState("#ffffff");
//   const sceneRef = useRef();

//   useEffect(() => {
//     const fetchModelUrl = async () => {
//       const docRef = doc(firestore, "models", "currentModel");
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setPreviewModelUrl(docSnap.data().url);
//       }
//     };
//     fetchModelUrl();
//   }, []);

//   useEffect(() => {
//     const fetchLightSettings = async () => {
//       const docRef = doc(firestore, "lightSettings", "currentSettings");
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setLightSettings(docSnap.data());
//       }
//     };
//     fetchLightSettings();
//   }, []);

//   useEffect(() => {
//     const gridColor = backgroundColor === "#021b25" ? "#ffffff" : "#000000";
//     setGridColor(gridColor);
//   }, [backgroundColor]);

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       const fileURL = URL.createObjectURL(selectedFile);
//       setPreviewModelUrl(fileURL);
//       setFile({
//         ...selectedFile,
//         name: "newcompressed",
//       });
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
//     const options = {
//       binary: true,
//       truncateDrawRange: false,
//       forcePowerOfTwoTextures: false,
//       includeCustomExtensions: false,
//       dracoOptions: {
//         encoderMethod: "edgebreaker",
//         quantizationBits: 14,
//       },
//     };

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
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `model_${Date.now()}.glb`;
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

//         loader.load(
//           url,
//           (gltf) => {
//             setModel(gltf.scene);
//             sceneRef.current = gltf.scene;
//             if (onModelLoad) {
//               onModelLoad();
//             }
//           },
//           undefined,
//           (error) => {
//             console.error("Error loading model:", error);
//             alert("Error loading model: " + error.message);
//           }
//         );
//       }
//     }, [url, onModelLoad, sceneRef]);

//     return model ? <primitive object={model} /> : null;
//   };

//   const handleLightSettingsChange = async (newSettings) => {
//     setLightSettings(newSettings);
//     try {
//       await setDoc(doc(firestore, "lightSettings", "currentSettings"), newSettings);
//       console.log("Light settings updated and saved to Firestore!");
//     } catch (error) {
//       console.error("Error updating light settings:", error);
//       alert("Error updating light settings: " + error.message);
//     }
//   };

//   useEffect(() => {
//     const updateLights = () => {
//       if (sceneRef.current) {
//         // Remove existing lights (if any)
//         sceneRef.current.traverse((child) => {
//           if (child.isLight) {
//             sceneRef.current.remove(child);
//           }
//         });

//         // Create new light based on lightSettings
//         let light;
//         switch (lightSettings.lightType) {
//           case "pointLight":
//             light = new THREE.PointLight(lightSettings.lightColor, lightSettings.lightIntensity);
//             break;
//           case "directionalLight":
//             light = new THREE.DirectionalLight(lightSettings.lightColor, lightSettings.lightIntensity);
//             break;
//           case "spotLight":
//             light = new THREE.SpotLight(lightSettings.lightColor, lightSettings.lightIntensity);
//             break;
//           default:
//             light = new THREE.AmbientLight(lightSettings.lightColor, lightSettings.lightIntensity);
//             break;
//         }

//         // Add shadow properties if shadowsEnabled
//         if (lightSettings.shadowsEnabled) {
//           light.castShadow = true;
//           light.shadow.mapSize.width = 2048;
//           light.shadow.mapSize.height = 2048;
//           light.shadow.camera.near = 0.1;
//           light.shadow.camera.far = 1000;
//           light.shadow.camera.fov = 30;

//           // Adjust shadow properties based on shadowIntensity
//           if (lightSettings.shadowIntensity === "soft") {
//             light.shadow.radius = 8;
//             light.shadow.bias = -0.001;
//           } else {
//             light.shadow.radius = 1;
//             light.shadow.bias = -0.0001;
//           }
//         }

//         // Add light to scene
//         light.position.set(10, 10, 10); // Example position, adjust as needed
//         sceneRef.current.add(light);

//         // Handle exposure settings (if needed)
//         // Note: Implementing exposure control depends on your renderer and post-processing setup.
//       }
//     };

//     updateLights();
//   }, [lightSettings]);

//   return (
//     <div className="App">
//       <div className="canvas-container" style={{ backgroundColor }}>
//         <Canvas
//           shadows={true}
//           camera={{ position: [0, 2, 5] }}
//         >
//           <ambientLight intensity={0.5} />
//           <pointLight
//             castShadow={true}
//             position={[10, 10, 10]}
//             intensity={1}
//             color="#ffffff"
//             shadow-mapSize-width={2048}
//             shadow-mapSize-height={2048}
//           />
//           <GridHelperComponent gridColor={gridColor} />
//           <mesh>
//             <Model url={previewModelUrl} sceneRef={sceneRef} onModelLoad={() => setIsModelLoaded(true)} />
//           </mesh>
//           <OrbitControls />
//           <Stats />
//         </Canvas>
//       </div>
//       <div className="ui">
//         <div className="file-input-wrapper">
//           <label className="file-input-label" htmlFor="file-input">Choose File</label>
//           <input
//             id="file-input"
//             type="file"
//             className="file-input"
//             accept=".glb,.gltf"
//             onChange={handleFileChange}
//           />
//         </div>
//         <button className="upload-btn" onClick={handleCompressModel} disabled={!file}>Compress & Upload Model</button>
//         <button className="upload-btn" onClick={handleExportGLB}>Export GLB</button>
//         <input
//           type="color"
//           value={backgroundColor}
//           onChange={(e) => setBackgroundColor(e.target.value)}
//           style={{ marginTop: "10px" }}
//         />

//         <div>
//           <h3>Light Settings</h3>
//           <label>
//             Light Type:
//             <select
//               value={lightSettings.lightType}
//               onChange={(e) => handleLightSettingsChange({ ...lightSettings, lightType: e.target.value })}
//             >
//               <option value="pointLight">Point Light</option>
//               <option value="directionalLight">Directional Light</option>
//               <option value="spotLight">Spot Light</option>
//               <option value="ambientLight">Ambient Light</option>
//             </select>
//           </label>
//           <br />
//           <label>
//             Light Color:
//             <input
//               type="color"
//               value={lightSettings.lightColor}
//               onChange={(e) => handleLightSettingsChange({ ...lightSettings, lightColor: e.target.value })}
//             />
//           </label>
//           <br />
//           <label>
//             Light Intensity:
//             <input
//               type="range"
//               min="0"
//               max="10"
//               step="0.1"
//               value={lightSettings.lightIntensity}
//               onChange={(e) => handleLightSettingsChange({ ...lightSettings, lightIntensity: parseFloat(e.target.value) })}
//             />
//           </label>
//           <br />
//           <label>
//             Shadows Enabled:
//             <input
//               type="checkbox"
//               checked={lightSettings.shadowsEnabled}
//               onChange={(e) => handleLightSettingsChange({ ...lightSettings, shadowsEnabled: e.target.checked })}
//             />
//           </label>
//           <br />
//           <label>
//             Shadow Intensity:
//             <select
//               value={lightSettings.shadowIntensity}
//               onChange={(e) => handleLightSettingsChange({ ...lightSettings, shadowIntensity: e.target.value })}
//               disabled={!lightSettings.shadowsEnabled}
//             >
//               <option value="sharp">Sharp</option>
//               <option value="soft">Soft</option>
//             </select>
//           </label>
//           <br />
//           <label>
//             Exposure Enabled:
//             <input
//               type="checkbox"
//               checked={lightSettings.exposureEnabled}
//               onChange={(e) => handleLightSettingsChange({ ...lightSettings, exposureEnabled: e.target.checked })}
//             />
//           </label>
//           <br />
//           <label>
//             Exposure Intensity:
//             <input
//               type="range"
//               min="0"
//               max="10"
//               step="0.1"
//               value={lightSettings.exposureIntensity}
//               onChange={(e) => handleLightSettingsChange({ ...lightSettings, exposureIntensity: parseFloat(e.target.value) })}
//               disabled={!lightSettings.exposureEnabled}
//             />
//           </label>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;

//-----------------------

import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import "./App.css";
import GridHelperComponent from "./GridHelperComponent";

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
  const [lightSettings, setLightSettings] = useState({
    lightType: "pointLight",
    lightColor: "#ffffff",
    lightIntensity: 1,
    shadowsEnabled: false,
    shadowIntensity: "sharp",
    exposureEnabled: false,
    exposureIntensity: 1,
  });
  const [backgroundColor, setBackgroundColor] = useState("#021b25");
  const [gridColor, setGridColor] = useState("#ffffff");
  const sceneRef = useRef();

  useEffect(() => {
    const fetchModelUrl = async () => {
      const docRef = doc(firestore, "models", "currentModel");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPreviewModelUrl(docSnap.data().url);
      }
    };
    fetchModelUrl();
  }, []);

  useEffect(() => {
    const fetchLightSettings = async () => {
      const docRef = doc(firestore, "lightSettings", "currentSettings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLightSettings(docSnap.data());
      }
    };
    fetchLightSettings();
  }, []);

  useEffect(() => {
    const gridColor = backgroundColor === "#021b25" ? "#ffffff" : "#000000";
    setGridColor(gridColor);
  }, [backgroundColor]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setPreviewModelUrl(fileURL);
      setFile({
        ...selectedFile,
        name: "newcompressed",
      });
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
    const options = {
      binary: true,
      truncateDrawRange: false,
      forcePowerOfTwoTextures: false,
      includeCustomExtensions: false,
      dracoOptions: {
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
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `model_${Date.now()}.glb`;
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

        loader.load(
          url,
          (gltf) => {
            setModel(gltf.scene);
            sceneRef.current = gltf.scene;
            if (onModelLoad) {
              onModelLoad();
            }
          },
          undefined,
          (error) => {
            console.error("Error loading model:", error);
            alert("Error loading model: " + error.message);
          }
        );
      }
    }, [url, onModelLoad, sceneRef]);

    return model ? <primitive object={model} /> : null;
  };

  const handleLightSettingsChange = async (newSettings) => {
    setLightSettings(newSettings);
    try {
      await setDoc(doc(firestore, "lightSettings", "currentSettings"), newSettings);
      console.log("Light settings updated and saved to Firestore!");
    } catch (error) {
      console.error("Error updating light settings:", error);
      alert("Error updating light settings: " + error.message);
    }
  };

  useEffect(() => {
    const updateLights = () => {
      if (sceneRef.current) {
        // Remove existing lights (if any)
        sceneRef.current.traverse((child) => {
          if (child.isLight) {
            sceneRef.current.remove(child);
          }
        });

        // Create new light based on lightSettings
        let light;
        switch (lightSettings.lightType) {
          case "pointLight":
            light = new THREE.PointLight(lightSettings.lightColor, lightSettings.lightIntensity);
            break;
          case "directionalLight":
            light = new THREE.DirectionalLight(lightSettings.lightColor, lightSettings.lightIntensity);
            break;
          case "spotLight":
            light = new THREE.SpotLight(lightSettings.lightColor, lightSettings.lightIntensity);
            break;
          default:
            light = new THREE.AmbientLight(lightSettings.lightColor, lightSettings.lightIntensity);
            break;
        }

        // Add shadow properties if shadowsEnabled
        if (lightSettings.shadowsEnabled) {
          light.castShadow = true;
          light.shadow.mapSize.width = 2048;
          light.shadow.mapSize.height = 2048;
          light.shadow.camera.near = 0.1;
          light.shadow.camera.far = 1000;
          light.shadow.camera.fov = 30;

          // Adjust shadow properties based on shadowIntensity
          if (lightSettings.shadowIntensity === "soft") {
            light.shadow.radius = 8;
            light.shadow.bias = -0.001;
          } else {
            light.shadow.radius = 1;
            light.shadow.bias = -0.0001;
          }
        }

        // Add light to scene
        light.position.set(10, 10, 10); // Example position, adjust as needed
        sceneRef.current.add(light);

        // Handle exposure settings (if needed)
        // Note: Implementing exposure control depends on your renderer and post-processing setup.
      }
    };

    updateLights();
  }, [lightSettings]);

  return (
    <div className="App">
      <div className="canvas-container" style={{ backgroundColor }}>
        <Canvas
          shadows={true}
          camera={{ position: [0, 2, 5] }}
        >
          <ambientLight intensity={0.5} />
          <GridHelperComponent gridColor={gridColor} />
          <mesh>
            <Model url={previewModelUrl} sceneRef={sceneRef} onModelLoad={() => setIsModelLoaded(true)} />
          </mesh>
          <OrbitControls />
          <Stats />
        </Canvas>
      </div>
      <div className="ui">
        <div className="file-input-wrapper">
          <label className="file-input-label" htmlFor="file-input">Choose File</label>
          <input
            id="file-input"
            type="file"
            className="file-input"
            accept=".glb,.gltf"
            onChange={handleFileChange}
          />
        </div>
        <button className="upload-btn" onClick={handleCompressModel} disabled={!file}>Compress & Upload Model</button>
        <button className="upload-btn" onClick={handleExportGLB}>Export GLB</button>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          style={{ marginTop: "10px" }}
        />

        <div>
          <h3>Light Settings</h3>
          <label>
            Light Type:
            <select
              value={lightSettings.lightType}
              onChange={(e) => handleLightSettingsChange({ ...lightSettings, lightType: e.target.value })}
            >
              <option value="pointLight">Point Light</option>
              <option value="directionalLight">Directional Light</option>
              <option value="spotLight">Spot Light</option>
              <option value="ambientLight">Ambient Light</option>
            </select>
          </label>
          <br />
          <label>
            Light Color:
            <input
              type="color"
              value={lightSettings.lightColor}
              onChange={(e) => handleLightSettingsChange({ ...lightSettings, lightColor: e.target.value })}
            />
          </label>
          <br />
          <label>
            Light Intensity:
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={lightSettings.lightIntensity}
              onChange={(e) => handleLightSettingsChange({ ...lightSettings, lightIntensity: parseFloat(e.target.value) })}
            />
          </label>
          <br />
          <label>
            Shadows Enabled:
            <input
              type="checkbox"
              checked={lightSettings.shadowsEnabled}
              onChange={(e) => handleLightSettingsChange({ ...lightSettings, shadowsEnabled: e.target.checked })}
            />
          </label>
          <br />
          <label>
            Shadow Intensity:
            <select
              value={lightSettings.shadowIntensity}
              onChange={(e) => handleLightSettingsChange({ ...lightSettings, shadowIntensity: e.target.value })}
              disabled={!lightSettings.shadowsEnabled}
            >
              <option value="sharp">Sharp</option>
              <option value="soft">Soft</option>
            </select>
          </label>
          <br />
          <label>
            Exposure Enabled:
            <input
              type="checkbox"
              checked={lightSettings.exposureEnabled}
              onChange={(e) => handleLightSettingsChange({ ...lightSettings, exposureEnabled: e.target.checked })}
            />
          </label>
          <br />
          <label>
            Exposure Intensity:
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={lightSettings.exposureIntensity}
              onChange={(e) => handleLightSettingsChange({ ...lightSettings, exposureIntensity: parseFloat(e.target.value) })}
              disabled={!lightSettings.exposureEnabled}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default App;




