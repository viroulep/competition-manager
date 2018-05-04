import React from 'react';
import { addLocaleData, FormattedMessage, FormattedDate } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';

addLocaleData([...en, ...fr]);

const availableLocales = ["en", "fr"];
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export const localesData = {}

availableLocales.forEach(function(locale) {
  localesData[locale] = require(`./lang/${locale}.json`);
});


export function t(id, values={}) {
  return (
    <FormattedMessage id={id} values={values}
                      defaultMessage={localesData.en[id]}
    />
  );
}

export function l(date) {
  return (
    <FormattedDate value={new Date(date)} {...dateOptions} />
  );
}
