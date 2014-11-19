//
//  AudioRecord.m
//
//  By Lyle Pratt, September 2011.
//  MIT licensed
//

#import "AudioRecord.h"
#import <resolv.h> // Has Base64 routines

@implementation AudioRecord

//- (void) startAudioRecord:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
- (void) startAudioRecord:(CDVInvokedURLCommand*)command {
	NSString* callbackId = [command.arguments objectAtIndex:0];
#pragma unused(callbackId)
	
	NSString* mediaId = [command.arguments objectAtIndex:1];
    
    //Use Super's audio file.
	CDVAudioFile* audioFile = [super audioFileForResource:[command.arguments objectAtIndex:2] withId: mediaId];
    NSString* jsString = nil;
    
    NSString* FormatIDString = [options objectForKey:@"FormatID"];
    
    //Default is LinearPCM
    NSNumber* FormatID = [NSNumber numberWithInt:kAudioFormatLinearPCM];
    
    if([FormatIDString isEqual: @"kAudioFormatLinearPCM"]) {
        FormatID = [NSNumber numberWithInt:kAudioFormatLinearPCM];
    }
    else if([FormatIDString isEqual: @"kAudioFormatAppleLossless"]) {
        FormatID = [NSNumber numberWithInt:kAudioFormatAppleLossless];
    }
    else if([FormatIDString isEqual: @"kAudioFormatAppleIMA4"]) {
        FormatID = [NSNumber numberWithInt:kAudioFormatAppleIMA4];
    }
    else if([FormatIDString isEqual: @"kAudioFormatiLBC"]) {
        FormatID = [NSNumber numberWithInt:kAudioFormatiLBC];
    }
    else if([FormatIDString isEqual: @"kAudioFormatULaw"]) {
        FormatID = [NSNumber numberWithInt:kAudioFormatULaw];
    }
    else if([FormatIDString isEqual: @"kAudioFormatALaw"]) {
        FormatID = [NSNumber numberWithInt:kAudioFormatALaw];
    }
    
    NSNumber* SampleRate = [options objectForKey:@"SampleRate"];
    NSNumber* NumberOfChannels = [options objectForKey:@"NumberOfChannels"];
    NSNumber* LinearPCMBitDepth = [options objectForKey:@"LinearPCMBitDepth"];
    
	if (audioFile != nil) {
		
		NSError* error = nil;

		if (audioFile.recorder != nil) {
			[audioFile.recorder stop];
			audioFile.recorder = nil;
		}
        
        NSDictionary* recorderSettingsDict = [[NSDictionary alloc] initWithObjectsAndKeys:
                        FormatID,AVFormatIDKey,
                        SampleRate,AVSampleRateKey,
                        NumberOfChannels,AVNumberOfChannelsKey,
                        LinearPCMBitDepth,AVLinearPCMBitDepthKey,
                        [NSNumber numberWithInt:0],AVLinearPCMIsBigEndianKey,
                        [NSNumber numberWithInt:0],AVLinearPCMIsFloatKey,
                        nil];
        
        
		// create a new recorder for each start record
		audioFile.recorder = [[CDVAudioRecorder alloc] initWithURL:audioFile.resourceURL settings:recorderSettingsDict error:&error];
	
		if (error != nil) {
			NSLog(@"Failed to initialize AVAudioRecorder: %@\n", error);
			audioFile.recorder = nil;
			jsString = [NSString stringWithFormat: @"%@(\"%@\",%d,%d);", @"Cordova.Media.onStatus", mediaId, MEDIA_ERROR, MEDIA_ERR_ABORTED];
			
		} else {
			audioFile.recorder.delegate = self;
			audioFile.recorder.mediaId = mediaId;
			[audioFile.recorder record];
			NSLog(@"Started recording audio sample '%@'", audioFile.resourcePath);
            jsString = [NSString stringWithFormat: @"%@(\"%@\",%d,%d);", @"Cordova.Media.onStatus", mediaId, MEDIA_STATE, MEDIA_RUNNING];
		}
	} else {
      jsString = [NSString string: @"no audio file"];
   }
   
   //[super writeJavascript:jsString];
	[self.commandDelegate sendPluginResult:jsString callbackId:callbackId];
   return;
}

