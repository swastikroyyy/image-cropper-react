# image-cropper-react - A Lightweight React Image Cropper Component for Avatar Uploads and Image Editing


**image-cropper-react** is a lightweight and customizable **React image cropper** component for cropping images using drag, zoom, resize, or keyboard input.  
Perfect for **avatar upload**, **image editors**, and cropping tools in **React** applications.

Supports exporting cropped images as **Base64**, **Blob**, or **File**, with options for **square** or **circle** crop areas.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Ref Methods](#ref-methods)
- [Crop Box Behavior](#crop-box-behavior)
- [Links](#links)
- [License](#license)

---

## Why Use `image-cropper-react`?

This package provides a **lightweight**, **customizable**, and **dependency-free image cropping solution** for React developers. It supports both **square** and **circle crop boxes**, offers **drag and resize** functionalities, and is fully controllable via **props** and **ref**. Whether you're creating an **avatar upload feature** or an **image editing tool**, `image-cropper-react` is perfect for your project.

---

##  Features

-  Lightweight and no external dependencies
-  Drag to move crop box
-  Resize crop area from corners
-  Zoom image using mouse wheel
-  Square or Circle crop modes
-  Keyboard arrow key support (with Shift for resizing)
-  Export cropped image as **Base64**, **Blob**, or **File**
-  Fully controllable via props and `ref`

---

## 📦 Installation

To install `image-cropper-react`, run the following command:

```bash

npm install image-cropper-react

# or
yarn add image-cropper-react
```

---

## 🚀 Usage

```tsx
import React, { useRef, useState } from "react";
import Cropper from "image-cropper-react"; 
import { Crop } from "./types";

const App = () => {
  const cropperRef = useRef<any>(null);
  const [crop, setCrop] = useState<Crop>({ x: 0, y: 0, width: 100, height: 100 });

  const handleCropChange = (newCrop: Crop) => {
    setCrop(newCrop);
  };

  const handleCropComplete = (cropped: string | Blob | File) => {
    console.log("Cropped output:", cropped);
  };

  const triggerCrop = () => {
    cropperRef.current?.triggerCropComplete();
  };

  return (
    <div>
      <Cropper
        ref={cropperRef}
        src="your-image-url.jpg"
        crop={crop}
        onCropChange={handleCropChange}
        onCropComplete={handleCropComplete}
        format="file" // "base64", "blob", or "file"
        cropBoxType="square" // or "circle"
      />

      <button onClick={triggerCrop}>Crop Image</button>
    </div>
  );
};

export default App;
```

### JavaScript (JSX)

```jsx
import React, { useRef, useState } from "react";
import Cropper from "image-cropper-react";

const App = () => {
  const cropperRef = useRef(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const handleCropComplete = (cropped) => {
    console.log("Cropped output:", cropped);
  };

  const triggerCrop = () => {
    cropperRef.current?.triggerCropComplete();
  };

  return (
    <div>
      <Cropper
        ref={cropperRef}
        src="your-image-url.jpg"
        crop={crop}
        onCropChange={handleCropChange}
        onCropComplete={handleCropComplete}
        format="file" // "base64", "blob", or "file"
        cropBoxType="square" // or "circle"
      />
      <button onClick={triggerCrop}>Crop Image</button>
    </div>
  );
};

export default App;
```

---

## 🧩 Props

| Prop             | Type                          | Default    | Description                                      |
| ---------------- | ----------------------------- | ---------- | ------------------------------------------------ |
| `src`            | `string`                      | required   | Image source URL                                 |
| `crop`           | `{ x: number; y: number; width: number; height: number }` | required | Crop box dimensions |
| `onCropChange`   | `(crop: Crop) => void`         | required   | Callback when crop is moved or resized           |
| `onCropComplete` | `(cropped: string \| Blob \| File) => void` | optional | Callback when cropping is completed             |
| `format`         | `"base64" \| "blob" \| "file"` | `"file"`   | Output format of cropped result                 |
| `cropBoxType`    | `"square" \| "circle"`         | `"square"` | Shape of the crop box                           |

---

## 🔥 Ref Methods

| Method                | Description                        |
| --------------------- | ---------------------------------- |
| `triggerCropComplete` | Manually trigger crop and export   |

Example:

```tsx
cropperRef.current?.triggerCropComplete();
```

---

## 🎨 Crop Box Behavior

- Drag inside the box to move it.
- Resize from any corner using mouse.
- Use the mouse wheel to zoom in and out of the image.
- Hold **Shift** key while using arrow keys for resizing.
- Press **Enter** to trigger crop completion by keyboard.

---

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/image-cropper-react)
- [GitHub Repository](https://github.com/swastikroyyy/image-cropper-react)

---

## 🔍 Keywords

React image cropper, crop image in React, image cropper for React, cropper React component, avatar cropper React, React crop component, crop image React npm, image-cropper-react, React image cropper component, image cropping React, image cropper React library, image cropper for React apps, image cropper React UI

---

## 📄 License

MIT License © 2025  
Developed with ❤️