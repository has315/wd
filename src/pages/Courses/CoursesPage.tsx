import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { AllCommunityModule, ColDef, ColGroupDef, ModuleRegistry, ValueGetterParams } from 'ag-grid-community';
import { useEffect, useState } from 'react';
import { getCourses } from '@/store/slices/course';
import { useDispatch, useSelector } from '@/store/store';

ModuleRegistry.registerModules([AllCommunityModule]);

const CustomButtonComponent = () => {
  return <button onClick={() => window.alert("clicked")}>Push Me!</button>;
};

export default function CoursesPage() {
  const dispatch = useDispatch()
  const { courses } = useSelector(state => state.course)

  const [columnDefs, setColumnDefs] = useState<
    (ColDef<any, any> | ColGroupDef<any>)[]
  >([
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

    { field: "button", cellRenderer: CustomButtonComponent, flex: 1 },
  ]);

  useEffect(() => {
    dispatch(getCourses())
  }, [])

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "100%" }}>
        <AgGridReact rowData={courses} columnDefs={columnDefs} />
      </div>
    </div>
  );
};