- (void) stopAudioRecord:(CDVInvokedURLCommand*)command {
	NSString* callbackId = [arguments objectAtIndex:0];
#pragma unused(callbackId)
	NSString* mediaId = [arguments objectAtIndex:1];

    //Use Super's soundCache
	CDVAudioFile* audioFile = [super audioFileForResource:[arguments objectAtIndex:2] withId:mediaId];
    NSString* jsString = nil;
	
	if (audioFile != nil && audioFile.recorder != nil) {
		NSLog(@"Stopped recording audio sample '%@'", audioFile.resourcePath);
		[audioFile.recorder stop];
        jsString = [NSString stringWithFormat: @"%@(\"%@\",%d,%d);", @"Cordova.Media.onStatus", mediaId, MEDIA_STATE, MEDIA_STOPPED];
      [audioFile.recorder release];
	} else {
        jsString = [NSString stringWithFormat: @"%@(\"%@\",%d,%d);", @"Cordova.Media.onStatus", mediaId, MEDIA_ERROR, MEDIA_NONE];
    }
    if (jsString) {
        [super writeJavascript:jsString]; 
    }
}

- (void)audioRecorderDidFinishRecording:(AVAudioRecorder*)recorder successfully:(BOOL)flag {

	CDVAudioRecorder* aRecorder = (CDVAudioRecorder*)recorder;
	NSString* mediaId = aRecorder.mediaId;
    
    //Use Super's soundCache
	CDVAudioFile* audioFile = [[super soundCache] objectForKey: [aRecorder.url path]]; //mediaId];
	NSString* jsString = nil;

	
	if (audioFile != nil) {
		NSLog(@"Finished recording audio sample '%@'", audioFile.resourcePath);
		if (flag){
			jsString = [NSString stringWithFormat: @"%@(\"%@\",%d,%d);", @"Cordova.Media.onStatus", mediaId, MEDIA_STATE, MEDIA_STOPPED];
		} else {
			jsString = [NSString stringWithFormat: @"%@(\"%@\",%d,%d);", @"Cordova.Media.onStatus", mediaId, MEDIA_ERROR, MEDIA_ERR_DECODE];
		}
		[super writeJavascript:jsString];
	}
}

- (void) writeBase64ToBinary:(CDVInvokedURLCommand*)command
{
    NSLog(@"Enter writeBase64ToBinary");

   CDVPluginResult* pluginResult = nil;
   NSString * resultString;
	NSString* callbackId = [arguments objectAtIndex:0];

	NSString* srcId = [arguments objectAtIndex:1];
   #pragma unused(srcId)
   
    NSString * jsString = nil;
    NSString * base64String = [options objectForKey:@"base64Data"];
    NSString * filePath = [options objectForKey:@"fileName"];
   
    if(base64String==nil || filePath==nil)
    {
        jsString =  @"ATT_WL_Kitchensink_plugin.writeBase64ToBinary(missing required paramater);";
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:jsString];
        resultString = [pluginResult toSuccessCallbackString:callbackId];
        [super writeJavascript:resultString];

        return;
    }

    NSLog(@"audio file name: %@", filePath);
   
    NSData *decodedData = nil;
    
    NSData* base64Data = [base64String dataUsingEncoding:NSUTF8StringEncoding];
   
    // overkill on the length but no heuristic is accurate to infer the size
    uint8_t* decodedBuffer = malloc(base64Data.length);
    
    if(decodedBuffer == nil)
    {
       jsString = @"Out of memory to decode audio";
       pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:jsString];
       resultString = [pluginResult toSuccessCallbackString:callbackId];
        [super writeJavascript: resultString];
        return;
    }
    
    int decodedLength = b64_pton(base64Data.bytes, decodedBuffer, base64Data.length);
   
   if(decodedLength >= 0)
   {
      decodedData = [NSData dataWithBytesNoCopy:decodedBuffer
                                         length:decodedLength
                                   freeWhenDone:YES];
      NSError * writeError;
      
      NSURL * url = [NSURL fileURLWithPath:filePath];
   
      if(! [decodedData writeToURL:url options:0 error:&writeError])
      {
         NSLog(@"Write error: %@", [writeError localizedDescription]);
         jsString = [writeError localizedDescription];
      }
   }

   if(jsString==nil) {
      jsString = @"success";
      pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:jsString];
      resultString = [pluginResult toSuccessCallbackString:callbackId];
   } else {
      pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:jsString];
      resultString = [pluginResult toSuccessCallbackString:callbackId];
   }
   
   NSLog(@"writeBase64ToBinary returning: %@", resultString);
   
   [super writeJavascript:resultString];
}

@end
