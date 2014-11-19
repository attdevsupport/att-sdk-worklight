//
//  AudioRecord.h
//
//  By Lyle Pratt, September 2011.
//  MIT licensed
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioServices.h>
#import <Cordova/CDV.h>
#import <Cordova/CDVSound.h>


@interface AudioRecord : CDVSound <AVAudioRecorderDelegate> {
}

- (void)startAudioRecord:(CDVInvokedUrlCommand*)command;
- (void) stopAudioRecord:(CDVInvokedUrlCommand*)command;
- (void) writeBase64ToBinary:(CDVInvokedUrlCommand*)command;

@end
