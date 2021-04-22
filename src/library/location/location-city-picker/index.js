import { Fragment } from 'react';

import LocationController, { LocationAsset } from '../../../api/location-controller';

import { StringExtension as String } from '../../base/base-extension';

import Picker from '../../base/base-picker';

import style from './style.module.scss';

/** @param {Props}*/
export default function LocationCityPicker({
    onClick,
    onReset,
    value,
    isResetAllowed
}) {
    return (
        <Picker
            placeholder='Search Cities...'
            initialValue={value}
            isResetAllowed={isResetAllowed}
            onChangeBeforeDelay={(keyword) => String.firstLetterToUpperCase(keyword)}
            onChangeAfterDelay={async (keyword) => {
                var { data: cities, isSuccess } = await LocationController.city.search.get({ keyword });

                if (!isSuccess) return [{ content: 'Failed to search cities 😐' }];
                if (!cities.length) return [{ content: 'No Results...' }];

                return cities.map((city) => ({
                    data: city,
                    content: (
                        <Fragment>
                            <img src={LocationAsset.country.flag(city.country.twoLetterCode)} className={style.icon} alt='' />
                            <p className='d-inline-block'>{city.country.threeLetterCode}, {city.state ? ` ${city.state.twoLetterCode}, ${city.name}, ${city.zipcode}` : city.name}</p>
                        </Fragment>
                    )
                }))
            }}
            onClick={(/**@type {LocationCityContract}*/city) => {
                if (!city) return;
                onClick && onClick(city);
                return city.name;
            }}
            onReset={() => {
                onReset && onReset();
            }}
        />
    );
}

/**Props
 * @typedef Props
 * @property {(city: LocationCityContract) => void} onClick
 * @property {() => void} onReset
 * @property {string} value
 * @property {boolean} isResetAllowed
*/