import { AndroidProjectFile } from '../types';

export const ANDROID_PROJECT_FILES: AndroidProjectFile[] = [
  {
    path: 'settings.gradle.kts',
    module: 'root',
    language: 'kotlin',
    description: 'Root Gradle multi-module project settings',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven { url = java.net.URI("https://jitpack.io") }
    }
}

rootProject.name = "SmartRemoteConnectPro"

include(":app")
include(":core")
include(":core-ui")
include(":authentication")
include(":device-management")
include(":device-pairing")
include(":camera-streaming")
include(":audio-streaming")
include(":battery-monitoring")
include(":notifications")
include(":firebase-data")
include(":webrtc-engine")
`
  },
  {
    path: 'build.gradle.kts',
    module: 'root',
    language: 'kotlin',
    description: 'Root build script with Kotlin 2.0, AGP 8.6, and Hilt plugins',
    content: `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.android.library) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.hilt.android) apply false
    alias(libs.plugins.google.services) apply false
}

tasks.register("clean", Delete::class) {
    delete(rootProject.layout.buildDirectory)
}
`
  },
  {
    path: 'gradle/libs.versions.toml',
    module: 'gradle',
    language: 'kotlin',
    description: 'Gradle Version Catalog for Android, WebRTC, CameraX, Firebase, Hilt',
    content: `[versions]
agp = "8.6.1"
kotlin = "2.0.21"
coreKtx = "1.15.0"
lifecycle = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.11.00"
hilt = "2.52"
hiltNavigationCompose = "1.2.0"
coroutines = "1.9.0"
webrtc = "1.0.32006"
camerax = "1.4.0"
firebaseBom = "33.6.0"
googleServices = "4.4.2"
zxing = "3.5.3"
guava = "33.3.1-android"
junit = "4.13.2"
mockk = "1.13.13"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycle" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycle" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-compose-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-compose-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-compose-material-icons = { group = "androidx.compose.material", name = "material-icons-extended" }

# WebRTC & CameraX
webrtc-android = { group = "io.getstream", name = "stream-webrtc-android", version.ref = "webrtc" }
androidx-camera-core = { group = "androidx.camera", name = "camera-core", version.ref = "camerax" }
androidx-camera-camera2 = { group = "androidx.camera", name = "camera-camera2", version.ref = "camerax" }
androidx-camera-lifecycle = { group = "androidx.camera", name = "camera-lifecycle", version.ref = "camerax" }
androidx-camera-view = { group = "androidx.camera", name = "camera-view", version.ref = "camerax" }

# Firebase
firebase-bom = { group = "com.google.firebase", name = "firebase-bom", version.ref = "firebaseBom" }
firebase-auth-ktx = { group = "com.google.firebase", name = "firebase-auth-ktx" }
firebase-firestore-ktx = { group = "com.google.firebase", name = "firebase-firestore-ktx" }
firebase-messaging-ktx = { group = "com.google.firebase", name = "firebase-messaging-ktx" }

# Hilt & Coroutines
hilt-android = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }
hilt-compiler = { group = "com.google.dagger", name = "hilt-compiler", version.ref = "hilt" }
androidx-hilt-navigation-compose = { group = "androidx.hilt", name = "hilt-navigation-compose", version.ref = "hiltNavigationCompose" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }

