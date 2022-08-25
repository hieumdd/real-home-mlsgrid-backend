import { http } from '@google-cloud/functions-framework';
import express from 'express';

import { getConnection } from './providers/snowflake';

import optionsMiddleware from './features/middleware/options';
import patientSessionController from './features/patient-session/patient-session.controller';
import patientController from './features/patient/patient.controller';
import complianceController from './features/compliance/compliance.controller';

const app = express();

app.use(async (req, res, next) => {
    req.snowflake = await getConnection();
    next();
});

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        next();
    }
});

app.use(optionsMiddleware);

app.use('/patient-session', patientSessionController);
app.use('/patient', patientController);
app.use('/compliance', complianceController);

http('main', app);
