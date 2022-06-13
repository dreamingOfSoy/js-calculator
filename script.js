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

let numOne = [];
let operator = [];
let numTwo = [];
let answer;
btnSection.textContent = 0;

const getBtnValue = function (e) {
  if (btnSection.textContent === '0') {
    btnSection.textContent = '';
  }

  if (e.target.classList.contains('number-btn')) {
    btnSection.textContent += e.target.dataset.value;
  }

  if (e.target.classList.contains('number-btn') && operator.length === 0) {
    if (e.target.dataset.value === '.') {
      numOne.push(e.target.dataset.value);
      btnDot.disabled = true;
    } else {
      if (Array.isArray(numOne)) {
        numOne.push(+e.target.dataset.value);
      } else {
        numOne = [numOne, +e.target.dataset.value];
      }
    }
    console.log(numOne);
  }

  if (
    e.target.dataset.value === 'x' ||
    e.target.dataset.value === '%' ||
    e.target.dataset.value === '-' ||
    e.target.dataset.value === '+'
  ) {
    if (operator.length > 0) {
      if (numTwo.length === 0) {
        btnSection.textContent = 0;
        return;
      }
      answer = buildSum(numOne, operator, numTwo);
      numOne = answer;
      numTwo = [];
      console.log(answer);
    }
    operator = [];
    btnDot.disabled = false;
    operator.push(e.target.dataset.value);

    displaySectionSecondNum.textContent = '';
    displaySectionOpTwo.textContent = '';

    if (Array.isArray(numOne)) {
      displaySectionFirstNum.textContent = numOne.join('');
    } else {
      displaySectionFirstNum.textContent = numOne;
    }

    displaySectionOpOne.textContent = operator.join('');
    btnSection.textContent = 0;

    console.log(operator);
  }

  if (e.target.classList.contains('number-btn') && operator.length > 0) {
    if (e.target.dataset.value === '.') {
      btnDot.disabled = true;
      numTwo.push(e.target.dataset.value);
    } else {
      numTwo.push(+e.target.dataset.value);
    }
    console.log(numTwo);
  }

  if (e.target.dataset.value === '=') {
    if (numTwo.length === 0) return;

    displaySectionSecondNum.textContent = numTwo.join('');
    displaySectionOpTwo.textContent = '=';

    answer = buildSum(numOne, operator, numTwo);
    numOne = answer;
    numTwo = [];
    operator = [];

    if (!isFinite(answer)) {
      btnSection.textContent = 'to infinity and beyond!';
    } else {
      btnSection.textContent = answer;
    }

    console.log(answer);
  }

  if (e.target.classList.contains('btn-delete')) {
    btnDot.disabled = false;

    if (btnSection.textContent.length <= 1) {
      btnSection.textContent = 0;
    } else {
      btnSection.textContent = btnSection.textContent.slice(0, -1);
    }

    if (operator.length === 0) {
      if (Array.isArray(numOne)) {
        numOne = numOne.slice(0, -1);
      } else {
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
      }

      console.log(numOne);
    }

    if (operator.length > 0) {
      numTwo = numTwo.slice(0, -1);
      console.log(numTwo);
    }

    console.log(btnSection.textContent);
  }

  if (e.target.classList.contains('btn-clear')) {
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
  }
};

const buildSum = function (numberOne, operator, numberTwo) {
  console.log(numberOne, operator, numberTwo);

  let numOne;

  if (Array.isArray(numberOne)) {
    numOne = +numberOne.join('');
  } else {
    numOne = numberOne;
  }

  const op = operator.join('');
  const numTwo = +numberTwo.join('');
  console.log(numOne, op, numTwo);

  if (op === 'x') {
    return numOne * numTwo;
  }

  if (op === '%') {
    return numOne / numTwo;
  }

  if (op === '-') {
    return numOne - numTwo;
  }

  if (op === '+') {
    return numOne + numTwo;
  }
};

btns.forEach(btn => {
  btn.addEventListener('click', getBtnValue);
});