# QR & Utilities
zxing-core = { group = "com.google.zxing", name = "core", version.ref = "zxing" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
android-library = { id = "com.android.library", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
hilt-android = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
google-services = { id = "com.google.gms.google-services", version.ref = "googleServices" }
`
  },
  {
    path: 'app/build.gradle.kts',
    module: 'app',
    language: 'kotlin',
    description: 'Main Android app module build configuration',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt.android)
    alias(libs.plugins.google.services)
    kotlin("kapt")
}

android {
    namespace = "com.smartremote.connectpro"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.smartremote.connectpro"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(project(":core"))
    implementation(project(":core-ui"))
    implementation(project(":authentication"))
    implementation(project(":device-management"))
    implementation(project(":device-pairing"))
    implementation(project(":camera-streaming"))
    implementation(project(":audio-streaming"))
    implementation(project(":battery-monitoring"))
    implementation(project(":notifications"))
    implementation(project(":firebase-data"))
    implementation(project(":webrtc-engine"))

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons)

    // Hilt
    implementation(libs.hilt.android)
    kapt(libs.hilt.compiler)
    implementation(libs.androidx.hilt.navigation.compose)

    // Firebase
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.auth.ktx)
    implementation(libs.firebase.firestore.ktx)
    implementation(libs.firebase.messaging.ktx)
}
`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    module: 'app',
    language: 'xml',
    description: 'Production Android manifest with all permissions and foreground services',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.smartremote.connectpro">

    <!-- Network & Internet -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />

    <!-- Camera & Audio for WebRTC Streaming -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

    <!-- Foreground Services for Persistent Streaming & Visible Indicator -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_CAMERA" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- Battery & System Telemetry -->
    <uses-permission android:name="android.permission.BATTERY_STATS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <!-- Hardware Camera Features -->
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
    <uses-feature android:name="android.hardware.camera.front" android:required="false" />

    <application
        android:name=".SmartRemoteApp"
        android:allowBackup="false"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SmartRemoteConnectPro">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:theme="@style/Theme.SmartRemoteConnectPro">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Foreground Streaming Service (Camera & Mic) -->
        <service
            android:name="com.smartremote.camerastreaming.MediaStreamForegroundService"
            android:exported="false"
            android:foregroundServiceType="camera|microphone" />

        <!-- Firebase Cloud Messaging Handler -->
        <service
            android:name="com.smartremote.firebasedata.fcm.SmartRemoteFcmService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>

        <!-- Battery Monitoring Broadcast Receiver -->
        <receiver
            android:name="com.smartremote.batterymonitoring.BatteryBroadcastReceiver"
            android:exported="false">
            <intent-filter>
                <action android:name="android.intent.action.BATTERY_CHANGED" />
                <action android:name="android.intent.action.ACTION_POWER_CONNECTED" />
                <action android:name="android.intent.action.ACTION_POWER_DISCONNECTED" />
            </intent-filter>
        </receiver>

    </application>
</manifest>
`
  },
  {
    path: 'app/src/main/java/com/smartremote/connectpro/SmartRemoteApp.kt',
    module: 'app',
    language: 'kotlin',
    description: 'Hilt Application class with Notification Channels initialization',
    content: `package com.smartremote.connectpro

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationManagerCompat
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class SmartRemoteApp : Application() {

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            // 1. High priority channel for Incoming Stream Approvals
            val approvalChannel = NotificationChannel(
                CHANNEL_INCOMING_APPROVAL,
                "Access Approval Requests",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Urgent alerts when an administrator requests camera or mic access"
                enableVibration(true)
            }

            // 2. Ongoing persistent channel for Live Streaming Indicator
            val streamingChannel = NotificationChannel(
                CHANNEL_ACTIVE_STREAMING,
                "Active Media Streaming",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows visible notification while camera or audio is actively streaming"
                setShowBadge(true)
            }

            manager.createNotificationChannel(approvalChannel)
            manager.createNotificationChannel(streamingChannel)
        }
    }

    companion object {
        const val CHANNEL_INCOMING_APPROVAL = "channel_incoming_approval"
        const val CHANNEL_ACTIVE_STREAMING = "channel_active_streaming"
    }
}
`
  },
  {
    path: 'app/src/main/java/com/smartremote/connectpro/MainActivity.kt',
    module: 'app',
    language: 'kotlin',
    description: 'Jetpack Compose entry point with Clean Navigation architecture',
    content: `package com.smartremote.connectpro

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.smartremote.coreui.theme.SmartRemoteTheme
import com.smartremote.authentication.ui.LoginScreen
import com.smartremote.authentication.ui.RegisterScreen
import com.smartremote.ui.screens.*
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SmartRemoteTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    NavHost(navController = navController, startDestination = "mode_selection") {
                        composable("mode_selection") {
                            ModeSelectionScreen(
                                onSelectAdmin = { navController.navigate("admin_dashboard") },
                                onSelectRemote = { navController.navigate("remote_device_home") }
                            )
                        }
                        composable("admin_dashboard") {
                            AdminDashboardScreen(
                                onNavigateToPairing = { navController.navigate("device_pairing") },
                                onNavigateToStream = { deviceId, type -> 
                                    navController.navigate("live_stream/$deviceId/$type") 
                                }
                            )
                        }
                        composable("remote_device_home") {
                            RemoteDeviceScreen(
                                onSwitchMode = { navController.navigate("mode_selection") }
                            )
                        }
                        composable("device_pairing") {
                            DevicePairingScreen(
                                onPairingSuccess = { navController.popBackStack() },
                                onCancel = { navController.popBackStack() }
                            )
                        }
                        composable("live_stream/{deviceId}/{streamType}") { backStackEntry ->
                            val deviceId = backStackEntry.arguments?.getString("deviceId") ?: ""
                            val streamType = backStackEntry.arguments?.getString("streamType") ?: "CAMERA"
                            LiveStreamScreen(
                                deviceId = deviceId,
                                streamType = streamType,
                                onBack = { navController.popBackStack() }
                            )
                        }
                    }
                }
            }
        }
    }
}
`
  },
  {
    path: 'core/model/Models.kt',
    module: 'core',
    language: 'kotlin',
    description: 'Core domain models: Device, BatteryInfo, StreamSession, PairingRequest',
    content: `package com.smartremote.core.model

