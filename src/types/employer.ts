import { Sex } from ".";

namespace Employer {
    export type Id = string;

    export type Type = {
        id: Id,
        sexe: Sex,
        name: string,
        pass: string,
        rules: Rule[],
    }

    export type Rule =
        'RECEPTIONIST'
        | 'CLEANER'
        | 'RESTAURANT'
        | 'SECURITY'

    export type AuthSession = string
}

export default Employer;
