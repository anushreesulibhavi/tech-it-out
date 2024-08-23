# FABRIK SPATIAL APP

Welcome to the 3D Model Viewer and Editor! This application is designed to provide a seamless interface for uploading, viewing, and interacting with 3D models. Whether you're an artist, developer, or hobbyist, our app offers a robust set of tools to manipulate lights, cameras, upload models to firebase and other visual elements in a 3D scene.

### REACT APPLICATION

## JSX COMPONENTS OVERVIEW

This document provides an overview of the JSX components used in this React application. The components are designed to create a responsive and interactive 3D interface, leveraging React, Three.js, and custom hooks to manage the application's state and 3D scene.

# Contents
- [Introduction](#introduction)
- [Components Overview](#components-overview)
  - [App Component](#app-component)
  - [Canvas Component](#canvas-component)
  - [UI Controls Component](#ui-controls-component)
  - [LightSettings Component](#lightsettings-component)
  - [SlidingPanel Component](#slidingpanel-component)
  - [HelpPanel Component](#helppanel-component)
- [State Management](#state-management)
- [Event Handling](#event-handling)
- [3D Scene Setup](#3d-scene-setup)
- [Conclusion](#conclusion)

## Introduction

The React application is structured with several JSX components that each serve a specific purpose. The components interact to build a cohesive user interface where users can manipulate 3D objects and control various settings through a dynamic UI.

## Components Overview

### App Component

## File: App.jsx

- Purpose: The App component serves as the main container for the application, rendering the core layout and managing the high-level state. It includes the main 3D canvas and UI components that allow user interaction.
- Structure:
  - Renders the CanvasComponent, which displays the 3D scene.
  - Includes UIControls, LightSettings, SlidingPanel, and HelpPanel components to manage various aspects of the UI.
- State Management: The component manages the application's global state using hooks like useState and useEffect for reactivity.

### Canvas Component

## File: CanvasComponent.jsx

- Purpose: The CanvasComponent is responsible for setting up and rendering the 3D scene using react-three-fiber. It includes the camera, lighting, and 3D objects.
- Structure:
  - Camera: Includes both orthographic and perspective cameras, enabling different views of the scene.
  - Lighting: Configures various lights (e.g., ambient, directional) to illuminate the scene.
  - 3D Objects: Renders the main 3D models or objects within the scene.
  - Interactivity: Implements event listeners for user interactions like clicks, drags, or zooms.
- React Three Fiber: Utilizes the useFrame hook to handle animation and updates within the 3D scene.

### UI Controls Component

## File: UIControls.jsx

- Purpose: The UIControls component provides the user interface for interacting with the 3D scene, such as uploading files, adjusting settings, and toggling views.
- Structure:
  - Buttons: Includes buttons for uploading files, toggling the visibility of the sliding panel, and controlling other aspects of the UI.
  - Inputs: Renders inputs like sliders and color pickers for fine-tuning settings like light intensity or color.
- Styling: Incorporates CSS classes to manage the layout and appearance of the UI controls, ensuring they are accessible and easy to use.

### LightSettings Component

#### File: LightSettings.jsx

- Purpose: Manages the lighting configuration for the 3D scene, allowing users to adjust parameters like light type, intensity, and color.
- Structure:
  - Controls: Provides sliders and color pickers for real-time adjustment of light properties.
  - State Management: Utilizes state hooks to update the 3D scene's lighting in response to user input.
- Integration: Connected to the CanvasComponent to apply the selected light settings dynamically.

### SlidingPanel Component

- Purpose: This component manages a sliding panel UI that provides additional settings or information without cluttering the main interface.
- Structure:
  - Panel Visibility: Includes logic to toggle the panel's visibility based on user interaction.
  - Content: Can contain various UI elements such as forms, checkboxes, or additional settings related to the application.
- Interactivity: The panel slides in and out of view smoothly, offering a non-intrusive way to access secondary features.

### HelpPanel Component

- Purpose: Displays a help panel with instructions or guidance for users. It can be toggled on or off as needed.
- Structure:
  - Content: Contains text and images explaining how to use the application.
  - Accessibility: Positioned to be easily accessible without interfering with the main content.
- Toggle: Includes a button that opens or closes the help panel, providing users with on-demand assistance.

## State Management

State management within these components is primarily handled using React's useState and useEffect hooks. The state is passed between components via props, ensuring a single source of truth and synchronized updates across the UI and 3D scene.

### Example:
- Global State: The App component might manage global state such as the current lighting configuration, which is then passed down to the LightSettings component.
- Local State: Components like SlidingPanel and HelpPanel manage their visibility states locally, triggered by specific user interactions.

## Event Handling

Event handling is crucial for user interaction with the 3D scene and UI components. Common events include:
- Click Events: Used for buttons, toggling panels, and selecting UI elements.
- Drag Events: To manipulate 3D objects or navigate within the scene.
- Input Events: Captured by sliders and color pickers to update lighting or other scene properties.

### Example:
- Canvas Component: Uses the onPointerDown event to detect and handle user clicks on 3D objects.
- UI Controls: Handles onChange events to update settings like light intensity in real-time.

## 3D Scene Setup

The 3D scene setup is handled primarily within the CanvasComponent. Key aspects include:
- Cameras: Both orthographic and perspective cameras are implemented, allowing for different perspectives of the scene.
- Lighting: Configurable lights are added to illuminate the 3D objects, which can be adjusted using the LightSettings component.
- Objects: The 3D models or objects that the user interacts with are loaded and rendered within the scene, with potential animations managed through useFrame.

## Conclusion

The React application is built with a modular approach, where each JSX component is responsible for a specific aspect of the UI or 3D scene. The structure promotes reusability, maintainability, and scalability. By following this documentation, developers can easily understand the purpose and functionality of each component, making it easier to contribute to or extend the application.

# React Application - Styling and UI Overview

The project leverages custom CSS to create an intuitive and visually appealing user interface. The app.css file plays a crucial role in defining the look and feel of the application. 

## The available content

- [Global Styles](#global-styles)
- [Root Container Styles](#root-container-styles)
- [Canvas Container](#canvas-container)
- [UI Panel](#ui-panel)
- [File Input and Button Styles](#file-input-and-button-styles)
- [Sliding Panels](#sliding-panels)
- [Light Settings Panel](#light-settings-panel)
- [Help Panel](#help-panel)
- [Help Button](#help-button)

The app.css file defines a comprehensive and cohesive set of styles that create a visually appealing and functional user interface. The design focuses on user interactivity, with elements like buttons and panels that respond dynamically to user actions. The consistent use of color, shadows, and transitions contributes to a polished and professional look.

PS: The css is set to the zoom level of 67%, could be changed accordingly.


### TECHNOLOGY STACK

1. Vite:
   - A fast build tool and development server, primarily for modern JavaScript frameworks like React.
   - Handles the bundling and hot-reloading of your project.

2. React:
   - A popular JavaScript library for building user interfaces, particularly single-page applications (SPAs).
   - The `@vitejs/plugin-react` plugin is used to integrate React with Vite.

3. CSS:
   - Standard CSS is being used for styling the application, including layout adjustments and UI design.

4. Three.js:
   - A JavaScript library used for creating and displaying 3D graphics in the browser.
   - Integrated with React, using `react-three-fiber`, `react-three-drei` and other libraries.

5. Firebase (in App.jsx):
   - A backend-as-a-service (BaaS) platform by Google.
   - Used for storing and retrieving data, such as the settings and models in your application.

### Additional Tools/Technologies:
- JavaScript (ES6+): The core language used for developing the application.
- HTML5: The structure and markup language for the web pages.
  
The stack is focused on modern web development, particularly with React for the frontend and Three.js for 3D rendering, all bundled and served efficiently using Vite.


### HOW TO START

# Create a project folder 

Open a command/terminal prompt and create a new folder on your system somewhere.

```mkdir react-three-fiber-boilerplate ```

# CD into the new folder

```cd react-three-fiber-boilerplate```

# Clone the repository for full application
```git clone https://github.com/anushreesulibhavi/tech-it-out```


# Setup development environment 
# VSCode 

To begin, we should ensure that we've set up an IDE (Integrated Development Environment) to develop with.
If you don't have VSCode already installed, then you can install it from - [VScode](https://code.visualstudio.com.) 

# NodeJS
We also need Node.js, which includes NPM, since we will be using the npm and npx commands.
To check if Node.js is already installed, open a cmd/terminal/shell prompt and type,

```node -v```
You should get a response indicating a version number
For example 

```v18.14.0```
Your version should be equal to or higher than v18.0.0.

We can also check the version of NPM,
```npm -v```
You want to see no error, but instead a version number equal to, or higher than v8.0.0.

# Run the app
Once you have setup the devlopemnt environment, Open the project on VSCode. Make sure you are under the project folder if not ```cd tech-it-out```, 
Now open a new terminal within VScode and install all dependencies using

```npm install```

To run the application with local devlopement server
```npm run dev```

<img width="1429" alt="Screenshot 2024-05-16 at 12 08 53 PM" src="https://github.com/fabrik-space/spatial-app-boilerplate/assets/67771257/1a977f72-8ceb-4c37-aa75-c7e2574aee16">

You should be able to see a red color cube on canvas, you can interact and get started with it

Within you're terminal you should see 
```tech-it-out git:(main)```

Which means you're under the main branch of the project,
Checkout from the current main branch to a new branch where you can start making changes 
```git checkout -b "your-branch-name"```

Based on the module you start, Replace "your-branch-name" with a preffered branch name and associated task for example :
```git checkout -b "module-1/upload-model"```

Once done with changes you can raise a pull request against the main branch and request review




