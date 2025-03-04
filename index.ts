import { chromium } from 'playwright'
import { format } from '@formkit/tempo'
import { CronJob } from 'cron'
import { styleText } from 'util'

process.loadEnvFile()

const job = new CronJob(
  '*/30 * * * *', // cronTime every 30 min
  () => getAppointment(),
  null, // onComplete
  true // start
)

getAppointment()

async function getAppointment() {
  const browser = await chromium.launch()

  const page = await browser.newPage()

  await page.goto(`${process.env.BASE_URL}`)

  const loginForm = page.locator('#REGISTRO-PASO-1')

  const loginDoc = loginForm.getByPlaceholder('N° Documento')
  const loginPass = loginForm.getByPlaceholder('Clave')
  const loginButton = loginForm.getByRole('button', { name: 'Ingresar' })

  await loginDoc.fill(`${process.env.DNI}`)
  await loginPass.fill(`${process.env.PASS}`)
  await loginButton.click()

  const appointmentButton = page
    .locator('#MENU-Afiliados')
    .getByRole('link', { name: 'Turnos' })
  await appointmentButton.click()

  const newAppointmentButton = page.getByRole('button', {
    name: 'Solicitar Turno',
  })
  await newAppointmentButton.click()

  await page.getByText('Por favor seleccionar:').locator('nth=0').click()

  const appointmentBy = page.getByRole('option', { name: `${process.env.TURN_SELECTION_TYPE}` })
  await appointmentBy.click()

  await page.getByText('Profesional / Especialidad:').locator('nth=0').click()

  const appointmentCategory = page.getByRole('option', {
    name: `${process.env.SELECTION_CRITERIA}`,
  })
  await appointmentCategory.click()

  await page.getByText('Práctica:').locator('nth=0').click()

  const appointmentType = page.getByRole('cell', {
    name: `${process.env.PRACTICE_TYPE}`,
  })
  await appointmentType.click()

  let noAppointments: boolean

  try {
    await page
      .locator('#mensajePracticaSinTurnoDiv div')
      .waitFor({ state: 'visible', timeout: 3000 })
    noAppointments = await page.isVisible('#mensajePracticaSinTurnoDiv div')
  } catch (error) {
    noAppointments = false
  }

  const date = new Date()

  if (noAppointments) {
    console.log(
      styleText(
        'bgRedBright',
        `No hay turnos disponibles siendo ${format(date, {
          date: 'full',
          time: 'short',
        })}`
      )
    )
  } else {
    await fetch(
      `https://api.telegram.org/bot${
        process.env.TELEGRAM_BOT_TOKEN
      }/sendMessage?chat_id=${
        process.env.TELEGRAM_CHAT_ID
      }&text=${encodeURIComponent(
        `Hay turnos disponibles siendo ${format(date, {
          date: 'full',
          time: 'short',
        })}`
      )}`
    )
    console.log(
      styleText(
        'bgGreenBright',
        `Hay turnos disponibles siendo ${format(date, {
          date: 'full',
          time: 'short',
        })}`
      )
    )
    job.stop()
  }

  browser.close()
}
