class ContentManager {
  constructor() {
    this.content = {};
    this.publishedContent = {};
    this.isAdmin = true; // Dashboard is only for admin
    this.init();
  }

  async init() {
    await this.loadContent();
    this.loadPublishedContent();
    this.populateAllSections();
    this.setupSidebarNavigation();
    this.setupSectionSaves();
    this.setupSkillsHandlers();
    this.setupServicesHandlers();
    this.setupAppearanceHandlers();
    this.setupPreviewHandlers();
    this.showToast('Dashboard loaded', false);
  }

  async loadContent() {
    try {
      const doc = await db.collection('portfolio').doc('content').get();
      if (doc.exists) {
        this.content = doc.data();
      } else {
        this.content = this.getDefaultContent();
        await db.collection('portfolio').doc('content').set(this.content);
      }
    } catch (e) {
      this.showToast('Error loading content: ' + e.message, true);
    }
  }

  async loadPublishedContent() {
    // Optionally, keep a separate published version for reset
    try {
      const doc = await db.collection('portfolio').doc('published').get();
      if (doc.exists) {
        this.publishedContent = doc.data();
      } else {
        this.publishedContent = JSON.parse(JSON.stringify(this.content));
        await db.collection('portfolio').doc('published').set(this.publishedContent);
      }
    } catch (e) {
      this.showToast('Error loading published content: ' + e.message, true);
    }
  }

  getDefaultContent() {
    return {
      home: {
        title: "Hello, I'm Muhammad Umar",
        subtitle: "Frontend Developer",
        description: "Creating modern and responsive web designs",
        image: "profile.jpeg",
        social: {
          facebook: "https://www.facebook.com/share/1C65hAUAZ6/",
          linkedin: "https://www.linkedin.com/in/muhammad-umar-ansari-26a456355",
          instagram: "https://www.instagram.com/u_m_a_r_i_302"
        }
      },
      about: {
        name: "Muhammad Umar",
        title: "Frontend Developer",
        description: "I am a dedicated and passionate Frontend Developer...",
        email: "umar@example.com",
        location: "Pakistan",
        image: "profile.jpeg",
        resume: "umar cv.pdf"
      },
      skills: [
        { name: "HTML", level: "90%" },
        { name: "CSS", level: "85%" }
      ],
      services: [
        { title: "Web Design", description: "Modern web design services" }
      ],
      contact: {
        image: "img1.png",
        heading: "Contact Me"
      },
      appearance: {
        primary: "#00ff99",
        secondary: "#00cc77",
        accent: "#00aaff",
        darkMode: "auto"
      }
    };
  }

  // --------- UI POPULATION ---------
  populateAllSections() {
    this.populateHome();
    this.populateAbout();
    this.populateSkills();
    this.populateServices();
    this.populateContact();
    this.populateAppearance();
  }

  populateHome() {
    const h = this.content.home || {};
    document.getElementById('home-title').value = h.title || '';
    document.getElementById('home-subtitle').value = h.subtitle || '';
    document.getElementById('home-description').value = h.description || '';
    document.getElementById('home-image').value = h.image || '';
    document.getElementById('facebook-link').value = h.social?.facebook || '';
    document.getElementById('linkedin-link').value = h.social?.linkedin || '';
    document.getElementById('instagram-link').value = h.social?.instagram || '';
  }

  populateAbout() {
    const a = this.content.about || {};
    document.getElementById('about-name').value = a.name || '';
    document.getElementById('about-title').value = a.title || '';
    document.getElementById('about-description').value = a.description || '';
    document.getElementById('about-email').value = a.email || '';
    document.getElementById('about-location').value = a.location || '';
    document.getElementById('about-image').value = a.image || '';
    document.getElementById('about-resume').value = a.resume || '';
  }

