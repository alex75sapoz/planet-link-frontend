import { LocationAsset } from '../../api/location-controller';
import { Asset } from '../../api/asset-controller';

/**@type {import('../base/base-archive-viewer').Group} */
export const cityArchiveGroup = {
    title: 'Cities',
    description: '209,557 cities from Open Weather Api',
    info: 'All U.S. cities include a state, county and zipcode',
    archives: [
        {
            path: LocationAsset.city.archive.xlsx,
            name: 'Cities.xlsx',
            icon: Asset.file.xlsx
        },
        {
            path: LocationAsset.city.archive.csv,
            name: 'Cities.csv',
            icon: Asset.file.csv
        },
        {
            path: LocationAsset.city.archive.json,
            name: 'Cities.json',
            icon: Asset.file.json
        },
        {
            path: LocationAsset.city.archive.sql,
            name: 'Cities.sql',
            icon: Asset.file.sql
        }
    ]
}

/**@type {import('../base/base-archive-viewer').Group} */
export const countryArchiveGroup = {
    title: 'Countries',
    description: '246 countries',
    info: 'Manually scraped data from multiple sources',
    archives: [
        {
            path: LocationAsset.country.archive.xlsx,
            name: 'Countries.xlsx',
            icon: Asset.file.xlsx
        },
        {
            path: LocationAsset.country.archive.csv,
            name: 'Countries.csv',
            icon: Asset.file.csv
        },
        {
            path: LocationAsset.country.archive.json,
            name: 'Countries.json',
            icon: Asset.file.json
        },
        {
            path: LocationAsset.country.archive.sql,
            name: 'Countries.sql',
            icon: Asset.file.sql
        }
    ]
}

/**@type {import('../base/base-archive-viewer').Group} */
export const stateArchiveGroup = {
    title: 'States',
    description: '50 states',
    info: '2 additional states were added to fill in exceptions',
    archives: [
        {
            path: LocationAsset.state.archive.xlsx,
            name: 'States.xlsx',
            icon: Asset.file.xlsx
        },
        {
            path: LocationAsset.state.archive.csv,
            name: 'States.csv',
            icon: Asset.file.csv
        },
        {
            path: LocationAsset.state.archive.json,
            name: 'States.json',
            icon: Asset.file.json
        },
        {
            path: LocationAsset.state.archive.sql,
            name: 'States.sql',
            icon: Asset.file.sql
        }
    ]
}

/**@type {import('../base/base-archive-viewer').Group} */
export const continentArchiveGroup = {
    title: 'Continents',
    description: '7 continents',
    info: 'This is where it all begins',
    archives: [
        {
            path: LocationAsset.continent.archive.xlsx,
            name: 'Continents.xlsx',
            icon: Asset.file.xlsx
        },
        {
            path: LocationAsset.continent.archive.csv,
            name: 'Continents.csv',
            icon: Asset.file.csv
        },
        {
            path: LocationAsset.continent.archive.json,
            name: 'Continents.json',
            icon: Asset.file.json
        },
        {
            path: LocationAsset.continent.archive.sql,
            name: 'Continents.sql',
            icon: Asset.file.sql
        }
    ]
}

/**@type {import('../base/base-archive-viewer').Group} */
export const subContinentArchiveGroup = {
    title: 'Sub Continents',
    description: '18 sub continents',
    info: 'Basically continents split into parts',
    archives: [
        {
            path: LocationAsset.subContinent.archive.xlsx,
            name: 'SubContinents.xlsx',
            icon: Asset.file.xlsx
        },
        {
            path: LocationAsset.subContinent.archive.csv,
            name: 'SubContinents.csv',
            icon: Asset.file.csv
        },
        {
            path: LocationAsset.subContinent.archive.json,
            name: 'SubContinents.json',
            icon: Asset.file.json
        },
        {
            path: LocationAsset.subContinent.archive.sql,
            name: 'SubContinents.sql',
            icon: Asset.file.sql
        }
    ]
}

/**@type {import('../base/base-archive-viewer').Group} */
export const areaCodeArchiveGroup = {
    title: 'Area Codes',
    description: '236 area codes',
    info: 'Each area code is linked to at least one country',
    archives: [
        {
            path: LocationAsset.areaCode.archive.xlsx,
            name: 'AreaCodes.xlsx',
            icon: Asset.file.xlsx
        },
        {
            path: LocationAsset.areaCode.archive.csv,
            name: 'AreaCodes.csv',
            icon: Asset.file.csv
        },
        {
            path: LocationAsset.areaCode.archive.json,
            name: 'AreaCodes.json',
            icon: Asset.file.json
        },
        {
            path: LocationAsset.areaCode.archive.sql,
            name: 'AreaCodes.sql',
            icon: Asset.file.sql
        }
    ]
}

/**@type {import('../base/base-archive-viewer').Group} */
export const languageArchiveGroup = {
    title: 'Languages',
    description: '114 languages',
    info: 'Each language is linked to at least one country',
    archives: [
        {
            path: LocationAsset.language.archive.xlsx,
            name: 'Languages.xlsx',
            icon: Asset.file.xlsx
        },
        {
            path: LocationAsset.language.archive.csv,
            name: 'Languages.csv',
            icon: Asset.file.csv
        },
        {
            path: LocationAsset.language.archive.json,
            name: 'Languages.json',
            icon: Asset.file.json
        },
        {
            path: LocationAsset.language.archive.sql,
            name: 'Languages.sql',
            icon: Asset.file.sql
        }
    ]
}

/**@type {import('../base/base-archive-viewer').Group} */
export const currencyArchiveGroup = {
    title: 'Currencies',
    description: '154 currencies',
    info: 'Each currency is linked to at least one country',
    archives: [
        {
            path: LocationAsset.currency.archive.xlsx,
            name: 'Currencies.xlsx',
            icon: Asset.file.xlsx
        },
        {
            path: LocationAsset.currency.archive.csv,
            name: 'Currencies.csv',
            icon: Asset.file.csv
        },
        {
            path: LocationAsset.currency.archive.json,
            name: 'Currencies.json',
            icon: Asset.file.json
        },
        {
            path: LocationAsset.currency.archive.sql,
            name: 'Currencies.sql',
            icon: Asset.file.sql
        }
    ]
}