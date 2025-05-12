import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// Check if a space exists and validate the password
export const validateSpaceAccess = async (spaceId, password) => {
  try {
    const spaceRef = doc(db, 'spaces', spaceId);
    const spaceDoc = await getDoc(spaceRef);
    
    if (!spaceDoc.exists()) {
      return { success: false, message: 'Space not found' };
    }
    
    const spaceData = spaceDoc.data();
    if (spaceData.password !== password) {
      return { success: false, message: 'Incorrect password' };
    }
    
    return { 
      success: true, 
      data: {
        id: spaceId,
        name: spaceData.name,
        createdAt: spaceData.createdAt
      }
    };
  } catch (error) {
    console.error('Error validating space access:', error);
    return { success: false, message: error.message };
  }
};

// Create a new space
export const createNewSpace = async (spaceName, password) => {
  try {
    // Generate a unique ID (could be UUID or a custom ID format)
    const spaceId = generateSpaceId();
    
    // Create the space document in Firestore
    await setDoc(doc(db, 'spaces', spaceId), {
      name: spaceName,
      password, // In a production app, this would be hashed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return { 
      success: true, 
      data: {
        id: spaceId,
        name: spaceName
      }
    };
  } catch (error) {
    console.error('Error creating new space:', error);
    return { success: false, message: error.message };
  }
};

// Generate a readable space ID
const generateSpaceId = () => {
  // This is a simple implementation - in production you might want something more sophisticated
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
};

// Store space access in localStorage for persistence
export const storeSpaceAccess = (spaceData) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('codeshare_space', JSON.stringify({
      id: spaceData.id,
      name: spaceData.name,
      lastAccessed: new Date().toISOString()
    }));
  }
};

// Get stored space access from localStorage
export const getStoredSpaceAccess = () => {
  if (typeof window !== 'undefined') {
    const storedSpace = localStorage.getItem('codeshare_space');
    if (storedSpace) {
      try {
        return JSON.parse(storedSpace);
      } catch (e) {
        console.error('Error parsing stored space access:', e);
        return null;
      }
    }
  }
  return null;
};

// Clear stored space access
export const clearStoredSpaceAccess = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('codeshare_space');
  }
};
