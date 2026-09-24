namespace Employer {

    export type Type = {
        name: string,
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

export type AuthSession = {
    name: string,
}

export default Employer;
