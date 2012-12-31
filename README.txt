========================================================
AT&T Adapters for IBM Worklight
========================================================
The AT&T Adapters for IBM Worklight provide a simplified way for IBM Worklight
mobile developers to access the AT&T API platform services.  By significantly
reducing the complexity of building applications that use the AT&T platform 
services, the AT&T Adapters help developers quickly bring robust Worklight
mobile applications to market.

The AT&T Adapters provide interfaces that facilitate access to the following
AT&T platform APIs:

• SMS
• Speech
• OAuth
• Notary
• Payment
• Device Capabilities

===============Tested versions===============
IBM Worklight Studio: 5.0.5
Xcode 4.5
Android SDK rev. 21.0
iOS Simulator: iOS 5.1, iOS 6.0 for both iPhone and iPad
Android Emulator: 4.0.4, 4.1
Android Devices: 4.0 and 4.1


===============Known issues===============
1. On Android 4.0 in the KitchenSink sample application, the PIN verification
button may become only partially visible on the bottom of the screen but is
still clickable.  On iPhone, the PIN verification button may become inoperable.
Use the GO keyboard button as a work around in this case.

2. In KitchenSink application, audio capture from mic is tested on the following:
• Android 4.0.4 and 4.1.2 Emulators
• Android 4.0.4 Device
• iOS 5.1 and 6.0 Simulators
• iPhone 4 Device with iOS 6.0

This feature may not work on Android devices with older versions.

--END--
