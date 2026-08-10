(() => {
  "use strict";

  const STORAGE_KEYS = {
    profile: "hogarAmigo.admin.profile",
  };

  const DEFAULT_PROFILE = {
    name: "Administrador",
    email: "admin@hogaramigopeludo.org",
    phone: "",
    role: "Administrador general",
  };

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

    if (currentViewTitle) currentViewTitle.textContent = requestedView.dataset.viewTitle || "Administración";
    history.replaceState(null, "", `#${viewName}`);
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
    const count = Number(document.querySelector(".notification-count")?.textContent) || 0;
    showToast(
      count === 1
        ? "Tienes 1 solicitud pendiente."
        : `Tienes ${count} solicitudes pendientes.`,
    );
  });

  logoutButton?.addEventListener("click", () => {
    /* Sustituye este aviso por tu cierre de sesión real cuando exista backend. 
    showToast("Conecta este botón con tu función de cierre de sesión.");*/
    localStorage.removeItem("usuarioActual");
    showToast("Sesión cerrada correctamente.");
    setTimeout(() => {
    window.location.href = "../login/login.html";
    }, 800);
  });

  renderProfile(currentProfile);

  const initialView = window.location.hash.replace("#", "");
  showView(initialView === "perfil" ? "perfil" : "dashboard");
})();
