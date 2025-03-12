const ACCOUNT_TYPES = Object.freeze({
  CASH_IN_HAND_GL:"CashInHandGL",
  INCOME_GL: "IncomeGl",
  DRAWING_GL: "DrawingGL",
  INVESTMENT_GL: "InvestmentGL",
})
const GL_TYPES = Object.freeze({
  ASSET_GL:"ASSET",
  EXPENSE_GL : "EXPENSE",
  LIABILITY_GL : "LIABILITY",
  INCOME_GL: "INCOME",
});

const BaseLocation = Object.freeze({
  LATITUDE: 28.652035446998084,
  LONGITUDE:-81.53080236001611
})
module.exports = {GL_TYPES,ACCOUNT_TYPES,BaseLocation};