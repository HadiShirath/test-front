export const calculatePercentages = (dataset) => {
    const total = dataset.reduce((sum, value) => sum + value, 0);

    if (total === 0) {
        return dataset.map(() => 0);
    }

    return dataset.map(value => {
        const percentage = (value / total) * 100;
        return parseFloat(percentage.toFixed(2));
    });
}