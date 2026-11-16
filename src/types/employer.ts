import { Sex } from ".";
import { ConfigType } from "../hooks/useConfig";

namespace Employer {
    export type Id = number;

    export type Type = {
        id: number,
        sexe: Sex,
        name: string,
        rules: Rule[],
        auth_user_id?: string,
        email?: string;
    }

    export type Auth = ConfigType<Omit<Type, 'email'>> & {
        email: string;
    }

    export type Rule =
        'receptionnist'
        | 'cleaner'
        | 'cooker'
        | 'security'
}

export default Employer;
