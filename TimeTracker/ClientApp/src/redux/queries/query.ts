import { ajax } from 'rxjs/ajax';
import { QueryStructure } from '..';

export function AjaxQuery<T>(query: string, variables: object|null=null, token: string | null = null) {

    return ajax<QueryStructure<T>>({
        url: "/graphql",
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: {
            query,
            variables
        }
    })
}