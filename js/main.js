(function () {
  "use strict";
  var CFG = window.AMS_CONFIG || {};

  // ---------- Ano do copyright: sempre atual, sem precisar editar todo ano ----------
  var yearEl = document.getElementById("copyright-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Redes sociais no rodapé: só aparecem se a URL estiver configurada ----------
  [["instagram-link", CFG.INSTAGRAM_URL], ["linkedin-link", CFG.LINKEDIN_URL]].forEach(function (pair) {
    var el = document.getElementById(pair[0]);
    if (el && pair[1]) {
      el.href = pair[1];
      el.hidden = false;
    }
  });

  // ---------- UTM: captura de onde vem o tráfego ----------
  // Guarda a última UTM da URL em sessionStorage, pra não perder a origem se a
  // pessoa navegar pela página antes de preencher o formulário.
  var UTM_STORAGE_KEY = "ams_utm";
  var CANAL_MAP = {
    ig: "Instagram", instagram: "Instagram",
    tiktok: "TikTok", tt: "TikTok",
    linkedin: "LinkedIn",
    facebook: "Facebook", fb: "Facebook",
    google: "Google", whatsapp: "WhatsApp"
  };

  function lerUtmsDaUrl() {
    var params = new URLSearchParams(window.location.search);
    var utm = {
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || ""
    };
    return (utm.utm_source || utm.utm_medium || utm.utm_campaign) ? utm : null;
  }

  function salvarUtm(utm) {
    try { sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm)); } catch (e) {}
  }

  function lerUtmSalva() {
    try {
      var raw = sessionStorage.getItem(UTM_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  (function capturarUtm() {
    var utmDaUrl = lerUtmsDaUrl();
    if (utmDaUrl) salvarUtm(utmDaUrl);
  })();

  function canalDeReferrer(ref) {
    if (!ref) return "";
    if (ref.indexOf("instagram.com") > -1) return "Instagram";
    if (ref.indexOf("tiktok.com") > -1) return "TikTok";
    if (ref.indexOf("linkedin.com") > -1) return "LinkedIn";
    if (ref.indexOf("facebook.com") > -1 || ref.indexOf("fb.com") > -1) return "Facebook";
    if (ref.indexOf("google.") > -1) return "Google";
    return "";
  }

  // Origem legível pro time comercial: prioriza UTM da URL, depois referrer, depois "Direto".
  function getOrigem() {
    var utm = lerUtmSalva();
    if (utm && utm.utm_source) {
      var chave = utm.utm_source.toLowerCase();
      return CANAL_MAP[chave] || utm.utm_source;
    }
    var doReferrer = canalDeReferrer(document.referrer);
    if (doReferrer) return doReferrer;
    return document.referrer ? document.referrer : "Direto";
  }

  function getCampanhaUtm() {
    var utm = lerUtmSalva();
    return utm && utm.utm_campaign ? utm.utm_campaign : "";
  }

  // ---------- Tracking helpers (não erram se os IDs não existirem) ----------
  // Matriz de eventos oficial fica a cargo do item 7 do painel (Joseph);
  // os três eventos abaixo (cta_click, form_submit, whatsapp_click) são os
  // combinados no plano de CRO e já ficam disparando desde já.
  function track(eventName, params) {
    params = params || {};
    try {
      if (CFG.GA4_MEASUREMENT_ID && typeof gtag === "function") {
        gtag("event", eventName, params);
      }
      if (CFG.META_PIXEL_ID && typeof fbq === "function") {
        fbq("trackCustom", eventName, params);
      }
    } catch (e) { console.warn("tracking falhou:", e); }
  }

  if (CFG.GA4_MEASUREMENT_ID) {
    var s1 = document.createElement("script");
    s1.async = true;
    s1.src = "https://www.googletagmanager.com/gtag/js?id=" + CFG.GA4_MEASUREMENT_ID;
    document.head.appendChild(s1);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", CFG.GA4_MEASUREMENT_ID);
  }
  if (CFG.META_PIXEL_ID) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', CFG.META_PIXEL_ID);
    fbq('track', 'PageView');
    /* eslint-enable */
  }

  // ---------- cta_click em todo elemento com data-cta ----------
  document.querySelectorAll("[data-cta]").forEach(function (el) {
    el.addEventListener("click", function () {
      track("cta_click", { local: el.getAttribute("data-cta") });
    });
  });

  // ---------- Pílulas de rádio (serviço de interesse) ----------
  var servicoGroup = document.getElementById("servico-group");
  function selecionarServico(valor) {
    if (!servicoGroup) return;
    servicoGroup.querySelectorAll(".radio-pill").forEach(function (pill) {
      var isMatch = pill.getAttribute("data-value") === valor;
      pill.classList.toggle("checked", isMatch);
      pill.querySelector("input").checked = isMatch;
    });
  }
  if (servicoGroup) {
    servicoGroup.querySelectorAll(".radio-pill").forEach(function (pill) {
      pill.addEventListener("click", function () {
        selecionarServico(pill.getAttribute("data-value"));
      });
    });
  }

  // ---------- Cards "dois caminhos": pré-selecionam o serviço e rolam pro formulário ----------
  document.querySelectorAll("[data-servico]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      selecionarServico(el.getAttribute("data-servico"));
      var alvo = document.getElementById("formulario");
      if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // ---------- WhatsApp flutuante e CTA do hero: mensagem genérica ----------
  var msgGenerico = encodeURIComponent(
    "Olá! Vim pelo site da " + (CFG.BRAND_NAME || "AMS Digital") + " e quero saber mais."
  );
  document.querySelectorAll(".js-wa-generico").forEach(function (el) {
    el.href = "https://wa.me/" + CFG.WHATSAPP_NUMBER + "?text=" + msgGenerico;
  });

  // ---------- Formulário principal ----------
  var form = document.getElementById("lead-form");
  var successBox = document.getElementById("form-success");
  var submitBtn = document.getElementById("submit-btn");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nome = form.nome.value.trim();
      var whatsapp = form.whatsapp.value.trim();
      var servicoEl = form.querySelector('input[name="servico"]:checked');
      var servico = servicoEl ? servicoEl.value : "";

      if (!nome || !whatsapp || !servico || !form.consentimento.checked) {
        alert("Só falta preencher todos os campos (e marcar a autorização de contato) pra continuar.");
        return;
      }

      submitBtn.disabled = true;

      var payload = {
        nome: nome,
        whatsapp: whatsapp,
        servico: servico,
        origem: getOrigem(),
        campanha: getCampanhaUtm(),
        pagina: window.location.href,
        data_envio: new Date().toISOString()
      };

      track("form_submit", { servico: servico, origem: payload.origem, campanha: payload.campanha });

      // Log na planilha (Google Sheets via Apps Script) — nunca bloqueia o redirecionamento.
      // Ver README.md e integrations/apps-script.gs para configurar AMS_CONFIG.SHEET_WEBHOOK_URL.
      var logPromise;
      if (CFG.SHEET_WEBHOOK_URL) {
        logPromise = fetch(CFG.SHEET_WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        }).catch(function (err) { console.warn("Falha ao registrar lead na planilha:", err); });
      } else {
        console.info("SHEET_WEBHOOK_URL não configurada — pulando log na planilha. Ver README.md.");
        logPromise = Promise.resolve();
      }

      var redirect = function () {
        track("whatsapp_click", { origem: "form" });
        var msg = "Olá! Me chamo " + nome + " e quero falar sobre: " + servico + ".\n" +
                  "Meu WhatsApp: " + whatsapp;
        window.location.href = "https://wa.me/" + CFG.WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
      };

      form.style.display = "none";
      successBox.classList.add("show");

      // Dá um tempinho pro fetch (fire-and-forget) sair antes de navegar, sem travar o usuário se falhar.
      Promise.race([
        logPromise,
        new Promise(function (resolve) { setTimeout(resolve, 900); })
      ]).finally(function () {
        setTimeout(redirect, 500);
      });
    });
  }
})();
