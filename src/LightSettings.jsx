import React, { useState, useEffect } from "react";
import { ChromePicker } from "react-color";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const LightSettings = ({ onSettingsChange }) => {
  const [lightType, setLightType] = useState("pointLight");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [lightIntensity, setLightIntensity] = useState(1);
  const [shadowsEnabled, setShadowsEnabled] = useState(false);
  const [shadowIntensity, setShadowIntensity] = useState("sharp"); // "sharp" or "soft"
  const [exposureEnabled, setExposureEnabled] = useState(false);
  const [exposureIntensity, setExposureIntensity] = useState(1);

  useEffect(() => {
    const fetchLightSettings = async () => {
      const docRef = doc(firestore, "lightSettings", "currentSettings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const settings = docSnap.data();
        setLightType(settings.lightType);
        setLightColor(settings.lightColor);
        setLightIntensity(settings.lightIntensity);
        setShadowsEnabled(settings.shadowsEnabled);
        setShadowIntensity(settings.shadowIntensity);
        setExposureEnabled(settings.exposureEnabled);
        setExposureIntensity(settings.exposureIntensity);
      }
    };
    fetchLightSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await setDoc(doc(firestore, "lightSettings", "currentSettings"), {
        lightType,
        lightColor,
        lightIntensity,
        shadowsEnabled,
        shadowIntensity,
        exposureEnabled,
        exposureIntensity,
      });
      alert("Light settings saved successfully!");
      if (onSettingsChange) {
        onSettingsChange({
          lightType,
          lightColor,
          lightIntensity,
          shadowsEnabled,
          shadowIntensity,
          exposureEnabled,
          exposureIntensity,
        });
      }
    } catch (error) {
      console.error("Error saving light settings:", error);
      alert("Error saving light settings: " + error.message);
    }
  };

  const handleLightTypeChange = (event) => {
    setLightType(event.target.value);
  };

  const handleColorChange = (color) => {
    setLightColor(color.hex);
  };

  const handleIntensityChange = (event) => {
    setLightIntensity(parseFloat(event.target.value));
  };

  const handleShadowsToggle = () => {
    setShadowsEnabled(!shadowsEnabled);
  };

  const handleShadowIntensityChange = (event) => {
    setShadowIntensity(event.target.value);
  };

  const handleExposureToggle = () => {
    setExposureEnabled(!exposureEnabled);
  };

  const handleExposureIntensityChange = (event) => {
    setExposureIntensity(parseFloat(event.target.value));
  };

  return (
    <div className="light-settings">
      <h2>Light Settings</h2>
      <div className="setting">
        <label htmlFor="lightType">Light Type:</label>
        <select id="lightType" value={lightType} onChange={handleLightTypeChange}>
          <option value="pointLight">Point Light</option>
          <option value="directionalLight">Directional Light</option>
          <option value="spotLight">Spot Light</option>
        </select>
      </div>
      <div className="setting">
        <label>Light Color:</label>
        <ChromePicker color={lightColor} onChangeComplete={handleColorChange} />
      </div>
      <div className="setting">
        <label htmlFor="lightIntensity">Light Intensity:</label>
        <input
          id="lightIntensity"
          type="number"
          min="0"
          max="2"
          step="0.1"
          value={lightIntensity}
          onChange={handleIntensityChange}
        />
      </div>
      {lightType !== "ambientLight" && (
        <div className="setting">
          <label>
            <input type="checkbox" checked={shadowsEnabled} onChange={handleShadowsToggle} />
            Enable Shadows
          </label>
          {shadowsEnabled && (
            <select value={shadowIntensity} onChange={handleShadowIntensityChange}>
              <option value="sharp">Sharp Shadows</option>
              <option value="soft">Soft Shadows</option>
            </select>
          )}
        </div>
      )}
      <div className="setting">
        <label>
          <input type="checkbox" checked={exposureEnabled} onChange={handleExposureToggle} />
          Enable Exposure
        </label>
        {exposureEnabled && (
          <input
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={exposureIntensity}
            onChange={handleExposureIntensityChange}
          />
        )}
      </div>
      <button onClick={saveSettings}>Save Settings</button>
    </div>
  );
};

export default LightSettings;


//----8th

