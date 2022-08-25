import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import { getLatest, load } from '../bigquery.service';
import { Property } from './mlsgrid.pipeline';
import { get } from './mlsgrid.repository';

export const pipelineService = async (start?: string, end?: string) => {
    const _start = start
        ? dayjs(start)
        : await getLatest(Property.name).then((res) => dayjs(res.value));
    const _end = end ? dayjs(end) : dayjs.utc();

    return get(Property.resource, { start: _start, end: _end })
        .then((rows) => rows.map(Property.transform))
        .then((rows) =>
            load(rows, { table: Property.name, schema: Property.schema }),
        );
};
