import { ActionCellRenderer } from '@/components/grid/ActionCellRenderer';
import { ColDef, ColGroupDef, ValueGetterParams } from 'ag-grid-community';


export const columndDefs: ColDef<any, any>[] = [
    {
        field: "id",
        headerName: "ID",
        flex: 1,
    },

    {
        field: "title",
        headerName: "Title",
        flex: 1,
    },
    {
        field: "description",
        headerName: "Description",
        flex: 1,
    },
    {
        field: "totalLessons",
        headerName: "Course Lessons",
        flex: 1,
    },
    {
        field: "totalTopics",
        headerName: "Course Topics",
        flex: 1,
    },
    {
        field: "processingStyle",
        headerName: "Course Processing Style",
        flex: 1,
    },
    {
        field: "delivery",
        valueGetter: (p: ValueGetterParams) => p.data.delivery.channel,
        headerName: "Delivery method",
        flex: 1,
    },
    {
        field: "frequency",
        valueGetter: (p: ValueGetterParams) => p.data.delivery.frequency,
        headerName: "Frequency",
        flex: 1,
    },

    { field: "button", cellRenderer: ActionCellRenderer, flex: 1 },
]