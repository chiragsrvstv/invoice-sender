const fs = require('fs').promises
const pdf = require('html-pdf')
const dayjs = require('dayjs')
const mustache = require('mustache')
const nodemailer = require('nodemailer')
require('dotenv').config()

const { mail: mailConfig, invoice: invoiceConfig } = require('./config')

async function invoiceSender() {
  try {
    const invoiceTemplate = await fs.readFile('./invoice.html', 'utf-8')
    const filename = `Invoice-${invoiceConfig.invoiceSerial}.pdf`

    // Fill the html invoice template with relevant config data
    const filledTemplate = mustache.render(invoiceTemplate, invoiceConfig)
    const mail = nodemailer.createTransport(mailConfig)

    // Generate pdf and send it as an attachment in the email
    pdf
      .create(filledTemplate, { height: '30.00cm', width: '26.59cm' })
      .toFile(`./pdf/${filename}`, (err, res) => {
        if (res) {
          return mail
            .sendMail({
              to: process.env.TO,
              subject: `Invoice-${invoiceConfig.invoiceSerial} for ${dayjs()
                .subtract(1, 'month')
                .format('MMMM-YYYY')}`,
              text: `Hello!\nHere is the invoice for the month of ${dayjs()
                .subtract(1, 'month')
                .format('MMMM')}.\nThanks.\n`,
              attachments: [
                {
                  filename,
                  path: `./pdf/${filename}`,
                },
              ],
              auth: {
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: process.env.ACCESS_TOKEN,
                expires: 3599,
              },
            })
            .catch((err) => console.error(err))
        }
        console.log(err)
      })
  } catch (error) {
    console.log(error)
  }
}

module.exports = invoiceSender