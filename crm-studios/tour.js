(function () {
  "use strict";

  function track(eventName, params) {
    try {
      if (window.AMS_CONFIG && window.AMS_CONFIG.GA4_MEASUREMENT_ID && typeof gtag === "function") {
        gtag("event", eventName, params || {});
      }
    } catch (e) { /* silencioso, igual ao main.js */ }
  }

  // ---------- Troca de aba (sidebar desktop + select mobile) ----------
  var navItems = document.querySelectorAll(".crm-nav__item");
  var panels = document.querySelectorAll(".crm-panel");
  var select = document.getElementById("crm-tab-select");

  function irParaAba(aba) {
    navItems.forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-tab") === aba);
    });
    panels.forEach(function (p) {
      p.classList.toggle("is-active", p.getAttribute("data-panel") === aba);
    });
    if (select) select.value = aba;
    track("demo_tab_switch", { aba: aba });
  }

  navItems.forEach(function (btn) {
    btn.addEventListener("click", function () { irParaAba(btn.getAttribute("data-tab")); });
  });
  if (select) {
    select.addEventListener("change", function () { irParaAba(select.value); });
  }

  // ---------- Chamada: clicar no aluno marca presença ----------
  document.querySelectorAll(".crm-roll__item").forEach(function (item) {
    item.addEventListener("click", function () {
      var presente = item.getAttribute("data-presente") === "true";
      item.setAttribute("data-presente", presente ? "false" : "true");
      var statusEl = item.querySelector(".crm-roll__status");
      if (presente) {
        statusEl.textContent = "Ausente";
        statusEl.className = "crm-roll__status crm-pill crm-pill--pending";
      } else {
        statusEl.textContent = "Presente";
        statusEl.className = "crm-roll__status crm-pill crm-pill--ok";
      }
    });
  });

  // ---------- Cobranças: botão "Cobrar via Pix" revela um código de exemplo ----------
  document.querySelectorAll(".crm-btn-pix").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.nextElementSibling && btn.nextElementSibling.classList.contains("crm-pix-box")) return;
      var box = document.createElement("div");
      box.className = "crm-pix-box";
      box.textContent = "00020126580014BR.GOV.BCB.PIX0136exemplo-fake-nao-usar-5204000053039865405120.005802BR5913AMS DIGITAL EXEMPLO6009SAO PAULO62070503***6304ABCD";
      btn.parentNode.appendChild(box);
      btn.textContent = "Código Pix gerado";
      btn.disabled = true;
    });
  });

  // ---------- Atendente IA: conversa simulada, sem API ----------
  var chatEl = document.getElementById("crm-chat");
  var replayBtn = document.getElementById("crm-chat-replay");
  var SCRIPT = [
    { tipo: "in", texto: "Oi! Vi que vocês têm aula de Pilates. Tem vaga pra essa semana?" },
    { tipo: "out", texto: "Oi! Temos sim 😊 Prefere manhã ou noite?" },
    { tipo: "in", texto: "Noite, por favor." },
    { tipo: "out", texto: "Perfeito! Tenho vaga terça às 19h. Posso reservar no seu nome?" },
    { tipo: "in", texto: "Pode sim!" },
    { tipo: "out", texto: "Reservado ✅ Te mando a confirmação aqui mesmo antes da aula." }
  ];

  var chatTimers = [];

  function limparTimers() {
    chatTimers.forEach(function (t) { clearTimeout(t); });
    chatTimers = [];
  }

  function tocarChat() {
    limparTimers();
    chatEl.innerHTML = "";
    var delay = 300;
    SCRIPT.forEach(function (msg) {
      var typingDelay = delay;
      chatTimers.push(setTimeout(function () {
        var typing = document.createElement("div");
        typing.className = "crm-bubble crm-bubble--typing";
        typing.innerHTML = "<span></span><span></span><span></span>";
        chatEl.appendChild(typing);
        chatEl.scrollTop = chatEl.scrollHeight;

        chatTimers.push(setTimeout(function () {
          typing.remove();
          var bubble = document.createElement("div");
          bubble.className = "crm-bubble crm-bubble--" + msg.tipo;
          bubble.textContent = msg.texto;
          chatEl.appendChild(bubble);
          chatEl.scrollTop = chatEl.scrollHeight;
        }, 700));
      }, typingDelay));
      delay += 1100;
    });
  }

  if (chatEl) {
    // Só toca quando a aba "Atendente IA" é aberta pela primeira vez.
    var atendenteBtn = document.querySelector('[data-tab="atendente"]');
    var jaTocou = false;
    function possívelInicio() {
      var painelAtivo = document.querySelector('.crm-panel[data-panel="atendente"]');
      if (painelAtivo && painelAtivo.classList.contains("is-active") && !jaTocou) {
        jaTocou = true;
        tocarChat();
      }
    }
    if (atendenteBtn) atendenteBtn.addEventListener("click", possívelInicio);
    if (select) select.addEventListener("change", possívelInicio);
    if (replayBtn) replayBtn.addEventListener("click", tocarChat);
  }
})();
