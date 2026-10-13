import Employer from "../types/employer";

export const employers_datas = {
    'receptionist1': {
        sexe: 'Mme',
        name: "Hillary",
        pass: "1234",
        rules: [
            Employer.Rule.RECEPTIONIST,
        ],
    },
    'receptionist2': {
        sexe: 'Mr',
        name: "Romuald",
        pass: "1234",
        rules: [
            Employer.Rule.RECEPTIONIST,
        ],
    },
    'vallet1': {
        sexe: 'Mr',
        name: "Théophane",
        pass: "1234",
        rules: [
            Employer.Rule.CLEANER,
        ],
    },
    'vallet2': {
        sexe: 'Mme',
        name: "Albérique",
        pass: "1234",
        rules: [
            Employer.Rule.CLEANER,
        ],
    },
    'vallet3': {
        sexe: 'Mr',
        name: "Alexis",
        pass: "1234",
        rules: [
            Employer.Rule.CLEANER,
            Employer.Rule.SECURITY,
        ],
    },
    'security': {
        sexe: 'Mr',
        name: "Le vieux",
        pass: "1234",
        rules: [
            Employer.Rule.SECURITY,
        ],
    },
} as const satisfies Record<string, Employer.Type>;
