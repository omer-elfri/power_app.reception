import { uniqueId } from "../tools/tools";
import Employer from "../types/employer";

export const employers_datas: Employer.Type[] = uniqueId([
    {
        name: "Hilary",
        rules: [
            Employer.Rule.RECEPTIONIST,
        ],
    },
    {
        name: "Romuald",
        rules: [
            Employer.Rule.RECEPTIONIST,
        ],
    },
    {
        name: "Théophane",
        rules: [
            Employer.Rule.CLEANER,
        ],
    },
    {
        name: "Albérique",
        rules: [
            Employer.Rule.CLEANER,
        ],
    },
    {
        name: "Alexis",
        rules: [
            Employer.Rule.CLEANER,
            Employer.Rule.SECURITY,
        ],
    },
    {
        name: "Le vieux",
        rules: [
            Employer.Rule.SECURITY,
        ],
    },
] as const, 'name');
