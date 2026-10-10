import Employer from "../types/employer";

export const employers_datas = {
    'receptionist1': {
        name: "Hillary",
        pass: "1234",
        rules: [
            Employer.Rule.RECEPTIONIST,
        ],
    },
    'receptionist2': {
        name: "Romuald",
        pass: "1234",
        rules: [
            Employer.Rule.RECEPTIONIST,
        ],
    },
    'vallet1': {
        name: "Théophane",
        pass: "1234",
        rules: [
            Employer.Rule.CLEANER,
        ],
    },
    'vallet2': {
        name: "Albérique",
        pass: "1234",
        rules: [
            Employer.Rule.CLEANER,
        ],
    },
    'vallet3': {
        name: "Alexis",
        pass: "1234",
        rules: [
            Employer.Rule.CLEANER,
            Employer.Rule.SECURITY,
        ],
    },
    'security': {
        name: "Le vieux",
        pass: "1234",
        rules: [
            Employer.Rule.SECURITY,
        ],
    },
} as const satisfies Record<string, Employer.Type>;
