export const easternTimezoneId = 'America/New_York';

export class NumberExtension extends Number {
    static toUniversalString(input) {
        return input > 1000000000
            ? `${(input / 1000000000).toFixed(2)}B`
            : input > 1000000
                ? `${(input / 1000000).toFixed(2)}M`
                : input > 1000
                    ? `${(input / 1000).toFixed(2)}K`
                    : input;
    }
}

export class StringExtension extends String {
    /**
     * @param {string} input
     * @returns {string}
    */
    static firstLetterToUpperCase(input) {
        return typeof (input) == 'string' && input ? input.charAt(0).toUpperCase() + (input.length > 1 ? input.slice(1) : '') : input;
    }
}

export class PromiseExtension extends Promise {
    static wait(timeoutInMilliseconds) {
        return new Promise(callback => setTimeout(callback, timeoutInMilliseconds));
    }
}

export class GeometryExtension {
    static getDegreesDirection(degrees) {
        return ['North', 'North East', 'East', 'South East', 'South', 'South West', 'West', 'North West', 'North'][(degrees / 45).toFixed(0)];
    }

    static getDistanceInMiles(coordinate1, coordinate2) {
        var R = 3958.8; //Radius of the Earth in miles
        var radiansLatitude1 = coordinate1.latitude * (Math.PI / 180); //Convert degrees to radians
        var radiansLatitude2 = coordinate2.latitude * (Math.PI / 180); //Convert degrees to radians
        var differenceLatitude = radiansLatitude2 - radiansLatitude1; //Radian difference (latitudes)
        var differenceLongitude = (coordinate2.longitude - coordinate1.longitude) * (Math.PI / 180); //Radian difference (longitudes)

        var d = 2 * R * Math.asin(Math.sqrt(Math.sin(differenceLatitude / 2) * Math.sin(differenceLatitude / 2) + Math.cos(radiansLatitude1) * Math.cos(radiansLatitude2) * Math.sin(differenceLongitude / 2) * Math.sin(differenceLongitude / 2)));
        return d;
    }
}

export class StorageExtension {
    static get(key) {
        var response = localStorage.getItem(key);
        if (!response) return;

        try {
            return JSON.parse(response);
        }
        catch (error) {
            return;
        }
    }

    static set(key, value) {
        if (!key || !value) return;
        localStorage.setItem(key, JSON.stringify(value));
    }

    static remove(key) {
        if (!key) return;
        localStorage.removeItem(key);
    }
}