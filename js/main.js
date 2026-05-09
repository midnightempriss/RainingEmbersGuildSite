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

})();
