const dayjs = require('dayjs')

const mail = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.USER_EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
}
const invoice = {
  fullname: process.env.INVOICE_FULLNAME,
  address1: process.env.INVOICE_ADDRESS_1,
  address2: process.env.INVOICE_ADDRESS_2,
  address3: process.env.INVOICE_ADDRESS_3,
  billingAddress1: process.env.INVOICE_BILLING_ADDRESS_1,
  billingAddress2: process.env.INVOICE_BILLING_ADDRESS_2,
  billingAddress3: process.env.INVOICE_BILLING_ADDRESS_3,
  billingAddress4: process.env.INVOICE_BILLING_ADDRESS_4,
  phone: process.env.INVOICE_PHONE,
  itemDescription: process.env.INVOICE_ITEM_DESCRIPTION,
  quantity: process.env.INVOICE_QUANTITY,
  invoiceRate: process.env.INVOICE_ITEM_RATE,
  issueDate: dayjs().format('DD/MM/YYYY'),
  amountPaid: process.env.INVOICE_AMOUNT_PAID,
  pan: process.env.PAN,
  bannkName: process.env.BANK_NAME,
  branchName: process.env.BANK_BRANCH_NAME,
  swiftCode: process.env.BANK_SWIFT_CODE,
  ifsc: process.env.BANK_IFSC,
  bankAccount: process.env.BANK_ACCOUNT,
  bankAccountName: process.env.BANK_ACCOUNT_NAME,
}

invoice.lineTotal = Number(invoice.quantity) * Number(invoice.invoiceRate)
invoice.total = invoice.lineTotal
invoice.amountDue = invoice.total - Number(invoice.amountPaid)
// Serial is calculated as number of months from start date till now
invoice.invoiceSerial = dayjs().diff(process.env.INVOICE_SERIAL_START, 'month')

let previousMonth = dayjs().subtract(1, 'month')
invoice.period = `${previousMonth
  .startOf('month')
  .format('DD/MM/YYYY')} to ${previousMonth
  .endOf('month')
  .format('DD/MM/YYYY')}`

module.exports = { mail, invoice }
