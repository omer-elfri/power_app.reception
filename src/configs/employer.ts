import Employer from "../types/employer";

export const employers_datas = [
    {
        id: "Hillary",
        sexe: 'Mme',
        name: "Hillary",
        pass: "1234",
        rules: [ 'RECEPTIONIST', ],
    },
    {
        id: "Romuald",
        sexe: 'Mr',
        name: "Romuald",
        pass: "1234",
        rules: [ 'RECEPTIONIST', ],
    },
    {
        id: "Théophane",
        sexe: 'Mr',
        name: "Théophane",
        pass: "1234",
        rules: [ 'CLEANER', ],
    },
    {
        id: "Albérique",
        sexe: 'Mme',
        name: "Albérique",
        pass: "1234",
        rules: [ 'CLEANER', ],
    },
    {
        id: "Alexis",
        sexe: 'Mr',
        name: "Alexis",
        pass: "1234",
        rules: [ 'CLEANER', 'SECURITY', ],
    },
    {
        id: "Le vieux",
        sexe: 'Mr',
        name: "Le vieux",
        pass: "1234",
        rules: [ 'SECURITY', ],
    },
] as Employer.Type[];
