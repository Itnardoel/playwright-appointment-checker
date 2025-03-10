# Playwright Appointment Checker

Este script utiliza [Playwright](https://playwright.dev/) para automatizar la verificación de turnos médicos en una página web. Está desarrollado con **Node.js y TypeScript** y se ejecuta de manera periódica usando **cron**. Si encuentra turnos disponibles, manda una notificación por **Telegram** y corta la ejecución del cron.

## Requisitos

- Tener instalado Node.js (versión 18 o superior recomendada)
- Tener instalado [pnpm](https://pnpm.io/)
- Archivo `.env` con los datos de acceso

## Instalación

1. Clonar el repositorio:
   ```sh
   git clone https://github.com/Itnardoel/playwright-appointment-checker.git
   cd playwright-turnos-checker
   ```
2. Instalar las dependencias y los navegadores de Playwright:
   ```sh
   pnpm install
   ```
   *(Gracias al script `postinstall` en el `package.json`, Playwright va a instalar automáticamente los navegadores necesarios.)*

## Configuración

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
BASE_URL=URL_de_la_página

DNI=tu_dni
PASS=tu_contraseña

TURN_SELECTION_TYPE=tipo_de_selección_de_turno (PROFESIONAL o ESPECIALIDAD)
SELECTION_CRITERIA=criterio_de_búsqueda_de_turno (PEREZ, JUAN JOSE o CLINICA MEDICA)
PRACTICE_TYPE=tipo_de_práctica_médica (CONSULTA MEDICA)

TELEGRAM_BOT_TOKEN=token_de_tu_bot_de_Telegram
TELEGRAM_CHAT_ID=ID_del_chat_donde_se_enviarán_las_notificaciones
```

## Uso

Para ejecutar el script:
```sh
pnpm start
```

El script va a iniciar sesión en la página, revisar si hay turnos disponibles y mostrar el resultado por consola. Si encuentra turnos, te avisa por Telegram y termina la ejecución del cron.

## Notas

- Asegurate de que Playwright tenga acceso al navegador necesario.
- Si cambia la estructura de la página (como los botones o formularios), capaz haya que actualizar los selectores en el código.
- Configurá bien el bot de Telegram para poder recibir las notificaciones.
