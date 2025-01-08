import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { AllCommunityModule, ColDef, ColGroupDef, ModuleRegistry, ValueGetterParams } from 'ag-grid-community';
import { useState } from 'react';

ModuleRegistry.registerModules([AllCommunityModule]);

const CustomButtonComponent = () => {
  return <button onClick={() => window.alert("clicked")}>Push Me!</button>;
};

export default function CoursesPage() {
  const [rowData, setRowData] = useState<any[]>([
    { id: "1", user_id: "1", title: "test topic 1", description: "test1", delivery: {channel: "slack", frequency: "daily" } },
    { id: "2", user_id: "2", title: "test topic 2", description: "tes2t", delivery: {channel: "slack", frequency: "daily" } },
    { id: "3", user_id: "1", title: "test topic 3", description: "test3", delivery: {channel: "slack", frequency: "daily" } },
  ]);
  const [columnDefs, setColumnDefs] = useState<
    (ColDef<any, any> | ColGroupDef<any>)[]
  >([
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "user_id",
      headerName: "User ID",
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
      field: "delivery",
      valueGetter: (p: ValueGetterParams) => p.data.delivery.channel ,
      headerName: "Delivery method",
      flex: 1,
    },
    {
      field: "frequency",
      valueGetter: (p: ValueGetterParams) => p.data.delivery.frequency ,
      headerName: "Frequency",
      flex: 1,
    },

    { field: "button", cellRenderer: CustomButtonComponent, flex: 1 },
  ]);
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "100%" }}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} />
      </div>
    </div>
  );
};


