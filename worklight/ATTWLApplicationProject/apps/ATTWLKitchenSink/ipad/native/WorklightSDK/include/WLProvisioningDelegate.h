/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

//
//  WLProvisioningDelegate.h
//  WorklightStaticLibProject
//
//  Created by admin on 4/29/12.
//

#import <Foundation/Foundation.h>
#import "WLDelegate.h"

@protocol WLProvisioningDelegate <NSObject>

/**
 * Send CSR request in order to get the certificate back provider (default is worklightserver)
 * CSRJSONData - includes basic data to deal with entity type (application, device, group) plus the data from invoking 
 */
- (void) sendCSR:(NSMutableDictionary *) csrJSONData;
@end
