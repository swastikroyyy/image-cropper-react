import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import { CropperProps, Crop } from "./types";

const Cropper = React.forwardRef(
  (
    {
      src,
      crop,
      onCropChange,
      onCropComplete,
      format = "file",
      cropBoxType = "square",
    }: CropperProps,
    ref
  ) => {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const cropRef = useRef<Crop>(crop);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<string | null>(null);
    const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);

    const forceUpdate = React.useReducer(() => ({}), {})[1];

    useEffect(() => {
      cropRef.current = crop;
    }, [crop]);

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const handleImageLoad = () => {
      if (imageRef.current) {
        const { width, height } = imageRef.current;
        let cropWidth = Math.min(400, width);
        let cropHeight = Math.min(400, height);
        if (cropBoxType === "circle") {
          const size = Math.min(cropWidth, cropHeight);
          cropWidth = size;
          cropHeight = size;
        }
        const x = (width - cropWidth) / 2;
        const y = (height - cropHeight) / 2;
        const newCrop = { x, y, width: cropWidth, height: cropHeight };
        cropRef.current = newCrop;
        onCropChange(newCrop);
        forceUpdate();
      }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      e.stopPropagation();
    };

    const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
      setIsResizing(true);
      setResizeDirection(direction);
      dragStart.current = { x: e.clientX, y: e.clientY };
      e.stopPropagation();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;

      const { width: imgWidth, height: imgHeight } = imageRef.current;
      const diffX = e.clientX - dragStart.current.x;
      const diffY = e.clientY - dragStart.current.y;

      let { x, y, width, height } = cropRef.current;
      const minSize = 20;

      if (isDragging) {
        x = clamp(x + diffX, 0, imgWidth - width);
        y = clamp(y + diffY, 0, imgHeight - height);
      }

      if (isResizing && resizeDirection) {
        if (resizeDirection === "bottom-right") {
          width += diffX;
          height += diffY;
        } else if (resizeDirection === "bottom-left") {
          x += diffX;
          width -= diffX;
          height += diffY;
        } else if (resizeDirection === "top-right") {
          y += diffY;
          width += diffX;
          height -= diffY;
        } else if (resizeDirection === "top-left") {
          x += diffX;
          y += diffY;
          width -= diffX;
          height -= diffY;
        }
        if (cropBoxType === "circle") {
          const size = Math.min(width, height);
          const maxWidth = imgWidth - x;
          const maxHeight = imgHeight - y;
          const maxSize = Math.min(maxWidth, maxHeight);

          const finalSize = clamp(size, minSize, maxSize);

          width = finalSize;
          height = finalSize;
        } else {
          width = clamp(width, minSize, imgWidth - x);
          height = clamp(height, minSize, imgHeight - y);
        }

        if (x < 0) {
          width += x;
          x = 0;
        }
        if (y < 0) {
          height += y;
          y = 0;
        }
        if (x + width > imgWidth) {
          width = imgWidth - x;
        }
        if (y + height > imgHeight) {
          height = imgHeight - y;
        }

        width = Math.max(width, minSize);
        height = Math.max(height, minSize);
      }

      cropRef.current = { x, y, width, height };
      onCropChange(cropRef.current);
      dragStart.current = { x: e.clientX, y: e.clientY };
      forceUpdate();
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    const triggerCropComplete = () => {
      if (!imageRef.current) return;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const { x, y, width, height } = cropRef.current;
      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(
          imageRef.current,
          x,
          y,
          width,
          height,
          0,
          0,
          width,
          height
        );

        if (format === "base64") {
          const base64 = canvas.toDataURL();
          onCropComplete?.(base64);
        } else if (format === "blob" || format === "file") {
          canvas.toBlob((blob) => {
            if (blob) {
              if (format === "file") {
                const file = new File([blob], "cropped-image.png", {
                  type: "image/png",
                });
                onCropComplete?.(file);
              } else {
                onCropComplete?.(blob);
              }
            }
          }, "image/png");
        }
      }
    };

    useEffect(() => {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, isResizing, resizeDirection]);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!imageRef.current) return;
      const { width: imgWidth, height: imgHeight } = imageRef.current;
      let { x, y, width, height } = cropRef.current;

      if (e.key === "ArrowUp") {
        y = clamp(y - 1, 0, imgHeight - height);
      } else if (e.key === "ArrowDown") {
        y = clamp(y + 1, 0, imgHeight - height);
      } else if (e.key === "ArrowLeft") {
        x = clamp(x - 1, 0, imgWidth - width);
      } else if (e.key === "ArrowRight") {
        x = clamp(x + 1, 0, imgWidth - width);
      }

      if (isShiftPressed) {
        if (e.key === "ArrowUp") {
          height = clamp(height - 1, 20, imgHeight - y);
        } else if (e.key === "ArrowDown") {
          height = clamp(height + 1, 20, imgHeight - y);
        } else if (e.key === "ArrowLeft") {
          width = clamp(width - 1, 20, imgWidth - x);
        } else if (e.key === "ArrowRight") {
          width = clamp(width + 1, 20, imgWidth - x);
        }
      }

      if (e.key === "Enter") {
        triggerCropComplete();
      }

      cropRef.current = { x, y, width, height };
      onCropChange(cropRef.current);
      forceUpdate();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    useEffect(() => {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }, [isShiftPressed]);



    const handleWheel = (e: React.WheelEvent) => {
      if (!imageRef.current) return;

      e.preventDefault();
      const scaleAmount = 0.1;
      let newZoomLevel = zoomLevel;

      if (e.deltaY < 0) {
       
        newZoomLevel = Math.min(zoomLevel + scaleAmount, 3); 
      } else {
       
        newZoomLevel = Math.max(zoomLevel - scaleAmount, 1);
      }

      setZoomLevel(newZoomLevel);

      const { width: imgWidth, height: imgHeight } = imageRef.current;
      const cropWidth = cropRef.current.width;
      const cropHeight = cropRef.current.height;

      
      const cropCenterX = cropRef.current.x + cropWidth / 2;
      const cropCenterY = cropRef.current.y + cropHeight / 2;

    
      const scale = `scale(${newZoomLevel})`;
      imageRef.current.style.transformOrigin = `${cropCenterX}px ${cropCenterY}px`;
      imageRef.current.style.transform = scale;

      forceUpdate();
    };




    const { x, y, width, height } = cropRef.current;

    useImperativeHandle(ref, () => ({
      triggerCropComplete,
    }));

    return (
      <div
        style={{
          position: "relative",
          display: "inline-block",
          userSelect: "none",
        }}
        onWheel={handleWheel}
      >
        
        <div
          style={{
            overflow: "hidden",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
              transition: "transform 0.2s ease-in-out",
            }}
          >
            <img
              ref={imageRef}
              src={src}
              alt="To Crop"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
              onLoad={handleImageLoad}
            />
          </div>
        </div>
    
        
        <div
          style={{
            position: "absolute",
            top: y,
            left: x,
            width,
            height,
            border: "1px dashed #035FFE",
            borderRadius: cropBoxType === "circle" ? "50%" : "0",
            boxShadow: `0 0 0 4000px rgba(0, 0, 0, 0.3)`,
            cursor: isDragging ? "move" : "default",
            pointerEvents: "auto",
            zIndex: 10,
          }}
          onMouseDown={handleMouseDown}
        >
          {["top-left", "top-right", "bottom-left", "bottom-right"].map((dir) => (
            <div
              key={dir}
              style={{
                position: "absolute",
                width: 20,
                height: 20,
                backgroundColor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...(dir.includes("top") ? { top: -10 } : { bottom: -10 }),
                ...(dir.includes("left") ? { left: -10 } : { right: -10 }),
                cursor:
                  dir === "top-left"
                    ? "nwse-resize"
                    : dir === "top-right"
                    ? "nesw-resize"
                    : dir === "bottom-left"
                    ? "nesw-resize"
                    : "nwse-resize",
                zIndex: 15,
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, dir)}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderTop: "2px solid #035FFE",
                  borderLeft: "2px solid #035FFE",
                  transform:
                    dir === "top-right"
                      ? "rotate(90deg)"
                      : dir === "bottom-left"
                      ? "rotate(-90deg)"
                      : dir === "bottom-right"
                      ? "rotate(180deg)"
                      : "none",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
    
  }
);

export default Cropper;
