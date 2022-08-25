import { Handler } from 'express';

const optionsMiddleware: Handler = (req, res, next) => {
    const { patientName, compliant, over65 } = req.query;

    req.options = {
        count: parseInt(<string>req.query.count || '500'),
        page: parseInt(<string>req.query.page || '0'),
        start: <string>req.query.start,
        end: <string>req.query.end,
        patientName: patientName ? decodeURI(<string>patientName) : undefined,
        therapyModeGroup: <string>req.query.therapyModeGroup,
        compliant,
        over65,
    };

    next();
};

export default optionsMiddleware;
