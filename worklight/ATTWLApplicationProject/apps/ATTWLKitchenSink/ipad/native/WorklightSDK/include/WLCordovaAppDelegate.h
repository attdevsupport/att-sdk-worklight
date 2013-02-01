/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

//
//  WLCordovaAppDelegate.h
//  Worklight SDK
//
//  Created by Benny Weingarten on 8/16/10.
//  Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CDVAppDelegate.h"


@class Push;

@interface WLCordovaAppDelegate : CDVAppDelegate < UIApplicationDelegate, UIAlertViewDelegate > {
	Push *push;
	BOOL applicationPageLoaded;
	BOOL isIPAD;
    
}

extern NSString * const SKIN_LOADER_FILE_NAME;
extern NSString * const BUILD_TIME_FILE_NAME;
extern NSString * const APP_PATH_FILE_NAME;
extern NSString * const CHECKSUM_JS_FILE_NAME;
extern NSString * const CHECKSUM_KEY_NAME; // key for reading the checksum from checksum.js
extern NSString * const DEFAULT_SKIN_NAME;
extern NSString * const SAVED_CHECKSUM_KEY_NAME; // key for NSUserDefaults

@property (retain, nonatomic) Push *push;
@property (readonly) BOOL isIPAD;
@property (nonatomic, copy) NSString *appInitErrorString;


// Class public methods
+ (void) setAppChecksum:(NSString *)checksum;
+ (NSString *)readPrePackagedChecksum;
+ (long long) getFreeSpaceOnDevice;
+ (NSString*) wwwFolderName;
+ (NSString*) startPage;
+ (NSString*) pathForResource:(NSString*)resourcepath;

@end

