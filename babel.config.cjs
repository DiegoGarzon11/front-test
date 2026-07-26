module.exports = {
	presets: [
		['@babel/preset-env', { targets: { node: 'current' } }],
		['@babel/preset-react', { runtime: 'automatic' }],
	],
	overrides: [
		{
			test: /\.tsx$/,
			presets: [['@babel/preset-typescript', { isTSX: true, allExtensions: true }]],
		},
		{
			test: /\.ts$/,
			presets: [['@babel/preset-typescript', { onlyRemoveTypeImports: true }]],
		},
	],
	plugins: ['babel-plugin-transform-vite-meta-env'],
};
