pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
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
