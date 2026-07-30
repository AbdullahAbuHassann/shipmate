

# shipmate

Convierte los issues de GitHub en pull requests. Tu equipo describe lo que quiere en lenguaje claro, y Claude se encarga de todo, desde la aclaración de detalles hasta el código y las pruebas.

---

## El flujo completo

### 1. Abre un issue

Rellénalo en lenguaje claro (etiquétalo como mejora o corrección de error; los usuarios no técnicos no deberían crear nuevas funcionalidades). `@claude` se incluye automáticamente. No hace falta escribirlo.

Claude responde en aproximadamente un minuto con preguntas aclaratorias.

### 2. Responde a las preguntas de Claude

Responde en el hilo del issue. En lenguaje claro. Claude intenta completar detalles que afectarían cómo construye la funcionalidad. Una vez que tenga suficiente información, lo indicará.

### 3. `@claude plan`

Comenta `@claude plan` en el issue. Claude leerá primero la especificación relevante en `.spec-workflow/specs/`, y luego:
- Leerá la base de código
- Redactará un plan de implementación
- Publicará un resumen en lenguaje claro de lo que va a construir y qué archivos modificará

Revisa el plan. Pide cambios si algo no parece correcto. Cuando estés satisfecho, continúa.

### 4. `@claude implement`

Comenta `@claude implement`. Claude se encargará de:
- Escribir el código
- Ejecutar las pruebas y el linting
- Abrir un pull request

Tan pronto como se abra el PR, se ejecutarán en paralelo dos revisiones automatizadas:
- **Revisión de código** — errores lógicos, calidad del código, cumplimiento de los estándares del proyecto
- **Revisión de seguridad** — OWASP Top 10, secretos en código duro, vulnerabilidades de inyección

Si alguna revisión marca un problema, puedes responder al comentario inline con `@claude fix this` y Claude aplicará una corrección en la misma rama.

### 5. Obtén la URL de vista previa

Railway despliega cada PR automáticamente. Una vez que se abre el PR, Railway publica una URL de vista previa como comentario en el PR. Esto suele tardar entre 1 y 2 minutos.

### 6. `@claude test <url>`

Comenta `@claude test https://your-app-pr-42.up.railway.app` en el PR o issue. Claude navegará por la URL de vista previa utilizando un navegador real — haciendo clic, llenando formularios, tomando capturas de pantalla — y publicará un informe con lo que encontró.

### 7. Revisa y fusiona

Revisa el PR. Si todo parece correcto, fusionalo.

---

## Configuración

Aproximadamente 10 minutos. Instrucciones completas en [SETUP.md](SETUP.md).

1. Haz clic en **"Use this template"** para crear tu propia copia de este repositorio
2. Agrega tu secreto `CLAUDE_CODE_OAUTH_TOKEN` a GitHub
3. Edita `.claude/CLAUDE.md` para describir el stack y las convenciones de tu proyecto
4. Agrega los comandos de instalación de dependencias a `.github/workflows/claude-issues.yml`
5. Conecta Railway para los despliegues de vista previa de PR

---

## Qué incluye

```
├── .github/
│   ├── workflows/
│   │   ├── claude-issues.yml        # Maneja todos los comandos @claude
│   │   ├── ci.yml                   # Ejecuta lint + pruebas en cada PR
│   │   ├── pr-review.yml            # Revisión automática de código en cada PR
│   │   └── pr-security-review.yml   # Revisión automática de seguridad en cada PR
│   └── ISSUE_TEMPLATE/
│       ├── feature_request.yml      # Formulario de solicitud de funcionalidad (dispara automáticamente @claude)
│       └── bug_report.yml           # Formulario de informe de errores (dispara automáticamente @claude)
├── .claude/
│   ├── CLAUDE.md                    # Convenciones de tu proyecto — personalízalo
│   └── commands/                    # Comandos con barra (/) usados internamente por Claude
├── .spec-workflow/
│   └── specs/                       # Una especificación por funcionalidad — la fuente de verdad
│       ├── todo-feature.md          # Qué hace la funcionalidad de tareas (reemplázala con la tuya)
│       └── ui-and-design.md         # Decisiones visuales: colores, diseño, componentes
├── .agents/
│   └── plans/                       # Los archivos de planificación se guardan y commiten aquí
├── public/                          # Aplicación de ejemplo (lista de tareas en HTML/CSS/JS puro)
├── server.js                        # Aplicación de ejemplo (Node.js + Express)
├── tests/                           # Pruebas de la aplicación de ejemplo (Jest)
├── CLAUDE.md                        # Instrucciones para que Claude maneje los issues
└── SETUP.md                         # Guía completa de configuración
```

Las carpetas `public/`, `server.js` y `tests/` contienen una aplicación de ejemplo de lista de tareas en Node.js. Reemplázalas con tu propio proyecto. Conserva todo lo que esté en `.github/`, `.claude/` y `.agents/`.

---

## Requisitos

- **Token OAuth de Claude Code** — desde [claude.ai](https://claude.ai) (requiere Claude Pro o Team)
- **Cuenta de Railway** — el plan gratuito funciona para despliegues de vista previa
- **Repositorio de GitHub** — público o privado, cualquier plan con Actions habilitado
