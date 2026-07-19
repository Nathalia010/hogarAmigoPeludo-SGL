document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.sidebar-tab');
    const iframe = document.getElementById('dashboard-iframe');

    function ajustarAlturaIframe() {
        if (iframe) {
            try {
                iframe.style.height = "0px";
                const nuevaAltura = iframe.contentWindow.document.documentElement.scrollHeight;
                iframe.style.height = nuevaAltura + "px";
            } catch (error) {
                console.warn("Error", error);
            }
        }
    }

    if (iframe) {
        iframe.addEventListener('load', ajustarAlturaIframe);
        window.addEventListener('resize', ajustarAlturaIframe);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetUrl = tab.getAttribute('data-url');
            
            if (targetUrl && iframe) {
                iframe.src = targetUrl;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            }
        });
    });
});



(() => {
  "use strict";

  const STORAGE_KEYS = {
    sidebar: "hogarAmigo.admin.sidebarCollapsed",
    profile: "hogarAmigo.admin.profile",
  };

  const DEFAULT_PROFILE = {
    name: "Administrador",
    email: "admin@hogaramigopeludo.org",
    phone: "",
    role: "Administrador general",
  };

  const shell = document.querySelector("#adminShell");
  const toggleButton = document.querySelector("#sidebarToggle");
  const closeButton = document.querySelector("#sidebarClose");
  const overlay = document.querySelector("#sidebarOverlay");
  const profileForm = document.querySelector("#adminProfileForm");
  const cancelButton = document.querySelector("#cancelProfileChanges");
  const currentViewTitle = document.querySelector("#currentViewTitle");
  const toast = document.querySelector("#adminToast");
  const logoutButton = document.querySelector("#logoutButton");
  const adminSearch = document.querySelector("#adminSearch");
  const notificationButton = document.querySelector("#notificationButton");
  const dashboardLink = document.querySelector(
    '.sidebar-link[href="dashboardAdmin.html"]',
  );

  let currentProfile = readProfile();
  let toastTimer;

  function isMobile() {
    return window.matchMedia("(max-width: 991px)").matches;
  }

  function safeJsonParse(value, fallback) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function readProfile() {
    const stored = safeJsonParse(localStorage.getItem(STORAGE_KEYS.profile), {});
    return { ...DEFAULT_PROFILE, ...stored };
  }

  function getInitials(name) {
    const words = String(name || "Administrador")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return (words.length > 1 ? words[0][0] + words[1][0] : words[0]?.slice(0, 2) || "AD")
      .toUpperCase();
  }

  function renderProfile(profile) {
    document.querySelectorAll("[data-admin-name]").forEach((element) => {
      element.textContent = profile.name;
    });

    document.querySelectorAll("[data-admin-role]").forEach((element) => {
      element.textContent = profile.role;
    });

    document.querySelectorAll("[data-admin-email]").forEach((element) => {
      element.textContent = profile.email;
    });

    document.querySelectorAll("[data-admin-phone]").forEach((element) => {
      element.textContent = profile.phone || "Sin registrar";
    });

    document.querySelectorAll("[data-admin-initials]").forEach((element) => {
      element.textContent = getInitials(profile.name);
    });

    document.querySelectorAll("[data-admin-first-name]").forEach((element) => {
      element.textContent = profile.name.trim().split(/\s+/)[0] || "Administrador";
    });

    if (profileForm) {
      profileForm.elements.name.value = profile.name;
      profileForm.elements.email.value = profile.email;
      profileForm.elements.phone.value = profile.phone;
      profileForm.elements.role.value = profile.role;
    }
  }

  function setSidebarCollapsed(collapsed) {
    if (!shell || isMobile()) return;

    shell.classList.toggle("sidebar-collapsed", collapsed);
    toggleButton?.setAttribute("aria-expanded", String(!collapsed));
    toggleButton?.setAttribute(
      "aria-label",
      collapsed ? "Expandir menú lateral" : "Contraer menú lateral",
    );
    localStorage.setItem(STORAGE_KEYS.sidebar, String(collapsed));
  }

  function openMobileSidebar() {
    shell?.classList.add("mobile-sidebar-open");
    toggleButton?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileSidebar() {
    shell?.classList.remove("mobile-sidebar-open");
    toggleButton?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function handleSidebarToggle() {
    if (isMobile()) {
      const open = shell?.classList.contains("mobile-sidebar-open");
      open ? closeMobileSidebar() : openMobileSidebar();
      return;
    }

    setSidebarCollapsed(!shell?.classList.contains("sidebar-collapsed"));
  }

  function showView(viewName) {
    const requestedView = document.querySelector(`#view-${viewName}`);
    if (!requestedView) return;

    document.querySelectorAll(".admin-view").forEach((view) => {
      const active = view === requestedView;
      view.hidden = !active;
      view.classList.toggle("active", active);
    });

    document.querySelectorAll("[data-admin-view]").forEach((control) => {
      control.classList.toggle("active", control.dataset.adminView === viewName);
    });

    dashboardLink?.classList.toggle("active", viewName === "dashboard");

    currentViewTitle.textContent = requestedView.dataset.viewTitle || "Administración";
    history.replaceState(null, "", `#${viewName}`);
    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showToast(message) {
    if (!toast) return;

    toast.querySelector("span").textContent = message;
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3200);
  }

  function handleProfileSubmit(event) {
    event.preventDefault();

    if (!profileForm.reportValidity()) return;

    const formData = new FormData(profileForm);
    currentProfile = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      role: currentProfile.role,
    };

    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(currentProfile));
    renderProfile(currentProfile);
    showToast("Datos del administrador actualizados.");
  }

  toggleButton?.addEventListener("click", handleSidebarToggle);
  closeButton?.addEventListener("click", closeMobileSidebar);
  overlay?.addEventListener("click", closeMobileSidebar);

  document.querySelectorAll("[data-admin-view]").forEach((control) => {
    control.addEventListener("click", () => showView(control.dataset.adminView));
  });

  profileForm?.addEventListener("submit", handleProfileSubmit);
  cancelButton?.addEventListener("click", () => {
    renderProfile(currentProfile);
    showView("dashboard");
  });

  adminSearch?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    const term = adminSearch.value.trim().toLocaleLowerCase("es");
    if (!term) return;

    const destination = [...document.querySelectorAll(".sidebar-nav .sidebar-link")]
      .find((link) => link.textContent.toLocaleLowerCase("es").includes(term));

    if (destination) {
      window.location.href = destination.href;
    } else {
      showToast("No encontramos una sección con ese nombre.");
    }
  });

  notificationButton?.addEventListener("click", () => {
    showToast("Tienes 3 notificaciones pendientes.");
  });

  logoutButton?.addEventListener("click", () => {
    /* Sustituye este aviso por tu cierre de sesión real cuando exista backend. */
    showToast("Conecta este botón con tu función de cierre de sesión.");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileSidebar();
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) {
      closeMobileSidebar();
      setSidebarCollapsed(localStorage.getItem(STORAGE_KEYS.sidebar) === "true");
    }
  });

  renderProfile(currentProfile);

  if (!isMobile()) {
    setSidebarCollapsed(localStorage.getItem(STORAGE_KEYS.sidebar) === "true");
  } else {
    toggleButton?.setAttribute("aria-expanded", "false");
  }

  const initialView = window.location.hash.replace("#", "");
  showView(initialView === "perfil" ? "perfil" : "dashboard");
})();
