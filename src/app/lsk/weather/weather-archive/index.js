import { cityArchiveGroup, countryArchiveGroup, stateArchiveGroup, continentArchiveGroup, subContinentArchiveGroup, areaCodeArchiveGroup, currencyArchiveGroup, languageArchiveGroup } from '../../../../library/location/location-archive';

import ArchiveViewer from '../../../../library/base/base-archive-viewer';

export default function WeatherArchive() {
    return (
        <ArchiveViewer
            sections={[
                {
                    name: 'Locations',
                    groups: [
                        [
                            cityArchiveGroup
                        ],
                        [
                            countryArchiveGroup,
                            stateArchiveGroup
                        ],
                        [
                            continentArchiveGroup,
                            subContinentArchiveGroup
                        ]
                    ]
                },
                {
                    name: 'Global',
                    groups: [
                        [
                            languageArchiveGroup
                        ],
                        [
                            currencyArchiveGroup,
                            areaCodeArchiveGroup
                        ]
                    ]
                }
            ]}
        />
    )
}