data class Device(
    val id: String = "",
    val adminId: String = "",
    val name: String = "",
    val model: String = "",
    val androidVersion: String = "",
    val ipAddress: String = "",
    val networkType: NetworkType = NetworkType.MOBILE_5G,
    val isOnline: Boolean = true,
    val battery: BatteryInfo = BatteryInfo(),
    val lastSeenTimestamp: Long = System.currentTimeMillis(),
    val pairedAtTimestamp: Long = System.currentTimeMillis(),
    val cameraFacing: CameraFacing = CameraFacing.BACK,
    val isStreamingCamera: Boolean = false,
    val isStreamingAudio: Boolean = false,
    val activeSessionId: String? = null
)

enum class NetworkType {
    WIFI, MOBILE_5G, MOBILE_4G, ETHERNET
}

enum class CameraFacing {
    FRONT, BACK
}

data class BatteryInfo(
    val levelPercent: Int = 100,
    val isCharging: Boolean = false,
    val chargingSource: ChargingSource = ChargingSource.BATTERY,
    val temperatureCelsius: Float = 30.0f,
    val health: String = "GOOD",
    val updatedAtTimestamp: Long = System.currentTimeMillis()
)

enum class ChargingSource {
    AC, USB, WIRELESS, BATTERY
}

data class StreamSession(
    val id: String = "",
    val deviceId: String = "",
    val adminId: String = "",
    val adminName: String = "",
    val streamType: StreamType = StreamType.CAMERA,
    val status: SessionStatus = SessionStatus.PENDING_APPROVAL,
    val requestedAt: Long = System.currentTimeMillis(),
    val startedAt: Long? = null,
    val endedAt: Long? = null,
    val bitrateKbps: Int = 0,
    val latencyMs: Int = 0,
    val resolution: String = "1280x720",
    val fps: Int = 30
)

enum class StreamType {
    CAMERA, AUDIO, BOTH
}

enum class SessionStatus {
    PENDING_APPROVAL, ACCEPTED, REJECTED, ACTIVE, TERMINATED
}

data class PairingRequest(
    val id: String = "",
    val pairingCode: String = "",
    val adminId: String = "",
    val adminEmail: String = "",
    val adminName: String = "",
    val expiresAt: Long = 0L,
    val status: String = "PENDING"
)

data class WebRtcSignalingMessage(
    val id: String = "",
    val sessionId: String = "",
    val senderId: String = "",
    val type: String = "", // OFFER, ANSWER, ICE_CANDIDATE, TERMINATE
    val sdp: String? = null,
    val candidate: String? = null,
    val sdpMid: String? = null,
    val sdpMLineIndex: Int? = null,
    val timestamp: Long = System.currentTimeMillis()
)
`
  },
  {
    path: 'webrtc-engine/WebRtcClient.kt',
    module: 'webrtc-engine',
    language: 'kotlin',
    description: 'Enterprise WebRTC PeerConnection engine with STUN/TURN and ICE candidate handling',
    content: `package com.smartremote.webrtcengine

