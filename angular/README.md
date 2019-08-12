## hy-station-app

## 用法

- $ git clone https://wdgit.mapbar.com/suipeng.aerozhonghuan.com/hy-station-app.git
- cd hy-station-app
- npm install -g cordova ionic	(没安装的先全局安装cordova,ionic)
- npm install
- npm install ionic-angular@latest --save --save-exact
- ionic serve

打开你的浏览器访问http://localhost:8100/

关于ionic的更详细介绍请看这里：http://ionicframework.com/getting-started/

ionic支持的所有移动端UI组件和demo代码请参考这里：http://ionicframework.com/docs

## 真机调试

Android真机调试需要安装以下几种软件，并配置环境变量

 1. Java
 2. Android SDK  
 3. Gradle

 输入命令  
 	
    ionic cordova run android --device (查看)
    ionic cordova run android --device --prod --aot --minifyjs --minifycss --optimizejs (压缩版)
    ionic cordova run android --livereload (调试模式)
    ionic cordova run android -lcs (log调试模式)
	
 关于ionic的打包部署请看这里：https://ionicframework.com/docs/intro/deploying/

ps：第一次启动时Gradle会去下载相关软件，数量比较多。请耐心等待。

## web打包

 输入命令 npm run build --prod 将www下的内容放入tomcat中即可

ps.对应的cordova插件无法使用

## 开源许可证  

	MIT

## cordova插件集成

 - startapp（调用第三方app）
        $ https://github.com/lampaa/com.lampa.startapp

 - cordova-plugin-baidumaplocation（调用第三方app,定位）
        $ https://github.com/aruis/cordova-plugin-baidumaplocation

 - Call Number（电话功能）
        $ ionic cordova plugin add call-number 
        $ npm install --save @ionic-native/call-number

 - Native Storage（本地存储）
        $ ionic cordova plugin add cordova-plugin-nativestorage
        $ npm install --save @ionic-native/native-storage

 - Barcode Scanner（二维码扫描）
        $ ionic cordova plugin add phonegap-plugin-barcodescanner
        $ npm install --save @ionic-native/barcode-scanner

 - In App Browser（浏览器控件）
        $ ionic cordova plugin add cordova-plugin-inappbrowser
        $ npm install --save @ionic-native/in-app-browser

 - Network （网络监测）
        $ ionic cordova plugin add cordova-plugin-network-information
        $ npm install --save @ionic-native/network

 - File（文件操作）
        $ ionic cordova plugin add cordova-plugin-file
        $ npm install --save @ionic-native/file
        
 - File Transfer （文件传输问题）
        $ ionic cordova plugin add cordova-plugin-file-transfer
        $ npm install --save @ionic-native/file-transfer
        
 - Camera (相机)
        $ ionic cordova plugin add cordova-plugin-camera
        $ npm install --save @ionic-native/camera

 - App Availability （查找是否安装该app）
        $ ionic cordova plugin add cordova-plugin-appavailability
        $ npm install --save @ionic-native/app-availability

 - App Version (查看app版本)
       $ ionic cordova plugin add cordova-plugin-app-version
       $ npm install --save @ionic-native/app-version

 - File Opener (打开文件)
       $ ionic cordova plugin add cordova-plugin-file-opener2
       $ npm install --save @ionic-native/file-opener

 - Local-notification (消息提示)
       $ ionic cordova plugin add de.appplant.cordova.plugin.local-notification
       $ npm install --save @ionic-native/local-notifications

 - Android Permissions (手动开启安卓手机权限)
      $ ionic cordova plugin add cordova-plugin-android-permissions
      $ npm install --save @ionic-native/android-permissions

 - issue
   cordova-plugin-compat 版本问题
   cordova plugin remove --force


