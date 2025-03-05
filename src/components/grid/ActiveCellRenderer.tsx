import { setDialogueOpen, setSelectedCourse, updateCourse } from "@/store/slices/course"
import { useDispatch } from "@/store/store"
import type { ICellRendererParams } from "@ag-grid-community/core";
import { FormControl } from "../ui/form";
import { Switch } from "../ui/switch";
import { toast } from "react-toastify";

export const ActiveCellRenderer = ({ value, data, ...props }: ICellRendererParams) => {
    const dispatch = useDispatch()

    const handleOnChange = async () => {
        const result = await dispatch(updateCourse({ course: { ...data, active: !value } }))
        if (result?.status === 200) {
            if(!value) {
                toast('Course activated', { type: "success" })
                return
            }
            toast('Course disabled', { type: "success" })
            return
        }
        toast('Course failed to update', { type: "error" })
    }

    return <>

        <Switch
            checked={value}
            onCheckedChange={handleOnChange}
        />
    </>
}