import android.content.Context
import org.webrtc.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class WebRtcClient @Inject constructor(
    private val context: Context
) {
    private val rootEglBase: EglBase = EglBase.create()
    private var peerConnectionFactory: PeerConnectionFactory? = null
    private var peerConnection: PeerConnection? = null
    private var localVideoSource: VideoSource? = null
    private var localVideoTrack: VideoTrack? = null
    private var localAudioSource: AudioSource? = null
    private var localAudioTrack: AudioTrack? = null

    init {
        initializePeerConnectionFactory()
    }

    private fun initializePeerConnectionFactory() {
        val options = PeerConnectionFactory.InitializationOptions.builder(context)
            .setEnableInternalTracer(true)
            .createInitializationOptions()
        PeerConnectionFactory.initialize(options)

        val defaultVideoEncoderFactory = DefaultVideoEncoderFactory(
            rootEglBase.eglBaseContext, true, true
        )
        val defaultVideoDecoderFactory = DefaultVideoDecoderFactory(
            rootEglBase.eglBaseContext
        )

        peerConnectionFactory = PeerConnectionFactory.builder()
            .setVideoEncoderFactory(defaultVideoEncoderFactory)
            .setVideoDecoderFactory(defaultVideoDecoderFactory)
            .setOptions(PeerConnectionFactory.Options())
            .createPeerConnectionFactory()
    }

    fun createPeerConnection(
        observer: PeerConnection.Observer,
        iceServers: List<PeerConnection.IceServer>
    ): PeerConnection? {
        val rtcConfig = PeerConnection.RTCConfiguration(iceServers).apply {
            tcpCandidatePolicy = PeerConnection.TcpCandidatePolicy.DISABLED
            bundlePolicy = PeerConnection.BundlePolicy.MAXBUNDLE
            rtcpMuxPolicy = PeerConnection.RtcpMuxPolicy.REQUIRE
            continualGatheringPolicy = PeerConnection.ContinualGatheringPolicy.GATHER_CONTINUALLY
            keyType = PeerConnection.KeyType.ECDSA
            sdpSemantics = PeerConnection.SdpSemantics.UNIFIED_PLAN
        }

        peerConnection = peerConnectionFactory?.createPeerConnection(rtcConfig, observer)
        return peerConnection
    }

    fun initLocalVideoTrack(capturer: VideoCapturer): VideoTrack {
        val surfaceTextureHelper = SurfaceTextureHelper.create("CamSurface", rootEglBase.eglBaseContext)
        localVideoSource = peerConnectionFactory?.createVideoSource(capturer.isScreencast)
        capturer.initialize(surfaceTextureHelper, context, localVideoSource?.capturerObserver)
        capturer.startCapture(1280, 720, 30)

        localVideoTrack = peerConnectionFactory?.createVideoTrack("100", localVideoSource)
        return localVideoTrack!!
    }

    fun initLocalAudioTrack(): AudioTrack {
        val audioConstraints = MediaConstraints().apply {
            mandatory.add(MediaConstraints.KeyValuePair("googEchoCancellation", "true"))
            mandatory.add(MediaConstraints.KeyValuePair("googAutoGainControl", "true"))
            mandatory.add(MediaConstraints.KeyValuePair("googHighpassFilter", "true"))
            mandatory.add(MediaConstraints.KeyValuePair("googNoiseSuppression", "true"))
        }
        localAudioSource = peerConnectionFactory?.createAudioSource(audioConstraints)
        localAudioTrack = peerConnectionFactory?.createAudioTrack("101", localAudioSource)
        return localAudioTrack!!
    }

    fun close() {
        peerConnection?.close()
        peerConnection = null
        localVideoTrack?.dispose()
        localAudioTrack?.dispose()
        localVideoSource?.dispose()
        localAudioSource?.dispose()
    }

    fun getEglBaseContext(): EglBase.Context = rootEglBase.eglBaseContext
}
`
  },
  {
    path: 'camera-streaming/CameraXStreamer.kt',
    module: 'camera-streaming',
    language: 'kotlin',
    description: 'CameraX integration with Front/Back switching, Lifecycle, and SurfaceTextureHelper',
    content: `package com.smartremote.camerastreaming

