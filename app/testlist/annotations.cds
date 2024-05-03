using from '../../srv/service';
using from '../../db/schema';

annotate MyService.Test with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : id,
            Label : 'id',
        },
        {
            $Type : 'UI.DataField',
            Value : name,
            Label : 'name',
        },
    ]
);
// using MyService as service from 'SAP Business Application Studio/projects/WorkFlowUI/srv/service';