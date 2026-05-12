/* ============================================================
   RAINING EMBERS — Ember Particle Canvas + Scroll Reveal + Nav
   ============================================================ */

(function () {
  'use strict';

  /* -------- Ember Particle System -------- */
  const canvas = document.getElementById('ember-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let embers = [];
  const EMBER_COUNT = 100;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function Ember() {
    this.reset();
  }

  Ember.prototype.reset = function () {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = Math.random() * 3 + 2;
    this.speedY = -(Math.random() * 1.5 + 0.5);
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.opacity = Math.random() * 0.6 + 0.4;
    this.fadeRate = Math.random() * 0.003 + 0.001;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    // Pick a warm color
    var colors = [
      [232, 98, 30],   // ember orange
      [255, 69, 0],    // fire red-orange
      [255, 106, 0],   // molten
      [245, 166, 35],  // gold
      [204, 34, 0]     // deep red
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  };

  Ember.prototype.update = function () {
    this.wobble += this.wobbleSpeed;
    this.x += this.speedX + Math.sin(this.wobble) * 0.3;
    this.y += this.speedY;
    this.opacity -= this.fadeRate;

    if (this.opacity <= 0 || this.y < -20) {
      this.reset();
    }
  };

  Ember.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

    // Glow
    ctx.shadowColor = 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ',0.8)';
    ctx.shadowBlur = this.size * 8;

    ctx.fillStyle = 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ',' + this.opacity + ')';
    ctx.fill();
    ctx.restore();
  };

  // Init embers
  for (var i = 0; i < EMBER_COUNT; i++) {
    var e = new Ember();
    e.y = Math.random() * canvas.height; // spread initially
    embers.push(e);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < embers.length; i++) {
      embers[i].update();
      embers[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();

  /* -------- Scroll Reveal -------- */
  function revealElements() {
    var reveals = document.querySelectorAll('.reveal, .feature-card');
    for (var i = 0; i < reveals.length; i++) {
      var el = reveals[i];
      var windowHeight = window.innerHeight;
      var elementTop = el.getBoundingClientRect().top;
      var revealPoint = 120;

      if (elementTop < windowHeight - revealPoint) {
        el.classList.add('visible');
      }
    }
  }

  window.addEventListener('scroll', revealElements);
  window.addEventListener('load', revealElements);

  /* -------- Mobile Navigation Toggle -------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    // Close mobile nav when clicking a link
    var links = navLinks.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    }
  }

  /* -------- Smooth scroll for anchor links -------- */
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < anchorLinks.length; i++) {
    anchorLinks[i].addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* -------- Nav scroll shadow -------- */
  var mainNav = document.querySelector('.main-nav');
  if (mainNav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        mainNav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.8), 0 1px 0 rgba(232,98,30,0.2)';
      } else {
        mainNav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.6)';
      }
    });
  }

  /* -------- Raid Night Countdowns -------- */
  var timeZonePartFormatters = {};

  function getTimeZonePartFormatter(timeZone) {
    if (!timeZonePartFormatters[timeZone]) {
      timeZonePartFormatters[timeZone] = new Intl.DateTimeFormat('en-US', {
        timeZone: timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23'
      });
    }

    return timeZonePartFormatters[timeZone];
  }

  function getTimeZoneParts(date, timeZone) {
    var formatter = getTimeZonePartFormatter(timeZone);
    var formattedParts = formatter.formatToParts(date);
    var parts = {};

    for (var i = 0; i < formattedParts.length; i++) {
      var part = formattedParts[i];
      if (part.type !== 'literal') {
        parts[part.type] = parseInt(part.value, 10);
      }
    }

    return parts;
  }

  function getTimeZoneOffset(date, timeZone) {
    var parts = getTimeZoneParts(date, timeZone);
    var utcDate = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    return utcDate - date.getTime();
  }

  function makeDateInTimeZone(year, month, day, hour, minute, second, timeZone) {
    var utcDate = Date.UTC(year, month - 1, day, hour, minute, second);
    var zonedDate = new Date(utcDate);

    for (var i = 0; i < 3; i++) {
      zonedDate = new Date(utcDate - getTimeZoneOffset(zonedDate, timeZone));
    }

    return zonedDate;
  }

  function addCalendarDays(year, month, day, amount) {
    var date = new Date(Date.UTC(year, month - 1, day + amount, 12, 0, 0));
    return {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      weekday: date.getUTCDay()
    };
  }

  function parseRaidConfig(card) {
    var days = card.getAttribute('data-raid-days').split(',');
    var raidDays = [];

    for (var i = 0; i < days.length; i++) {
      raidDays.push(parseInt(days[i], 10));
    }

    return {
      card: card,
      days: raidDays,
      hour: parseInt(card.getAttribute('data-raid-hour'), 10),
      minute: parseInt(card.getAttribute('data-raid-minute'), 10),
      timeZone: card.getAttribute('data-raid-time-zone') || 'America/New_York',
      nextLabel: card.querySelector('[data-countdown-next]'),
      parts: {
        days: card.querySelector('[data-countdown-part="days"]'),
        hours: card.querySelector('[data-countdown-part="hours"]'),
        minutes: card.querySelector('[data-countdown-part="minutes"]'),
        seconds: card.querySelector('[data-countdown-part="seconds"]')
      }
    };
  }

  function getNextRaidDate(config, now) {
    var nowParts = getTimeZoneParts(now, config.timeZone);

    for (var i = 0; i <= 14; i++) {
      var candidate = addCalendarDays(nowParts.year, nowParts.month, nowParts.day, i);
      if (config.days.indexOf(candidate.weekday) === -1) continue;

      var raidDate = makeDateInTimeZone(
        candidate.year,
        candidate.month,
        candidate.day,
        config.hour,
        config.minute,
        0,
        config.timeZone
      );

      if (raidDate.getTime() > now.getTime()) {
        return raidDate;
      }
    }

    return null;
  }

  function padNumber(value) {
    return value < 10 ? '0' + value : String(value);
  }

  function updateRaidCountdown(config, formatter) {
    var now = new Date();
    var nextRaid = getNextRaidDate(config, now);
    if (!nextRaid) return;

    var remainingSeconds = Math.max(0, Math.floor((nextRaid.getTime() - now.getTime()) / 1000));
    var days = Math.floor(remainingSeconds / 86400);
    var hours = Math.floor((remainingSeconds % 86400) / 3600);
    var minutes = Math.floor((remainingSeconds % 3600) / 60);
    var seconds = remainingSeconds % 60;

    config.parts.days.textContent = padNumber(days);
    config.parts.hours.textContent = padNumber(hours);
    config.parts.minutes.textContent = padNumber(minutes);
    config.parts.seconds.textContent = padNumber(seconds);

    if (config.nextLabel) {
      config.nextLabel.textContent = formatter.format(nextRaid);
    }
  }

  function initRaidCountdowns() {
    var countdownCards = document.querySelectorAll('[data-raid-countdown]');
    if (!countdownCards.length || !window.Intl) return;

    var configs = [];
    for (var i = 0; i < countdownCards.length; i++) {
      configs.push(parseRaidConfig(countdownCards[i]));
    }

    var nextRaidFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    function tick() {
      for (var i = 0; i < configs.length; i++) {
        updateRaidCountdown(configs[i], nextRaidFormatter);
      }
    }

    tick();
    window.setInterval(tick, 1000);
  }

  initRaidCountdowns();

})();