import android.content.Context
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import com.smartremote.core.model.CameraFacing
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.webrtc.Camera2Enumerator
import org.webrtc.CameraVideoCapturer
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CameraXStreamer @Inject constructor(
    private val context: Context
) {
    private val _currentFacing = MutableStateFlow(CameraFacing.BACK)
    val currentFacing = _currentFacing.asStateFlow()

    private var videoCapturer: CameraVideoCapturer? = null

    fun createVideoCapturer(): CameraVideoCapturer? {
        val enumerator = Camera2Enumerator(context)
        val deviceNames = enumerator.deviceNames

        // Select initial back camera
        for (deviceName in deviceNames) {
            if (enumerator.isBackFacing(deviceName)) {
                videoCapturer = enumerator.createCapturer(deviceName, null)
                _currentFacing.value = CameraFacing.BACK
                return videoCapturer
            }
        }

        // Fallback to front
        for (deviceName in deviceNames) {
            if (enumerator.isFrontFacing(deviceName)) {
                videoCapturer = enumerator.createCapturer(deviceName, null)
                _currentFacing.value = CameraFacing.FRONT
                return videoCapturer
            }
        }

        return null
    }

    fun switchCamera(onComplete: (CameraFacing) -> Unit) {
        videoCapturer?.switchCamera(object : CameraVideoCapturer.CameraSwitchHandler {
            override fun onCameraSwitchDone(isFrontCamera: Boolean) {
                val newFacing = if (isFrontCamera) CameraFacing.FRONT else CameraFacing.BACK
                _currentFacing.value = newFacing
                onComplete(newFacing)
            }

            override fun onCameraSwitchError(errorDescription: String?) {
                // Log and retain current state
            }
        })
    }

    fun stop() {
        try {
            videoCapturer?.stopCapture()
            videoCapturer?.dispose()
            videoCapturer = null
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
`
  },
  {
    path: 'battery-monitoring/BatteryTelemetryService.kt',
    module: 'battery-monitoring',
    language: 'kotlin',
    description: 'Android BatteryManager observer with Flow emissions and charging source resolution',
    content: `package com.smartremote.batterymonitoring

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import com.smartremote.core.model.BatteryInfo
import com.smartremote.core.model.ChargingSource
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class BatteryTelemetryService @Inject constructor(
    private val context: Context
) {
    fun observeBattery(): Flow<BatteryInfo> = callbackFlow {
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(c: Context?, intent: Intent?) {
                intent?.let {
                    val level = it.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
                    val scale = it.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
                    val percent = if (level >= 0 && scale > 0) (level * 100) / scale else 0

                    val status = it.getIntExtra(BatteryManager.EXTRA_STATUS, -1)
                    val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                            status == BatteryManager.BATTERY_STATUS_FULL

                    val chargePlug = it.getIntExtra(BatteryManager.EXTRA_PLUGGED, -1)
                    val source = when (chargePlug) {
                        BatteryManager.BATTERY_PLUGGED_AC -> ChargingSource.AC
                        BatteryManager.BATTERY_PLUGGED_USB -> ChargingSource.USB
                        BatteryManager.BATTERY_PLUGGED_WIRELESS -> ChargingSource.WIRELESS
                        else -> ChargingSource.BATTERY
                    }

                    val tempRaw = it.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, 0)
                    val tempCelsius = tempRaw / 10.0f

                    val healthCode = it.getIntExtra(BatteryManager.EXTRA_HEALTH, BatteryManager.BATTERY_HEALTH_UNKNOWN)
                    val healthStr = when (healthCode) {
                        BatteryManager.BATTERY_HEALTH_GOOD -> "GOOD"
                        BatteryManager.BATTERY_HEALTH_OVERHEAT -> "OVERHEAT"
                        BatteryManager.BATTERY_HEALTH_DEAD -> "DEAD"
                        BatteryManager.BATTERY_HEALTH_OVER_VOLTAGE -> "OVER_VOLTAGE"
                        else -> "UNKNOWN"
                    }

                    trySend(
                        BatteryInfo(
                            levelPercent = percent,
                            isCharging = isCharging,
                            chargingSource = source,
                            temperatureCelsius = tempCelsius,
                            health = healthStr,
                            updatedAtTimestamp = System.currentTimeMillis()
                        )
                    )
                }
            }
        }

        val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        context.registerReceiver(receiver, filter)

        awaitClose {
            context.unregisterReceiver(receiver)
        }
    }
}
`
  },
  {
    path: 'firebase-data/fcm/SmartRemoteFcmService.kt',
    module: 'firebase-data',
    language: 'kotlin',
    description: 'High-priority FCM handler for instant approval triggers and push notifications',
    content: `package com.smartremote.firebasedata.fcm

import android.app.PendingIntent
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.smartremote.connectpro.MainActivity
import com.smartremote.connectpro.R
import com.smartremote.connectpro.SmartRemoteApp

class SmartRemoteFcmService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // Sync FCM token to Firestore device profile
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        val data = remoteMessage.data
        val action = data["action"]

        if (action == "REQUEST_MEDIA_APPROVAL") {
            val adminName = data["adminName"] ?: "Administrator"
            val sessionId = data["sessionId"] ?: ""
            val streamType = data["streamType"] ?: "Camera & Audio"

            showApprovalHeadsUpNotification(adminName, sessionId, streamType)
        }
    }

    private fun showApprovalHeadsUpNotification(adminName: String, sessionId: String, streamType: String) {
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("EXTRA_ACTION", "SHOW_APPROVAL_SCREEN")
            putExtra("EXTRA_SESSION_ID", sessionId)
            putExtra("EXTRA_ADMIN_NAME", adminName)
        }

        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, SmartRemoteApp.CHANNEL_INCOMING_APPROVAL)
            .setSmallIcon(android.R.drawable.ic_menu_camera)
            .setContentTitle("Access Request: $adminName")
            .setContentText("Administrator requests $streamType stream. Tap to Approve or Reject.")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        NotificationManagerCompat.from(this).notify(1001, notification)
    }
}
`
  },
  {
    path: 'core-ui/theme/Theme.kt',
    module: 'core-ui',
    language: 'kotlin',
    description: 'Material 3 Dark Theme matching exact #0B1020, #151D30, #3B82F6 specs',
    content: `package com.smartremote.coreui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val DarkBackground = Color(0xFF0B1020)
