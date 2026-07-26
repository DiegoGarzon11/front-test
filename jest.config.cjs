/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: 'jest-environment-jsdom',
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
		'\\.(css|less|scss)$': 'identity-obj-proxy',
	},
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
	transform: {
		'^.+\\.(t|j)sx?$': 'babel-jest',
	},
};
