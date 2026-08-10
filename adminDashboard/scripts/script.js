import { requerirAdmin } from "../../js/auth-guard.js";

document.addEventListener("DOMContentLoaded", () => {
  const usuario = requerirAdmin({
    loginPath: "../login/login.html",
  });

  if (!usuario) {
    return;
  }

  const tabs = document.querySelectorAll(".sidebar-tab");
  const iframe = document.getElementById("dashboard-iframe");

  function ajustarAlturaIframe() {
    if (iframe) {
      try {
        iframe.style.height = "0px";
        const nuevaAltura =
          iframe.contentWindow.document.documentElement.scrollHeight;
        iframe.style.height = nuevaAltura + "px";
      } catch (error) {
        console.warn("Error", error);
      }
    }
  }

  if (iframe) {
    iframe.addEventListener("load", ajustarAlturaIframe);
    window.addEventListener("resize", ajustarAlturaIframe);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetUrl = tab.getAttribute("data-url");

      if (targetUrl && iframe) {
        iframe.src = targetUrl;

        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
      }
    });
  });
});
