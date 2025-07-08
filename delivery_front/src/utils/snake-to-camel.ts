export function snakeToCamel(str: string): string {
    return str.replace(/(_\w)/g, match => match[1].toUpperCase());
}

export function convertKeysToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(item => convertKeysToCamelCase(item));
    } else if (obj !== null && typeof obj === 'object') {
        const newObj: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const newKey = snakeToCamel(key);
                newObj[newKey] = convertKeysToCamelCase(obj[key]);
            }
        }
        return newObj;
    }
    return obj;
}