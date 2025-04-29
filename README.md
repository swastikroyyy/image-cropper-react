# image-cropper-react

A lightweight, customizable React component for cropping images with drag, resize, and keyboard support.  
Supports exporting cropped images as **Base64**, **Blob**, or **File** — with options for **square** or **circle** crop boxes.

---

## ✨ Features

- 📦 Lightweight and no external dependencies
- 🖱️ Drag to move crop box
- ↔️ Resize crop area from corners
- 🎯 Square or Circle crop modes
- ⌨️ Keyboard arrow key support (with Shift for resizing)
- 🖼️ Export cropped image as **Base64**, **Blob**, or **File**
- 🔥 Fully controllable via props and `ref`

---

## 📦 Installation

> **Note**: Not yet published to npm.  
Until then, manually copy the `Cropper.tsx` and `types.ts` into your project.

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
        format="file"
        cropBoxType="square"
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
- Hold **Shift** key while using arrow keys for resizing.
- Press **Enter** to trigger crop completion by keyboard.

---

## 📄 License

MIT License © 2025  
Developed with ❤️