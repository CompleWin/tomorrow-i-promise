import type { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name!,
  slug: config.slug!,
  experiments: {
    ...config.experiments,
    baseUrl: process.env.BASE_PATH ?? config.experiments?.baseUrl,
  }
})