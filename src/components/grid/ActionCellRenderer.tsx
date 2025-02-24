import { setDialogueOpen, setSelectedCourse } from "@/store/slices/course"
import { useDispatch } from "@/store/store"
import type { ICellRendererParams } from "@ag-grid-community/core";

export const ActionCellRenderer = ({ value, data, ...props }: ICellRendererParams) => {
    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(setSelectedCourse({ ...data }))
        dispatch(setDialogueOpen(true))
    }

    return <>
        <button onClick={handleClick}>Edit</button>
    </>
}