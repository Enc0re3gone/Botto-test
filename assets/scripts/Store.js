export const state = () => ({
	tariff: null,
	salaryCard: false,
	cost: null,
	deposit: null,
	loanTerm: null
});

export const mutations = {
	setTariff(value) { state.tariff = value },
	setSalaryCard(value) { state.salaryCard = value },
	setCost(value) { state.cost = value },
	setDeposit(value) { state.deposit = value },
	setLoanTerm(value) { state.loanTerm = value }
};

export const getters = {
	getTariff: () => state.tariff,
	getSalaryCard: () => state.salaryCard,
	getCost: () => state.cost,
	getDeposit: () => state.deposit,
	getLoanTerm: () => state.loanTerm,
}
