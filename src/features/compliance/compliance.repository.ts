import { Knex } from 'knex';

import { Options } from '../common/repository';
import { Snowflake } from '../../providers/snowflake';

const compliantRepository = ({ patientName }: Options) => {
    const withCached = (qb: Knex.QueryBuilder) => {
        qb.withSchema('UTIL_DB.PUBLIC')
            .from('RESPIRONICS_COMPLIANCE_TAB')
            .select();

        patientName && qb.where('PATIENTNAME', 'ILIKE', `%${patientName}%`);

        return qb;
    };

    return Snowflake.with('cached', withCached).from('cached');
};

export default compliantRepository;
