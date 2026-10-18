'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

// Mobile navigation
const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');
menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  mainNav?.classList.toggle('open', !isOpen);
});
$$('#mainNav a').forEach(link => link.addEventListener('click', () => {
  mainNav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation menu');
}));

// Reveal sections as they enter the viewport; retain content if observers aren't supported.
const revealItems = $$('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Project category filters
const filterButtons = $$('.filter-button');
const projectCards = $$('.project-card');
const projectEmpty = $('#projectEmpty');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => item.classList.toggle('active', item === button));
  let visibleCount = 0;
  projectCards.forEach(card => {
    const categories = (card.dataset.category || '').split(/\s+/);
    const show = filter === 'all' || categories.includes(filter);
    card.hidden = !show;
    if (show) visibleCount++;
  });
  if (projectEmpty) projectEmpty.hidden = visibleCount !== 0;
}));

// Project descriptions used by the details dialogs.
const projects = {
  college: {
    title: 'College Communication Platform',
    description: 'A one-way messaging concept where college administrators publish announcements for students and lecturers to view. The planned communication flow includes email delivery and in-app style notifications.',
    focus: 'Admin-only message publishing, recipient access, past announcements, email sending and notification delivery. The goal is to make official college updates easy to find in one place.',
    tags: ['Java', 'Spring Boot', 'MySQL', 'Email', 'Notifications']
  },
  meeting: {
    title: 'Meeting Booking System',
    description: 'A booking workflow concept for businesses that need to request consultations with professionals. The prototype explores how users choose a service, provide business details and submit a meeting request.',
    focus: 'Booking form design, consultant selection, request handling and a possible confirmation/reminder flow. Backend integration and notification features should be described according to the version currently available.',
    tags: ['Java', 'HTML', 'CSS', 'JavaScript', 'Booking forms']
  },
  car: {
    title: 'College Car Booking',
    description: 'A college vehicle booking concept to help staff request a car for an event and allow authorised people to review and approve requests.',
    focus: 'Vehicle requests, booking status, approval emails and a structured record of bookings. This portfolio describes the concept and does not claim that it is deployed or production-ready.',
    tags: ['Java', 'Spring Boot', 'MySQL', 'Email']
  },
  stockvel: {
    title: 'Stockvel Management App',
    description: 'A community savings application concept in which multiple members can participate in a group and follow shared activity.',
    focus: 'Member records, contribution history, shared visibility and clear group activity. Financial calculations and real-money handling would need careful validation before any live use.',
    tags: ['Java', 'JSON', 'Data modelling', 'Application logic']
  }
};

const projectDialog = $('#projectDialog');
const dialogTitle = $('#dialogTitle');
const dialogDescription = $('#dialogDescription');
const dialogFocus = $('#dialogFocus');
const dialogTags = $('#dialogTags');
const dialogClose = $('#dialogClose');
$$('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  if (!project || !projectDialog) return;
  dialogTitle.textContent = project.title;
  dialogDescription.textContent = project.description;
  dialogFocus.textContent = project.focus;
  dialogTags.replaceChildren(...project.tags.map(tag => {
    const span = document.createElement('span');
    span.textContent = tag;
    return span;
  }));
  if (typeof projectDialog.showModal === 'function') projectDialog.showModal();
}));
dialogClose?.addEventListener('click', () => projectDialog?.close());
projectDialog?.addEventListener('click', event => {
  if (event.target === projectDialog) projectDialog.close();
});
$('#dialogContact')?.addEventListener('click', () => projectDialog?.close());

// A static portfolio cannot send mail from the server. This prepares a message in the visitor's email app.
const contactForm = $('#contactForm');
contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const subject = String(formData.get('subject') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const mailSubject = `[Portfolio enquiry] ${subject}`;
  const mailBody = `Hi Nasha,\n\n${message}\n\nFrom: ${name}\nReply to: ${email}`;
  const mailto = `mailto:malassenasha@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  const note = $('#formNote');
  if (note) note.textContent = 'Opening your email app… If it does not open, email malassenasha@gmail.com directly.';
  window.location.href = mailto;
});

// Keep the displayed copyright year current.
const year = $('#year');
if (year) year.textContent = new Date().getFullYear();
