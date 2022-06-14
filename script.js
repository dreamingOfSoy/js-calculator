'use strict';

// Selectors

const btns = document.querySelectorAll('.btn');
const display = document.querySelector('.display');
const btnSection = document.querySelector('.btn-section');
const displaySectionFirstNum = document.querySelector('.display-first-num');
const displaySectionOpOne = document.querySelector('.display-operator-one');
const displaySectionSecondNum = document.querySelector('.display-second-num');
const displaySectionOpTwo = document.querySelector('.display-operator-two');
const btnDelete = document.querySelector('.btn-delete');
const btnClear = document.querySelector('.btn-clear');
const btnDot = document.querySelector('.btn-dot');
const btnEq = document.querySelector('.btn-eq');

// Initiators - where the numbers are all stored during calculations.

let numOne = [];
let operator = [];
let numTwo = [];
let answer;
btnSection.textContent = 0;

// Helper functions

const clear = function () {
  // Clears all the initators
  btnDot.disabled = false;
  btnSection.textContent = 0;
  displaySectionFirstNum.textContent = '';
  displaySectionSecondNum.textContent = '';
  displaySectionOpTwo.textContent = '';
  displaySectionOpOne.textContent = '';
  numOne = [];
  operator = [];
  numTwo = [];
  answer = '';
};

const stopDoubleDecimal = function (num, e) {
  // Pushed the decimal to the array but then disables the button to stop multiple decimals.
  num.push(e.target.dataset.value);
  btnDot.disabled = true;
};

const formatSum = function () {
  answer = buildSum(numOne, operator, numTwo);
  numOne = answer;
  numTwo = [];
};

// These two functions format and assign the two number involved in the equation.

const assignNumberOne = function (e) {
  // Stops the decimal from being pressed twice.
  if (e.target.dataset.value === '.') {
    stopDoubleDecimal(numOne, e);
  } else {
    // If the number is an array its the first number calculated, if it's a number, its the sum of an equasion and therefore can be combined with additionally pressed numbers.
    if (Array.isArray(numOne)) {
      numOne.push(+e.target.dataset.value);
    } else {
      numOne = [numOne, +e.target.dataset.value];
    }
  }
  console.log(numOne);
};

const assignNumberTwo = function (e) {
  e.target.dataset.value === '.'
    ? stopDoubleDecimal(numTwo, e)
    : numTwo.push(+e.target.dataset.value);

  console.log(numTwo);
};

// This function assigns the operators correctly.

const assignOperator = function (e) {
  // If another operator is pressed instead of equals it calculates the current equation the displays that answer ready for the next one.
  if (operator.length > 0) {
    // Returns the displayed number to zero after a calculation to signify the calculator is ready to input a new number.
    if (numTwo.length === 0) {
      btnSection.textContent = 0;
      return;
    }

    formatSum();
    console.log(answer);
  }

  // Return operator array to zero to prevent doubling up on operators.
  operator = [];
  // Re-enables the decimal to use in the second number.
  btnDot.disabled = false;
  // Adds the desired operator to the equasion.
  operator.push(e.target.dataset.value);

  // If there is previous sums displaying, this removes them from the display.
  displaySectionSecondNum.textContent = '';
  displaySectionOpTwo.textContent = '';

  // Checks if number is an array or a number to decide what to do, then assigns the number.
  Array.isArray(numOne)
    ? (displaySectionFirstNum.textContent = numOne.join(''))
    : (displaySectionFirstNum.textContent = numOne);

  // Displays the numbers correctly formatted in the display.
  displaySectionOpOne.textContent = operator.join('');
  btnSection.textContent = 0;

  console.log(operator);
};

// This function calculates the equation currently displayed.

const equals = function () {
  // If equals is pressed before an operator, prevents breaking the calculator.
  if (numTwo.length === 0) {
    numOne = [];
    btnSection.textContent = 0;
    return;
  }

  // Displays the numbers correctly formatted in the display.
  displaySectionSecondNum.textContent = numTwo.join('');
  displaySectionOpTwo.textContent = '=';

  // Computes the correct sum and returns the operator array to 0 to start again.
  formatSum();
  operator = [];

  // Prevents dividing by 0.
  !isFinite(answer)
    ? (btnSection.textContent = 'to infinity and beyond!')
    : (btnSection.textContent = answer);

  console.log(answer);
};

const deleteBtn = function () {
  // Stop from removing too many numbers.
  btnSection.textContent.length <= 1
    ? (btnSection.textContent = 0)
    : (btnSection.textContent = btnSection.textContent.slice(0, -1));

  // Removes numbers from the number one array.
  if (operator.length === 0)
    Array.isArray(numOne) ? (numOne = numOne.slice(0, -1)) : clear();

  // Removes numbers from the number two array.
  if (operator.length > 0) numTwo = numTwo.slice(0, -1);

  // Stops decimal button being pressed twice after pressing delete but re-enables if decimal is deleted also.
  if (!btnSection.textContent.includes('.')) btnDot.disabled = false;
};

const clearBtn = function () {
  clear();
};

// This function controls the whole calculator. It retreives the value of each button pressed and depending on the combination decides the specific outcome.

const getBtnValue = function (e) {
  // This sees if initially there is a zero in the display, and if there is, it removes this to make room for the numbers being pressed.
  if (btnSection.textContent === '0') btnSection.textContent = '';

  // This adds only the numbers one after the other in the display section when pressed
  if (e.target.classList.contains('number-btn'))
    btnSection.textContent += e.target.dataset.value;

  if (e.target.classList.contains('number-btn') && operator.length === 0)
    assignNumberOne(e);

  if (
    e.target.dataset.value === 'x' ||
    e.target.dataset.value === '%' ||
    e.target.dataset.value === '-' ||
    e.target.dataset.value === '+'
  )
    assignOperator(e);

  if (e.target.classList.contains('number-btn') && operator.length > 0)
    assignNumberTwo(e);

  if (e.target.dataset.value === '=') equals();

  if (e.target.classList.contains('btn-delete')) deleteBtn();

  if (e.target.classList.contains('btn-clear')) clearBtn();
};

// Specific operator functions

const multiply = function (numOne, numTwo) {
  return numOne * numTwo;
};

const divide = function (numOne, numTwo) {
  return numOne / numTwo;
};

const add = function (numOne, numTwo) {
  return numOne + numTwo;
};

const subtract = function (numOne, numTwo) {
  return numOne - numTwo;
};

const buildSum = function (numberOne, operator, numberTwo) {
  console.log(numberOne, operator, numberTwo);

  // Here we define a new local variable first for the number one, as it could be inputted as either an array or a number depending on the stage of the equation. Doing this allows the correct method of formatting and for it to be reassigned mid sum.

  let numOne;

  Array.isArray(numberOne)
    ? (numOne = +numberOne.join(''))
    : (numOne = numberOne);

  // Define new variables to convert them to numbers as they come in as arrays.

  const op = operator.join('');
  const numTwo = +numberTwo.join('');
  console.log(numOne, op, numTwo);

  // Depending on the operator in the equation, call the correct function

  if (op === 'x') return multiply(numOne, numTwo);

  if (op === '%') return divide(numOne, numTwo);

  if (op === '-') return subtract(numOne, numTwo);

  if (op === '+') return add(numOne, numTwo);
};

// Event listener

btns.forEach(btn => {
  btn.addEventListener('click', getBtnValue);
});
