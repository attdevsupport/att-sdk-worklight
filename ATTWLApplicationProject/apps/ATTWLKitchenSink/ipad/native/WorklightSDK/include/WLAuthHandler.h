/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

//
//  WLAuthHandler.h
//  Worklight SDK
//
//  Created by Benjamin Weingarten on 6/16/10.
//  Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved.
//

#import <UIKit/UIKit.h>
#import "WLResponse.h"

// The WLAuthHandler protocol provides authentication-related services to WLCLient
@protocol WLAuthHandler <NSObject>

/*
 * This protocol method is called for every response arriving from the Worklight server.
 * The method must return YES if and only if the response is identified as a login form.
 * This method should be implemented in an efficient way, since it is invoked upon every incoming response.
 */
-(BOOL) isLoginFormResponse:(WLResponse *) response;

/*
 * Called when a login form is unexpectedly returned from the server (i.e., not after an explicit invocation of the 
 * login method, and the user session is invalid (and is hence no longer logged in). 
 * This method should be implemented in a way to take proper action when it is called, usually to display a login 
 * form and initiate the login sequence.
 */ 
-(void) handleLoginResponse:(WLResponse *) response;


@end
