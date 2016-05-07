App.info({
  name: 'Pickk',
  description: 'Predict sports events in real time',
  author: 'Pickk Corporation',
  email: 'kyle@pickk.co',
  website: 'http://pickk.co',
  version: '0.0.6'
});

App.icons({
  // iPhone Icons
  // 'iphone': 'resources/icons/ios/new_iphone.png',
  'iphone_2x': 'resources/icons/ios/Icon-602x.png',
  'iphone_3x': 'resources/icons/ios/Icon-603x.png',
  'ipad_pro': 'resources/icons/ios/Icon-iPadPro2x.png', 
  'ios_settings': 'resources/icons/ios/Icon-Small.png', 
  'ios_settings_2x': 'resources/icons/ios/Icon-Small2x.png', 
  'ios_settings_3x': 'resources/icons/ios/Icon-Small3x.png', 
  'ios_spotlight': 'resources/icons/ios/Icon-Spotlight-40.png', 
  'ios_spotlight_2x': 'resources/icons/ios/Icon-Spotlight-402x.png', 


  // iPad Icons
  'ipad': 'resources/icons/ios/new_ipad1x.png',
  'ipad_2x': 'resources/icons/ios/new_ipad2x.png',

  // Android Phones
  // 'android_ldpi': 'resources/icons/android/36.png',
  'android_mdpi': 'resources/icons/android/48.png',
  'android_hdpi': 'resources/icons/android/72.png',
  'android_xhdpi': 'resources/icons/android/96.png',
  // 'android_xxhdpi': (144x144)
  // 'android_xxxhdpi': (192x192)
});

App.launchScreens({
  // iPhone
  'iphone_2x': 'resources/splash/iphone_portrait_4_1x.png',
  'iphone5': 'resources/splash/iphone_portrait_5_1x.png',
  'iphone6': 'resources/splash/iphone_portrait_6_1x.png',
  'iphone6p_portrait': 'resources/splash/iphone_portrait_6p_1x.png',

  //iPad
  'ipad_portrait': 'resources/splash/ipad_portrait_7-8_1x.png',
  'ipad_portrait_2x': 'resources/splash/ipad_portrait_7-8_2x.png',
  'ipad_landscape': 'resources/splash/ipad_landscape_7-8_1x.png',
  'ipad_landscape_2x': 'resources/splash/ipad_landscape_7-8_2x.png',

  // Android
  // 'android_ldpi_portrait': 'resources/splash/ldpi-portrait.png',
  // 'android_ldpi_landscape': 'resources/splash/ldpi-landscape.png',
  'android_mdpi_portrait': 'resources/splash/mdpi-portrait.png',
  'android_mdpi_landscape': 'resources/splash/mdpi-landscape.png',
  'android_hdpi_portrait': 'resources/splash/hdpi-portrait.png',
  'android_hdpi_landscape': 'resources/splash/hdpi-landscape.png',
  'android_xhdpi_portrait': 'resources/splash/xhdpi-portrait.png',
  'android_xhdpi_landscape': 'resources/splash/xhdpi-landscape.png'
});

App.accessRule('*');
App.setPreference('StatusBarOverlaysWebView', 'true');
App.setPreference('StatusBarStyle', 'lightcontent');
App.accessRule('*://fonts.gstatic.com/*');
App.configurePlugin('phonegap-plugin-push', {
    SENDER_ID: '259263435947',
});