import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export const uploadImage = async (
  file: File,
  userId: string,
  folder: string = 'artifacts'
): Promise<string> => {
  // Always use local data URL storage - no Firebase Storage needed
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

export const deleteImage = async (imagePath: string): Promise<void> => {
  const imageRef = ref(storage, imagePath);
  await deleteObject(imageRef);
};


