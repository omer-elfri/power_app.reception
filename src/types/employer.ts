import { Sex } from ".";

namespace Employer {
    export type Id = number;

    export type Type = {
        id: number,
        sexe: Sex,
        name: string,
        rules: Rule[],
        auth_user_id?: string,
    }

    export type Rule =
        'receptionnist'
        | 'cleaner'
        | 'cooker'
        | 'security'

    export type AuthSession = string
}

export default Employer;
