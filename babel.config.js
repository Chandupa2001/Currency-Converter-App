module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-paper/babel'],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        "envName": "APP_ENV",
        "moduleName": "@env",
        "path": ".env",
      }
    ]
  ],
};
