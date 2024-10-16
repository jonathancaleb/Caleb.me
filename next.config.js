const { spawnSync } = require('child_process');

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 60 * 60,
  env: {
    BUILD_ID: [
      spawnSync('git', ['rev-parse', '--short', 'HEAD']).stdout.toString().trim(),
      spawnSync('git', ['tag', '--points-at', 'HEAD']).stdout.toString().trim()
    ]
      .filter(Boolean)
      .join('-'),
    SITE_URL:
      (process.env['SITE_URL'] ??
        (process.env['VERCEL_URL'] && 'https://' + process.env['VERCEL_URL'])) ??
      'http://localhost:3000'
  },
  redirects: async () => {
    return [
      {
        source: '/projects/:slug',
        destination: '/projects',
        permanent: true
      },
      {
        source: '/blog/return-type-inference',
        destination: '/blog/target-type-inference',
        permanent: true
      }
    ];
  }
};

module.exports = config;
