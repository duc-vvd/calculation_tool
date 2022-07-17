import Big from "big.js";

function calculate(numberOne, numberTwo, operator) {
  try {
    const n1 = new Big(numberOne);
    const n2 = new Big(numberTwo);

    if (operator === "+") {
      return parseFloat(n1.plus(n2).toString());
    }
    if (operator === "-") {
      return parseFloat(n1.minus(n2).toString());
    } else if (operator === "*") {
      return parseFloat(n1.times(n2).toString());
    } else if (operator === "/") {
      return parseFloat(n1.div(n2).toString());
    } else if (operator === "%") {
      return numberOne % numberTwo;
    }
    return 0;
  } catch (error) {
    console.error(
      `utils - calculate - numberOne: ${numberOne}, numberTwo: ${numberTwo}, operator: ${operator} - error: ${error.message})}`
    );
  }
  return 0;
}

export { calculate };
