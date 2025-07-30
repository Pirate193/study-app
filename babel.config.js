module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // or react-native if not using expo
    plugins: ['nativewind/babel'],
  };
};
