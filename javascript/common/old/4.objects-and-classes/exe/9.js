function solve(input) {
    const result = input
        .map((el) => JSON.parse(el))
        .reduce((acc, curr) => {
            const [key, value] = Object.entries(curr).flat();

            acc[key] = value;

            return acc;
        }, {});

    Object.entries(result)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .forEach(([term, definition]) => console.log(`Term: ${term} => Definition: ${definition}`));
}

solve([
    '{"Cup":"A small bowl-shaped container for drinking from, typically having a handle"}',
    '{"Cup":"B small bowl-shaped container for drinking from, typically having a handle"}',

    '{"Cake":"An item of soft sweet food made from a mixture of flour, fat, eggs, sugar, and other ingredients, baked and sometimes iced or decorated."}',

    '{"Watermelon":"The large fruit of a plant of the gourd family,with smooth green skin, red pulp, and watery juice."} ',

    '{"Music":"Vocal or instrumental sounds (or both) combined in such a way as to produce beauty of form, harmony, and expression of emotion."} ',

    '{"Art":"The expression or application of human creative skill and imagination, typically in a visual form such as painting or sculpture, producing works to be appreciated primarily for their beauty or emotional power."} ',
]);
