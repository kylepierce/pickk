App.info({
  name: 'Pickk',
  description: 'Predict sports events in real time',
  author: 'Pickk Corporation',
  email: 'kyle@pickk.co',
  website: 'http://pickk.co',
  version: '0.0.5'
});

App.icons({
  // iPhone Icons
  'iphone': 'resources/icons/ios/iphone.png',
  'iphone_2x': 'resources/icons/ios/iphone2x.png',
  'iphone_3x': 'resources/icons/ios/iphone63x.png',

  // iPad Icons
  'ipad': 'resources/icons/ios/ipad1x.png',
  'ipad_2x': 'resources/icons/ios/ipad2x.png',

  // Android Phones
  'android_ldpi': 'resources/icons/android/36.png',
  'android_mdpi': 'resources/icons/android/48.png',
  'android_hdpi': 'resources/icons/android/72.png',
  'android_xhdpi': 'resources/icons/android/96.png',
});

App.launchScreens({
  // iPhone
  // 'iphone': 'resources/splash/iphone.png',
  'iphone_2x': 'resources/splash/iphone4.png',
  'iphone5': 'resources/splash/iphone5.png',
  'iphone6': 'resources/splash/iphone6.png',
  'iphone6p_portrait': 'resources/splash/iphone6plus.png',

  //iPad
  'ipad_portrait': 'resources/splash/Default-Portrait~ipad.png',
  'ipad_portrait_2x': 'resources/splash/Default-Portrait2x~ipad.png',
  'ipad_landscape': 'resources/splash/Default-Landscape~ipad.png',
  'ipad_landscape_2x': 'resources/splash/Default-Landscape2x~ipad.png',

  // Android
  'android_ldpi_portrait': 'resources/splash/ldpi-portrait.png',
  'android_ldpi_landscape': 'resources/splash/ldpi-landscape.png',
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