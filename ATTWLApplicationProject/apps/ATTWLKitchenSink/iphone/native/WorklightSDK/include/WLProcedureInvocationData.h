/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

//
//  WLProcedureInvocationData.h
//  Worklight SDK
//
//  Created by Benjamin Weingarten on 3/9/10.
//  Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved.
//

#import <Foundation/Foundation.h>

/*
 * This class holds all data necessary for invoking a procedure, including:
 * 1) The name of the adapter and procedure to invoke
 * 2) Parameters required by the procedure
 */
@interface WLProcedureInvocationData : NSObject {
	@private NSString *adapter;
	NSString *procedure;
	
	// Array of primitive types: (NSString, NSNumber) BOOL values should be created as 
	NSArray *parameters;
}

// Sets the procedure parameters
// The Array should contain Objects that can be parsed via JSON. NSString and NSNumber work best.
// For Boolean values, use [NSNumber numberWithBool:]
@property (nonatomic, retain) NSArray *parameters;


-(NSDictionary *)toDictionary;

// Initializes with the adapter name and the procedure name.
-(id)initWithAdapterName:(NSString *)adapter procedureName:(NSString *)procedure;


@end
