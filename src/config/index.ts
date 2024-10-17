import convict from 'convict';
import development from './development';
import production from './production';
import test from './test';

export { default as schema } from './schema';

export const configurations = { test, development, production };

convict.addFormat({
  name: 'comma-separated-string',
  validate: function (val) {
    const emptyStringRegex = /^$/;
    const commaSeparatedStringRegex = /^\w+(\s*,\s*\w+)*$/;

    if (!emptyStringRegex.test(val) && !commaSeparatedStringRegex.test(val)) {
      throw new Error('must be a comma separated string');
    }
  },
  coerce: function (val) {
    if (!val) return [];
    return val.trim().split(/\s*,\s*/);
  },
});
