/**
 * ===================================================================
 * PORTFOLIO REZA DWI KURNIAWAN
 * Main JavaScript Controller: Dual Themes, C++ Simulator, Canvas FX,
 * Dynamic Typing, 3D Tilt & Interactive Lab
 * Vanilla JS (ES6+) - Clean, Modular, Optimized
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // --- 1. TOAST NOTIFICATION SYSTEM ---
  const toastHub = document.getElementById("toastHub");

  function showToast(message, duration = 3000) {
    if (!toastHub) return;
    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toastHub.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(30px)";
      setTimeout(() => toast.remove(), 350);
    }, duration);
  }

  // --- 2. DUAL THEME CONTROLLER (DARK & LIGHT MODE) ---
  const themeToggle = document.getElementById("themeToggle");
  const footerThemeBtn = document.getElementById("footerThemeBtn");
  const themeLabel = document.getElementById("themeLabel");

  function getPreferredTheme() {
    const saved = localStorage.getItem("rezadev-theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme, notify = false) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("rezadev-theme", theme);

    if (themeLabel) {
      themeLabel.textContent = theme === "dark" ? "Mode Gelap" : "Mode Terang";
    }

    if (notify) {
      showToast(theme === "dark" ? "Beralih ke Mode Gelap 🌙" : "Beralih ke Mode Terang ☀️");
    }

    // Update theme-color meta tag for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === "dark" ? "#070b12" : "#f8fafc");
    }
  }

  // Initialize theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme, false);

  function toggleThemeAction() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next, true);
  }

  if (themeToggle) themeToggle.addEventListener("click", toggleThemeAction);
  if (footerThemeBtn) footerThemeBtn.addEventListener("click", toggleThemeAction);

  // --- 3. AMBIENT CONSTELLATION CANVAS ---
  const canvas = document.getElementById("ambientCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);

    let mouse = { x: null, y: null, radius: 120 };

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 1.8 + 0.8;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw(isDark) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(0, 245, 212, 0.45)" : "rgba(13, 148, 136, 0.35)";
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.getAttribute("data-theme") !== "light";

      // Connect particles with faint lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 110;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isDark ? 0.18 : 0.09);
            ctx.beginPath();
            ctx.strokeStyle = isDark
              ? `rgba(0, 245, 212, ${alpha})`
              : `rgba(13, 148, 136, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw(isDark);
      });

      requestAnimationFrame(animateParticles);
    }

    requestAnimationFrame(animateParticles);
  }

  // --- 4. CURSOR GLOW EFFECT (DESKTOP) ---
  const cursorGlow = document.getElementById("cursorGlow");
  if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = -500;
    let mouseY = -500;
    let currentX = -500;
    let currentY = -500;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCursor() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();
  }

  // --- 5. DYNAMIC TYPING EFFECT ---
  const typingTextEl = document.getElementById("typingText");
  if (typingTextEl) {
    const roles = [
      "Web Development (HTML, JS) & C++",
      "C++ Algorithm & Computational Logic",
      "Interactive Modern Frontend Architecture",
      "Mahasiswa Teknik Informatika UNESA"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function handleTyping() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 75;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2200; // Pause at end of text
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before typing next
      }

      setTimeout(handleTyping, typingSpeed);
    }

    setTimeout(handleTyping, 600);
  }

  // --- 6. 3D CARD TILT ON MOUSEMOVE ---
  const tiltCards = document.querySelectorAll(".tilt-card");
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((centerY - y) / centerY) * 7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(850px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // --- 7. C++ SOURCE CODES & INTERACTIVE SIMULATOR ---
  const cppCodes = {
    oddEven: `// ==========================================
// PROGRAM CEK BILANGAN GANJIL GENAP
// Penulis: Reza Dwi Kurniawan (UNESA)
// Bahasa : C++ (C++17)
// ==========================================
#include <iostream>

using namespace std;

int main() {
    int bilangan;

    cout << "== PROGRAM CEK BILANGAN GANJIL GENAP ==" << endl;
    cout << "Masukkan bilangan bulat: ";
    cin >> bilangan;

    // Evaluasi menggunakan operasi modulus (%)
    if (bilangan % 2 == 0) {
        cout << ">> Hasil: Angka " << bilangan 
             << " adalah BILANGAN GENAP." << endl;
    } else {
        cout << ">> Hasil: Angka " << bilangan 
             << " adalah BILANGAN GANJIL." << endl;
    }

    return 0;
}`,
    calc: `// ==========================================
// PROGRAM KALKULATOR ARITMATIKA DASAR
// Penulis: Reza Dwi Kurniawan (UNESA)
// Bahasa : C++ (C++17)
// ==========================================
#include <iostream>

using namespace std;

int main() {
    double a, b, hasil;
    char op;

    cout << "== KALKULATOR SEDERHANA ==" << endl;
    cout << "Masukkan angka pertama: ";
    cin >> a;
    cout << "Pilih operator (+, -, *, /): ";
    cin >> op;
    cout << "Masukkan angka kedua: ";
    cin >> b;

    switch (op) {
        case '+':
            hasil = a + b;
            cout << ">> Hasil " << a << " + " << b << " = " << hasil << endl;
            break;
        case '-':
            hasil = a - b;
            cout << ">> Hasil " << a << " - " << b << " = " << hasil << endl;
            break;
        case '*':
            hasil = a * b;
            cout << ">> Hasil " << a << " * " << b << " = " << hasil << endl;
            break;
        case '/':
            if (b != 0) {
                hasil = a / b;
                cout << ">> Hasil " << a << " / " << b << " = " << hasil << endl;
            } else {
                cout << ">> ERROR: Pembagian dengan angka nol tidak terdefinisi!" << endl;
            }
            break;
        default:
            cout << ">> Operator tidak valid!" << endl;
    }

    return 0;
}`,
    timeConvert: `// ==========================================
// PROGRAM KONVERSI SATUAN WAKTU
// Penulis: Reza Dwi Kurniawan (UNESA)
// Bahasa : C++ (C++17)
// ==========================================
#include <iostream>

using namespace std;

int main() {
    int totalDetik, jam, menit, detik, sisaDetik;

    cout << "== PROGRAM KONVERSI SATUAN WAKTU ==" << endl;
    cout << "Masukkan total waktu dalam detik: ";
    cin >> totalDetik;

    // 1 Jam = 3600 Detik
    jam = totalDetik / 3600;
    sisaDetik = totalDetik % 3600;

    // 1 Menit = 60 Detik
    menit = sisaDetik / 60;
    detik = sisaDetik % 60;

    cout << ">> HASIL KONVERSI:" << endl;
    cout << totalDetik << " detik setara dengan:" << endl;
    cout << ">> " << jam << " Jam, " 
         << menit << " Menit, dan " 
         << detik << " Detik." << endl;

    return 0;
}`
  };

  const cppProgramSelect = document.getElementById("cppProgramSelect");
  const formOddEven = document.getElementById("formOddEven");
  const formCalc = document.getElementById("formCalc");
  const formTimeConvert = document.getElementById("formTimeConvert");
  const cppFileName = document.getElementById("cppFileName");
  const cppCodeDisplay = document.getElementById("cppCodeDisplay");
  const cppConsoleBody = document.getElementById("cppConsoleBody");
  const btnClearConsole = document.getElementById("btnClearConsole");
  const btnCopyCppCode = document.getElementById("btnCopyCppCode");

  function syntaxHighlightCpp(code) {
    // Basic escape and keyword highlight
    let escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    escaped = escaped.replace(/(\/\/[^\n]*)/g, '<span class="syn-comment">$1</span>');
    escaped = escaped.replace(/\b(#include|using|namespace|return|if|else|switch|case|break|default)\b/g, '<span class="syn-keyword">$1</span>');
    escaped = escaped.replace(/\b(int|double|char|void|bool|cout|cin|endl)\b/g, '<span class="syn-type">$1</span>');
    escaped = escaped.replace(/(".*?")/g, '<span class="syn-string">$1</span>');

    return escaped;
  }

  function updateCppView(programKey) {
    if (!cppCodeDisplay) return;

    // Show appropriate form
    if (formOddEven) formOddEven.classList.toggle("hidden", programKey !== "oddEven");
    if (formCalc) formCalc.classList.toggle("hidden", programKey !== "calc");
    if (formTimeConvert) formTimeConvert.classList.toggle("hidden", programKey !== "timeConvert");

    // Update file name
    const fileNames = {
      oddEven: "ganjil_genap.cpp",
      calc: "kalkulator_sederhana.cpp",
      timeConvert: "konversi_waktu.cpp"
    };
    if (cppFileName) cppFileName.textContent = fileNames[programKey];

    // Update code view
    const rawCode = cppCodes[programKey] || "";
    cppCodeDisplay.innerHTML = syntaxHighlightCpp(rawCode);
  }

  if (cppProgramSelect) {
    cppProgramSelect.addEventListener("change", (e) => {
      updateCppView(e.target.value);
    });
    // Initial display
    updateCppView("oddEven");
  }

  function appendConsoleLine(text, className = "") {
    if (!cppConsoleBody) return;
    const line = document.createElement("div");
    line.className = `console-line ${className}`;
    line.innerHTML = text;
    cppConsoleBody.appendChild(line);
    cppConsoleBody.scrollTop = cppConsoleBody.scrollHeight;
  }

  // Run Odd/Even
  const btnRunOddEven = document.getElementById("btnRunOddEven");
  const inputOddEven = document.getElementById("inputOddEven");
  if (btnRunOddEven && inputOddEven) {
    btnRunOddEven.addEventListener("click", () => {
      const val = parseInt(inputOddEven.value, 10);
      if (isNaN(val)) {
        appendConsoleLine("&gt;&gt; [ERROR] Harap masukkan angka integer yang valid!", "text-dim");
        return;
      }
      appendConsoleLine(`$ g++ ganjil_genap.cpp -o ganjil_genap &amp;&amp; ./ganjil_genap`, "text-cyan");
      appendConsoleLine(`Masukkan bilangan bulat: ${val}`);
      if (val % 2 === 0) {
        appendConsoleLine(`&gt;&gt; [HASIL] Angka ${val} adalah BILANGAN GENAP (${val} % 2 == 0)`, "text-green");
      } else {
        appendConsoleLine(`&gt;&gt; [HASIL] Angka ${val} adalah BILANGAN GANJIL (${val} % 2 == ${Math.abs(val % 2)})`, "text-cyan");
      }
      appendConsoleLine("&gt;&gt; Selesai dengan kode status 0 (Exit Success).", "text-dim");
    });
  }

  // Run Calc
  const btnRunCalc = document.getElementById("btnRunCalc");
  const calcNum1 = document.getElementById("calcNum1");
  const calcNum2 = document.getElementById("calcNum2");
  const calcOperator = document.getElementById("calcOperator");
  if (btnRunCalc && calcNum1 && calcNum2 && calcOperator) {
    btnRunCalc.addEventListener("click", () => {
      const a = parseFloat(calcNum1.value);
      const b = parseFloat(calcNum2.value);
      const op = calcOperator.value;

      if (isNaN(a) || isNaN(b)) {
        appendConsoleLine("&gt;&gt; [ERROR] Masukkan kedua angka secara valid!", "text-dim");
        return;
      }

      appendConsoleLine(`$ g++ kalkulator.cpp -o kalkulator &amp;&amp; ./kalkulator`, "text-cyan");
      appendConsoleLine(`Angka 1: ${a} | Operator: [ ${op} ] | Angka 2: ${b}`);

      let hasil;
      if (op === "+") hasil = a + b;
      else if (op === "-") hasil = a - b;
      else if (op === "*") hasil = a * b;
      else if (op === "/") {
        if (b === 0) {
          appendConsoleLine("&gt;&gt; [ERROR] Division by zero (Pembagian dengan nol tidak diperbolehkan)!", "text-dim");
          return;
        }
        hasil = a / b;
      }

      appendConsoleLine(`&gt;&gt; [HASIL KALKULASI C++] ${a} ${op} ${b} = ${hasil}`, "text-green");
      appendConsoleLine("&gt;&gt; Selesai dengan kode status 0.", "text-dim");
    });
  }

  // Run Time Conversion
  const btnRunTime = document.getElementById("btnRunTime");
  const inputTimeSeconds = document.getElementById("inputTimeSeconds");
  if (btnRunTime && inputTimeSeconds) {
    btnRunTime.addEventListener("click", () => {
      const totalDetik = parseInt(inputTimeSeconds.value, 10);
      if (isNaN(totalDetik) || totalDetik < 0) {
        appendConsoleLine("&gt;&gt; [ERROR] Masukkan total detik berupa angka positif!", "text-dim");
        return;
      }

      const jam = Math.floor(totalDetik / 3600);
      const sisa = totalDetik % 3600;
      const menit = Math.floor(sisa / 60);
      const detik = sisa % 60;

      appendConsoleLine(`$ g++ konversi_waktu.cpp -o konversi &amp;&amp; ./konversi`, "text-cyan");
      appendConsoleLine(`Masukkan total detik: ${totalDetik}`);
      appendConsoleLine(`&gt;&gt; [HASIL KONVERSI WAKTU]`, "text-cyan");
      appendConsoleLine(`&gt;&gt; ${jam} Jam, ${menit} Menit, ${detik} Detik`, "text-green");
      appendConsoleLine(`&gt;&gt; Formula: ${totalDetik} = (${jam} * 3600) + (${menit} * 60) + ${detik}`, "text-dim");
    });
  }

  // Clear Console
  if (btnClearConsole && cppConsoleBody) {
    btnClearConsole.addEventListener("click", () => {
      cppConsoleBody.innerHTML = `
        <div class="console-line text-cyan">$ console cleared</div>
        <div class="console-line text-dim">Siap menjalankan program C++ berikutnya...</div>
      `;
      showToast("Terminal console dibersihkan.");
    });
  }

  // Copy C++ Code
  if (btnCopyCppCode) {
    btnCopyCppCode.addEventListener("click", () => {
      const prog = cppProgramSelect ? cppProgramSelect.value : "oddEven";
      const code = cppCodes[prog] || "";
      navigator.clipboard.writeText(code).then(() => {
        showToast("Kode C++ berhasil disalin ke clipboard! 📋");
      });
    });
  }

  // --- 8. CODE HUB TABS NAVIGATION ---
  const hubTabs = document.querySelectorAll(".hub-tab");
  const hubPanels = document.querySelectorAll(".hub-panel");

  hubTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      hubTabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      hubPanels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      const targetId = tab.dataset.tab;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  // --- 9. JAVASCRIPT PLAYGROUND INTERACTIVE DEMO ---
  const jsTextModifier = document.getElementById("jsTextModifier");
  const previewHeading = document.getElementById("previewHeading");
  const bubbleBtns = document.querySelectorAll(".bubble-btn");
  const btnCopyJsCode = document.getElementById("btnCopyJsCode");

  if (jsTextModifier && previewHeading) {
    jsTextModifier.addEventListener("input", (e) => {
      previewHeading.textContent = e.target.value.trim() || "Ketik sesuatu di atas...";
    });
  }

  bubbleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      bubbleBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const color = btn.dataset.color;
      if (previewHeading) previewHeading.style.color = color;
    });
  });

  if (btnCopyJsCode) {
    btnCopyJsCode.addEventListener("click", () => {
      const jsSnippet = document.getElementById("jsCodeSnippet");
      if (jsSnippet) {
        navigator.clipboard.writeText(jsSnippet.innerText).then(() => {
          showToast("Script JavaScript berhasil disalin! 🚀");
        });
      }
    });
  }

  // Copy Profile Code
  const copyProfileBtn = document.getElementById("copyProfileBtn");
  const profileCodeSnippet = document.getElementById("profileCodeSnippet");
  if (copyProfileBtn && profileCodeSnippet) {
    copyProfileBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(profileCodeSnippet.innerText).then(() => {
        showToast("Objek profil Reza berhasil disalin! 💻");
      });
    });
  }

  // --- 10. SKILLS FILTERING ---
  const filterChips = document.querySelectorAll(".filter-chip");
  const skillCards = document.querySelectorAll(".skill-card");

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const category = chip.dataset.filter;

      skillCards.forEach((card) => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 30);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(12px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 250);
        }
      });
    });
  });

  // --- 11. STATS COUNTER ANIMATION ---
  const statNumbers = document.querySelectorAll(".stat-number");
  let statsCounted = false;

  function countUpStats() {
    if (statsCounted) return;
    statsCounted = true;

    statNumbers.forEach((el) => {
      const target = parseInt(el.dataset.target, 10) || 0;
      let count = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = count;
        }
      }, 35);
    });
  }

  // Trigger counters when hero enters view
  const heroSection = document.getElementById("home");
  if (heroSection) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          countUpStats();
          heroObserver.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    heroObserver.observe(heroSection);
  }

  // --- 12. PROJECT MODAL PREVIEW ---
  const projectModal = document.getElementById("projectModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalCloseSecondary = document.getElementById("modalCloseSecondary");
  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalDesc = document.getElementById("modalDesc");

  function openProjectModal(imgSrc, title, desc) {
    if (!projectModal) return;
    modalImage.src = imgSrc;
    modalImage.alt = `Screenshot ${title}`;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    projectModal.classList.add("active");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove("active");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Bind all preview buttons
  const previewButtons = document.querySelectorAll(".project-preview-btn, .open-modal-btn");
  previewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const imgSrc = btn.dataset.img;
      const title = btn.dataset.title;
      const desc = btn.dataset.desc;
      openProjectModal(imgSrc, title, desc);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProjectModal);
  if (modalCloseSecondary) modalCloseSecondary.addEventListener("click", closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeProjectModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && projectModal && projectModal.classList.contains("active")) {
      closeProjectModal();
    }
  });

  // --- 13. SCROLL REVEAL & NAVIGATION ACTIVE STATE ---
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // Nav Scroll Spy
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll("main section[id]");

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navItems.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );
  sections.forEach((s) => navObserver.observe(s));

  // --- 14. MOBILE NAVIGATION TOGGLE ---
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- 15. CONTACT FORM VALIDATION & SIMULATION ---
  const contactForm = document.getElementById("contactForm");
  const senderName = document.getElementById("senderName");
  const senderEmail = document.getElementById("senderEmail");
  const senderMessage = document.getElementById("senderMessage");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const formSuccessBanner = document.getElementById("formSuccessBanner");
  const btnSubmitMessage = document.getElementById("btnSubmitMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!senderName.value.trim()) {
        nameError.textContent = "Nama wajib diisi.";
        isValid = false;
      } else {
        nameError.textContent = "";
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!senderEmail.value.trim()) {
        emailError.textContent = "Email wajib diisi.";
        isValid = false;
      } else if (!emailRegex.test(senderEmail.value.trim())) {
        emailError.textContent = "Format email tidak valid (contoh@domain.com).";
        isValid = false;
      } else {
        emailError.textContent = "";
      }

      // Validate Message
      if (!senderMessage.value.trim()) {
        messageError.textContent = "Pesan wajib diisi.";
        isValid = false;
      } else if (senderMessage.value.trim().length < 8) {
        messageError.textContent = "Pesan minimal terdiri dari 8 karakter.";
        isValid = false;
      } else {
        messageError.textContent = "";
      }

      if (isValid) {
        btnSubmitMessage.disabled = true;
        btnSubmitMessage.innerHTML = `
          <span>Mengirim Pesan...</span>
        `;

        setTimeout(() => {
          formSuccessBanner.classList.remove("hidden");
          contactForm.reset();
          btnSubmitMessage.disabled = false;
          btnSubmitMessage.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            <span>Kirim Pesan Sekarang</span>
          `;
          showToast("Pesan Anda berhasil dikirim! Terima kasih. 🎉");

          setTimeout(() => {
            formSuccessBanner.classList.add("hidden");
          }, 6000);
        }, 1200);
      }
    });
  }

  // --- 16. INSTANT COPY EMAIL BUTTONS ---
  const copyEmailBtns = document.querySelectorAll(".copy-email-btn");
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const email = btn.dataset.email || "rdwik1190@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email disalin: ${email} 📬`);
      });
    });
  });

  // --- 17. DYNAMIC YEAR ---
  const currentYearEl = document.getElementById("currentYear");
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
});
