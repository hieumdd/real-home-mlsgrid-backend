type Pipeline = {
    name: string;
    resource: string;
    transform: (row: Record<string, any>) => Record<string, any>;
    schema: Record<string, any>[];
};

export const Property: Pipeline = {
    name: 'Property',
    resource: 'Property',
    transform: (v) => v,
    schema: [],
};
