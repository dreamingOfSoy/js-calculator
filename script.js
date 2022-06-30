'use strict';

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
const placeholder = document.querySelector('.placeholder');

let numOne = [];
let operator = [];
let numTwo = [];
let answer;

const clear = function () {
  btnDot.disabled = false;
  btnSection.textContent = '';
  addPlaceholder();
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
  if (typeof num === 'number') {
    const number = num.toString().split('');
    if (number.includes('.')) {
      btnSection.textContent = numOne;
      return;
    }
    numOne = [number, e.target.dataset.value];
    btnDot.disabled = true;
    return;
  }
  num.push(e.target.dataset.value);
  btnDot.disabled = true;
};

const formatSum = function () {
  answer = buildSum(numOne, operator, numTwo);
  numOne = answer;
  numTwo = [];
};

const addZeroBeforeDecimal = function (num, e) {
  const number = num;
  if (
    e.target.textContent === '.' &&
    (number[0] === '.' || number.length === 0)
  ) {
    numOne.splice(0, 0, 0);
    btnSection.textContent = '0.';
  }
};

const assignNumberOne = function (e) {
  console.log(numOne);
  if (e.target.dataset.value === '.') {
    stopDoubleDecimal(numOne, e);
  } else {
    if (Array.isArray(numOne)) {
      numOne.push(+e.target.dataset.value);
    } else {
      numOne = [numOne, +e.target.dataset.value];
    }
  }
  addZeroBeforeDecimal(numOne, e);
};

const assignNumberTwo = function (e) {
  addZeroBeforeDecimal(numTwo, e);
  e.target.dataset.value === '.'
    ? stopDoubleDecimal(numTwo, e)
    : numTwo.push(+e.target.dataset.value);
};

const assignOperator = function (e) {
  if (operator.length > 0) {
    if (numTwo.length === 0) {
      btnSection.textContent = 0;
      return;
    }
    formatSum();
  }
  operator = [];
  btnDot.disabled = false;
  operator.push(e.target.dataset.value);
  displaySectionSecondNum.textContent = '';
  displaySectionOpTwo.textContent = '';
  Array.isArray(numOne)
    ? (displaySectionFirstNum.textContent = numOne.join(''))
    : (displaySectionFirstNum.textContent = numOne);
  displaySectionOpOne.textContent = operator.join('');
  btnSection.textContent = '';
  addPlaceholder();
};

const equals = function () {
  if (numTwo.length === 0) {
    numOne = [];
    addPlaceholder();
    return;
  }
  displaySectionSecondNum.textContent = numTwo.join('');
  displaySectionOpTwo.textContent = '=';
  formatSum();
  operator = [];
  !isFinite(answer)
    ? (btnSection.textContent = 'to infinity and beyond!')
    : (btnSection.textContent = answer);
};

const deleteBtn = function () {
  if (btnSection.textContent.length <= 1) {
    btnSection.textContent = '';
    addPlaceholder();
  } else {
    btnSection.textContent = btnSection.textContent.slice(0, -1);
  }
  if (operator.length === 0)
    Array.isArray(numOne) ? (numOne = numOne.slice(0, -1)) : clear();
  if (operator.length > 0) numTwo = numTwo.slice(0, -1);
  if (!btnSection.textContent.includes('.')) btnDot.disabled = false;
};

const clearBtn = function () {
  clear();
};

const removePlaceholder = function () {
  placeholder.classList.add('displaynone');
  btnSection.classList.remove('displaynone');
};

const addPlaceholder = function () {
  placeholder.classList.remove('displaynone');
  btnSection.classList.add('displaynone');
};

const getBtnValue = function (e) {
  if (
    e.target.classList.contains('number-btn') &&
    btnSection.textContent === ''
  ) {
    removePlaceholder();
  }
  if (e.target.dataset.value === '0' && numOne[0] === 0 && numOne.length === 1)
    return;
  if (e.target.dataset.value === '.') {
    if ([numOne].includes('.') || [numTwo].includes('.')) return;
  }
  if (
    numOne.length === 0 &&
    (e.target.dataset.value === 'x' ||
      e.target.dataset.value === '%' ||
      e.target.dataset.value === '-' ||
      e.target.dataset.value === '+')
  ) {
    return;
  }

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
  let numOne;
  Array.isArray(numberOne)
    ? (numOne = +numberOne.join(''))
    : (numOne = numberOne);
  const op = operator.join('');
  const numTwo = +numberTwo.join('');
  if (op === 'x') return multiply(numOne, numTwo);
  if (op === '%') return divide(numOne, numTwo);
  if (op === '-') return subtract(numOne, numTwo);
  if (op === '+') return add(numOne, numTwo);
};

btns.forEach(btn => {
  btn.addEventListener('click', getBtnValue);
});
