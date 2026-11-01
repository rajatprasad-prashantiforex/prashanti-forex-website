function loadComponent(url, elementId, onLoaded) {
  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status + " while loading " + url);
      }
      return response.text();
    })
    .then(function (html) {
      var container = document.getElementById(elementId);
      if (container) {
        container.innerHTML = html;
        if (typeof onLoaded === "function") {
          onLoaded(container);
        }
      }
    })
    .catch(function (err) {
      console.error("Component load error:", err);
    });
}

function setupHeaderMenus(headerContainer) {
  var navLinks = headerContainer.querySelector(".main-menu .navigation");
  var mobileMenuOuter = headerContainer.querySelector(".mobile-menu .menu-box .menu-outer");
  
  if (navLinks && mobileMenuOuter && mobileMenuOuter.children.length === 0) {
    mobileMenuOuter.appendChild(navLinks.cloneNode(true));
  }

  var stickyMenu = headerContainer.querySelector(".sticky-header .main-menu");
  if (navLinks && stickyMenu && stickyMenu.children.length === 0) {
    stickyMenu.appendChild(navLinks.cloneNode(true));
  }

  var mobileDropdowns = headerContainer.querySelectorAll(".mobile-menu li.dropdown");
  mobileDropdowns.forEach(function (drop) {
    if (!drop.querySelector(".dropdown-btn")) {
      var btn = document.createElement("div");
      btn.className = "dropdown-btn";
      btn.innerHTML = '<span class="fa fa-angle-down"></span>';
      btn.addEventListener("click", function () {
        var subMenu = drop.querySelector("ul");
        if (subMenu) {
          if (subMenu.style.display === "block") {
            subMenu.style.display = "none";
          } else {
            subMenu.style.display = "block";
          }
        }
      });
      drop.appendChild(btn);
    }
  });
}

document.addEventListener("click", function (e) {
  var hamburgerBtn = e.target.closest(".navSidebar-button");
  if (hamburgerBtn) {
    e.preventDefault();
    document.body.classList.add("side-content-visible");
    return;
  }

  var closeSidebar = e.target.closest(".close-side-widget");
  var sidebarOverlay = e.target.closest(".xs-overlay");
  if (closeSidebar || (sidebarOverlay && document.body.classList.contains("side-content-visible"))) {
    e.preventDefault();
    document.body.classList.remove("side-content-visible");
    return;
  }

  var searchOpenBtn = e.target.closest(".search-box-btn");
  if (searchOpenBtn) {
    e.preventDefault();
    var popup = document.querySelector(".search-popup");
    if (popup) {
      popup.classList.add("popup-visible");
    }
    return;
  }

  var searchCloseBtn = e.target.closest(".close-search");
  var searchColorLayer = e.target.closest(".search-popup .color-layer");
  if (searchCloseBtn || searchColorLayer) {
    e.preventDefault();
    var popup = document.querySelector(".search-popup");
    if (popup) {
      popup.classList.remove("popup-visible");
    }
    return;
  }

  var mobileToggleBtn = e.target.closest(".mobile-nav-toggler");
  if (mobileToggleBtn) {
    e.preventDefault();
    document.body.classList.add("mobile-menu-visible");
    return;
  }

  var mobileCloseBtn = e.target.closest(".mobile-menu .close-btn");
  var mobileBackdrop = e.target.closest(".mobile-menu .menu-backdrop");
  if (mobileCloseBtn || mobileBackdrop) {
    e.preventDefault();
    document.body.classList.remove("mobile-menu-visible");
    return;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  loadComponent("components/header.html", "site-header", setupHeaderMenus);

  var footerPlaceholder = document.getElementById("site-footer");
  if (footerPlaceholder) {
    loadComponent("components/footer.html", "site-footer");
  }
});