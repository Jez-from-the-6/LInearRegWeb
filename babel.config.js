module.exports = api => {
  const presets = ['@babel/preset-react', '@babel/preset-typescript', ['@babel/preset-env', { modules: 'commonjs' }]];

  const isTest = api.env('test');

  console.log(isTest);

  if (isTest) {
    const plugins = [
      [
        'transform-strict-mode',
        {
          strict: false,
        },
      ],
    ];
    return { presets, plugins };
  } else {
    return { presets };
  }
};
