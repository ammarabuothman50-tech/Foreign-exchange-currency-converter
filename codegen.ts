import type { CodegenConfig } from '@graphql-codegen/cli';

process.loadEnvFile();

const config: CodegenConfig = {
  schema: {
    [process.env['NG_APP_API_URL']!]: {
      headers: { Authorization: `ApiKey ${process.env['NG_APP_API_KEY']}` },
    },
  },
  documents: 'src/**/*.graphql',
  generates: {
    'src/app/features/fx/services/fx.generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular'],
      config: {
        scalars: { Date: 'string', BigDecimal: 'number' },
        onlyOperationTypes: true,
      },
    },
  },
  hooks: { afterAllFileWrite: ['npx prettier --write'] },
};

export default config;
