========================================================
AT&T API Platform Adapters for IBM Worklight
========================================================
The AT&T API Platform Adapters for IBM Worklight provide a simplified way for IBM Worklight
mobile developers to access the AT&T API platform services.  By significantly
reducing the complexity of building applications that use the AT&T platform 
services, the AT&T Adapters help developers quickly bring robust Worklight
mobile applications to market.

The AT&T Adapters provide interfaces that facilitate access to the following
AT&T Platform APIs:

• Advertising
• Device Capabilities
• Notary
• OAuth
• Payment
• SMS
• Speech To Text
• Text To Speech

<div>
<table>
<tr>
<td><img width="257" height="457" src="images/Worklight_Banking_Speech_1.png"</img></td>
<td><img width="257" height="457" src="images/Worklight_Banking_Speech_2.png"</img></td>
<td><img width="257" height="457" src="images/Worklight_Banking_Speech_3.png"</img></td>
</tr>
</table>
</div>

===============Tested versions===============
IBM Worklight Studio & Enterprise Server: 5.0.6
Xcode 4.6
Android SDK rev. 21.0.1
iOS Simulator: iOS 5.1, iOS 6.1 for both iPhone and iPad
Android Emulator: 4.0.4, 4.1
Android Devices: 4.0 and 4.1


===============Known issues===============
1. On Android 4.0 in the KitchenSink sample application, the PIN verification
button may become only partially visible on the bottom of the screen but is
still clickable.  On iPhone, the PIN verification button may become inoperable.
Use the GO keyboard button as a work around in this case.

2. In KitchenSink sample application, audio capture from mic may not work on Android devices with versions before 4.0.
--END--
