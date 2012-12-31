/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

//
//  SecurityPlugin.h
//  WorklightStaticLibProject
//
//  Created by Oded Regev on 3/1/12.
//  Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

@interface SecurityPlugin : CDVPlugin {
    
    
}

- (void) encrypt:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options; 
- (void) decrypt:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options; 
- (void) keygen:(NSMutableArray *)arguments withDict:(NSMutableDictionary *)options;
- (void)hashData:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end


