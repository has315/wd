import { setSelectedCourse } from "@/store/slices/course"
import { setDeleteDialogueOpen, setEditDialogueOpen } from "@/store/slices/modal";
import { useDispatch } from "@/store/store"
import type { ICellRendererParams } from "@ag-grid-community/core";
import { EditIcon, Trash } from "lucide-react";

export const ActionCellRenderer = ({ value, data, ...props }: ICellRendererParams) => {
    const dispatch = useDispatch()

    const handleEdit = () => {
        dispatch(setSelectedCourse({ ...data }))
        dispatch(setEditDialogueOpen(true))
    }
    const handleDelete = () => {
        dispatch(setSelectedCourse({ ...data }))
        dispatch(setDeleteDialogueOpen(true))
    }

    return <div className="h-full flex items-center justify-center gap-2 ">
        <button onClick={handleEdit}><EditIcon /></button>
        <button onClick={handleDelete}><Trash color="red" /></button>
    </div>
}