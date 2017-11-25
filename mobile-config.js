App.info({
  id: 'com.id5oyejxkvm3yq1jfiwr5',
  name: 'Pickk',
  description: 'Predict sports events in real time',
  author: 'Pickk Corporation',
  email: 'hi@pickk.co',
  website: 'http://pickk.co',
  version: '1.0.24',
});

App.accessRule('*');
App.accessRule("blob:*");
App.accessRule('*', { type: 'navigation' });

App.icons({
  "app_store": "resources/icons/icon-1024.png", //1024x1024
  "iphone_2x": "resources/icons/icon-60-2x.png", // 120x120
  "iphone_3x": "resources/icons/icon-60-3x.png", // 180x180
  "ipad": "resources/icons/icon-76.png", // 76x76
  "ipad_2x": "resources/icons/icon-76-2x.png", // 152x152
  "ipad_pro": "resources/icons/icon-83.5-2x.png", // 167x167
  "ios_settings": "resources/icons/icon-29.png", // 29x29
  "ios_settings_2x": "resources/icons/icon-29-2x.png", // 58x58
  "ios_settings_3x": "resources/icons/icon-29-3x.png", // 87x87
  "ios_spotlight": "resources/icons/icon-40.png", // 40x40
  "ios_spotlight_2x": "resources/icons/icon-40-2x.png", // 80x80
  "ios_spotlight_3x": "resources/icons/icon-40-3x.png", // 120x120
  "ios_notification": "resources/icons/icon-20.png", //20x20
  "ios_notification_2x": "resources/icons/icon-20-2x.png", //40x40
  "ios_notification_3x": "resources/icons/icon-20-3x.png", //60x60
  "iphone_legacy": "resources/icons/icon-57.png", //57x57
  "iphone_legacy_2x": "resources/icons/icon-57-2x.png", //114x114
  "ipad_spotlight_legacy": "resources/icons/icon-50.png", //50x50
  "ipad_spotlight_legacy_2x": "resources/icons/icon-50-2x.png", //100x100
  "ipad_app_legacy": "resources/icons/icon-72.png", //72x72
  "ipad_app_legacy_2x": "resources/icons/icon-72-2x.png", //144x144
  "android_mdpi": "resources/icons/android_mdpi.png", // 48x48
  "android_hdpi": "resources/icons/android_hdpi.png", // 72x72
  "android_xhdpi": "resources/icons/android_xhdpi.png", // 96x96
  "android_xxhdpi": "resources/icons/android_xxhdpi.png", // 144x144
  "android_xxxhdpi": "resources/icons/android_xxxhdpi.png" // 192x192
});

App.launchScreens({
  "iphone_2x": "resources/splashes/iphone_2x.png", // 640x960
  "iphone5": "resources/splashes/iphone5.png", // 640x1136
  "iphone6": "resources/splashes/iphone6.png", // 750x1334
  "iphone6p_portrait": "resources/splashes/iphone6p_portrait.png", // 1242x2208
  "iphone6p_landscape": "resources/splashes/iphone6p_landscape.png", // 2208x1242
  "ipad_portrait": "resources/splashes/ipad_portrait.png", // 768x1024
  "ipad_portrait_2x": "resources/splashes/ipad_portrait_2x.png", // 1536x2048
  "ipad_landscape": "resources/splashes/ipad_landscape.png", // 1024x768
  "ipad_landscape_2x": "resources/splashes/ipad_landscape_2x.png", // 2048x1536
  "android_mdpi_portrait": "resources/splashes/android_mdpi_portrait.png", // 320x480
  "android_mdpi_landscape": "resources/splashes/android_mdpi_landscape.png", // 480x320
  "android_hdpi_portrait": "resources/splashes/android_hdpi_portrait.png", // 480x800
  "android_hdpi_landscape": "resources/splashes/android_hdpi_landscape.png", // 800x480
  "android_xhdpi_portrait": "resources/splashes/android_xhdpi_portrait.png", // 720x1280
  "android_xhdpi_landscape": "resources/splashes/android_xhdpi_landscape.png", // 1280x720
  "android_xxhdpi_portrait": "resources/splashes/android_xxhdpi_portrait.png", // 1080x1440
  "android_xxhdpi_landscape": "resources/splashes/android_xxhdpi_landscape.png", // 1440x1080
  "android_xxhdpi_portrait": "resources/splashes/android_xxhdpi_portrait.png", // 960x1600
  "android_xxhdpi_landscape": "resources/splashes/android_xxhdpi_landscape.png", // 1600x960
  "android_xxxhdpi_portrait": "resources/splashes/android_xxxhdpi_portrait.png", // 1280x1920
  "android_xxxhdpi_landscape": "resources/splashes/android_xxxhdpi_landscape.png" // 1920x1280
})

App.setPreference('DisallowOverscroll', 'true');
App.setPreference('Orientation', 'default');
App.setPreference('StatusBarOverlaysWebView', 'true');
App.setPreference('StatusBarStyle', 'lightcontent');
App.setPreference('WebAppStartupTimeout', '60000');

App.setPreference('android-targetSdkVersion', '26');
App.setPreference('android-minSdkVersion', '15');

App.appendToConfig(`
  <branch-config>
    <branch-key value="key_live_ppziaDSmTGvzyWPJ66QaqjocuvaXZc9M" />
    <uri-scheme value="pickk" />
    <link-domain value="getpickk.com" scheme="https" />
    <link-domain value="pickk.app.link" scheme="https" />
    <android-prefix value="/6ABs" />
    <ios-team-release value="Q768H4GZH4" />
  </branch-config>
  <platform name="ios">
    <config-file platform="ios" target="*-Info.plist" parent="NSLocationUsageDescription">
      <string>Verfiy users are in the locations that allow game play. Find near by players, leagues, and matchups.</string>
    </config-file>
    <config-file platform="ios" target="*-Info.plist" parent="NSLocationWhenInUseUsageDescription">
      <string>Prizes require location information</string>
    </config-file>
    <config-file platform="ios" target="*-Info.plist" parent="NSPhotoLibraryUsageDescription">
      <string>Upload photos to update profile photo.</string>
    </config-file>
    <config-file platform="ios" target="*-Info.plist" parent="NSCameraUsageDescription">
      <string>Take a photo to update profile photo.</string>
    </config-file>
  </platform>
`);

App.configurePlugin("branch-cordova-sdk", {
    URI_SCHEME : "pickk",
    BRANCH_KEY : "key_live_ppziaDSmTGvzyWPJ66QaqjocuvaXZc9M",
});

App.configurePlugin('cordova-plugin-facebook4', {
  APP_ID: '1399965486969249',
  APP_NAME: 'Pickk'
});