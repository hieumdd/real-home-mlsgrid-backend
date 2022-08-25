import { getService } from '../common/service';
import patientRepository from './patient.repository';

export const getCountService = (columns?: string[]) =>
    getService((options) => {
        const count = patientRepository(options).count('PATIENTID', {
            as: 'COUNT',
        });

        columns && count.select(columns).groupBy(columns);

        return count;
    });

export const getAll = getService((options) => {
    const { count, page } = options;

    return patientRepository(options)
        .select()
        .orderBy('PATIENTID')
        .limit(count)
        .offset(count * page);
});

export const getCount = getCountService();

export const getCountByStartOfMonth = getCountService(['STARTOFMONTH']);

export const getCountByCompliant = getCountService(['LASTCOMPLIANT']);

export const getCountByTherapyModeGroup = getCountService([
    'LASTTHERAPYMODEGROUP',
]);

export const getCountByAge = getCountService(['LASTOVER65']);
