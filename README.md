# React Native App Auth Example

![Demo](demo.gif)



PRE_STEPS:

```sh
Install NodeJS 
Install React Native First by follow here: https://reactnative.dev/docs/0.61/getting-started
Install Cocoapods by type: sudo gem install cocoapods
```
## Running the iOS app
After cloning the repository, run the following:
```sh
cd react-native-app-auth
yarn
(cd ios && pod install)
npx react-native run-ios
```

## Running the Android app

After cloning the repository, run the following:

```sh
cd react-native-app-auth
yarn
npx react-native run-android
```

Note that you have to have the emulator open before running the last command. If you have difficulty getting the emulator to connect, open the project from Android Studio and run it through there.


## Issue config
# 1. Register was be hold when creating a user
Fix: Go to Identity Providers -> Resident -> "Account Management Policies" Tab -> User self registration callback URL regex	
https://yourdomain:443/authenticationendpoint/login.do (SSL)

#2. To logout 
You should add to your config with this information:
```sh
additionalParameters: {prompt: 'login'},
```
