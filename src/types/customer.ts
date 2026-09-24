namespace Customer {

    export type Id = string;

    export type Type = {
        name: string,
        rules: [string, ...string[]],
        enterprise?: string,
        ifu?: number,
        tel?: number,
    }
}

export default Customer;
