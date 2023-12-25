import { UserAddType, UserEditType } from '@redux/types'

export interface UserFormProps {
    formDataHandler: (data: UserAddType | UserEditType) => void,
    step?: number
}

export type Inputs = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    hoursPerMonth: number,
    permissions: number,
}