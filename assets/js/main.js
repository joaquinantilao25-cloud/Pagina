/* Administraciones Ferrada SpA — Interacciones HTML5 sin librerías
   CONFIGURACIÓN: cambie aquí el número de WhatsApp si la empresa lo actualiza.
   El formulario abre WhatsApp con un texto preparado: NO existe un backend de envío. */
'use strict';

const CONFIG = {
  whatsapp: '56956392635',
  mensajeInicial: 'Hola, quisiera obtener información sobre la administración de mi edificio o condominio.'
};

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

function whatsappUrl(text) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
}

function openWhatsapp(text) {
  // Activación desde un clic real del visitante, con navegación estándar.
  const link = document.createElement('a');
  link.href = whatsappUrl(text);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Menú accesible en teléfonos y tabletas.
const menuToggle = $('.menu-toggle');
const navLinks = $('#menu-principal');
function closeMenu() {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Abrir menú');
  navLinks?.classList.remove('is-open');
}
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  navLinks.classList.toggle('is-open', open);
});
$$('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
document.addEventListener('click', event => {
  if (navLinks?.classList.contains('is-open') && !event.target.closest('.nav')) closeMenu();
});

// Barra fija con cambio de sombra al desplazarse, botón volver arriba.
const siteHeader = $('.site-header');
const backToTop = $('#back-to-top');
function updateScrollUI() {
  const scrolled = window.scrollY > 24;
  siteHeader?.classList.toggle('scrolled', scrolled);
  backToTop?.classList.toggle('visible', window.scrollY > 580);
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
$('#year').textContent = String(new Date().getFullYear());

// Aparecer suavemente cuando cada sección ingresa a la pantalla.
const revealItems = $$('[data-reveal]');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.07, rootMargin: '0px 0px 30px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Actualizar automáticamente todos los botones que abren WhatsApp.
$$('.wa-direct').forEach(link => {
  link.href = whatsappUrl(CONFIG.mensajeInicial);
});

// Formulario de propuesta: valida, compone mensaje y abre WhatsApp.
const proposalForm = $('#formulario-propuesta');
const statusBox = $('#form-status');
proposalForm?.addEventListener('submit', event => {
  event.preventDefault();
  statusBox.textContent = '';
  statusBox.classList.remove('error');

  if (!proposalForm.checkValidity()) {
    statusBox.textContent = 'Complete los campos obligatorios, revise el correo si lo escribió y acepte el uso de sus datos.';
    statusBox.classList.add('error');
    proposalForm.reportValidity();
    return;
  }
  const data = new FormData(proposalForm);
  const name = String(data.get('nombre') || '').trim();
  const community = String(data.get('comunidad') || '').trim();
  const phone = String(data.get('telefono') || '').trim();
  const email = String(data.get('correo') || '').trim();
  const issue = String(data.get('necesidad') || '').trim();
  const message = String(data.get('mensaje') || '').trim();

  if (name.length < 3 || community.length < 3 || phone.replace(/\D/g, '').length < 8) {
    statusBox.textContent = 'Revise su nombre, comunidad y teléfono. El teléfono debe incluir al menos 8 dígitos.';
    statusBox.classList.add('error');
    return;
  }
  const text = [
    'Hola, equipo de Administraciones Ferrada SpA.',
    'Quisiera solicitar información / una propuesta de administración.',
    '',
    `Nombre: ${name}`,
    `Edificio o comunidad y comuna: ${community}`,
    `Teléfono: ${phone}`,
    email ? `Correo electrónico: ${email}` : null,
    `Motivo: ${issue}`,
    message ? `Mensaje: ${message}` : null,
    '',
    'Enviado desde el formulario web.'
  ].filter(line => line !== null).join('\n');
  statusBox.textContent = 'Se abrirá WhatsApp con su solicitud preparada. Revise el texto y presione Enviar en WhatsApp para completar el contacto.';
  openWhatsapp(text);
});

// Diálogos de detalles: se puede ampliar este catálogo editando solo este objeto.
const serviceCatalog = {
  gastos: {
    label: '01 / FINANZAS Y ADMINISTRACIÓN', title: 'Cobro de gastos comunes',
    description: 'La organización de los gastos comunes ayuda al comité a contar con una gestión ordenada y comprensible para la comunidad.',
    points: ['Organización de la información financiera.', 'Seguimiento de cobros y pagos de gastos comunes.', 'Comunicación de antecedentes relevantes para el comité.', 'Apoyo para comprender los movimientos de la comunidad.']
  },
  morosidad: {
    label: '02 / COBRANZA', title: 'Manejo de morosidad',
    description: 'El seguimiento de las obligaciones pendientes permite anticipar dificultades de caja y trabajar soluciones dentro de las reglas aplicables.',
    points: ['Seguimiento de saldos vencidos.', 'Comunicación y gestión de cobranza.', 'Revisión de alternativas de regularización.', 'Información sobre la evolución de la morosidad.']
  },
  reserva: {
    label: '03 / PLANIFICACIÓN', title: 'Fondo de reserva',
    description: 'Una administración responsable identifica las necesidades futuras y registra el uso del fondo de reserva conforme a la normativa y los acuerdos correspondientes.',
    points: ['Seguimiento de los recursos disponibles.', 'Planificación de gastos autorizados.', 'Registro y respaldo de movimientos.', 'Comunicación a quienes corresponda.']
  },
  espacios: {
    label: '04 / CONVIVENCIA', title: 'Uso de espacios comunes',
    description: 'Los espacios comunes son parte importante de la vida de la comunidad. Su uso debe ser organizado y respetar el reglamento del condominio.',
    points: ['Organización de solicitudes de uso.', 'Coordinación de mantención y cuidado.', 'Aplicación de reglas de convivencia.', 'Comunicación de condiciones de uso.']
  },
  personal: {
    label: '05 / PERSONAS', title: 'Manejo de personal',
    description: 'La coordinación del personal favorece una operación diaria más clara y una mejor atención a residentes y visitas.',
    points: ['Supervisión y definición de funciones.', 'Coordinación del trabajo de conserjería y aseo.', 'Apoyo a los procesos operativos.', 'Comunicación de necesidades del equipo.']
  },
  seguridad: {
    label: '06 / PROTECCIÓN', title: 'Gestión de entornos seguros',
    description: 'La seguridad requiere medidas preventivas, organización y coordinación apropiadas a cada edificio o condominio.',
    points: ['Apoyo en el control de acceso.', 'Supervisión de procedimientos de seguridad.', 'Coordinación de medidas preventivas.', 'Seguimiento de situaciones informadas por la comunidad.']
  },
  riesgos: {
    label: '07 / PREVENCIÓN', title: 'Prevención de riesgos y siniestros',
    description: 'Un enfoque preventivo ayuda a identificar situaciones de riesgo y a promover el cuidado de personas e instalaciones.',
    points: ['Identificación de necesidades preventivas.', 'Coordinación de revisiones y mantenciones.', 'Difusión de recomendaciones relevantes.', 'Apoyo en procedimientos y organización ante emergencias.']
  },
  informacion: {
    label: '08 / INFORMACIÓN', title: 'Manejo de la información',
    description: 'Documentos organizados y comunicaciones claras hacen más sencilla la relación entre administración, comité y residentes.',
    points: ['Organización de antecedentes y documentación.', 'Comunicación oportuna de información.', 'Apoyo al resguardo de los registros.', 'Seguimiento de solicitudes y asuntos de gestión.']
  }
};
const extraInformation = {
  normativa: {
    label: 'NORMATIVA Y CUMPLIMIENTO', title: 'Normativa de copropiedad',
    description: 'Nuestro enfoque contempla el marco legal aplicable. El reglamento de copropiedad y la situación de cada comunidad deben examinarse en cada caso.',
    points: ['Ley N.º 21.442 sobre Copropiedad Inmobiliaria.', 'Reglamento de copropiedad de la comunidad.', 'Acuerdos de los órganos competentes.', 'Otras disposiciones aplicables según la actividad y las circunstancias del edificio.']
  },
  etica: {
    label: 'COMPROMISO PROFESIONAL', title: 'Principios de nuestro código de ética',
    description: 'Buscamos una relación de confianza y responsabilidad en cada una de nuestras gestiones.',
    points: ['Transparencia y honestidad.', 'Discreción y respeto por la información de la comunidad.', 'Lealtad e imparcialidad en nuestras decisiones.', 'Eficiencia, respeto y orientación al servicio.']
  }
};
const dialog = $('#info-dialog');
function showDetail(detail) {
  if (!dialog || !detail) return;
  $('#dialog-label').textContent = detail.label;
  $('#dialog-title').textContent = detail.title;
  $('#dialog-description').textContent = detail.description;
  const list = $('#dialog-list');
  list.replaceChildren();
  detail.points.forEach(point => {
    const li = document.createElement('li');
    li.textContent = point; // Evita inyectar HTML desde texto.
    list.appendChild(li);
  });
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}
$$('[data-service]').forEach(card => card.addEventListener('click', () => showDetail(serviceCatalog[card.dataset.service])));
$$('.open-info').forEach(button => button.addEventListener('click', () => showDetail(extraInformation[button.dataset.info])));
$('.dialog-close')?.addEventListener('click', () => dialog.close());
$('.dialog-cta')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

// Un solo acordeón abierto a la vez.
$$('.faq-list details').forEach(item => item.addEventListener('toggle', () => {
  if (item.open) $$('.faq-list details').filter(other => other !== item).forEach(other => { other.open = false; });
}));

// Asistente local: reglas de respuesta a preguntas comunes; no inventa datos ni llama a una IA externa.
const chatLaunch = $('#chat-launch');
const chatPanel = $('#chat-panel');
const chatMessages = $('#chat-messages');
const chatForm = $('#chat-form');
const chatInput = $('#chat-question');
function toggleChat(force) {
  const open = typeof force === 'boolean' ? force : chatPanel.hidden;
  chatPanel.hidden = !open;
  chatLaunch.setAttribute('aria-expanded', String(open));
  if (open) chatInput.focus();
  else chatLaunch.focus();
}
chatLaunch?.addEventListener('click', () => toggleChat());
$('#chat-close')?.addEventListener('click', () => toggleChat(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && chatPanel && !chatPanel.hidden) toggleChat(false);
});
function replyTo(question) {
  const normalized = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (/cambiar|cambio|traspaso|otra administracion/.test(normalized)) return 'El cambio considera cuatro pasos: nos cuenta sobre su comunidad, revisamos antecedentes, presentamos una propuesta escrita y coordinamos un traspaso ordenado si corresponde. Puede comenzar con el formulario de la portada.';
  if (/gasto|comun|cobro|boleta|factura/.test(normalized)) return 'Apoyamos la organización y el cobro de gastos comunes, el seguimiento de pagos y la comunicación de información financiera. El detalle depende del reglamento y necesidades de cada comunidad.';
  if (/propuesta|cotiza|precio|costo|presupuesto|valor/.test(normalized)) return 'Para conocer el servicio y solicitar una propuesta personalizada, complete el formulario al inicio de la página o escríbanos por WhatsApp. Los valores se evalúan según las características de su edificio.';
  if (/moros|deuda|atraso|impago/.test(normalized)) return 'La gestión de morosidad contempla seguimiento de saldos pendientes, cobranza y revisión de alternativas de regularización conforme a las reglas aplicables.';
  if (/reserva|imprevist/.test(normalized)) return 'El fondo de reserva se administra conforme al marco legal y las decisiones aplicables de la comunidad, con respaldo de sus movimientos.';
  if (/segur|acceso|conserje|guardia|camara/.test(normalized)) return 'Podemos conversar sobre coordinación del personal, control de acceso y medidas preventivas ajustadas a las necesidades de su comunidad.';
  if (/ley|normativa|reglamento|21.442/.test(normalized)) return 'En Chile, la Ley N.º 21.442 regula principalmente la copropiedad inmobiliaria. También debe revisarse el reglamento y la situación particular del condominio.';
  if (/personal|aseo|mantencion|mantenimiento/.test(normalized)) return 'El servicio considera coordinación operativa y supervisión de labores del personal y la mantención, de acuerdo con las necesidades de cada edificio.';
  if (/contact|telefono|whatsapp|escribir|llamar|horario/.test(normalized)) return 'Puede comunicarse al +56 9 5639 2635 o usar el botón de WhatsApp. Para confirmar horarios específicos, consúltelo directamente al equipo.';
  if (/hola|buenas|saludos|gracias/.test(normalized)) return '¡Gracias por escribirnos! Puedo orientar sobre gastos comunes, morosidad, cambio de administración, servicios o solicitudes de propuesta.';
  return 'Gracias por su consulta. Para recibir una respuesta específica de nuestro equipo, utilice el formulario de propuesta o el enlace de WhatsApp que está debajo de este chat.';
}
function addChatMessage(text, kind) {
  const element = document.createElement('div');
  element.className = `chat-message ${kind}`;
  element.textContent = text;
  chatMessages.appendChild(element);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function askChat(question) {
  const value = question.trim();
  if (!value) return;
  addChatMessage(value, 'user');
  addChatMessage(replyTo(value), 'bot');
}
chatForm?.addEventListener('submit', event => {
  event.preventDefault();
  askChat(chatInput.value);
  chatInput.value = '';
  chatInput.focus();
});
$$('[data-chat-question]').forEach(button => button.addEventListener('click', () => askChat(button.dataset.chatQuestion)));
