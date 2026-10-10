import { employers_datas } from "../configs/employer";

namespace Employer {
    export type Id = keyof typeof employers_datas;

    export type Type = {
        name: string,
        pass: string,
        rules: [Rule, ...Rule[]],
    }

    export enum Rule {
        RECEPTIONIST,
        CLEANER,
        RESTAURANT,
        SECURITY,
    }

    export type AuthSession = string
}

export default Employer;