  populateSkills() {
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';
    (this.content.skills || []).forEach((skill, idx) => {
      const div = document.createElement('div');
      div.className = 'skill-item';
      div.innerHTML = `
        <span>${skill.name} (${skill.level})</span>
        <button class="btn btn-danger btn-sm" data-index="${idx}" title="Remove"><i class="fas fa-trash"></i></button>
      `;
      skillsList.appendChild(div);
    });
    // Add remove handlers
    skillsList.querySelectorAll('button[data-index]').forEach(btn => {
      btn.onclick = () => this.removeSkill(parseInt(btn.dataset.index));
    });
  }

  populateServices() {
    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = '';
    (this.content.services || []).forEach((service, idx) => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <div class="card-header">
          <h3>${service.title}</h3>
          <button class="btn btn-danger btn-sm" data-index="${idx}" title="Remove"><i class="fas fa-trash"></i></button>
        </div>
        <div class="card-body">
          <p>${service.description}</p>
        </div>
      `;
      servicesList.appendChild(div);
    });
    // Add remove handlers
    servicesList.querySelectorAll('button[data-index]').forEach(btn => {
      btn.onclick = () => this.removeService(parseInt(btn.dataset.index));
    });
  }

  populateContact() {
    const c = this.content.contact || {};
    document.getElementById('contact-image').value = c.image || '';
    document.getElementById('contact-heading').value = c.heading || '';
  }

  populateAppearance() {
    const a = this.content.appearance || {};
    document.getElementById('primary-color').value = a.primary || '#00ff99';
    document.getElementById('secondary-color').value = a.secondary || '#00cc77';
    document.getElementById('accent-color').value = a.accent || '#00aaff';
    document.getElementById('dark-mode').value = a.darkMode || 'auto';
  }

  // --------- SIDEBAR NAV ---------
  setupSidebarNavigation() {
    document.querySelectorAll('.sidebar-menu ul li a[data-section]').forEach(link => {
      link.onclick = (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        document.querySelectorAll('.sidebar-menu ul li a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active-section'));
        if (document.getElementById(section + '-section'))
          document.getElementById(section + '-section').classList.add('active-section');
        document.getElementById('current-section').textContent = link.textContent.trim();
      };
    });
  }

  // --------- SAVE BUTTONS ---------
  setupSectionSaves() {
    document.getElementById('save-home').onclick = () => this.saveHome();
    document.getElementById('save-about').onclick = () => this.saveAbout();
    document.getElementById('save-skills').onclick = () => this.saveSkills();
    document.getElementById('save-services').onclick = () => this.saveServices();
    document.getElementById('save-contact').onclick = () => this.saveContact();
    document.getElementById('save-appearance').onclick = () => this.saveAppearance();
  }

  async saveHome() {
    this.content.home = {
      title: document.getElementById('home-title').value,
      subtitle: document.getElementById('home-subtitle').value,
      description: document.getElementById('home-description').value,
      image: document.getElementById('home-image').value,
      social: {
        facebook: document.getElementById('facebook-link').value,
        linkedin: document.getElementById('linkedin-link').value,
        instagram: document.getElementById('instagram-link').value
      }
    };
    await this.saveContent();
    this.showToast('Home section saved');
  }

  async saveAbout() {
    this.content.about = {
      name: document.getElementById('about-name').value,
      title: document.getElementById('about-title').value,
      description: document.getElementById('about-description').value,
      email: document.getElementById('about-email').value,
      location: document.getElementById('about-location').value,
      image: document.getElementById('about-image').value,
      resume: document.getElementById('about-resume').value
    };
    await this.saveContent();
    this.showToast('About section saved');
  }

  async saveSkills() {
    // Already handled by add/remove, just save
    await this.saveContent();
    this.showToast('Skills saved');
  }

  async saveServices() {
    // Already handled by add/remove, just save
    await this.saveContent();
    this.showToast('Services saved');
  }

  async saveContact() {
    this.content.contact = {
      image: document.getElementById('contact-image').value,
      heading: document.getElementById('contact-heading').value
    };
    await this.saveContent();
    this.showToast('Contact section saved');
  }

  async saveAppearance() {
    this.content.appearance = {
      primary: document.getElementById('primary-color').value,
      secondary: document.getElementById('secondary-color').value,
      accent: document.getElementById('accent-color').value,
      darkMode: document.getElementById('dark-mode').value
    };
    await this.saveContent();
    this.showToast('Appearance settings saved');
  }

  async saveContent() {
    await db.collection('portfolio').doc('content').set(this.content);
    this.populateAllSections();
    this.updatePreview();
  }

  // --------- SKILLS HANDLERS ---------
  setupSkillsHandlers() {
    document.getElementById('add-skill').onclick = () => {
      const name = document.getElementById('new-skill-name').value.trim();
      const level = document.getElementById('new-skill-level').value.trim();
      if (!name || !level) return this.showToast('Enter skill name and level', true);
      if (!this.content.skills) this.content.skills = [];
      this.content.skills.push({ name, level });
      document.getElementById('new-skill-name').value = '';
      document.getElementById('new-skill-level').value = '';
      this.populateSkills();
      this.saveSkills();
    };
  }

  removeSkill(idx) {
    if (this.content.skills && this.content.skills[idx]) {
      this.content.skills.splice(idx, 1);
      this.populateSkills();
      this.saveSkills();
    }
  }

  // --------- SERVICES HANDLERS ---------
  setupServicesHandlers() {
    document.getElementById('add-service').onclick = () => {
      const title = document.getElementById('new-service-title').value.trim();
      const description = document.getElementById('new-service-description').value.trim();
      if (!title || !description) return this.showToast('Enter service title and description', true);
      if (!this.content.services) this.content.services = [];
      this.content.services.push({ title, description });
      document.getElementById('new-service-title').value = '';
      document.getElementById('new-service-description').value = '';
      this.populateServices();
      this.saveServices();
    };
  }

  removeService(idx) {
    if (this.content.services && this.content.services[idx]) {
      this.content.services.splice(idx, 1);
      this.populateServices();
      this.saveServices();
    }
  }

  // --------- APPEARANCE HANDLERS ---------
  setupAppearanceHandlers() {
    // Optionally, update CSS variables live
    ['primary-color', 'secondary-color', 'accent-color'].forEach(id => {
      document.getElementById(id).oninput = () => {
        document.documentElement.style.setProperty('--' + id.replace('-color', '') + '-color', document.getElementById(id).value);
      };
    });
    document.getElementById('dark-mode').onchange = () => {
      // Implement dark mode toggle if needed
    };
  }

  // --------- PREVIEW/PUBLISH/RESET ---------
  setupPreviewHandlers() {
    document.getElementById('open-preview').onclick = () => {
      document.getElementById('preview-container').classList.add('active');
      this.updatePreview();
    };
    document.getElementById('close-preview').onclick = () => {
      document.getElementById('preview-container').classList.remove('active');
    };
    document.getElementById('publish-changes').onclick = () => this.publishChanges();
    document.getElementById('reset-changes').onclick = () => this.resetToPublished();
  }

  updatePreview() {
    // Send content to iframe via postMessage or reload iframe
    const iframe = document.getElementById('portfolio-preview');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'updateContent', content: this.content }, '*');
    }
  }

  async publishChanges() {
    await db.collection('portfolio').doc('published').set(this.content);
    this.publishedContent = JSON.parse(JSON.stringify(this.content));
    this.showToast('Changes published!');
  }

  async resetToPublished() {
    if (!this.publishedContent) return;
    this.content = JSON.parse(JSON.stringify(this.publishedContent));
    await db.collection('portfolio').doc('content').set(this.content);
    this.populateAllSections();
    this.showToast('Reset to last published version');
  }

  // --------- TOAST ---------
  showToast(msg, isError = false) {
    let toast = document.createElement('div');
    toast.className = 'toast-message ' + (isError ? 'error' : 'success');
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.remove(); }, 300);
    }, 2500);
  }
}

// Initialize
window.contentManager = new ContentManager();
