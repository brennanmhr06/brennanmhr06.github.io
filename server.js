document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const typewriterPhrases = [
      "Full Stack Developer · Tech Enjoyer",
      "Plant & Animal Lover · Full-Stack Dev",
      "Always building something new or fixing something old"
    ];
    let phraseIndex = 0, charIndex = 0, typing = true;
    function type() {
      const phrase = typewriterPhrases[phraseIndex];
      if (typing) {
        if (charIndex < phrase.length) {
          typewriterEl.textContent = phrase.slice(0, charIndex + 1);
          charIndex++;
          setTimeout(type, 55);
        } else {
          typing = false;
          setTimeout(type, 1200);
        }
      } else {
        if (charIndex > 0) {
          typewriterEl.textContent = phrase.slice(0, charIndex - 1);
          charIndex--;
          setTimeout(type, 30);
        } else {
          typing = true;
          phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
          setTimeout(type, 600);
        }
      }
    }
    type();
  }

  async function loadProjects() {
    const user = "brennanmhr06";
    const orgs = ["fluent-lang-apps", "Guardians-Stuff"];
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;
    projectsList.textContent = "Loading...";
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
        fetchRepos(`https://api.github.com/users/${user}/repos?per_page=100&type=public`),
        ...orgs.map(org => fetchRepos(`https://api.github.com/orgs/${org}/repos?per_page=100&type=public`))
      ]);
      const allRepos = uniqueBy(
        [...(userRepos || []), ...orgReposArr.flat()],
        "full_name"
      );
      const publicRepos = allRepos
        .filter(repo => !repo.fork && !repo.archived)
        .sort((a, b) => b.stargazers_count - a.stargazers_count);
      if (publicRepos.length === 0) {
        projectsList.innerHTML = "<p>No public projects found.</p>";
        return;
      }
      const displayRepos = publicRepos.slice(0, 12);
      const html = `
        <ul class="cozy-projects-list">
          ${displayRepos.map(repo => `
            <li class="cozy-project-card">
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                <div class="project-thumb">
                  <img src="https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}" alt="${repo.name}" loading="lazy">
                </div>
                <div class="project-content">
                  <div class="project-header">
                    <span>${repo.name}</span>
                  </div>
                  <div class="project-desc">
                    ${repo.description ? repo.description.replace(/</g,"&lt;").replace(/>/g,"&gt;") : "<em>No description</em>"}
                  </div>
                  <div class="project-meta">
                    ${repo.language ? `<span>${repo.language}</span>` : ""}
                    ${repo.stargazers_count ? `<span>⭐ ${repo.stargazers_count}</span>` : ""}
                    <span>Updated ${new Date(repo.pushed_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </a>
            </li>
          `).join("")}
        </ul>
      `;
      projectsList.innerHTML = html;
    } catch {
      projectsList.innerHTML = "<p>Failed to load projects from GitHub.</p>";
    }
  }

  loadProjects();
});
