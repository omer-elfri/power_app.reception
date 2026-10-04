import Employer from "../types/employer";

export const employers_datas = {
    'receptionist1': {
        name: "Hilary",
        rules: [
            Employer.Rule.RECEPTIONIST,
        ],
    },
    'receptionist2': {
        name: "Romuald",
        rules: [
            Employer.Rule.RECEPTIONIST,
        ],
    },
    'vallet1': {
        name: "Théophane",
        rules: [
            Employer.Rule.CLEANER,
        ],
    },
    'vallet2': {
        name: "Albérique",
        rules: [
            Employer.Rule.CLEANER,
        ],
    },
    'vallet3': {
        name: "Alexis",
        rules: [
            Employer.Rule.CLEANER,
            Employer.Rule.SECURITY,
        ],
    },
    'security': {
        name: "Le vieux",
        rules: [
            Employer.Rule.SECURITY,
        ],
    },
} as const satisfies Record<string, Employer.Type>;
