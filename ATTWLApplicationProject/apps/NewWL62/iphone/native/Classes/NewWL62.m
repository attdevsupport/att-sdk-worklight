//
//  MyAppDelegate.m
//  NewWL62
//
//

#import "NewWL62.h"
#import "WLWebFrameworkInitResult.h"
#import "Cordova/CDVViewController.h"

@interface Compatibility50ViewController : UIViewController
@end

@implementation Compatibility50ViewController
/**
 In iOS 5 and earlier, the UIViewController class displays views in portrait mode only. To support additional orientations, you must override the shouldAutorotateToInterfaceOrientation: method and return YES for any orientations your subclass supports.
 */
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
    return YES;
}
@end

@implementation MyAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions 
{
	BOOL result = [super application:application didFinishLaunchingWithOptions:launchOptions];
    
    // A root view controller must be created in application:didFinishLaunchingWithOptions:  
	self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    UIViewController* rootViewController = [[Compatibility50ViewController alloc] init];     
    
    [self.window setRootViewController:rootViewController];
    [self.window makeKeyAndVisible];
   
    [[WL sharedInstance] showSplashScreen];
    // By default splash screen will be automatically hidden once Worklight JavaScript framework is complete. 
	// To override this behaviour set autoHideSplash property in initOptions.js to false and use WL.App.hideSplashScreen() API.

    [[WL sharedInstance] initializeWebFrameworkWithDelegate:self];

    return result;
}

// This method is called after the WL web framework initialization is complete and web resources are ready to be used.
-(void)wlInitWebFrameworkDidCompleteWithResult:(WLWebFrameworkInitResult *)result
{
    if ([result statusCode] == WLWebFrameworkInitResultSuccess) {
        [self wlInitDidCompleteSuccessfully];
    } else {
        [self wlInitDidFailWithResult:result];
    }
}

-(void)wlInitDidCompleteSuccessfully
{
    UIViewController* rootViewController = self.window.rootViewController;

    // Create a Cordova View Controller
    CDVViewController* cordovaViewController = [[CDVViewController alloc] init] ;

    cordovaViewController.startPage = [[WL sharedInstance] mainHtmlFilePath];
     
    // Adjust the Cordova view controller view frame to match its parent view bounds
    cordovaViewController.view.frame = rootViewController.view.bounds;

	// Display the Cordova view
    [rootViewController addChildViewController:cordovaViewController];    
    [rootViewController.view addSubview:cordovaViewController.view];
}

-(void)wlInitDidFailWithResult:(WLWebFrameworkInitResult *)result
{
    UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"ERROR"
                                                  message:[result message]
                                                  delegate:self
                                                  cancelButtonTitle:@"OK"
                                                  otherButtonTitles:nil];
    [alertView show];
}


- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
