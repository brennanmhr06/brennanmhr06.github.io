document.addEventListener("DOMContentLoaded", () => {
  // Theme switching functionality
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-toggle__icon');

  // Check for saved theme preference or default to dark mode
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  // Theme toggle event listener
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      // Update theme
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  // Update theme icon based on current theme
  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Enhanced floating particles with varied effects
  function createParticles() {
    const particlesContainer = document.getElementById("particles");
    if (!particlesContainer) return;

    const particleCount = 60;
    const particleTypes = [
      'particle--small', 'particle--medium', 'particle--large',
      'particle--glow', 'particle--pulse', 'particle--cyan', 'particle--purple'
    ];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      const randomType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      particle.className = `particle ${randomType}`;
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 25 + "s";
      particle.style.animationDuration = (12 + Math.random() * 15) + "s";

      particlesContainer.appendChild(particle);
    }
  }

  createParticles();

  // Advanced scroll animations with enhanced Intersection Observer
  const observerOptions = {
    threshold: [0.1, 0.3, 0.6],
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const ratio = entry.intersectionRatio;
        entry.target.classList.add("visible");
        entry.target.style.setProperty('--scroll-ratio', ratio);

        // Add staggered animation for child elements
        const children = entry.target.querySelectorAll('.chips li, .project-card');
        children.forEach((child, index) => {
          setTimeout(() => {
            child.classList.add('animate-in');
          }, index * 100);
        });
      }
    });
  }, observerOptions);

  // Observe all section inner elements
  const sectionInners = document.querySelectorAll(".section__inner");
  sectionInners.forEach((inner) => {
    observer.observe(inner);
  });

  // Enhanced typewriter effect with more phrases and better timing
  const typewriterEl = document.getElementById("typewriter");
  if (typewriterEl) {
    const typewriterPhrases = [
      "Full Stack Developer · Tech Enjoyer",
      "Plant & Animal Lover · Full-Stack Dev",
    ];

    let phraseIndex = 0, charIndex = 0, typing = true;
    let cursorVisible = true;

    // Cursor blink effect
    setInterval(() => {
      cursorVisible = !cursorVisible;
      typewriterEl.style.borderRight = cursorVisible ? '2px solid var(--accent)' : '2px solid transparent';
    }, 500);

    function type() {
      const phrase = typewriterPhrases[phraseIndex];
      if (typing) {
        if (charIndex < phrase.length) {
          typewriterEl.textContent = phrase.slice(0, charIndex + 1);
          charIndex++;
          setTimeout(type, 50 + Math.random() * 30);
        } else {
          typing = false;
          setTimeout(type, 2000 + Math.random() * 1000);
        }
      } else {
        if (charIndex > 0) {
          typewriterEl.textContent = phrase.slice(0, charIndex - 1);
          charIndex--;
          setTimeout(type, 25 + Math.random() * 15);
        } else {
          typing = true;
          phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
          setTimeout(type, 500);
        }
      }
    }

    // Start typewriter with delay
    setTimeout(() => {
      typewriterEl.style.borderRight = '2px solid var(--accent)';
      type();
    }, 1000);
  }

  // Enhanced project loading with skeleton cards
  async function loadProjects() {
    const user = "brennanmhr06";
    const orgs = ["fluent-lang-apps", "Guardians-Stuff"];
    const projectsList = document.getElementById("projects-list");
    if (!projectsList) return;

    // Show skeleton loading cards
    projectsList.innerHTML = `
      <div class="projects-grid">
        ${Array(6).fill('').map(() => `
          <div class="skeleton-card">
            <div class="skeleton-card__thumb"></div>
            <div class="skeleton-card__body">
              <div class="skeleton-card__title"></div>
              <div class="skeleton-card__desc"></div>
              <div class="skeleton-card__meta"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    const fetchRepos = async (url) => {
      const response = await fetch(url);
      if (!response.ok) return [];
      return response.json();
    };

    function uniqueBy(repos, key) {
      const seen = new Set();
      return repos.filter((repo) => {
        if (seen.has(repo[key])) return false;
        seen.add(repo[key]);
        return true;
      });
    }

    try {
      const [userRepos, ...orgReposArr] = await Promise.all([
        fetchRepos(
          `https://api.github.com/users/${user}/repos?per_page=100&type=public`,
        ),
        ...orgs.map((org) =>
          fetchRepos(
            `https://api.github.com/orgs/${org}/repos?per_page=100&type=public`,
          ),
        ),
      ]);

      const allRepos = uniqueBy(
        [...(userRepos || []), ...orgReposArr.flat()],
        "full_name",
      );

      const publicRepos = allRepos
        .filter((repo) => !repo.fork && !repo.archived)
        .sort((a, b) => b.stargazers_count - a.stargazers_count);

      if (publicRepos.length === 0) {
        projectsList.innerHTML = "<p>No public projects found.</p>";
        return;
      }

      const displayRepos = publicRepos.slice(0, 12);
      const html = `
        <ul class="projects-grid">
          ${displayRepos
          .map(
            (repo, i) => `
            <li class="project-card" style="animation-delay: ${i * 0.1}s">
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                <div class="project-card__thumb">
                  <img src="https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}" alt="" loading="lazy">
                  <div class="project-card__overlay">
                    <div class="project-card__stars">★ ${repo.stargazers_count}</div>
                  </div>
                </div>
                <div class="project-card__body">
                  <h3 class="project-card__title">${repo.name}</h3>
                  <p class="project-card__desc">${repo.description ? repo.description.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "No description"}</p>
                  <div class="project-card__meta">
                    ${repo.language ? `<span class="tech-tag">${repo.language}</span>` : ""}
                    <span class="date-tag">${new Date(repo.pushed_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </a>
            </li>
          `,
          )
          .join("")}
        </ul>
      `;

      projectsList.innerHTML = html;

      // Re-trigger animations for newly loaded projects
      setTimeout(() => {
        const cards = projectsList.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('animate-in');
          }, index * 100);
        });
      }, 100);

    } catch {
      projectsList.innerHTML = "<p>Failed to load projects from GitHub.</p>";
    }
  }

  loadProjects();

  // Simplified 3D tilt effects (performance optimized)
  function init3DTiltEffect() {
    const tiltElements = document.querySelectorAll('.project-card');

    tiltElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Reduced intensity
        const rotateY = ((x - centerX) / centerX) * 10;  // Reduced intensity

        element.style.setProperty('--tilt-x', `${rotateX}deg`);
        element.style.setProperty('--tilt-y', `${rotateY}deg`);
      });

      element.addEventListener('mouseleave', () => {
        element.style.setProperty('--tilt-x', '0deg');
        element.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  init3DTiltEffect();

  // Remove magnetic cursor effect (performance issue)
  // function initMagneticCursor() {
  //   const cursor = document.createElement('div');
  //   cursor.className = 'magnetic-cursor';
  //   const cursorDot = document.createElement('div');
  //   cursorDot.className = 'magnetic-cursor-dot';
  //
  //   document.body.appendChild(cursor);
  //   document.body.appendChild(cursorDot);
  //
  //   let mouseX = 0, mouseY = 0;
  //   let cursorX = 0, cursorY = 0;
  //   let cursorDotX = 0, cursorDotY = 0;
  //
  //   document.addEventListener('mousemove', (e) => {
  //     mouseX = e.clientX;
  //     mouseY = e.clientY;
  //   });
  //
  //   function animateCursor() {
  //     const cursorSpeed = 0.1;
  //     const dotSpeed = 0.3;
  //
  //     cursorX += (mouseX - cursorX) * cursorSpeed;
  //     cursorY += (mouseY - cursorY) * cursorSpeed;
  //
  //     cursorDotX += (mouseX - cursorDotX) * dotSpeed;
  //     cursorDotY += (mouseY - cursorDotY) * dotSpeed;
  //
  //     cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
  //     cursorDot.style.transform = `translate(${cursorDotX - 2}px, ${cursorDotY - 2}px)`;
  //
  //     requestAnimationFrame(animateCursor);
  //   }
  //
  //   animateCursor();
  //
  //   // Magnetic effect on interactive elements
  //   const magneticElements = document.querySelectorAll('.nav__links a, .badge, .chips li, .project-card');
  //
  //   magneticElements.forEach(element => {
  //     element.addEventListener('mouseenter', () => {
  //       cursor.style.transform += ' scale(1.5)';
  //       cursorDot.style.transform += ' scale(0.5)';
  //     });
  //
  //     element.addEventListener('mouseleave', () => {
  //       cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
  //       cursorDot.style.transform = cursorDot.style.transform.replace(' scale(0.5)', '');
  //     });
  //   });
  // }

  // Don't initialize magnetic cursor (performance optimization)
  // if (window.innerWidth > 768) {
  //   initMagneticCursor();
  // }

  // Add smooth scroll behavior for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Enhanced parallax scrolling effect
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero::before, .grid-overlay, .bg-gradient');

    parallaxElements.forEach(element => {
      const speed = element.classList.contains('hero::before') ? 0.5 : 0.2;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });

  // Add parallax effect on scroll
  let ticking = false;
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero__avatar, .hero__name');

    parallaxElements.forEach((element, index) => {
      const speed = 0.5 + (index * 0.2);
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick);

  // Simplified scroll effects (performance optimized)
  function initPageTransitions() {
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Update scroll indicator only
    function updateScrollIndicator() {
      const scrolled = window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrolled / maxScroll;

      if (scrollIndicator) {
        scrollIndicator.style.transform = `scaleX(${scrollPercent})`;
      }
    }

    window.addEventListener('scroll', updateScrollIndicator);

    // Smooth page transitions for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          // Add active state to clicked link
          document.querySelectorAll('.nav__links a').forEach(link => {
            link.classList.remove('active');
          });
          this.classList.add('active');

          // Smooth scroll to target
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  initPageTransitions();

  // Add mouse move effect for hero section
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = hero.getBoundingClientRect();

      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;

      const avatar = hero.querySelector('.hero__avatar');
      if (avatar) {
        avatar.style.transform = `translate(${x * 20}px, ${y * 20}px) scale(1.05)`;
      }
    });

    hero.addEventListener('mouseleave', () => {
      const avatar = hero.querySelector('.hero__avatar');
      if (avatar) {
        avatar.style.transform = 'translate(0, 0) scale(1)';
      }
    });
  }

  // Simplified initialization (performance optimized)
  function initializeAllEffects() {
    // Add loading transition
    document.body.classList.add('loading-transition');
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);

    // Simplified 3D tilt for dynamically loaded content only
    setTimeout(() => {
      const newElements = document.querySelectorAll('.project-card:not(.tilt-initialized)');
      newElements.forEach(element => {
        element.classList.add('tilt-initialized');

        element.addEventListener('mousemove', (e) => {
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -10;
          const rotateY = ((x - centerX) / centerX) * 10;

          element.style.setProperty('--tilt-x', `${rotateX}deg`);
          element.style.setProperty('--tilt-y', `${rotateY}deg`);
        });

        element.addEventListener('mouseleave', () => {
          element.style.setProperty('--tilt-x', '0deg');
          element.style.setProperty('--tilt-y', '0deg');
        });
      });
    }, 2000);
  }

  initializeAllEffects();

});
