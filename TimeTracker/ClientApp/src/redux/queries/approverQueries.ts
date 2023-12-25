
import { ReadCookie } from "../../utils";
import { AjaxQuery } from "./query";
import { QueryStructure } from "../intrerfaces";
import { ApproversAddType } from "../types";

export function AddApproversQuery(data: ApproversAddType) {
    const token = ReadCookie('user');
    const { approvers, userId } = data;

    return AjaxQuery<{ userMutation: { create: boolean } }>(
        "mutation AddApprovers($userId:Int!,$approvers:[Int!]){ approverMutation{create(userSenderId:$userId,approvers:$approvers)}}",
        {
            approvers: approvers,
            userId: userId
        },
        token
    )
}
