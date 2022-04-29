import {mutations, getters} from './Store.js';
import Result from "./Result.js";

//init addEventListener for input
let result = new Result;
const MAX_COST_NUMBER = 100000000;
const MIN_COST_NUMBER = 375000;

//radio btn
document.querySelectorAll('.radio-btn__wrap .radio-btn input[type="radio"]').forEach(el=>{
	el.addEventListener('change', (val)=>{
		mutations.setTariff(val.target.value);
		result.setTariff(val.target.value, getters.getSalaryCard());

		setResultMonthlyPayment()
	})
})

//switch salary-card
let attentionSalaryCard = document.querySelector('.attention__salary-card')

document.querySelector('.switch #salary-card').addEventListener('change', el => {
	mutations.setSalaryCard(el.target.checked)
	result.setTariff(getters.getTariff(), el.target.checked)

	if (el.target.checked) attentionSalaryCard.classList.add('show')

	setResultMonthlyPayment()
})

//attention__salary-card
document.querySelector('.attention__salary-card .attention__icon-close svg')
		.addEventListener('click', ()=>{
			attentionSalaryCard.classList.remove('show')
		})

//input rage-cost
let inputCost = document.querySelector('.input-rage .input-rage__input-wrap #input-cost')
let rageCost = document.querySelector('.input-rage .input-rage__range-wrap #range-cost')

/* @params [str] строка в которой будут удаленны все не числовые значения */
function validNumber(str) { return str.replace(/[^\d]/g,''); }

/* @params [number] число которое будет преобразовано в форматированное число; 1000000 => '1 000 000' */
function replaceNumberDigits(number) { return (number).toLocaleString('ru') }

/* @params [cost] число */
function setResultCost (cost) {
	mutations.setCost(cost)
	setDefaultDepositValues(cost)
}

function validCostNumber() {
	let currentNumber = Number(validNumber(this.value).replace(' ','')) //удаляем пробелы и приводим к числу

	if(currentNumber>MAX_COST_NUMBER) {
		this.value = '100 000 000'
		rageCost.value = '100000000'
		setResultCost(100000000)
		return;
	}
	if(currentNumber<MIN_COST_NUMBER) {
		this.value = '375 000'
		rageCost.value = '375000'
		setResultCost(375000)
		return;
	}

	this.value = replaceNumberDigits(currentNumber)
	rageCost.value = currentNumber.toString().replace(' ', '')

	setResultCost(currentNumber)
}

inputCost.addEventListener('keyup', validCostNumber)
rageCost.addEventListener('change', el => {
	let currentNumber = replaceNumberDigits(Number(validNumber(el.target.value).replace(' ','')))
	inputCost.value = currentNumber

	setResultCost(Number(validNumber(el.target.value).replace(' ','')))
})

//input deposit
let inputDeposit = document.querySelector('.input-rage .input-rage__input-wrap #input-initial')
let rageDeposit = document.querySelector('.input-rage .input-rage__range-wrap #range-initial')
let elMinDeposit = document.querySelector('.input-rage__initial  .input-rage__range-wrap-cost-wrap .cost-min')
let elMaxDeposit = document.querySelector('.input-rage__initial .input-rage__range-wrap-cost-wrap .cost-max')

function setDefaultDepositValues(cost) {
	let maxCost = cost - 300000;
	let minCost = cost * 0.2;

	rageDeposit.max = maxCost;
	rageDeposit.value = rageDeposit.min = inputDeposit.value = minCost;

	if (minCost<1000000) elMinDeposit.innerHTML = `${(minCost / 1000).toFixed(1)} тыс.₽`
	else elMinDeposit.innerHTML = `${(minCost / 1000000).toFixed(1)} млн.₽`

	if (maxCost<1000000) elMaxDeposit.innerHTML = `${(maxCost / 1000).toFixed(1)} тыс.₽`
	else elMaxDeposit.innerHTML = `${(maxCost / 1000000).toFixed(1)} млн.₽`

	setResultDeposit(cost, rageDeposit.value)
}

function setResultDeposit (cost, deposit) {
	mutations.setDeposit(deposit)
	result.setCost(cost, Number(deposit))
	setResultMonthlyPayment()
}

function validDepositNumber() {
	let maxDeposit = Number(rageDeposit.max);
	let minDeposit = Number(rageDeposit.min);
	let currentNumber = Number(validNumber(this.value).replace(' ','')) //удаляем пробелы и приводим к числу


	if(currentNumber>maxDeposit) {
		this.value = replaceNumberDigits(maxDeposit)
		rageDeposit.value = maxDeposit
		setResultDeposit(getters.getCost(), maxDeposit)
		return;
	}
	if(currentNumber<minDeposit) {
		this.value = replaceNumberDigits(minDeposit)
		rageDeposit.value = minDeposit
		setResultDeposit(getters.getCost(), minDeposit)
		return;
	}

	this.value = replaceNumberDigits(currentNumber)
	rageDeposit.value = currentNumber.toString().replace(' ', '')

	setResultDeposit(getters.getCost(), currentNumber)
}

inputDeposit.addEventListener('keyup', validDepositNumber)
rageDeposit.addEventListener('change', el => {
	let currentNumber = replaceNumberDigits(Number(el.target.value.replace(' ','')))
	inputDeposit.value = currentNumber

	setResultDeposit(getters.getCost(), Number(el.target.value.replace(' ','')))
})

//input loan-term
let inputLoanTerm = document.querySelector('.input-rage .input-rage__input-wrap #input-loan-term')
let rageLoanTerm = document.querySelector('.input-rage .input-rage__range-wrap #range-loan-term')

function validLoanTermNumber() {
	let currentYears = Number(this.value)

	if(currentYears<1||''||0) {
		this.value = 1
		rageLoanTerm.value = 1
		mutations.setLoanTerm(1)
		setResultMonthlyPayment()
		return;
	}
	if(currentYears>30) {
		this.value = 30
		rageLoanTerm.value = 30
		mutations.setLoanTerm(30)
		setResultMonthlyPayment()
		return;
	}

	rageLoanTerm.value = currentYears
	mutations.setLoanTerm(currentYears)

	setResultMonthlyPayment()
}


inputLoanTerm.addEventListener('keyup', validLoanTermNumber)
rageLoanTerm.addEventListener('change', el => {
	inputLoanTerm.value = el.target.value
	mutations.setLoanTerm(Number(el.target.value))
	setResultMonthlyPayment()
})

function setResultMonthlyPayment () {
	let currentCost = getters.getCost()??375000
	let currentDeposit = getters.getDeposit()??75000
	let currentYears = getters.getLoanTerm()??1
	let currentTariff = getters.getTariff()??'base'
	let currentSalaryCard = getters.getSalaryCard()??false

	let percent
	let amount = currentCost - currentDeposit

	switch (currentTariff) {
		case 'base': percent = 18.6
			break
		case 'eastern': percent = 0.1
			break
		case 'military': percent = 17.9
			break
	}

	result.setMonthlyPayment(amount, currentYears, percent, currentSalaryCard)
}

