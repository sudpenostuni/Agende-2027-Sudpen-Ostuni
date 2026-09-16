import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User, Auth } from 'firebase/auth';
import { firebaseConfig, isFirebaseConfigured } from '../config/firebaseConfig';

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;

export const getAuthInstance = (): Auth | null => {
  if (authInstance) return authInstance;
  if (!isFirebaseConfigured) {
    console.warn('Firebase is not configured or apiKey is missing.');
    return null;
  }
  try {
    appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(appInstance);
    return authInstance;
  } catch (err) {
    console.error('Error initializing Firebase Auth:', err);
    return null;
  }
};

const provider = new GoogleAuthProvider();
// Add required Google Drive scopes
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  const auth = getAuthInstance();
  if (!auth) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }
  try {
    return onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        if (cachedAccessToken) {
          if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
        } else if (!isSigningIn) {
          cachedAccessToken = null;
          if (onAuthFailure) onAuthFailure();
        }
      } else {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    });
  } catch (err) {
    console.error('Error in onAuthStateChanged:', err);
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }
};

// Start Google sign-in
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  const auth = getAuthInstance();
  if (!auth) {
    throw new Error('Configurazione Firebase mancante o non valida. Verifica le credenziali.');
  }
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain access token from Google Auth');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Error during Google sign in:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Check if currently authenticated with cached token
export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

// Handle logout
export const googleLogout = async () => {
  const auth = getAuthInstance();
  if (auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error during signOut:', err);
    }
  }
  cachedAccessToken = null;
};

/**
 * Checks if the "Agende Sudpen 2027" folder exists, otherwise creates it, and returns the ID.
 */
export async function getOrCreateFolder(accessToken: string): Promise<string> {
  try {
    const q = encodeURIComponent("name = 'Agende Sudpen 2027' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id)`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!searchRes.ok) {
      throw new Error(`Google Drive API search error: ${searchRes.statusText}`);
    }
    
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }

    // Create the folder
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Agende Sudpen 2027',
        mimeType: 'application/vnd.google-apps.folder'
      })
    });

    if (!createRes.ok) {
      throw new Error(`Google Drive API create folder error: ${createRes.statusText}`);
    }

    const createData = await createRes.json();
    return createData.id;
  } catch (err) {
    console.error('Error in getOrCreateFolder:', err);
    throw err;
  }
}

/**
 * Uploads a PNG screenshot (data URL) to the specified Google Drive folder
 */
export async function uploadPngToDrive(
  accessToken: string,
  fileName: string,
  dataUrl: string,
  folderId?: string
): Promise<any> {
  const resBlob = await fetch(dataUrl);
  const blob = await resBlob.blob();

  const metadata = {
    name: fileName,
    mimeType: 'image/png',
    parents: folderId ? [folderId] : undefined
  };

  const boundary = '314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const reader = new FileReader();
  return new Promise<any>((resolve, reject) => {
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);

      const metadataString = JSON.stringify(metadata);
      const header = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${metadataString}${delimiter}Content-Type: image/png\r\n\r\n`;
      const footer = closeDelimiter;

      const headerBytes = new TextEncoder().encode(header);
      const footerBytes = new TextEncoder().encode(footer);

      const bodyBytes = new Uint8Array(headerBytes.length + bytes.length + footerBytes.length);
      bodyBytes.set(headerBytes, 0);
      bodyBytes.set(bytes, headerBytes.length);
      bodyBytes.set(footerBytes, headerBytes.length + bytes.length);

      try {
        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
          },
          body: bodyBytes
        });

        if (!response.ok) {
          const errMsg = await response.text();
          throw new Error(`Google Drive API upload failed: ${response.statusText} - ${errMsg}`);
        }

        const fileData = await response.json();
        resolve(fileData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}
