import * as lambda from '@aws-cdk/aws-lambda';
import * as lambdaNodeJs from '@aws-cdk/aws-lambda-nodejs';
import {
  Bundling,
  BundlingProps,
} from '@aws-cdk/aws-lambda-nodejs/lib/bundling';
import { resolve } from 'path';


{
  const bundlingOptions: BundlingProps = {
      // entry: resolve('dist/apps/api/esm.mjs'),
      entry: resolve('apps/esbuild-test/src/esm.mjs'),
      runtime: lambda.Runtime.NODEJS_14_X,
      architecture: lambda.Architecture.X86_64,
      depsLockFilePath: resolve('package-lock.json'),
      projectRoot: resolve('.'),
      // ^
      format: lambdaNodeJs.OutputFormat.ESM,
      target: 'node14.8',
      // https://github.com/evanw/esbuild/issues/1921#issuecomment-1152991694
      // https://bobbyhadz.com/blog/javascript-dirname-is-not-defined-in-es-module-scope
      banner: `
          import { createRequire } from 'module';const require = createRequire(import.meta.url);
          import path from 'path';
          import { fileURLToPath } from 'url';
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
          `.replace(/\s+/g,' '),
      externalModules: [
          'aws-sdk',
          // these libraries are loaded dynamically by NestJS (we don't use but esbuild detects)
          'fastify-swagger',
          '@nestjs/websockets/socket-module',
          '@nestjs/microservices',
          'cache-manager',
          'pg-native',
          'fastify-static',
      ],
      logLevel: lambdaNodeJs.LogLevel.INFO,
      commandHooks: {
          beforeBundling(inputDir: string, outputDir: string): string[] {
              console.log('inputDir', inputDir);
              console.log('outputDir', outputDir);
              return [
                  // `cd "${inputDir}"`,
                  // `${inputDir}/node_modules/.bin/copyfiles --verbose -u 3 "dist/apps/api/assets/**" "${outputDir}"`,
              ];
            },
            afterBundling(inputDir: string, outputDir: string): string[] {
              return [
                  // `ls -lR "${outputDir}"`,
              ];
            },
            beforeInstall() {
              return [];
            },
      }
  };

  const bundling = new Bundling(bundlingOptions);
  console.log(bundling.local.tryBundle('tmp/', { image: null, ...bundlingOptions }));
}
