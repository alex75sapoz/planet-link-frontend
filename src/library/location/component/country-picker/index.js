import { Fragment } from 'react';

import LocationController, { LocationAsset } from '../../../../api/location-controller';

import { StringExtension as String } from '../../../base/base-extension';

import Picker from '../../../base/component/picker';

import style from './style.module.scss';

/**@param {Props}*/
export default function CountryPicker({
    onClick,
    onReset,
    value,
    isResetAllowed
}) {
    return (
        <Picker
            placeholder='Search Countries...'
            initialValue={value}
            isResetAllowed={isResetAllowed}
            onChangeBeforeDelay={(keyword) => String.firstLetterToUpperCase(keyword)}
            onChangeAfterDelay={async (keyword) => {
                var { data: countries, isSuccess } = await LocationController.country.search.get({ keyword });

                if (!isSuccess) return [{ content: 'Failed to search countries 😐' }];
                if (!countries.length) return [{ content: 'No Results...' }];

                return countries.map((country) => ({
                    data: country,
                    content: (
                        <Fragment>
                            <img src={LocationAsset.country.flag(country.twoLetterCode)} className={style.icon} alt='' />
                            <p className='d-inline-block'>{country.threeLetterCode}, {country.name}</p>
                        </Fragment>
                    )
                }));
            }}
            onClick={(/**@type {LocationCountryContract}*/country) => {
                if (!country) return;
                onClick && onClick(country);
                return country.name;
            }}
            onReset={() => {
                onReset && onReset();
            }}
        />
    );
}

/**Props
 * @typedef Props
 * @property {(country: LocationCountryContract) => void} onClick
 * @property {() => void} onReset
 * @property {string} value
 * @property {boolean} isResetAllowed
*/