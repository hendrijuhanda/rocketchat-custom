import type { Config } from 'jest';

export default {
	projects: [
		{
			displayName: 'client',
			testEnvironment: 'jsdom',
			testMatch: [
				'<rootDir>/client/**/**.spec.[jt]s?(x)',
				'<rootDir>/tests/unit/client/views/**/*.spec.{ts,tsx}',
				'<rootDir>/tests/unit/client/providers/**/*.spec.{ts,tsx}',
			],
			errorOnDeprecated: true,

			modulePathIgnorePatterns: ['<rootDir>/dist/'],

			transform: {
				'^.+\\.(t|j)sx?$': '@swc/jest',
			},
			transformIgnorePatterns: ['!/node_modules/uuid'],

			moduleNameMapper: {
				'\\.css$': 'identity-obj-proxy',
				'^react($|/.+)': '<rootDir>/node_modules/react$1',
				'^react-dom($|/.+)': '<rootDir>/node_modules/react-dom$1',
				'^react-i18next($|/.+)': '<rootDir>/node_modules/react-i18next$1',
				'^@tanstack/(.+)': '<rootDir>/node_modules/@tanstack/$1',
				'^meteor/(.*)': '<rootDir>/tests/mocks/client/meteor.ts',
			},

			setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.ts'],
			coveragePathIgnorePatterns: ['<rootDir>/tests/'],
		},
		{
			displayName: 'server',
			testEnvironment: 'node',

			testMatch: [
				'<rootDir>/app/livechat/server/business-hour/**/*.spec.ts?(x)',
				'<rootDir>/app/livechat/server/api/**/*.spec.ts',
				'<rootDir>/ee/app/authorization/server/validateUserRoles.spec.ts',
				'<rootDir>/app/cloud/server/functions/supportedVersionsToken/**.spec.ts',
			],
			transformIgnorePatterns: ['!/node_modules/jose'],
			errorOnDeprecated: true,

			modulePathIgnorePatterns: ['<rootDir>/dist/'],

			transform: {
				'^.+\\.(t|j)sx?$': '@swc/jest',
			},

			moduleNameMapper: {
				'\\.css$': 'identity-obj-proxy',
				'^react($|/.+)': '<rootDir>/node_modules/react$1',
				'^@tanstack/(.+)': '<rootDir>/node_modules/@tanstack/$1',
			},
		},
	],
	collectCoverage: true,
} satisfies Config;
