import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../android-source/nativeProjectFiles';

export async function generateAndDownloadAndroidZip(): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('SmartRemoteConnectPro') || zip;

  // Add all project files
  for (const file of ANDROID_PROJECT_FILES) {
    rootFolder.file(file.path, file.content);
  }

  // Add a helpful README.md
  rootFolder.file('README.md', `# Smart Remote Connect Pro — Native Android Studio Project

Production-grade multi-device remote monitoring Android application built with:
- Kotlin 2.0 & Jetpack Compose (Material 3)
- Google WebRTC & CameraX real-time streaming
- Firebase Authentication, Cloud Firestore & Cloud Messaging (FCM)
- Android BatteryManager telemetry
- One-time PIN & QR Code secure pairing
- Clean Architecture (12 Gradle modules)

## How to Open in Android Studio
1. Unzip this directory.
2. Launch Android Studio Ladybug or newer.
3. Select "Open Existing Project" and choose the \`SmartRemoteConnectPro\` folder.
4. Allow Gradle sync to complete.
5. Place your \`google-services.json\` in the \`app/\` directory.
6. Connect an Android device with USB debugging or start an emulator and click Run.
`);

  // Generate blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'SmartRemoteConnectPro-Android-Studio-Project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
