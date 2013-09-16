/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

//
//  WLDeviceAuthManager.h
//  WorklightStaticLibProject
//

#import <Foundation/Foundation.h>
#import <CommonCrypto/CommonDigest.h>

//TODO: Review this, can we break the dependency on CDV completely?
#ifdef WL_IS_NATIVE_SDK
@interface CDVPlugin : NSObject {
}
@end
#else
#import <Cordova/CDVPlugin.h>
#endif


@interface WLDeviceAuthManager : NSObject

/**
 * Get the DeviceAuthManager singleton instance 
 */
+ (WLDeviceAuthManager *) sharedInstance;

/**
 * Generate KeyPair (private + public) and save it to Key Chain on the device.
 * Using RSA 512 long key size
 * This method should be used by custom provisioning implementation for CSR creation.  
 * It is recomended not to keep keypair in memory so this method should be called just before gneneration of CSR.  
 * return - NSMutableDictionary were element with key "private" is private key and element with key "public" is public key.
 */
-(NSMutableDictionary *) generateKeyPair:(NSString *)entity;

/**
 * This method signs on a given csr content according to JSW standard.
 * We'll using the public key
 * Sign the header and payload with SHA256 / RSA 512 
 * csrPayload- NSMutableDictionary with the content sign on.
 * return - the signed string.
 */
-(NSString *) signCsr:(NSDictionary *)payloadJSON withEntity:(NSString *)provisioningEntity;

/**
 * This method signs on a given content according to JSW standard.
 * We'll using the public key
 * Sign the header and payload with SHA256 / RSA 512 
 * payloadJSON- NSMutableDictionary with the content sign on.
 * return - the signed string.
 */
-(NSString *) signDeviceAuth:(NSDictionary *) payloadJSON entity:(NSString *) provisioningEntity isPEnabled:(BOOL) isProvisioningEnabled;

/**
 * Entry point for WLProvisioningDelegate to save the recieved certificate to the keystore.
 * When finished saving, it will start the device authentication process.
 * keyPair
 * certificate - NSData represent the certificate
 */
-(void) saveCertificate:(NSData *) certificateData withEntity:(NSString *)provisioningEntity;

/**
 * Called when failed to create a certificate, will show an error message to the client, and close the application
 * If the user implemented its own provider, then he MUST call this function when getting a failure to get a certificate.
 */
-(void)csrCertificateRecieveFailed;


//Call this initializer only
-(WLDeviceAuthManager *) init:(CDVPlugin *) plugin;
-(BOOL) isCertificateExist:(NSString *)provisioningEntity;
-(NSData *)getKeyChainKeyBits:(NSData *) keychainTag isCertificate:(BOOL) isCertificate;
-(NSString *) getWLUniqueDeviceId;
-(NSData *) signData:(NSString *)paylaod privateKey:(SecKeyRef)privateKey;
-(NSData *) getKeyIdentifier:(BOOL)isPublic withEntity:(NSString *)provisioningEntity;

@end

