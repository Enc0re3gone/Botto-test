const LIVING_WAGE = 20000
export default class Result {
	setTariff(name = 'base', salaryCard = false) {
		switch (name) {
			case 'base': this.renderTariff(18.6, salaryCard)
				break
			case 'eastern': this.renderTariff(0.1, salaryCard)
				break
			case 'military': this.renderTariff(17.9, salaryCard)
				break
		}
	}
	renderTariff(percent, salaryCard) {
		let per = percent
		let elPer = document.querySelector('.calculator__result #percentage span')

		//Если тариф "Дальневосточная ипотека" и есть зарплатная карта Сбербанка тогда мы отнимаем 0.05%
		if (salaryCard) {
			per = per > 0.1 ? per -= .5 : per -= 0.05
		}

		elPer.innerHTML = `${per}%`
		this.setMonthlyPayment()
	}

	setCost(cost= 35000, deposit= 75000) {
		let amount = cost - deposit
		this.renderCost(amount)
	}
	renderCost(amount) {
		let elAmount = document.querySelector('.calculator__result #loan-amount span')
		elAmount.innerHTML = `${(amount).toLocaleString('ru')} ₽`
	}

	setMonthlyPayment(amount, years, percent, salaryCard) {
		let per = percent

		if (salaryCard) {
			per = per > 0.1 ? per -= .5 : per -= 0.05
		}

		let payment = ((amount/100*per)+amount)/(years*12)

		if (payment!==NaN) {
			this.renderMonthlyPayment(payment)
			this.renderRequiredIncome(payment)
		}
	}
	renderMonthlyPayment(amount) {
		let elMonthlyPayment = document.querySelector('.calculator__result #monthly-payment span')
		elMonthlyPayment.innerHTML = `${(amount).toLocaleString('ru')} ₽`
	}
	renderRequiredIncome(amount) {
		let elRequiredIncome = document.querySelector('.calculator__result #required-income span')
		elRequiredIncome.innerHTML = `${(amount+LIVING_WAGE).toLocaleString('ru')} ₽`
	}
}
