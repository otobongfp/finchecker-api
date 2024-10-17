export default {
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  hostname: {
    doc: 'Public hostname where the service is running on',
    default: 'localhost',
    env: 'PUBLIC_HOSTNAME',
  },
};
