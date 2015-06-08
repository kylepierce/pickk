App.info({
  name: 'Pickk',
  description: 'Predict sports events in real time',
  author: 'Pickk Corporation',
  email: 'kyle@pickk.co',
  website: 'http://pickk.co',
  version: '0.0.1'
});

App.icons({
  // iPhone Icons
  'iphone': 'resources/icons/ios/iphone.png',
  'iphone_2x': 'resources/icons/ios/iphone@2x.png',
  'iphone_3x': 'resources/icons/ios/iphone6@3x.png',

  // iPad Icons
  'ipad': 'resources/icons/ios/ipad@1x.png',
  'ipad_2x': 'resources/icons/ios/ipad@2x.png',

  // Android Phones
  'android_ldpi': 'resources/icons/android/36.png',
  'android_mdpi': 'resources/icons/android/48.png',
  'android_hdpi': 'resources/icons/android/72.png',
  'android_xhdpi': 'resources/icons/android/96.png',
  // 'android_xxhdpi': 'resources/icons/android/144.png',
  // 'android_xxxhdpi': 'resources/icons/android/192.png',

  // Android Tablets
});

App.launchScreens({
  // iPhone
  'iphone': 'resources/splash/Default-portrait~iphone.png',
  'iphone_2x': 'resources/splash/Default-portrait@2x~iphone4.png',
  'iphone5': 'resources/splash/Default-portrait@2x~iphone5.jpg',
  'iphone6': 'resources/splash/Default-portrait@2x~iphone6.png',
  'iphone6p_portrait': 'resources/splash/Default-portrait@3x~iphone6+.png',

  //iPad
  'ipad_portrait': 'resources/splash/Default-Portrait~ipad.png',
  'ipad_portrait_2x': 'resources/splash/Default-Portrait@2x~ipad.png',
  'ipad_landscape': 'resources/splash/Default-Landscape~ipad.png',
  'ipad_landscape_2x': 'resources/splash/Default-Landscape@2x~ipad.png',

  // Android
  'android_ldpi_portrait': 'resources/splash/splash-200x320.png',
  'android_ldpi_landscape': 'resources/splash/splash-320x200.png',
  'android_mdpi_portrait': 'resources/splash/splash-320x480.png',
  'android_mdpi_landscape': 'resources/splash/splash-480x320.png',
  'android_hdpi_portrait': 'resources/splash/splash-480x800.png',
  'android_hdpi_landscape': 'resources/splash/splash-800x480.png',
  'android_xhdpi_portrait': 'resources/splash/splash-720x1280.png',
  'android_xhdpi_landscape': 'resources/splash/splash-1280x720.png'
});

App.setPreference('StatusBarOverlaysWebView', 'true');
App.setPreference('StatusBarStyle', 'lightcontent');
App.accessRule('http://174.48.168.66:3000/*')