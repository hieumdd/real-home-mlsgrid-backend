import { getConnection } from '../../providers/snowflake';
import * as compliantService from './compliance.service';

import cases from '../common/config.test';
import { Connection } from 'snowflake-sdk';

describe('Query', () => {
    let connection: Connection;

    beforeEach(async () => {
        connection = await getConnection();
    });

    it('List', async () => {
        return compliantService
            .getAll(connection, { count: 10, page: 0 })
            .then((data) => {
                expect(data.length).toBe(10);
            });
    });

    it('Count', async () => {
        return compliantService
            .getCount(connection, cases[1].options)
            .then((data) => {
                expect(data).toBeTruthy();
            });
    });
});
