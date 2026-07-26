
import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'jest-environment-jsdom',
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
		'\\.(css|less|scss)$': 'identity-obj-proxy',
	},
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: './tsconfig.app.json',
			},
		],
	},
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};

export default config;
