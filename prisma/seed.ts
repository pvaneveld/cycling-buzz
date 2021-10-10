import { PrismaClient, CountryCode, Cyclist } from '@prisma/client';
const prisma = new PrismaClient();

const cyclists: Omit<Cyclist, 'id' | 'createdAt'>[] = [
    {
        firstName: "Mathieu",
        lastName: "van der Poel",
        nationality: CountryCode.NLD,
    },
    {
        firstName: "Dylan",
        lastName: "Groenewegen",
        nationality: CountryCode.NLD,
    },
    {
        firstName: "Bauke",
        lastName: "Mollema",
        nationality: CountryCode.NLD,
    },
    {
        firstName: "Fabio",
        lastName: "Jakobsen",
        nationality: CountryCode.NLD,
    },
    {
        firstName: "Mike",
        lastName: "Teunissen",
        nationality: CountryCode.NLD,
    },
    {
        firstName: "Egan",
        lastName: "Bernal",
        nationality: CountryCode.COL,
    },
    {
        firstName: "Richard",
        lastName: "Carapaz",
        nationality: CountryCode.ECU,
    },
    {
        firstName: "Wout",
        lastName: "van Aert",
        nationality: CountryCode.BEL,
    },
    {
        firstName: "Jasper",
        lastName: "Stuyven",
        nationality: CountryCode.BEL,
    },
    {
        firstName: "Greg",
        lastName: "van Avermaet",
        nationality: CountryCode.BEL,
    },
    {
        firstName: "Remco",
        lastName: "Evenepoel",
        nationality: CountryCode.BEL,
    },
    {
        firstName: "Peter",
        lastName: "Sagan",
        nationality: CountryCode.SVK
    },
    {
        firstName: "Chris",
        lastName: "Froom",
        nationality: CountryCode.GBR,
    },
    {
        firstName: "Tadej",
        lastName: "Pogacar",
        nationality: CountryCode.SVN,
    },
    {
        firstName: "Primoz",
        lastName: "Roglic",
        nationality: CountryCode.SVN,
    },
];


(async () => {
    let id = 1;
    for (const cyclist of cyclists) {
        try {
            await prisma.cyclist.upsert({
                where: { id },
                update: cyclist,
                create: cyclist,
            });

            id++;
        } catch (error) {
            console.log(error);
        }
    }
})()