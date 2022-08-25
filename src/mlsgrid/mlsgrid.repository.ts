import axios from 'axios';
import { Dayjs } from 'dayjs';
import { QueryBuilder } from 'odata-query-builder';

const TOP = 5000;

const client = axios.create({
    baseURL: 'https://api.mlsgrid.com/v2',
    headers: { Authorization: `Bearer ${process.env.MLSGRID_TOKEN}` },
});

type GetOptions = {
    start: Dayjs;
    end: Dayjs;
};

export const get = (resource: string, { start, end }: GetOptions) => {
    const fetchOne = async (skip = 0): Promise<any[]> => {
        const query = new QueryBuilder()
            .filter(
                (f) =>
                    f
                        .filterExpression(
                            'OriginatingSystemName',
                            'eq',
                            `realtrac`,
                        )
                        .filterExpression(
                            'ModificationTimestamp',
                            'gte',
                            start.toISOString(),
                        )
                        .filterExpression(
                            'ModificationTimestamp',
                            'lte',
                            end.toISOString(),
                        ),
                'and',
            )
            .top(TOP)
            .skip(skip);

        const { value } = await client
            .get(resource + '?' + query.toQuery())
            .then(({ data }) => data);

        return value.length === 0 ? value : fetchOne(skip + 1);
    };

    return fetchOne();
};
