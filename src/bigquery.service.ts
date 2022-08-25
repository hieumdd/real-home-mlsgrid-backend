import knex from 'knex';
import { BigQuery, BigQueryTimestamp } from '@google-cloud/bigquery';

type LoadOptions = {
    table: string;
    schema: Record<string, any>[];
};

const client = new BigQuery();
const dataset = 'MLSGrid';
const qb = knex({ client: 'mysql' });

export const getLatest = async (table: string) => {
    const sql = qb
        .withSchema('MLSGrid')
        .from(table)
        .max('ModificationTimestamp', { as: 'cursor' });

    const { incre } = await client
        .query(sql.toQuery())
        .then(([rows]) => rows.pop());

    return incre as BigQueryTimestamp
};

export const load = (data: Record<string, any>[], options: LoadOptions) => {
    const writeStream = client
        .dataset(dataset)
        .table(options.table)
        .createWriteStream({
            schema: { fields: options.schema },
            sourceFormat: 'NEWLINE_DELIMITED_JSON',
        });

    return new Promise((resolve, reject) => {
        writeStream.on('complete', (job) => {
            console.log(job);
            resolve(job);
        });
        writeStream.on('error', (err) => reject(err));

        data.forEach((row) => {
            const _row = JSON.stringify(row) + '\n';
            writeStream.write(JSON.stringify(_row));
        });
        writeStream.end();
    });
};
