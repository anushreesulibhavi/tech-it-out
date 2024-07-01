import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import "./App.css";

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
  const sceneRef = useRef();

  useEffect(() => {
    // Fetch the model URL from Firestore on app initialization
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
        name: "newcompressed", // Setting the file name explicitly
      });
      setIsCompressed(false);  // Reset compression state on new file upload
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
    const options = isCompressed ? {
      binary: true,
      truncateDrawRange: false,
      forcePowerOfTwoTextures: false,
      includeCustomExtensions: false,
      dracoOptions: {
        encoderMethod: "edgebreaker",
        quantizationBits: 14,
      },
    } : {
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
      const a = document.createElement('a');
      a.href = url;
      a.download = `model_${isCompressed ? 'compressed_' : ''}${Date.now()}.glb`;
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
        dracoLoader.setDecoderPath("https://cdn.jsdelivr.net/npm/three/examples/js/libs/draco/");

        loader.setDRACOLoader(dracoLoader);

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
            console.error("An error happened while loading the model:", error);
            alert("An error happened while loading the model: " + error.message);
          }
        );
      }
    }, [url, onModelLoad, sceneRef]);

    return model ? <primitive object={model} position={[0, -1, 0]} /> : null; // Adjust position here
  };

  return (
    <div className="App">
      <div className="canvas-container">
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          {previewModelUrl && (
            <Model url={previewModelUrl} sceneRef={sceneRef} onModelLoad={() => setIsModelLoaded(true)} />
          )}
          <OrbitControls
            enableRotate={true}
            enablePan={true}
            enableZoom={true}
            enableTranslate={true}
            autoRotate={false}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
          />
          <Stats />
        </Canvas>
      </div>
      <div className="ui">
        <div className="file-input-wrapper">
          <label htmlFor="file-input" className="file-input-label">Choose File</label>
          <input
            type="file"
            accept=".glb,.gltf"
            onChange={handleFileChange}
            className="file-input"
            id="file-input"
          />
        </div>
        <button className="upload-btn" onClick={handleCompressModel}>Compress Model</button>
        <button className="upload-btn" onClick={handleExportGLB}>Export GLB</button>
      </div>
    </div>
  );
};

export default App;