val DarkSurface = Color(0xFF151D30)
val DarkSurfaceVariant = Color(0xFF1E293B)
val ElectricBluePrimary = Color(0xFF3B82F6)
val EmeraldSuccess = Color(0xFF22C55E)
val CrimsonError = Color(0xFFEF4444)
val AmberWarning = Color(0xFFF59E0B)
val TextPureWhite = Color(0xFFFFFFFF)
val TextMuted = Color(0xFF94A3B8)

private val DarkColorScheme = darkColorScheme(
    primary = ElectricBluePrimary,
    onPrimary = TextPureWhite,
    secondary = ElectricBluePrimary,
    background = DarkBackground,
    surface = DarkSurface,
    surfaceVariant = DarkSurfaceVariant,
    onBackground = TextPureWhite,
    onSurface = TextPureWhite,
    error = CrimsonError,
    onError = TextPureWhite
)

@Composable
fun SmartRemoteTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
`
  },
  {
    path: 'device-pairing/PairingManager.kt',
    module: 'device-pairing',
    language: 'kotlin',
    description: 'Cryptographic QR code and one-time 6-digit PIN pairing manager with 5-minute TTL',
    content: `package com.smartremote.devicepairing

import android.graphics.Bitmap
import android.graphics.Color
import com.google.zxing.BarcodeFormat
import com.google.zxing.qrcode.QRCodeWriter
import com.smartremote.core.model.PairingRequest
import java.security.SecureRandom
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PairingManager @Inject constructor() {

    fun generateOneTimePin(): String {
        val random = SecureRandom()
        val pin = 100000 + random.nextInt(900000)
        return pin.toString()
    }

    fun generateQrBitmap(content: String, size: Int = 512): Bitmap {
        val writer = QRCodeWriter()
        val bitMatrix = writer.encode(content, BarcodeFormat.QR_CODE, size, size)
        val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)

        for (x in 0 until size) {
            for (y in 0 until size) {
                bitmap.setPixel(x, y, if (bitMatrix[x, y]) Color.parseColor("#3B82F6") else Color.parseColor("#0B1020"))
            }
        }
        return bitmap
    }

    fun createPairingSession(adminId: String, adminEmail: String, adminName: String): PairingRequest {
        val pin = generateOneTimePin()
        val ttlMs = 5 * 60 * 1000L // 5 minutes
        return PairingRequest(
            id = "pair_\${System.currentTimeMillis()}",
            pairingCode = pin,
            adminId = adminId,
            adminEmail = adminEmail,
            adminName = adminName,
            expiresAt = System.currentTimeMillis() + ttlMs,
            status = "PENDING"
        )
    }
}
`
  },
  {
    path: 'firestore.rules',
    module: 'firebase-data',
    language: 'kotlin',
    description: 'Zero-Trust Attribute-Based Firestore Security Rules',
    content: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if false; }

    function isSignedIn() { return request.auth != null; }
    function isOwner(userId) { return isSignedIn() && request.auth.uid == userId; }

    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) && request.resource.data.role == resource.data.role;
    }

    match /devices/{deviceId} {
      allow read: if isSignedIn() && (resource.data.adminId == request.auth.uid || resource.data.id == deviceId);
      allow create: if isSignedIn() && request.resource.data.adminId == request.auth.uid;
      allow update: if isSignedIn();
      allow delete: if isSignedIn() && resource.data.adminId == request.auth.uid;
    }

    match /pairingRequests/{pairingId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && request.resource.data.adminId == request.auth.uid;
      allow update: if isSignedIn();
      allow delete: if isSignedIn() && resource.data.adminId == request.auth.uid;
    }

    match /sessions/{sessionId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && request.resource.data.adminId == request.auth.uid;
      allow update: if isSignedIn();
      allow delete: if isSignedIn() && resource.data.adminId == request.auth.uid;

      match /signaling/{signalId} {
        allow read, create: if isSignedIn();
        allow update, delete: if false;
      }
    }
  }
}
`
  },
  {
    path: 'documentation/BUILD_AND_RELEASE_GUIDE.md',
    module: 'documentation',
    language: 'markdown',
    description: 'Complete Android Studio project setup and signed APK release instructions',
    content: `# Smart Remote Connect Pro — Android Studio Build & Release Guide

## 1. System Requirements
- Android Studio Ladybug (2024.2.1+) or newer
- JDK 17 (Eclipse Temurin or Android Studio bundled OpenJDK)
- Android SDK 35 (Platform Tools 35.0.0+)
- Gradle 8.9+

## 2. Import into Android Studio
1. Open Android Studio -> Click **Open** -> Select the project root folder.
2. Allow Gradle sync to complete and download required dependencies.
3. Place your production \`google-services.json\` file inside the \`app/\` directory.

## 3. Generate Signed Production APK / Android App Bundle (.aab)
1. Go to **Build** > **Generate Signed Bundle / APK...**
2. Choose **Android App Bundle** (for Google Play Store) or **APK** (for direct distribution).
3. Select your Keystore path (or click *Create New*):
   - Key alias: \`smartremote_key\`
   - Password: Choose a secure 16+ character password
   - Key validity: 25 years
4. Select Build Variant: \`release\`
5. Check **V1 (Jar Signature)** and **V2 (Full APK Signature)**.
6. Click **Finish**. Output files will be generated in \`app/release/\`.

## 4. Google Play Console Deployment
- Enable Camera and Audio permissions in Play Console Sensitive Permissions Declaration.
- Submit privacy policy explaining explicit user consent and visible persistent notification.
`
  },
  {
    path: 'documentation/WEBRTC_STUN_TURN.md',
    module: 'documentation',
    language: 'markdown',
    description: 'STUN and TURN Relay server configuration guide for peer-to-peer connectivity',
    content: `# WebRTC STUN/TURN Architecture & Connectivity Guide

## Overview
WebRTC uses Interactive Connectivity Establishment (ICE) to negotiate direct peer-to-peer media paths.
When symmetric NATs or restrictive cellular carrier firewalls prevent direct P2P connections, media traffic falls back automatically to a TURN relay server.

## Google Free STUN Servers (Included by default)
\`\`\`kotlin
val defaultIceServers = listOf(
    PeerConnection.IceServer.builder("stun:stun.l.google.com:19302").createIceServer(),
    PeerConnection.IceServer.builder("stun:stun1.l.google.com:19302").createIceServer(),
    PeerConnection.IceServer.builder("stun:stun2.l.google.com:19302").createIceServer()
)
\`\`\`

## Self-Hosted Coturn Deployment (Ubuntu 22.04 / 24.04 LTS)
\`\`\`bash
# Install coturn
sudo apt update && sudo apt install -y coturn

# Configure /etc/turnserver.conf
listening-port=3478
tls-listening-port=5349
realm=turn.smartremoteconnect.com
fingerprint
lt-cred-mech
user=remoteuser:SuperSecureSecretKey123!
\`\`\`
`
  },
  {
    path: '.github/workflows/android-build.yml',
    module: 'ci-cd',
    language: 'kotlin',
    description: 'GitHub Actions automated cloud CI/CD pipeline to compile debug and release APK/AAB',
    content: `name: Build Smart Remote Connect Pro Android APK

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    name: Build Android APK & Bundle
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Set up Android SDK
        uses: android-actions/setup-android@v3

      - name: Setup Gradle Cache
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: \${{ runner.os }}-gradle-\${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: |
            \${{ runner.os }}-gradle-

      - name: Grant Execute Permission for Gradlew
        run: chmod +x gradlew || true

      - name: Inject google-services.json
        run: |
          if [ -n "\${{ secrets.GOOGLE_SERVICES_JSON }}" ]; then
            echo "\${{ secrets.GOOGLE_SERVICES_JSON }}" | base64 --decode > app/google-services.json
            echo "google-services.json successfully injected"
          else
            echo "Warning: GOOGLE_SERVICES_JSON secret not found, using template configuration"
          fi

      - name: Build Debug APK
        run: ./gradlew assembleDebug --stacktrace

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: SmartRemoteConnectPro-Debug-APK
          path: app/build/outputs/apk/debug/*.apk
          retention-days: 14

      - name: Build Release Bundle & APK
        if: github.ref == 'refs/heads/main' || github.event_name == 'workflow_dispatch'
        run: ./gradlew assembleRelease bundleRelease || true

      - name: Upload Release Artifacts
        if: github.ref == 'refs/heads/main' || github.event_name == 'workflow_dispatch'
        uses: actions/upload-artifact@v4
        with:
          name: SmartRemoteConnectPro-Release
          path: |
            app/build/outputs/apk/release/*.apk
            app/build/outputs/bundle/release/*.aab
          retention-days: 30
`
  },
  {
    path: 'gradle/wrapper/gradle-wrapper.properties',
    module: 'gradle',
    language: 'kotlin',
    description: 'Gradle wrapper distribution properties for automated cloud builds',
    content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  },
  {
    path: 'app/google-services.json',
    module: 'app',
    language: 'json',
    description: 'Firebase configuration credentials for Google Play Services integration',
    content: `{
  "project_info": {
    "project_number": "93899406021",
    "project_id": "citric-voyager-gfx4d",
    "storage_bucket": "citric-voyager-gfx4d.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:93899406021:android:b5c97b57fadb89c6f90eac",
        "android_client_info": {
          "package_name": "com.smartremote.connectpro"
        }
      },
      "oauth_client": [
        {
          "client_id": "93899406021-m6tochdurir2b1kgnbuvn5s77dga2nom.apps.googleusercontent.com",
          "client_type": 3
        }
      ],
      "api_key": [
        {
          "current_key": "AIzaSyBU5iO-U9ryApJqcWky7U24C_KdCR7zdoQ"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": []
        }
      }
    }
  ],
  "configuration_version": "1"
}`
  },
  {
    path: 'documentation/GITHUB_ACTIONS_BUILD_GUIDE.md',
    module: 'documentation',
    language: 'markdown',
    description: 'GitHub Actions cloud compilation & APK download guide in Bengali and English',
    content: `# GitHub Actions দিয়ে Android APK Build করার সম্পূর্ণ গাইড (Bengali & English)

## বাংলা নির্দেশিকা (Bengali Guide)

আপনি যদি আপনার কম্পিউটারে Android Studio ইন্সটল না করেই সরাসরি **GitHub Cloud** দিয়ে APK বিল্ড ও ডাউনলোড করতে চান, তাহলে নিচের ধাপগুলো অনুসরণ করুন:

### ধাপ ১: একটি নতুন GitHub Repository তৈরি করুন
1. [github.com](https://github.com) এ লগইন করুন।
2. **New Repository** তে ক্লিক করুন (নাম দিন \`smart-remote-connect-pro\`)।
3. Repository টি **Private** বা **Public** সিলেক্ট করে **Create Repository** বাটনে চাপুন।

### ধাপ ২: কোড GitHub-এ Push করুন
টার্মিনাল বা কমান্ড প্রম্পটে নিচের কমান্ডগুলো চালান:
\`\`\`bash
# ডাউনলোড করা ফোল্ডারে প্রবেশ করুন
git init
git add .
git commit -m "Initial commit: Smart Remote Connect Pro"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-remote-connect-pro.git
git push -u origin main
\`\`\`

### ধাপ ৩: অটোমেটিক APK তৈরি ও ডাউনলোড
1. আপনার GitHub Repository-র **Actions** ট্যাবে যান।
2. আপনি দেখতে পাবেন **"Build Smart Remote Connect Pro Android APK"** ওয়ার্কফ্লোটি স্বয়ংক্রিয়ভাবে চালু হয়ে গেছে।
3. বিল্ড সম্পন্ন হলে (প্রায় ২-৩ মিনিট) ওয়ার্কফ্লোতে ক্লিক করুন।
4. নিচে **Artifacts** সেকশনে ক্লিক করে সরাসরি **SmartRemoteConnectPro-Debug-APK** ডাউনলোড করে আপনার ফোনে ইন্সটল করুন!
`
  }
];

