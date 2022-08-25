import { Knex } from 'knex';

import { Snowflake } from '../../providers/snowflake';

import { Options } from '../common/repository';

const patientRepository = ({
    start,
    end,
    patientName,
    compliant,
    therapyModeGroup,
    over65,
}: Options) => {
    const withCached = (qb: Knex.QueryBuilder) => {
        qb.withSchema('UTIL_DB.PUBLIC')
            .from('RESPIRONICS_PATIENTS_CACHED')
            .select();

        start && end && qb.whereBetween('MAXTHERAPYDATE', [start, end]);
        patientName && qb.where('PATIENTNAME', 'ILIKE', `%${patientName}%`);
        compliant && qb.where('LASTCOMPLIANT', compliant);
        therapyModeGroup && qb.where('LASTTHERAPYMODEGROUP', therapyModeGroup);
        over65 && qb.where('LASTOVER65', over65);

        return qb;
    };

    return Snowflake.with('cached', withCached).from('cached');
};

export default patientRepository;
