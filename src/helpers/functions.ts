interface IFunctions {
    randomNumber: (min: number, max: number) => number;
}

const Functions: IFunctions = {
    randomNumber: (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
export default Functions;