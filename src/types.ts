export type Crop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CropperProps = {
  src: string;
  crop: Crop;
  onCropChange: (crop: Crop) => void;
  onCropComplete?: (croppedImage: string | Blob | File) => void;

  format?: "base64" | "blob" | "file";
  cropBoxType?: "square" | "circle";
};
