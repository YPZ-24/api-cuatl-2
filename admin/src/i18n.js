/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your plugin.
 *
 */

import translationMessages, { languageNativeNames } from './translations';

const languages = Object.keys(translationMessages);

export { languages, translationMessages, languageNativeNames };
