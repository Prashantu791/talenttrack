/**
 * TalentTrack Hiring Platform Interactive Engine
 * - Strict role isolation (Candidates only see Candidate Dashboard & Openings)
 * - Auto-dismissing login banner (no continue click required)
 * - Round-by-round score matrix out of 10 across CV, Tech, and HR rounds
 * - Tech Interviewer scoring & shortlisting advancing candidates to Final HR
 */

(function () {
  'use strict';

  const API_BASE = 'http://localhost:3000/api';

  // 11 Company Openings
  const JOBS = [
    {
      id: "job-fresher-1",
      title: "Graduate Engineer Trainee (GET)",
      tier: "Fresher",
      department: "Core Engineering",
      experience: "0 - 1 Yr",
      location: "Bengaluru (Hybrid)",
      salary: "₹6.5 - 9.0 LPA",
      skills: ["Data Structures", "Java", "Python", "SQL"]
    },
    {
      id: "job-fresher-2",
      title: "Associate Frontend Developer",
      tier: "Fresher",
      department: "Web Engineering",
      experience: "0 - 2 Yrs",
      location: "Bengaluru (In-Office)",
      salary: "₹7.0 - 10.5 LPA",
      skills: ["JavaScript", "HTML5/CSS3", "React Basics", "Git"]
    },
    {
      id: "job-fresher-3",
      title: "Junior QA Automation Engineer",
      tier: "Fresher",
      department: "Quality Engineering",
      experience: "0 - 2 Yrs",
      location: "Pune / Bengaluru",
      salary: "₹6.0 - 9.5 LPA",
      skills: ["Python", "Selenium", "Manual Testing", "Postman"]
    },
    {
      id: "job-fresher-4",
      title: "Junior Data Analyst",
      tier: "Fresher",
      department: "Data & Analytics",
      experience: "0 - 1 Yr",
      location: "Hyderabad / Remote",
      salary: "₹6.5 - 9.0 LPA",
      skills: ["SQL", "Excel", "Power BI", "Python (Pandas)"]
    },
    {
      id: "job-mid-1",
      title: "Software Development Engineer II (Backend)",
      tier: "Mid-Level",
      department: "Core Engineering",
      experience: "2 - 5 Yrs",
      location: "Bengaluru (Hybrid)",
      salary: "₹18.0 - 26.0 LPA",
      skills: ["Golang", "Java", "Microservices", "PostgreSQL", "Docker"]
    },
    {
      id: "job-mid-2",
      title: "Product Designer (UI/UX)",
      tier: "Mid-Level",
      department: "Product Design",
      experience: "2 - 4 Yrs",
      location: "Mumbai / Bengaluru",
      salary: "₹15.0 - 22.0 LPA",
      skills: ["Figma", "Design Systems", "User Research", "Wireframing"]
    },
    {
      id: "job-mid-3",
      title: "DevOps & Cloud Engineer",
      tier: "Mid-Level",
      department: "Infrastructure",
      experience: "3 - 5 Yrs",
      location: "Bengaluru",
      salary: "₹17.0 - 25.0 LPA",
      skills: ["AWS", "Terraform", "Kubernetes", "CI/CD", "Linux"]
    },
    {
      id: "job-senior-1",
      title: "Lead Frontend Engineer",
      tier: "Senior-Level",
      department: "Web Engineering",
      experience: "6 - 10 Yrs",
      location: "Bengaluru (Hybrid)",
      salary: "₹34.0 - 48.0 LPA",
      skills: ["Microfrontends", "React Architecture", "Web Workers", "System Design"]
    },
    {
      id: "job-senior-2",
      title: "Senior Backend Architect (Go/Distributed)",
      tier: "Senior-Level",
      department: "Core Engineering",
      experience: "7 - 12 Yrs",
      location: "Pune / Bengaluru",
      salary: "₹40.0 - 55.0 LPA",
      skills: ["Golang", "Raft Consensus", "Kafka", "gRPC", "Distributed Systems"]
    },
    {
      id: "job-senior-3",
      title: "Staff Machine Learning Engineer",
      tier: "Senior-Level",
      department: "Artificial Intelligence",
      experience: "6 - 11 Yrs",
      location: "Bengaluru",
      salary: "₹45.0 - 62.0 LPA",
      skills: ["PyTorch", "LLM Fine-Tuning", "CUDA", "vLLM", "Model Optimization"]
    },
    {
      id: "job-senior-4",
      title: "Principal DevOps Architect",
      tier: "Senior-Level",
      department: "Infrastructure",
      experience: "8 - 14 Yrs",
      location: "Bengaluru",
      salary: "₹45.0 - 65.0 LPA",
      skills: ["Kubernetes Mesh", "Terraform Cloud", "Zero-Trust", "Observability"]
    }
  ];

  // =========================================================================
  // CENTRALIZED RECRUITMENT & INTERVIEWER STAFF CONFIGURATION
  // Whenever an HR or Interviewer retires or joins, UPDATE THEIR DETAILS HERE!
  // All login dropdowns, dashboards, roadmap evaluators, congratulation cards,
  // offer letters, and audit logs will automatically synchronize with this.
  // =========================================================================
  const PERSONAS = {
    candidate: {
      name: "Rahul Sharma",
      email: "rahul@talenttrack.com",
      role: "candidate",
      title: "Candidate",
      initials: "RS"
    },
    hr_screener: {
      name: "Neha Gupta",
      email: "neha@talenttrack.com",
      role: "hr_screener",
      title: "HR Recruiter",
      badgeIcon: "👩‍💼",
      workspaceTitle: "CV Shortlisting & Academic Screening",
      workspaceDesc: "Review incoming profiles, evaluate candidate resume credentials out of 10, and shortlist for the Technical Round.",
      initials: "NG"
    },
    tech_interviewer: {
      name: "Vikram Malhotra",
      email: "vikram@talenttrack.com",
      role: "tech_interviewer",
      title: "Tech Round Interviewer",
      badgeIcon: "👨‍💻",
      workspaceTitle: "Technical Round Evaluation & Scoring",
      workspaceDesc: "Score candidates out of 10 and click \"Mark as Shortlisted\" to advance them to the Final HR Round.",
      initials: "VM"
    },
    hr_interviewer: {
      name: "Priya Kulkarni",
      email: "priya@talenttrack.com",
      role: "hr_interviewer",
      title: "Final HR Interviewer",
      badgeIcon: "👩‍⚖️",
      workspaceTitle: "Final HR Decision & Offer Rollout",
      workspaceDesc: "Review candidate scores across CV, Coding test, and Tech Interview out of 10 before finalizing offer rollout.",
      initials: "PK"
    }
  };

  // Candidates with Round-by-Round Scores (Out of 10)
  const DEFAULT_CANDIDATES = [
    {
      id: "cand-1",
      name: "Rahul Sharma",
      initials: "RS",
      role: "Lead Frontend Engineer",
      tier: "Senior-Level",
      stage: "Technical Round", // Removed "Step 2:"
      currentStep: 2,
      status: "In Progress",
      score: 8.8,
      scores: {
        cv_screening: 8.5,
        tech_assessment: 9.0,
        tech_interview: 8.8,
        hr_round: null,
        overall: 8.8
      },
      email: "rahul@talenttrack.com",
      phone: "+91 98201 44521",
      address: "Indiranagar, Bengaluru, Karnataka",
      resume_name: "Rahul_Sharma_Resume.pdf",
      referral_name: "Rajesh Kumar (Senior Staff Eng)",
      experience: "8.5 Yrs",
      skills: ["React Architecture", "Microfrontends", "V8 Perf", "System Design"],
      tracking_code: "TT-2026-8812",
      roadmap: [
        { step: 1, title: "CV Shortlisting", evaluator: `${PERSONAS.hr_screener.name} (${PERSONAS.hr_screener.title})`, status: "Completed", score: "8.5 / 10" },
        { step: 2, title: "Technical Round", evaluator: `${PERSONAS.tech_interviewer.name} (${PERSONAS.tech_interviewer.title})`, status: "In Progress", score: "8.8 / 10" },
        { step: 3, title: "Final HR Round", evaluator: `${PERSONAS.hr_interviewer.name} (${PERSONAS.hr_interviewer.title})`, status: "Upcoming", score: "Pending" },
        { step: 4, title: "Offer & Selection", evaluator: "TalentTrack Leadership", status: "Upcoming", score: "Pending" }
      ]
    },
    {
      id: "cand-2",
      name: "Snehal Patil",
      initials: "SP",
      role: "Graduate Engineer Trainee (GET)",
      tier: "Fresher",
      stage: "CV Shortlisting", // Removed "Step 1:"
      currentStep: 1,
      status: "In Progress",
      score: 8.2,
      scores: {
        cv_screening: 8.2,
        tech_assessment: 8.4,
        tech_interview: null,
        hr_round: null,
        overall: 8.3
      },
      email: "snehal@engineering.edu",
      phone: "+91 98200 11990",
      address: "Shivajinagar, Pune, Maharashtra",
      resume_name: "Snehal_Patil_Resume.pdf",
      referral_name: "Campus Recruitment Partner",
      experience: "0 Yrs (Fresher)",
      skills: ["Data Structures", "Java", "SQL", "Problem Solving"],
      tracking_code: "TT-2026-5178",
      roadmap: [
        { step: 1, title: "CV Shortlisting", evaluator: `${PERSONAS.hr_screener.name} (${PERSONAS.hr_screener.title})`, status: "In Progress", score: "8.2 / 10" },
        { step: 2, title: "Technical Round", evaluator: `${PERSONAS.tech_interviewer.name} (${PERSONAS.tech_interviewer.title})`, status: "Upcoming", score: "Pending" },
        { step: 3, title: "Final HR Round", evaluator: `${PERSONAS.hr_interviewer.name} (${PERSONAS.hr_interviewer.title})`, status: "Upcoming", score: "Pending" },
        { step: 4, title: "Offer & Selection", evaluator: "TalentTrack Leadership", status: "Upcoming", score: "Pending" }
      ]
    },
    {
      id: "cand-3",
      name: "Ankit Verma",
      initials: "AV",
      role: "Software Development Engineer II (Backend)",
      tier: "Mid-Level",
      stage: "Final HR Round", // Removed "Step 3:"
      currentStep: 3,
      status: "Shortlisted by Tech Team",
      score: 9.1,
      scores: {
        cv_screening: 8.8,
        tech_assessment: 9.4,
        tech_interview: 9.2,
        hr_round: 9.0,
        overall: 9.1
      },
      email: "ankit.verma@example.com",
      phone: "+91 98111 22334",
      address: "Hitec City, Hyderabad, Telangana",
      resume_name: "Ankit_Verma_Resume.pdf",
      referral_name: "Amitabh Sen (Engineering Director)",
      experience: "4 Yrs",
      skills: ["Golang", "Microservices", "PostgreSQL", "Docker", "Kafka"],
      tracking_code: "TT-2026-3392",
      roadmap: [
        { step: 1, title: "CV Shortlisting", evaluator: `${PERSONAS.hr_screener.name} (${PERSONAS.hr_screener.title})`, status: "Completed", score: "8.8 / 10" },
        { step: 2, title: "Technical Round", evaluator: `${PERSONAS.tech_interviewer.name} (${PERSONAS.tech_interviewer.title})`, status: "Completed", score: "9.2 / 10" },
        { step: 3, title: "Final HR Round", evaluator: `${PERSONAS.hr_interviewer.name} (${PERSONAS.hr_interviewer.title})`, status: "In Progress", score: "9.0 / 10" },
        { step: 4, title: "Offer & Selection", evaluator: "TalentTrack Leadership", status: "Upcoming", score: "Pending" }
      ]
    },
    {
      id: "cand-4",
      name: "Harsh Vardhan",
      initials: "HV",
      role: "Associate Frontend Engineer",
      tier: "Fresher",
      stage: "Application Concluded (Not Shortlisted)",
      currentStep: 2,
      status: "Rejected",
      score: 5.8,
      scores: {
        cv_screening: 7.2,
        tech_assessment: 6.0,
        tech_interview: 5.4,
        hr_round: null,
        overall: 5.8
      },
      email: "harsh.v@example.com",
      phone: "+91 97112 33445",
      address: "Whitefield, Bengaluru, Karnataka",
      resume_name: "Harsh_Vardhan_Resume.pdf",
      referral_name: null,
      experience: "0 - 1 Yr",
      skills: ["HTML5", "CSS3", "JavaScript Basics"],
      tracking_code: "TT-2026-4409",
      roadmap: [
        { step: 1, title: "CV Shortlisting", evaluator: `${PERSONAS.hr_screener.name} (${PERSONAS.hr_screener.title})`, status: "Completed", score: "7.2 / 10" },
        { step: 2, title: "Technical Round", evaluator: `${PERSONAS.tech_interviewer.name} (${PERSONAS.tech_interviewer.title})`, status: "Rejected", score: "5.4 / 10" },
        { step: 3, title: "Final HR Round", evaluator: `${PERSONAS.hr_interviewer.name} (${PERSONAS.hr_interviewer.title})`, status: "Not Applicable", score: "N/A" },
        { step: 4, title: "Offer & Selection", evaluator: "TalentTrack Leadership", status: "Not Applicable", score: "N/A" }
      ]
    }
  ];

  // State Management
  const state = {
    currentUser: null,
    candidates: DEFAULT_CANDIDATES,
    selectedTier: 'all',
    searchQuery: '',
    activeView: 'openings', // 'openings' | 'candidate_portal' | 'recruiter_workspace'
    selectedJobForApply: null
  };

  // --- Dynamic Staff Role Dropdown Synchronizer ---
  function populateStaffRoleDropdown() {
    const select = document.getElementById('staffRoleSelect');
    if (!select) return;
    select.innerHTML = `
      <option value="hr_screener">${PERSONAS.hr_screener.badgeIcon} ${PERSONAS.hr_screener.title} (${PERSONAS.hr_screener.name})</option>
      <option value="tech_interviewer">${PERSONAS.tech_interviewer.badgeIcon} ${PERSONAS.tech_interviewer.title} (${PERSONAS.tech_interviewer.name})</option>
      <option value="hr_interviewer">${PERSONAS.hr_interviewer.badgeIcon} ${PERSONAS.hr_interviewer.title} (${PERSONAS.hr_interviewer.name})</option>
    `;
  }

  // --- App Initialization ---
  document.addEventListener('DOMContentLoaded', async function () {
    populateStaffRoleDropdown();
    loadLocalUser();
    setupSearch();
    await checkAppliedConcept();
    await loadCandidates();
    updateView();
  });

  // --- Dynamic Brand Logo Loader (Concept 1, 2, 3 or Master) ---
  async function checkAppliedConcept() {
    const params = new URLSearchParams(window.location.search);
    const appliedParam = params.get('appliedConcept');
    const conceptId = appliedParam || localStorage.getItem('talenttrack_active_logo_concept');

    if (conceptId) {
      const conceptFiles = {
        '1': 'assets/logo-concept-1-shield.svg',
        '2': 'assets/logo-concept-2-ribbon.svg',
        '3': 'assets/logo-concept-3-orbital.svg'
      };
      const filePath = conceptFiles[conceptId];
      if (filePath) {
        try {
          const res = await fetch(filePath);
          if (res.ok) {
            const svgText = await res.text();
            document.querySelectorAll('.brand-icon').forEach(icon => {
              icon.innerHTML = svgText;
            });
            localStorage.setItem('talenttrack_active_logo_concept', conceptId);
            if (appliedParam) {
              setTimeout(() => {
                showToast(`✨ Brand Logo Concept ${conceptId} active across TalentTrack!`);
              }, 400);
            }
          }
        } catch (e) {
          console.warn("Could not load dynamic concept SVG:", e);
        }
      }
    }
  }

  function loadLocalUser() {
    // Only restore user if active in current session (guests start unauthenticated)
    const saved = sessionStorage.getItem('talenttrack_active_user');
    if (saved) {
      try {
        state.currentUser = JSON.parse(saved);
      } catch (e) {
        state.currentUser = null;
      }
    } else {
      state.currentUser = null;
    }
  }

  // --- Sync with Backend API ---
  window.loadCandidates = async function () {
    try {
      const res = await fetch(`${API_BASE}/candidates`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          state.candidates = data.map(cand => {
            const rawStep = cand.currentStep !== undefined ? cand.currentStep : cand.current_step;
            const stageLower = (cand.stage || '').toLowerCase();
            const step = (rawStep !== undefined && rawStep !== null && rawStep > 0) ? rawStep : (
              (stageLower.includes('selected') || stageLower.includes('offer') || stageLower.includes('step 4')) ? 4 :
              (stageLower.includes('final hr') || stageLower.includes('step 3')) ? 3 :
              (stageLower.includes('tech') || stageLower.includes('step 2')) ? 2 : 1
            );
            cand.currentStep = step;
            cand.current_step = step;

            const existing = state.candidates.find(c => c.id === cand.id || c.name === cand.name);
            if (existing) {
              return {
                ...existing,
                ...cand,
                currentStep: step,
                current_step: step,
                stage: cand.stage || existing.stage,
                status: cand.status || existing.status,
                scores: cand.scores || existing.scores,
                roadmap: (cand.roadmap && cand.roadmap.length > 0) ? cand.roadmap : existing.roadmap
              };
            }
            return cand;
          });
        }
      }
    } catch (err) {
      // Local state fallback
    }
    renderCurrentViewContent();
  };

  // --- View Controller (Strict Role Isolation) ---
  function updateView() {
    updateHeaderUI();

    const elRecruiter = document.getElementById('recruiterWorkspaceView');
    const elCandidate = document.getElementById('candidatePortalView');
    const elOpenings = document.getElementById('openingsView');

    elRecruiter.classList.add('hidden');
    elCandidate.classList.add('hidden');
    elOpenings.classList.add('hidden');

    if (!state.currentUser) {
      // Guest: Only Openings
      state.activeView = 'openings';
      elOpenings.classList.remove('hidden');
    } else if (state.currentUser.role === 'candidate') {
      // Candidate: Dashboard or Openings
      if (state.activeView === 'openings') {
        elOpenings.classList.remove('hidden');
      } else {
        state.activeView = 'candidate_portal';
        elCandidate.classList.remove('hidden');
      }
    } else {
      // Recruiting Staff (HR / Tech)
      if (state.activeView === 'openings') {
        elOpenings.classList.remove('hidden');
      } else {
        state.activeView = 'recruiter_workspace';
        elRecruiter.classList.remove('hidden');
      }
    }

    renderCurrentViewContent();
  }

  function renderCurrentViewContent() {
    renderOpenings();
    renderCandidatePortal();
    renderRecruiterWorkspace();
  }

  // --- Header Navigation & User Profile ---
  function updateHeaderUI() {
    const guestGroup = document.getElementById('guestAuthGroup');
    const userGroup = document.getElementById('userAuthGroup');
    const nav = document.getElementById('headerNav');

    if (state.currentUser) {
      guestGroup.classList.add('hidden');
      userGroup.classList.remove('hidden');

      const initials = state.currentUser.initials || state.currentUser.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
      const avatarEl = document.getElementById('headerUserAvatar');
      const popoverLettersEl = document.getElementById('popoverAvatarLetters');
      if (avatarEl) avatarEl.textContent = initials;
      if (popoverLettersEl) popoverLettersEl.textContent = initials;

      const userNameEl = document.getElementById('headerUserName');
      const userRoleEl = document.getElementById('headerUserRole');
      if (userNameEl) userNameEl.textContent = state.currentUser.name;
      if (userRoleEl) userRoleEl.textContent = state.currentUser.title;

      if (state.currentUser.role === 'candidate') {
        // Candidate sees strictly Candidate Navigation
        nav.innerHTML = `
          <button class="nav-tab-btn ${state.activeView === 'candidate_portal' ? 'active' : ''}" onclick="window.showCandidateTab('portal')">
            My Dashboard
          </button>
          <button class="nav-tab-btn ${state.activeView === 'openings' ? 'active' : ''}" onclick="window.showCandidateTab('openings')">
            Browse Openings
          </button>
        `;
      } else {
        // Staff sees strictly Staff Navigation
        nav.innerHTML = `
          <button class="nav-tab-btn ${state.activeView === 'recruiter_workspace' ? 'active' : ''}" onclick="window.toggleRecruiterView('workspace')">
            Evaluation Board
          </button>
          <button class="nav-tab-btn ${state.activeView === 'openings' ? 'active' : ''}" onclick="window.toggleRecruiterView('openings')">
            Company Openings
          </button>
        `;
      }
    } else {
      guestGroup.classList.remove('hidden');
      userGroup.classList.add('hidden');
      nav.innerHTML = `
        <button class="nav-tab-btn active" onclick="window.navigate('openings')">
          Job Openings
        </button>
      `;
    }
  }

  window.handleBrandClick = function () {
    if (state.currentUser && state.currentUser.role === 'candidate') {
      state.activeView = 'candidate_portal';
    } else if (state.currentUser && state.currentUser.role !== 'candidate') {
      state.activeView = 'recruiter_workspace';
    } else {
      state.activeView = 'openings';
    }
    updateView();
  };

  window.showCandidateTab = function (tab) {
    state.activeView = tab === 'portal' ? 'candidate_portal' : 'openings';
    updateView();
  };

  window.toggleRecruiterView = function (mode) {
    state.activeView = mode === 'openings' ? 'openings' : 'recruiter_workspace';
    updateView();
  };

  // =========================================================================
  // VIEW RENDERERS
  // =========================================================================

  // 1. OPENINGS VIEW
  function renderOpenings() {
    const container = document.getElementById('openingsGrid');
    if (!container) return;

    const q = state.searchQuery.toLowerCase().trim();
    const tier = state.selectedTier;

    const filtered = JOBS.filter(job => {
      if (tier !== 'all' && job.tier !== tier) return false;
      if (q) {
        const titleMatch = job.title.toLowerCase().includes(q);
        const skillMatch = job.skills.some(s => s.toLowerCase().includes(q));
        const deptMatch = job.department.toLowerCase().includes(q);
        if (!titleMatch && !skillMatch && !deptMatch) return false;
      }
      return true;
    });

    document.getElementById('countAll').textContent = JOBS.length;
    document.getElementById('countFresher').textContent = JOBS.filter(j => j.tier === 'Fresher').length;
    document.getElementById('countMid').textContent = JOBS.filter(j => j.tier === 'Mid-Level').length;
    document.getElementById('countSenior').textContent = JOBS.filter(j => j.tier === 'Senior-Level').length;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 36px; text-align: center; color: var(--color-text-secondary); background: rgba(255,255,255,0.03); border: 1px dashed var(--color-border); border-radius: var(--radius-base);">
          No openings match your search. <button class="btn-outline-gold" style="margin-left: 8px;" onclick="window.clearSearch()">Clear Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(job => {
      const tierClass = job.tier === 'Fresher' ? 'tier-fresher' : (job.tier === 'Mid-Level' ? 'tier-mid' : 'tier-senior');
      const skillsHTML = job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');

      let applyBtnHTML = '';
      if (!state.currentUser || state.currentUser.role === 'candidate') {
        // Any guest, employee, or candidate can directly apply!
        applyBtnHTML = `
          <button class="btn-primary" style="padding: 6px 14px; font-size: 12.5px;" onclick="window.openCandidateApplyModal('${job.id}')">
            Apply Now &rarr;
          </button>
        `;
      } else {
        applyBtnHTML = `
          <span style="font-size: 11.5px; color: var(--color-gold); font-weight: 600;">Active Requisition</span>
        `;
      }

      return `
        <div class="job-card">
          <div>
            <div class="job-card-header">
              <h3>${job.title}</h3>
              <span class="tier-pill ${tierClass}">${job.tier}</span>
            </div>

            <div class="job-chips-row">
              <span><strong>Dept:</strong> ${job.department}</span>
              <span>•</span>
              <span><strong>Exp:</strong> ${job.experience}</span>
              <span>•</span>
              <span class="salary-tag">${job.salary}</span>
            </div>

            <div class="job-skills-row">
              ${skillsHTML}
            </div>
          </div>

          <div class="job-card-footer">
            <span>📍 ${job.location}</span>
            ${applyBtnHTML}
          </div>
        </div>
      `;
    }).join('');
  }

  window.filterByTier = function (tier) {
    state.selectedTier = tier;
    document.querySelectorAll('.tier-tab-btn').forEach(btn => btn.classList.remove('active'));
    const tabMap = {
      'all': 'tabTierAll',
      'Fresher': 'tabTierFresher',
      'Mid-Level': 'tabTierMid',
      'Senior-Level': 'tabTierSenior'
    };
    if (tabMap[tier]) document.getElementById(tabMap[tier]).classList.add('active');
    renderOpenings();
  };

  function setupSearch() {
    const input = document.getElementById('jobSearchInput');
    const clearBtn = document.getElementById('searchClearBtn');
    if (!input) return;

    input.addEventListener('input', function () {
      state.searchQuery = this.value;
      if (clearBtn) clearBtn.style.display = this.value ? 'inline-flex' : 'none';
      renderOpenings();
    });
  }

  window.clearSearch = function () {
    const input = document.getElementById('jobSearchInput');
    const clearBtn = document.getElementById('searchClearBtn');
    if (input) input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    state.searchQuery = '';
    state.selectedTier = 'all';
    window.filterByTier('all');
  };

  // 2. CANDIDATE DASHBOARD (With Interactive Hiring Journey Map & Round Scores Out of 10)
  function renderCandidatePortal() {
    const container = document.getElementById('candidateActiveAppCard');
    if (!container) return;

    let activeCand = null;
    if (state.currentUser && state.currentUser.role === 'candidate') {
      activeCand = state.candidates.find(c => 
        (c.email && state.currentUser.email && c.email.toLowerCase() === state.currentUser.email.toLowerCase()) ||
        (c.tracking_code && state.currentUser.tracking_code && c.tracking_code.toLowerCase() === state.currentUser.tracking_code.toLowerCase()) ||
        (c.id && state.currentUser.id && c.id === state.currentUser.id) ||
        (c.name && state.currentUser.name && c.name.toLowerCase() === state.currentUser.name.toLowerCase())
      );
    }

    if (state.selectedCandidateId === 'simulate-offer') {
      const base = state.candidates[0] || DEFAULT_CANDIDATES[0];
      activeCand = {
        ...base,
        name: state.currentUser?.name || base.name,
        currentStep: 4,
        status: 'Selected',
        stage: 'Offer & Selection',
        scores: { cv_screening: 8.8, tech_assessment: 9.2, tech_interview: 9.0, hr_round: 9.4, overall: 9.1 }
      };
    } else if (state.selectedCandidateId === 'simulate-rejected') {
      const base = state.candidates.find(c => c.id === 'cand-4') || DEFAULT_CANDIDATES[3] || state.candidates[0];
      activeCand = {
        ...base,
        name: state.currentUser?.name || base.name,
        currentStep: 2,
        status: 'Rejected',
        stage: 'Application Concluded (Not Shortlisted)',
        score: 5.8,
        scores: { cv_screening: 7.2, tech_assessment: 6.0, tech_interview: 5.4, hr_round: null, overall: 5.8 }
      };
    } else if (!activeCand && state.selectedCandidateId) {
      activeCand = state.candidates.find(c => c.id === state.selectedCandidateId);
    }

    if (!activeCand) {
      if (state.currentUser && state.currentUser.role === 'candidate') {
        container.innerHTML = `
          <div style="padding: 48px 24px; text-align: center; background: #FFFFFF; border-radius: 12px; border: 1.5px dashed #CBD5E1;">
            <div style="font-size: 40px; margin-bottom: 12px;">📋</div>
            <h3 style="font-size: 18px; color: #1E3553; font-weight: 700; margin-bottom: 8px;">No Active Application Found</h3>
            <p style="color: #64748B; font-size: 13.5px; max-width: 480px; margin: 0 auto 20px; line-height: 1.5;">
              You do not have any submitted job application linked with this account. Please explore our company openings and submit an application to track your interview milestones here.
            </p>
            <button class="btn-primary" onclick="window.navigate('openings')" style="margin: 0 auto;">Browse Open Positions &rarr;</button>
          </div>
        `;
        return;
      }
      activeCand = state.candidates[0];
    }

    if (!activeCand) return;

    const isRejected = (activeCand.status && activeCand.status.toLowerCase() === 'rejected') || 
                       (activeCand.stage && activeCand.stage.toLowerCase().includes('concluded')) ||
                       (activeCand.stage && activeCand.stage.toLowerCase().includes('reject'));
    const isSelected = !isRejected && (activeCand.currentStep >= 4 || activeCand.status === 'Selected' || (activeCand.stage && activeCand.stage.toLowerCase().includes('selected')));
    const currentStep = isSelected ? 4 : (activeCand.currentStep || 1);
    const stagePillClass = isSelected ? 'stage-pill-selected' : isRejected ? 'stage-pill-rejected' : (currentStep === 3 ? 'stage-pill-hr' : (currentStep === 2 ? 'stage-pill-tech' : 'stage-pill-review'));
    const scores = activeCand.scores || { cv_screening: null, tech_assessment: null, tech_interview: null, hr_round: null, overall: null };

    const isCvShortlisted = (scores.cv_screening !== null && scores.cv_screening !== undefined);

    let progressPercent = 0;
    if (isRejected) {
      progressPercent = currentStep === 1 ? 18 : (currentStep === 2 ? 45 : 70);
    } else {
      if (currentStep === 1) progressPercent = isCvShortlisted ? 25 : 12;
      else if (currentStep === 2) progressPercent = 50;
      else if (currentStep === 3) progressPercent = 75;
      else if (currentStep >= 4) progressPercent = 100;
    }

    // 4 Hiring Stages with Clean Stage Names and Stage Icons
    const stageIcons = {
      1: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
      2: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
      3: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      4: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`
    };

    // Candidate Hiring Stages mapped dynamically to Centralized PERSONAS
    const stepsData = [
      { 
        step: 1, 
        title: "CV Shortlisting", 
        evaluator: `${PERSONAS.hr_screener.name} (${PERSONAS.hr_screener.title})`, 
        score: isCvShortlisted ? (`${scores.cv_screening} / 10`) : (currentStep > 1 ? "Cleared" : (isRejected && currentStep === 1 ? "5.0 / 10" : "Under Review")) 
      },
      { 
        step: 2, 
        title: "Technical Round", 
        evaluator: `${PERSONAS.tech_interviewer.name} (${PERSONAS.tech_interviewer.title})`, 
        score: (scores.tech_interview !== null && scores.tech_interview !== undefined) ? (`${scores.tech_interview} / 10`) : (currentStep > 2 ? "Cleared" : (currentStep === 2 ? (isRejected ? "5.4 / 10" : "In Progress") : (isRejected ? "N/A" : "Pending"))) 
      },
      { 
        step: 3, 
        title: "Final HR Round", 
        evaluator: `${PERSONAS.hr_interviewer.name} (Final HR Lead)`, 
        score: (scores.hr_round !== null && scores.hr_round !== undefined) ? (`${scores.hr_round} / 10`) : (isSelected ? "9.2 / 10" : (currentStep === 3 ? (isRejected ? "Concluded" : "In Progress") : (isRejected ? "N/A" : "Pending"))) 
      },
      { 
        step: 4, 
        title: "Offer & Selection", 
        evaluator: "TalentTrack Leadership", 
        score: isSelected ? "Offer Rolled Out" : (isRejected ? "Concluded" : "Pending") 
      }
    ];

    const stepsHTML = stepsData.map(stepItem => {
      const isCompleted = !isRejected && (stepItem.step < currentStep || (isSelected && stepItem.step <= 4) || (stepItem.step === 1 && isCvShortlisted && currentStep >= 2));
      const isPassedBeforeReject = isRejected && stepItem.step < currentStep;
      const isRejectedStep = isRejected && stepItem.step === currentStep;
      const isNaStep = isRejected && stepItem.step > currentStep;
      const isActive = !isRejected && stepItem.step === currentStep && !isSelected;

      let colClass = 'upcoming';
      let circleIcon = stageIcons[stepItem.step];
      let statusText = 'Upcoming';
      let activeBadgeHTML = '';

      if (isRejectedStep) {
        colClass = 'rejected-step';
        circleIcon = '&#10005;'; // ✕
        statusText = 'Not Shortlisted';
        activeBadgeHTML = '<span class="single-line-rejected-tag">Concluded</span>';
      } else if (isPassedBeforeReject) {
        colClass = 'completed';
        circleIcon = '&#10003;';
        statusText = 'Cleared & Shortlisted';
      } else if (isNaStep) {
        colClass = 'na-step';
        circleIcon = '&mdash;';
        statusText = 'Not Applicable';
      } else if (isCompleted) {
        colClass = 'completed';
        circleIcon = '&#10003;'; // Verified checkmark
        statusText = 'Cleared & Shortlisted';
      } else if (isActive) {
        colClass = 'active';
        circleIcon = stageIcons[stepItem.step];
        statusText = (currentStep === 1 && !isCvShortlisted) ? 'Under HR Review' : 'In Evaluation';
        activeBadgeHTML = '<span class="single-line-active-tag">Active Stage</span>';
      }

      return `
        <div class="single-line-step-item ${colClass}">
          <div class="single-line-circle-wrap">
            ${activeBadgeHTML}
            <div class="single-line-circle">${circleIcon}</div>
          </div>
          <div class="single-line-info">
            <div class="single-line-title">${stepItem.title}</div>
            <div class="single-line-evaluator">${stepItem.evaluator}</div>
            <div class="single-line-status">${statusText} &bull; Score: <strong>${stepItem.score}</strong></div>
          </div>
        </div>
      `;
    }).join('');

    let noteMessage = '';
    if (isRejected) {
      noteMessage = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <span style="font-size: 22px; line-height: 1;">📋</span>
          <div>
            <strong style="color: #991B1B;">Application Concluded:</strong> We sincerely appreciate the time and enthusiasm you invested during our recruitment rounds. Although your candidacy is not advancing to the next round for the <strong>${activeCand.role}</strong> position, your verified candidate profile and evaluation scores remain active in our database for future requisitions.
          </div>
        </div>
      `;
    } else if (currentStep === 1) {
      if (isCvShortlisted) {
        noteMessage = `✓ Your CV has been reviewed and shortlisted by <strong>${PERSONAS.hr_screener.name} (${PERSONAS.hr_screener.title})</strong> with rating <strong>${scores.cv_screening}/10</strong>. You are advancing to the Technical Round!`;
      } else {
        noteMessage = `📍 Your application has been received and is currently under review by <strong>${PERSONAS.hr_screener.name} (${PERSONAS.hr_screener.title})</strong> for credential screening. Once HR completes the review, your rating score and next round schedule will appear here.`;
      }
    } else if (currentStep === 2) {
      noteMessage = `Your profile is actively under technical evaluation by <strong>${PERSONAS.tech_interviewer.name} (${PERSONAS.tech_interviewer.title})</strong>. Status will update once evaluation is marked complete.`;
    } else if (currentStep === 3) {
      noteMessage = `Congratulations! You cleared the Technical Round with a score of <strong>${scores.tech_interview || '8.8'} / 10</strong>. You are currently in the Final HR Round with <strong>${PERSONAS.hr_interviewer.name}</strong>.`;
    } else {
      noteMessage = 'Official Offer Rolled Out! Congratulations, your profile was successfully selected across all technical and HR rounds. Welcome to TalentTrack!';
    }

    let referralHTML = '';
    if (activeCand.referral_name) {
      referralHTML = `<div class="cand-referral-banner">
        <span>Verified Employee Referral: <strong>${activeCand.referral_name}</strong></span>
      </div>`;
    }

    // Result Card: Grand Celebration Card if Selected, or Dignified Regret & Feedback Card if Rejected
    let resultCardHTML = '';
    if (isSelected) {
      resultCardHTML = `
        <!-- CONGRATULATIONS: CANDIDATE SELECTED CELEBRATION CARD -->
        <div class="selection-congrats-card">
          <div class="congrats-top-layout">
            <div class="congrats-trophy-circle">🏆</div>
            <div class="congrats-content">
              <div class="congrats-headline-tag">Official Selection Confirmed</div>
              <h2 class="congrats-title">🎉 Congratulations ${activeCand.name}! You are Selected!</h2>
              <p class="congrats-subtext">
                You have successfully cleared all screening, technical evaluation, and HR leadership rounds at TalentTrack. 
                We are proud to welcome you to our engineering team as <strong>${activeCand.role}</strong> (${activeCand.tier || 'Full-time'})!
              </p>
              
              <div class="congrats-rounds-strip">
                <div class="congrats-round-item">
                  <div class="congrats-check-icon">✓</div>
                  <div class="congrats-round-info">
                    <strong>1. Resume Screening (${scores.cv_screening ? `${scores.cv_screening}/10` : 'Cleared'})</strong>
                    <span>Verified & Shortlisted by ${PERSONAS.hr_screener.name} (${PERSONAS.hr_screener.title})</span>
                  </div>
                </div>
                <div class="congrats-round-item">
                  <div class="congrats-check-icon">✓</div>
                  <div class="congrats-round-info">
                    <strong>2. Technical Round (${scores.tech_interview ? `${scores.tech_interview}/10` : 'Cleared'})</strong>
                    <span>Cleared with ${PERSONAS.tech_interviewer.name} (${PERSONAS.tech_interviewer.title})</span>
                  </div>
                </div>
                <div class="congrats-round-item">
                  <div class="congrats-check-icon">✓</div>
                  <div class="congrats-round-info">
                    <strong>3. Final HR Round (${scores.hr_round ? `${scores.hr_round}/10` : 'Selected'})</strong>
                    <span>Selected by ${PERSONAS.hr_interviewer.name} (Final HR Lead)</span>
                  </div>
                </div>
                <div class="congrats-round-item">
                  <div class="congrats-check-icon">★</div>
                  <div class="congrats-round-info">
                    <strong>4. Official Offer Released</strong>
                    <span>Approved by TalentTrack Leadership</span>
                  </div>
                </div>
              </div>

              <div class="congrats-actions-footer">
                <div class="badge-official-offer">
                  <span>📜 Reference: <strong>${activeCand.tracking_code}</strong> &bull; Status: <strong>Official Offer Released</strong></span>
                </div>
                <button class="btn-view-offer" onclick="window.viewOfficialOfferLetter('${activeCand.name}', '${activeCand.role}', '${activeCand.tracking_code}')">
                  📄 View & Download Official Offer Letter &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (isRejected) {
      resultCardHTML = `
        <!-- REJECTION & REGRET RESULT CARD: DIGNIFIED, EMPATHETIC, AND TRANSPARENT -->
        <div class="rejection-result-card">
          <div class="rejection-top-layout">
            <div class="rejection-icon-circle">📋</div>
            <div class="rejection-content">
              <div class="rejection-headline-tag">Application Status &bull; Evaluation Concluded</div>
              <h2 class="rejection-title">Application Status for ${activeCand.name}</h2>
              <p class="rejection-subtext">
                Thank you for the significant time and effort you dedicated while interviewing for the <strong>${activeCand.role}</strong> position at TalentTrack.
                Following detailed panel debriefs, we regret to inform you that we will not be advancing your application to the next round for this vacancy.
              </p>

              <div class="rejection-rounds-strip">
                <div class="rejection-round-item">
                  <div class="rejection-badge-icon ${currentStep === 1 && isRejected ? 'failed' : 'cleared'}">
                    ${(currentStep === 1 && isRejected) ? '✕' : '✓'}
                  </div>
                  <div class="rejection-round-info">
                    <strong>1. Resume Screening (${scores.cv_screening ? `${scores.cv_screening}/10` : (currentStep === 1 ? 'Evaluated' : 'Cleared')})</strong>
                    <span>${(currentStep === 1 && isRejected) ? 'Threshold not met' : `Reviewed by ${PERSONAS.hr_screener.name}`}</span>
                  </div>
                </div>

                <div class="rejection-round-item">
                  <div class="rejection-badge-icon ${currentStep > 2 ? 'cleared' : (currentStep === 2 && isRejected ? 'failed' : 'na')}">
                    ${currentStep > 2 ? '✓' : (currentStep === 2 && isRejected ? '✕' : '—')}
                  </div>
                  <div class="rejection-round-info">
                    <strong>2. Technical Round (${scores.tech_interview ? `${scores.tech_interview}/10` : (currentStep === 2 ? 'Concluded' : (currentStep < 2 ? 'N/A' : 'Cleared'))})</strong>
                    <span>${(currentStep === 2 && isRejected) ? 'Concluded at Tech Round' : (currentStep > 2 ? `Reviewed by ${PERSONAS.tech_interviewer.name}` : 'Not reached')}</span>
                  </div>
                </div>

                <div class="rejection-round-item">
                  <div class="rejection-badge-icon ${currentStep > 3 ? 'cleared' : (currentStep === 3 && isRejected ? 'failed' : 'na')}">
                    ${currentStep > 3 ? '✓' : (currentStep === 3 && isRejected ? '✕' : '—')}
                  </div>
                  <div class="rejection-round-info">
                    <strong>3. Final HR Round (${scores.hr_round ? `${scores.hr_round}/10` : (currentStep === 3 ? 'Concluded' : (currentStep < 3 ? 'N/A' : 'Cleared'))})</strong>
                    <span>${(currentStep === 3 && isRejected) ? 'Leadership review concluded' : (currentStep > 3 ? 'Cleared' : 'Not reached')}</span>
                  </div>
                </div>

                <div class="rejection-round-item">
                  <div class="rejection-badge-icon na">—</div>
                  <div class="rejection-round-info">
                    <strong>4. Final Selection</strong>
                    <span>Application Concluded</span>
                  </div>
                </div>
              </div>

              <div class="rejection-feedback-box">
                <div class="rejection-feedback-icon">💡</div>
                <div class="rejection-feedback-text">
                  <h4>Candidate Account &amp; Talent Repository Protection</h4>
                  <p>
                    Your login credentials and account access remain fully active. Your verified resume and assessment scores are retained in our talent database, and our recruiters frequently review archived profiles when new requisitions open up. You are eligible to apply again for fresh openings after 6 months.
                  </p>
                </div>
              </div>

              <div class="rejection-actions-footer">
                <div class="badge-official-rejection">
                  <span>📄 Reference: <strong>${activeCand.tracking_code}</strong> &bull; Status: <strong>Not Shortlisted for Next Round</strong></span>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <button class="btn-view-feedback" onclick="window.viewRejectionFeedback('${activeCand.name}', '${activeCand.role}', '${activeCand.tracking_code}')">
                    📋 View Evaluation &amp; Feedback Report &rarr;
                  </button>
                  <button class="btn-browse-openings-rejection" onclick="window.navigate('openings')">
                    🔍 Explore Other Open Roles &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <!-- Top Candidate Bar with Clean Stage and Selection Highlight -->
      <div class="tracker-top-summary">
        <div>
          <h2 class="tracker-role-title">${activeCand.role}</h2>
          <span class="tracker-ref-code">Reference Code: ${activeCand.tracking_code} &bull; Candidate: <strong>${activeCand.name}</strong></span>
          ${activeCand.phone ? `<div style="font-size: 11.5px; color: var(--color-text-secondary); margin-top: 3px;">📍 ${activeCand.address || 'Bengaluru'} &bull; 📞 ${activeCand.phone} &bull; 📎 Attached CV: <span style="color: var(--color-primary); font-weight: 600; cursor: pointer; text-decoration: underline;" onclick="window.previewResumeDoc('${activeCand.name}', '${activeCand.resume_name || 'Rahul_Sharma_Resume.pdf'}')">${activeCand.resume_name || 'Rahul_Sharma_Resume.pdf'}</span></div>` : ''}
        </div>

        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          ${isSelected ? `
            <div class="current-stage-pill stage-pill-selected" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 800; padding: 6px 14px; background: #DCFCE7; color: #065F46; border: 1.5px solid #86EFAC;">
              🎉 Selected &bull; Official Offer Rolled Out
            </div>
          ` : isRejected ? `
            <div class="current-stage-pill stage-pill-rejected" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 800; padding: 6px 14px; background: #FEF2F2; color: #991B1B; border: 1.5px solid #FCA5A5;">
              ✕ Application Concluded &bull; Not Moving to Next Round
            </div>
          ` : (currentStep === 1 && !isCvShortlisted) ? `
            <div class="current-stage-pill" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 700; padding: 6px 14px; background: #FEF3C7; color: #92400E; border: 1.5px solid #FCD34D;">
              ⏳ Application Submitted &bull; Under HR Review
            </div>
          ` : `
            <div class="current-stage-pill ${stagePillClass}">
              &bull; ${(activeCand.stage || 'In Evaluation').replace(/Step \d+:\s*/i, '')}
            </div>
          `}
        </div>
      </div>

      ${referralHTML}

      <!-- Candidate Evaluation Scores Out of 10 -->
      <div class="cand-scores-card">
        <div class="cand-scores-header">
          <span class="cand-scores-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Candidate Evaluation Scores & Status
          </span>
          <span style="font-size: 12px; color: #1E3553; font-weight: 700;">Overall Rating: <strong>${(scores.overall !== null && scores.overall !== undefined) ? `${scores.overall} / 10` : (activeCand.score ? `${activeCand.score} / 10` : '<span style="color: #D97706; font-weight: 600;">Pending HR Review</span>')}</strong></span>
        </div>

        <div class="cand-scores-grid">
          <div class="cand-score-col">
            <span class="cand-score-label">Round 1: Resume Screening (${PERSONAS.hr_screener.name})</span>
            <div class="cand-score-val ${isCvShortlisted ? 'high-score' : ''}">
              ${isCvShortlisted ? `${scores.cv_screening} <span>/ 10</span>` : '<span style="font-size: 11.5px; color: #D97706; font-weight: 600;">⏳ In HR Review</span>'}
            </div>
          </div>
          <div class="cand-score-col">
            <span class="cand-score-label">Round 2: Tech Assessment</span>
            <div class="cand-score-val ${(scores.tech_assessment !== null && scores.tech_assessment !== undefined) ? 'high-score' : ''}">
              ${(scores.tech_assessment !== null && scores.tech_assessment !== undefined) ? `${scores.tech_assessment} <span>/ 10</span>` : '<span style="font-size: 11.5px; color: var(--color-text-muted);">Upcoming</span>'}
            </div>
          </div>
          <div class="cand-score-col">
            <span class="cand-score-label">Round 3: Tech Interview (${PERSONAS.tech_interviewer.name})</span>
            <div class="cand-score-val ${(scores.tech_interview !== null && scores.tech_interview !== undefined) ? 'high-score' : ''}">
              ${(scores.tech_interview !== null && scores.tech_interview !== undefined) ? `${scores.tech_interview} <span>/ 10</span>` : (currentStep === 2 ? '<span style="font-size: 11.5px; color: #2563EB; font-weight: 600;">In Progress</span>' : '<span style="font-size: 11.5px; color: var(--color-text-muted);">Upcoming</span>')}
            </div>
          </div>
          <div class="cand-score-col">
            <span class="cand-score-label">Round 4: Final HR Round (${PERSONAS.hr_interviewer.name})</span>
            <div class="cand-score-val ${(scores.hr_round || isSelected) ? 'high-score' : ''}">
              ${(scores.hr_round !== null && scores.hr_round !== undefined) ? `${scores.hr_round} <span>/ 10</span>` : (isSelected ? '9.2 <span>/ 10</span>' : (currentStep === 3 ? '<span style="font-size: 11.5px; color: #2563EB; font-weight: 600;">In Progress</span>' : '<span style="font-size: 11.5px; color: var(--color-text-muted);">Upcoming</span>'))}
            </div>
          </div>
        </div>
      </div>

      <!-- Single Continuous Horizontal Line Hiring Stage Map -->
      <div class="candidate-single-line-wrapper">
        <div class="single-line-map-container">
          <div class="single-line-rail-track">
            <div class="single-line-rail-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <div class="single-line-steps-row">
            ${stepsHTML}
          </div>
        </div>
      </div>

      <div class="tracker-stage-note-box">
        ${noteMessage}
      </div>

      <!-- Result Card: Celebratory Card when Selected, Dignified Regret & Feedback Card when Not Shortlisted -->
      ${resultCardHTML}
    `;
  }

    // 3. RECRUITING WORKSPACE (With Round Scores Out of 10 for HR & Tech)
  function renderRecruiterWorkspace() {
    const container = document.getElementById('recruiterCandidatesContainer');
    if (!container || !state.currentUser || state.currentUser.role === 'candidate') return;

    const role = state.currentUser.role;
    const titleEl = document.getElementById('recruiterWorkspaceTitle');
    const descEl = document.getElementById('recruiterWorkspaceDesc');
    const pillEl = document.getElementById('recruiterRolePill');

    let relevantCandidates = [];

    // Control Announcement Button:
    // Only announcement button adds on HR Recruiter (hr_screener), NO for tech interviewer, NO for another HR (hr_interviewer)
    const announceBtn = document.getElementById('btnAnnounceOpening');
    if (announceBtn) {
      if (role === 'hr_screener') {
        announceBtn.style.display = 'inline-flex';
      } else {
        announceBtn.style.display = 'none';
      }
    }

    if (role === 'tech_interviewer') {
      const p = PERSONAS.tech_interviewer;
      pillEl.textContent = `${p.badgeIcon} ${p.title}: ${p.name}`;
      titleEl.textContent = p.workspaceTitle;
      descEl.textContent = p.workspaceDesc;
      relevantCandidates = state.candidates.filter(c => {
        const step = c.currentStep || c.current_step;
        const st = (c.stage || '').toLowerCase();
        return step === 2 || st.includes('tech') || st.includes('step 2');
      });
    } else if (role === 'hr_screener') {
      const p = PERSONAS.hr_screener;
      pillEl.textContent = `${p.badgeIcon} ${p.title}: ${p.name}`;
      titleEl.textContent = p.workspaceTitle;
      descEl.textContent = p.workspaceDesc;
      relevantCandidates = state.candidates.filter(c => {
        const step = c.currentStep || c.current_step || 1;
        const st = (c.stage || '').toLowerCase();
        return (step === 1 || st.includes('cv') || st.includes('step 1') || st.includes('shortlisting')) && step < 2;
      });
    } else if (role === 'hr_interviewer') {
      const p = PERSONAS.hr_interviewer;
      pillEl.textContent = `${p.badgeIcon} ${p.title}: ${p.name}`;
      titleEl.textContent = p.workspaceTitle;
      descEl.textContent = p.workspaceDesc;
      relevantCandidates = state.candidates.filter(c => {
        const step = c.currentStep || c.current_step;
        const st = (c.stage || '').toLowerCase();
        return step === 3 || st.includes('final hr') || st.includes('step 3');
      });
    }

    if (relevantCandidates.length === 0) {
      container.innerHTML = `
        <div style="padding: 36px; text-align: center; color: var(--color-text-secondary); background: rgba(255,255,255,0.03); border: 1px dashed var(--color-border); border-radius: var(--radius-base);">
          <div style="font-size: 24px; margin-bottom: 8px;">✓</div>
          <strong>No pending candidates in this round.</strong>
          <p style="font-size: 12.5px; margin-top: 4px;">All assigned candidates have been scored and advanced.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = relevantCandidates.map(cand => {
      const scores = cand.scores || { cv_screening: null, tech_assessment: null, tech_interview: null, hr_round: null, overall: null };

      let actionAreaHTML = '';

      if (cand.status === 'Rejected') {
        actionAreaHTML = `
          <div class="eval-actions-row" style="background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 8px; color: #991B1B; font-weight: 700; font-size: 13px;">
              <span>✕ Candidate Marked as Not Shortlisted / Concluded</span>
            </div>
            <button class="btn-secondary" style="font-size: 11.5px; padding: 5px 12px; background: #FFFFFF; color: #1E3553; border: 1px solid #CBD5E1; font-weight: 700;" onclick="window.reopenCandidate('${cand.id}')">
              ↺ Re-evaluate Candidate
            </button>
          </div>
        `;
      } else if (role === 'tech_interviewer') {
        actionAreaHTML = `
          <div class="eval-actions-row">
            <div class="tech-score-input-group">
              <label for="techScoreInput_${cand.id}">Enter Tech Round Score (out of 10):</label>
              <input 
                type="number" 
                id="techScoreInput_${cand.id}" 
                class="tech-score-input" 
                min="1" 
                max="10" 
                step="0.1" 
                placeholder="e.g. 8.5"
                value="${(scores.tech_interview !== null && scores.tech_interview !== undefined) ? scores.tech_interview : ''}"
              >
              <span>/ 10</span>
            </div>

            <div class="eval-actions-group">
              <button class="btn-shortlist-tech" onclick="window.handleTechShortlist('${cand.id}')">
                ✓ Mark as Shortlisted (Advance to HR Round)
              </button>
              <button class="btn-reject" onclick="window.handleRejectCandidate('${cand.id}')">
                ✕ Reject
              </button>
            </div>
          </div>
        `;
      } else if (role === 'hr_screener') {
        // HR Screener: Rate Resume / CV out of 10 and Shortlist or Reject
        actionAreaHTML = `
          <div class="eval-actions-row">
            <div class="tech-score-input-group">
              <label for="resumeScoreInput_${cand.id}" style="font-weight: 700; color: #1E3553;">
                📄 Resume Screening Rating (out of 10):
              </label>
              <input 
                type="number" 
                id="resumeScoreInput_${cand.id}" 
                class="tech-score-input" 
                min="1" 
                max="10" 
                step="0.1" 
                placeholder="e.g. 8.5"
                value="${(scores.cv_screening !== null && scores.cv_screening !== undefined) ? scores.cv_screening : ''}"
              >
              <span style="font-weight: 700; color: #5089BD;">/ 10</span>
            </div>

            <div class="eval-actions-group">
              <button class="btn-primary" onclick="window.handleHrScreenPass('${cand.id}')">
                ✓ Shortlist for Tech Round &rarr;
              </button>
              <button class="btn-reject" onclick="window.handleRejectCandidate('${cand.id}')">
                ✕ Reject
              </button>
            </div>
          </div>
        `;
      } else if (role === 'hr_interviewer') {
        actionAreaHTML = `
          <div class="eval-actions-row">
            <div class="tech-score-input-group">
              <label for="hrScoreInput_${cand.id}">Final HR Score (out of 10):</label>
              <input 
                type="number" 
                id="hrScoreInput_${cand.id}" 
                class="tech-score-input" 
                min="1" 
                max="10" 
                step="0.1" 
                placeholder="e.g. 9.0"
                value="${(scores.hr_round !== null && scores.hr_round !== undefined) ? scores.hr_round : ''}"
              >
              <span>/ 10</span>
            </div>

            <div class="eval-actions-group">
              <button class="btn-primary" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-color: #22c55e;" onclick="window.handleFinalSelect('${cand.id}')">
                🎉 Select & Rollout Offer
              </button>
              <button class="btn-reject" onclick="window.handleRejectCandidate('${cand.id}')">
                ✕ Reject
              </button>
            </div>
          </div>
        `;
      }

      const skillsHTML = (cand.skills || []).map(s => `<span class="skill-tag">${s}</span>`).join('');

      const scoresStripHTML = `
        <!-- Round Scores Matrix Out of 10 -->
        <div class="eval-scores-strip">
          <div class="eval-scores-strip-title">Candidate Evaluation Scores Across All Rounds (Out of 10)</div>
          <div class="eval-scores-grid">
            <div class="eval-score-box">
              <span class="eval-score-label">1. Resume Screening</span>
              <div class="eval-score-num ${scores.cv_screening ? 'high-score' : 'pending'}">
                ${(scores.cv_screening !== null && scores.cv_screening !== undefined) ? `<strong>${scores.cv_screening}</strong> / 10` : '<span class="pending">Pending Review</span>'}
              </div>
            </div>
            <div class="eval-score-box">
              <span class="eval-score-label">2. Tech Test</span>
              <div class="eval-score-num ${scores.tech_assessment ? 'high-score' : 'pending'}">
                ${(scores.tech_assessment !== null && scores.tech_assessment !== undefined) ? `<strong>${scores.tech_assessment}</strong> / 10` : '<span class="pending">Upcoming</span>'}
              </div>
            </div>
            <div class="eval-score-box">
              <span class="eval-score-label">3. Tech Interview</span>
              <div class="eval-score-num ${scores.tech_interview ? 'high-score' : 'pending'}">
                ${(scores.tech_interview !== null && scores.tech_interview !== undefined) ? `<strong>${scores.tech_interview}</strong> / 10` : '<span class="pending">Upcoming</span>'}
              </div>
            </div>
            <div class="eval-score-box">
              <span class="eval-score-label">4. Final HR</span>
              <div class="eval-score-num ${scores.hr_round ? 'high-score' : 'pending'}">
                ${(scores.hr_round !== null && scores.hr_round !== undefined) ? `<strong>${scores.hr_round}</strong> / 10` : '<span class="pending">Upcoming</span>'}
              </div>
            </div>
            <div class="eval-score-box" style="border-color: #5089BD;">
              <span class="eval-score-label">Overall Rating</span>
              <div class="eval-score-num" style="color: #1E3553;">
                ${(scores.overall !== null && scores.overall !== undefined) ? `<strong>${scores.overall}</strong> / 10` : '<span class="pending">Pending Evaluation</span>'}
              </div>
            </div>
          </div>
        </div>
      `;

      return `
        <div class="eval-candidate-card">
          <div class="eval-cand-top-row">
            <div class="eval-cand-left">
              <div class="eval-avatar">${cand.initials || 'CD'}</div>
              <div class="eval-details">
                <h3>${cand.name}</h3>
                <div class="eval-role-line">Position: <strong>${cand.role}</strong> (${cand.tier})</div>
                <div class="eval-meta-line">
                  <span>Exp: ${cand.experience}</span>
                  <span>•</span>
                  <span>📞 ${cand.phone || '+91 98200 00000'}</span>
                  <span>•</span>
                  <span>📍 ${cand.address || 'Bengaluru'}</span>
                  <span>•</span>
                  <span>Email: ${cand.email}</span>
                  <span>•</span>
                  <span style="color: var(--color-gold);">Ref: ${cand.tracking_code}</span>
                </div>
                ${cand.referral_name ? `
                  <div class="eval-referral-tag">
                    Referred by: <strong>${cand.referral_name}</strong>
                  </div>
                ` : ''}
                ${(cand.resume_name || cand.resume_url) ? `
                  <div style="margin-top: 6px;">
                    <a href="javascript:void(0)" class="eval-cv-link" onclick="event.stopPropagation(); window.previewResumeDoc('${cand.name}', '${cand.resume_name || 'Resume_Document.pdf'}');">
                      📎 Attached CV: ${cand.resume_name || 'Candidate_Resume.pdf'} &rarr;
                    </a>
                  </div>
                ` : ''}
              </div>
            </div>

            <div style="display: flex; gap: 4px; align-items: center;">
              ${skillsHTML}
            </div>
          </div>

          <!-- Scores or Screening Strip -->
          ${scoresStripHTML}

          <!-- Dynamic Actions Area -->
          ${actionAreaHTML}
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // ACTIONS: TECH SHORTLIST WITH SCORE, HR ADVANCE, FINAL SELECT
  // =========================================================================

  // 1. TECH ROUND INTERVIEWER SHORTLIST
  window.handleTechShortlist = async function (candId) {
    const cand = state.candidates.find(c => c.id === candId);
    if (!cand) return;

    // Grab score from input
    const scoreInput = document.getElementById(`techScoreInput_${cand.id}`);
    const inputVal = scoreInput ? parseFloat(scoreInput.value) : NaN;
    if (isNaN(inputVal) || inputVal < 1 || inputVal > 10) {
      alert("Please enter a valid Tech Round Score between 1.0 and 10.0 before shortlisting.");
      if (scoreInput) scoreInput.focus();
      return;
    }
    const techScoreVal = parseFloat(inputVal.toFixed(1));

    cand.currentStep = 3;
    cand.current_step = 3;
    cand.stage = "Step 3: Final HR Round";
    cand.status = "Shortlisted by Tech Team";

    if (!cand.scores) cand.scores = {};
    cand.scores.tech_interview = techScoreVal;

    // Recalculate average
    const validScores = [cand.scores.cv_screening, cand.scores.tech_assessment, cand.scores.tech_interview].filter(s => typeof s === 'number');
    cand.scores.overall = validScores.length > 0 ? parseFloat((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)) : techScoreVal;
    cand.score = cand.scores.overall;

    if (cand.roadmap && cand.roadmap[1]) {
      cand.roadmap[1].status = "Completed";
      cand.roadmap[1].score = `${techScoreVal} / 10`;
    }
    if (cand.roadmap && cand.roadmap[2]) cand.roadmap[2].status = "In Progress";

    // Call API
    try {
      await fetch(`${API_BASE}/candidates/update-stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: cand.id,
          stage: "Step 3: Final HR Round",
          status: "Shortlisted by Tech Team",
          currentStep: 3,
          current_step: 3,
          score: cand.scores.overall,
          scores: cand.scores,
          actionBy: `${PERSONAS.tech_interviewer.name} (${PERSONAS.tech_interviewer.title})`,
          note: `Tech Round Cleared with Score: ${techScoreVal}/10`
        })
      });
    } catch (e) {}

    renderRecruiterWorkspace();

    // Auto-dismiss confirmation
    showToast(`✓ ${cand.name} marked as Shortlisted with Tech Score: ${techScoreVal}/10. Advanced to Final HR!`);
  };

  // 2. HR SCREENER ADVANCE
  window.handleHrScreenPass = async function (candId) {
    const cand = state.candidates.find(c => c.id === candId);
    if (!cand) return;

    const scoreInput = document.getElementById(`resumeScoreInput_${cand.id}`);
    const inputVal = scoreInput ? parseFloat(scoreInput.value) : NaN;
    if (isNaN(inputVal) || inputVal < 1 || inputVal > 10) {
      alert("Please enter a valid Resume Screening Rating between 1.0 and 10.0 before shortlisting.");
      if (scoreInput) scoreInput.focus();
      return;
    }
    const resumeScoreVal = parseFloat(inputVal.toFixed(1));

    cand.currentStep = 2;
    cand.current_step = 2;
    cand.stage = "Step 2: Technical Interview";
    cand.status = "In Progress";

    if (!cand.scores) cand.scores = {};
    cand.scores.cv_screening = resumeScoreVal;

    // Recalculate average
    const validScores = [cand.scores.cv_screening, cand.scores.tech_assessment, cand.scores.tech_interview, cand.scores.hr_round].filter(s => typeof s === 'number');
    cand.scores.overall = validScores.length > 0 ? parseFloat((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)) : resumeScoreVal;
    cand.score = cand.scores.overall;

    if (cand.roadmap && cand.roadmap[0]) {
      cand.roadmap[0].status = "Completed";
      cand.roadmap[0].score = `${resumeScoreVal} / 10`;
    }
    if (cand.roadmap && cand.roadmap[1]) cand.roadmap[1].status = "In Progress";

    try {
      await fetch(`${API_BASE}/candidates/update-stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: cand.id,
          stage: "Step 2: Technical Interview",
          status: "In Progress",
          currentStep: 2,
          current_step: 2,
          score: cand.scores.overall,
          scores: cand.scores,
          actionBy: `${PERSONAS.hr_screener.name} (${PERSONAS.hr_screener.title})`,
          note: `Resume Screening Cleared with Rating: ${resumeScoreVal}/10`
        })
      });
    } catch (e) {}

    renderRecruiterWorkspace();
    showToast(`✓ ${cand.name} shortlisted with Resume Rating: ${resumeScoreVal}/10. Advanced to Tech Round!`);
  };

  // 3. FINAL HR SELECT
  window.handleFinalSelect = async function (candId) {
    const cand = state.candidates.find(c => c.id === candId);
    if (!cand) return;

    const hrScoreInput = document.getElementById(`hrScoreInput_${cand.id}`);
    const inputVal = hrScoreInput ? parseFloat(hrScoreInput.value) : NaN;
    if (isNaN(inputVal) || inputVal < 1 || inputVal > 10) {
      alert("Please enter a valid Final HR Score between 1.0 and 10.0 before selecting.");
      if (hrScoreInput) hrScoreInput.focus();
      return;
    }
    const hrScoreVal = parseFloat(inputVal.toFixed(1));

    cand.currentStep = 4;
    cand.current_step = 4;
    cand.stage = "Step 4: Selected / Offer Rolled Out";
    cand.status = "Selected";

    if (!cand.scores) cand.scores = {};
    cand.scores.hr_round = hrScoreVal;

    const allScores = [cand.scores.cv_screening, cand.scores.tech_assessment, cand.scores.tech_interview, cand.scores.hr_round].filter(s => typeof s === 'number');
    cand.scores.overall = allScores.length > 0 ? parseFloat((allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)) : hrScoreVal;
    cand.score = cand.scores.overall;

    if (cand.roadmap && cand.roadmap[2]) {
      cand.roadmap[2].status = "Completed";
      cand.roadmap[2].score = `${hrScoreVal} / 10`;
    }
    if (cand.roadmap && cand.roadmap[3]) {
      cand.roadmap[3].status = "Completed";
      cand.roadmap[3].score = "Selected";
    }

    try {
      await fetch(`${API_BASE}/candidates/update-stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: cand.id,
          stage: "Step 4: Selected / Offer Rolled Out",
          status: "Selected",
          currentStep: 4,
          current_step: 4,
          score: cand.scores.overall,
          scores: cand.scores,
          actionBy: `${PERSONAS.hr_interviewer.name} (${PERSONAS.hr_interviewer.title})`
        })
      });
    } catch (e) {}

    renderRecruiterWorkspace();
    showToast(`🎉 ${cand.name} Selected! Offer rolled out with HR Score: ${hrScoreVal}/10.`);
  };

  // 4. REJECT (Preserves candidate account, sets status to Rejected, renders regret card)
  window.handleRejectCandidate = function (candId) {
    const cand = state.candidates.find(c => c.id === candId);
    if (!cand) return;

    cand.status = "Rejected";
    cand.stage = "Application Concluded (Not Shortlisted)";
    // NOTE: NEVER delete or filter out candidate from state.candidates!
    // Their login access and application status must remain active.

    try {
      fetch('/api/candidates/update-stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: cand.id,
          stage: 'Application Concluded',
          status: 'Rejected',
          currentStep: cand.currentStep || 1,
          actionBy: state.currentUser ? `${state.currentUser.name} (${state.currentUser.title})` : 'Evaluation Panel',
          note: 'Candidate not shortlisted for next round. Profile retained in talent database.'
        })
      });
    } catch (e) {}

    renderRecruiterWorkspace();
    showToast(`Candidate ${cand.name} marked as rejected. Access & status preserved.`);
  };

  // 5. RE-OPEN CANDIDATE (Allows recruiter to re-evaluate if needed)
  window.reopenCandidate = function (candId) {
    const cand = state.candidates.find(c => c.id === candId);
    if (!cand) return;

    cand.status = "In Progress";
    cand.stage = cand.currentStep === 3 ? "Final HR Round" : (cand.currentStep === 2 ? "Technical Round" : "CV Shortlisting");

    try {
      fetch('/api/candidates/update-stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: cand.id,
          stage: cand.stage,
          status: 'In Progress',
          currentStep: cand.currentStep || 1,
          actionBy: state.currentUser ? `${state.currentUser.name} (${state.currentUser.title})` : 'Recruiting Team',
          note: 'Candidate re-opened for active evaluation.'
        })
      });
    } catch (e) {}

    renderRecruiterWorkspace();
    showToast(`Candidate ${cand.name} status re-opened to In Progress.`);
  };

  // =========================================================================
  // GUEST CANDIDATE APPLY GATING
  // =========================================================================
  window.handleGuestApplyClick = function (jobId) {
    const modal = document.getElementById('loginRequiredModal');
    if (modal) modal.classList.add('active');
  };

  window.closeLoginRequiredModal = function () {
    const modal = document.getElementById('loginRequiredModal');
    if (modal) modal.classList.remove('active');
  };

  // For logged-in candidates
  window.openCandidateApplyModal = function (jobId) {
    const job = JOBS.find(j => j.id === jobId);
    if (!job) return;

    state.selectedJobForApply = job;
    document.getElementById('applyJobId').value = job.id;
    document.getElementById('applyJobTitle').value = job.title;
    document.getElementById('applyModalRoleTitle').textContent = `${job.title} (${job.salary})`;

    const nameEl = document.getElementById('displayResumeFileName');
    const metaEl = document.getElementById('displayResumeFileMeta');
    const hiddenInput = document.getElementById('applyResumeAttachedName');
    const fileInput = document.getElementById('applyResumeFile');
    const resumeBar = document.getElementById('resumeAttachmentBar');

    if (fileInput) fileInput.value = '';
    if (hiddenInput) hiddenInput.value = '';
    if (nameEl) nameEl.textContent = 'No file chosen (Attachment Required)';
    if (metaEl) {
      metaEl.textContent = 'Click attachment symbol or this bar to select your CV / Resume (.pdf, .doc, .docx)';
      metaEl.style.color = '';
    }
    if (resumeBar) {
      resumeBar.classList.remove('required-error');
      resumeBar.style.borderColor = '';
      resumeBar.style.boxShadow = '';
    }

    if (state.currentUser && state.currentUser.role === 'candidate') {
      document.getElementById('applyName').value = state.currentUser.name || '';
      document.getElementById('applyEmail').value = state.currentUser.email || '';
    } else {
      document.getElementById('applyName').value = '';
      document.getElementById('applyEmail').value = '';
    }

    const passInput = document.getElementById('applyPassword');
    if (passInput) passInput.value = 'Candidate@123';

    const modal = document.getElementById('candidateApplyModal');
    if (modal) modal.classList.add('active');
  };

  window.closeApplyModal = function () {
    const modal = document.getElementById('candidateApplyModal');
    if (modal) modal.classList.remove('active');
  };

  
  // =========================================================================
  // HR ANNOUNCE NEW OPENING ENGINE
  // =========================================================================
  window.openAnnounceOpeningModal = function () {
    const modal = document.getElementById('announceOpeningModal');
    if (modal) modal.classList.add('active');
  };

  window.closeAnnounceOpeningModal = function () {
    const modal = document.getElementById('announceOpeningModal');
    if (modal) modal.classList.remove('active');
  };

  window.submitAnnounceOpening = function () {
    const title = document.getElementById('announceTitle').value.trim();
    const dept = document.getElementById('announceDept').value;
    const tier = document.getElementById('announceTier').value;
    const exp = document.getElementById('announceExp').value.trim();
    const location = document.getElementById('announceLocation').value.trim();
    const salary = document.getElementById('announceSalary').value.trim();
    const skills = document.getElementById('announceSkills').value.split(',').map(s => s.trim()).filter(Boolean);
    const desc = document.getElementById('announceDesc').value.trim();

    const newJob = {
      id: `job-announce-${Date.now().toString().slice(-5)}`,
      title,
      tier,
      department: dept,
      experience: exp,
      location,
      salary,
      skills,
      description: desc
    };

    JOBS.unshift(newJob);
    window.closeAnnounceOpeningModal();
    updateOpeningsCount();
    renderOpenings();
    showToast(`📢 New Requisition Announced: ${title} (${salary})`);

    // Switch view to openings so HR immediately sees the new posting
    window.navigate('openings');
  };

  window.handleResumeFileSelect = function (e) {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    const nameEl = document.getElementById('displayResumeFileName');
    const metaEl = document.getElementById('displayResumeFileMeta');
    const hiddenInput = document.getElementById('applyResumeAttachedName');
    const resumeBar = document.getElementById('resumeAttachmentBar');

    if (nameEl) nameEl.textContent = file.name;
    const sizeKB = (file.size / 1024).toFixed(1);
    if (metaEl) {
      metaEl.textContent = `✓ ${sizeKB} KB • CV attached and ready to submit`;
      metaEl.style.color = '#059669';
    }
    if (hiddenInput) hiddenInput.value = file.name;
    if (resumeBar) {
      resumeBar.classList.remove('required-error');
      resumeBar.style.borderColor = '#10B981';
      resumeBar.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
    }

    showToast(`📎 CV Attached: ${file.name} (${sizeKB} KB)`);
  };

  window.previewResumeDoc = function (candName, fileName) {
    showToast(`📎 Attached CV Document: ${fileName} (${candName})`);
  };

  // =========================================================================
  // CANDIDATE APPLICATION WITH FULL DETAILS & REFERRAL ENGINE
  // =========================================================================
  window.submitCandidateApplication = async function () {
    const name = document.getElementById('applyName').value.trim();
    const phone = document.getElementById('applyPhone').value.trim();
    const email = document.getElementById('applyEmail').value.trim();
    const password = document.getElementById('applyPassword')?.value.trim() || 'Candidate@123';
    const address = document.getElementById('applyAddress').value.trim();
    const skills = document.getElementById('applySkills').value.trim();
    
    // MANDATORY CV/RESUME ATTACHMENT VALIDATION
    const fileInput = document.getElementById('applyResumeFile');
    const attachedNameInput = document.getElementById('applyResumeAttachedName');
    const resumeBar = document.getElementById('resumeAttachmentBar');

    const hasFile = (fileInput && fileInput.files && fileInput.files.length > 0) || 
                    (attachedNameInput && attachedNameInput.value.trim().length > 0 && !attachedNameInput.value.includes('No file chosen'));

    if (!hasFile) {
      if (resumeBar) {
        resumeBar.classList.add('required-error');
      }
      const metaEl = document.getElementById('displayResumeFileMeta');
      if (metaEl) {
        metaEl.textContent = '⚠️ Mandatory Attachment: Please attach your CV / Resume file before applying';
        metaEl.style.color = '#DC2626';
      }
      showToast('⚠️ CV / Resume attachment is mandatory! Please attach your CV before applying.');
      return;
    }

    if (!password) {
      showToast('Please create a login password for your candidate account.');
      document.getElementById('applyPassword')?.focus();
      return;
    }

    const resumeFileName = (fileInput && fileInput.files && fileInput.files[0])
      ? fileInput.files[0].name
      : attachedNameInput.value.trim();

    const referralName = document.getElementById('applyReferralName')?.value.trim() || '';

    const job = state.selectedJobForApply || JOBS[0];
    const newCode = `TT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCand = {
      id: `cand-${Date.now().toString().slice(-6)}`,
      name: name,
      initials: name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase(),
      role: job.title,
      tier: job.tier,
      stage: "CV Shortlisting",
      currentStep: 1,
      status: "Under Review", // Freshly applied: Under review, NOT shortlisted yet!
      score: null,            // Score is pending HR screening!
      scores: {
        cv_screening: null,
        tech_assessment: null,
        tech_interview: null,
        hr_round: null,
        overall: null
      },
      password: password,
      email: email,
      phone: phone,
      address: address,
      resume_name: resumeFileName,
      resume_url: null,
      referral_name: referralName || null,
      experience: "Applied Candidate",
      skills: skills.split(',').map(s => s.trim()),
      tracking_code: newCode,
      roadmap: [
        { step: 1, title: "CV Shortlisting", evaluator: `${PERSONAS.hr_screener.name} (${PERSONAS.hr_screener.title})`, status: "In Progress", score: "Under Review" },
        { step: 2, title: "Technical Round", evaluator: `${PERSONAS.tech_interviewer.name} (${PERSONAS.tech_interviewer.title})`, status: "Upcoming", score: "Pending" },
        { step: 3, title: "Final HR Round", evaluator: `${PERSONAS.hr_interviewer.name} (${PERSONAS.hr_interviewer.title})`, status: "Upcoming", score: "Pending" },
        { step: 4, title: "Offer & Selection", evaluator: "TalentTrack Leadership", status: "Upcoming", score: "Pending" }
      ]
    };

    state.candidates.unshift(newCand);

    // Persist new candidate in Database (MySQL & persistent backend)
    try {
      await fetch(`${API_BASE}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCand)
      });
    } catch (e) {
      console.warn('Database save fallback:', e);
    }

    // Automatically set active user session for newly registered candidate
    state.currentUser = {
      id: newCand.id,
      name: name,
      email: email,
      role: "candidate",
      title: "Candidate",
      initials: newCand.initials,
      roleTitle: job.title,
      tracking_code: newCode
    };
    sessionStorage.setItem('talenttrack_active_user', JSON.stringify(state.currentUser));
    localStorage.setItem('talenttrack_active_user', JSON.stringify(state.currentUser));
    state.selectedCandidateId = newCand.id;

    window.closeApplyModal();
    state.activeView = 'candidate_portal';
    updateHeaderUI();
    updateView();

    let msg = `Application Submitted! Reference Code: ${newCode} • Attached: ${resumeFileName}`;
    if (referralName) msg += ` • Referral logged from ${referralName}`;
    showToast(msg);
  };

  window.openLoginModal = function (defaultTab = 'candidate') {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('active');
    
    // Clear any previous error box on modal open
    const errorBox = document.getElementById('candidateLoginError');
    if (errorBox) {
      errorBox.classList.add('hidden');
      errorBox.innerHTML = '';
    }
    
    window.switchLoginTab(defaultTab);
  };

  window.closeLoginModal = function () {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('active');

    // Reset error box
    const errorBox = document.getElementById('candidateLoginError');
    if (errorBox) {
      errorBox.classList.add('hidden');
      errorBox.innerHTML = '';
    }

    // Reset revealed password fields back to secure masked mode
    ['candidatePasswordInput', 'staffPasswordInput'].forEach(id => {
      const inp = document.getElementById(id);
      if (inp && inp.getAttribute('type') === 'text') {
        inp.setAttribute('type', 'password');
        const wrap = inp.closest('.password-input-wrapper');
        if (wrap) {
          const showIcon = wrap.querySelector('.eye-icon-show');
          const hideIcon = wrap.querySelector('.eye-icon-hide');
          const btn = wrap.querySelector('.password-toggle-btn');
          if (showIcon) showIcon.style.display = 'block';
          if (hideIcon) hideIcon.style.display = 'none';
          if (btn) {
            btn.setAttribute('aria-label', 'Show password');
            btn.setAttribute('title', 'Show password');
          }
        }
      }
    });
  };

  window.togglePasswordVisibility = function (inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const isPassword = input.getAttribute('type') === 'password';
    input.setAttribute('type', isPassword ? 'text' : 'password');

    const showIcon = btn.querySelector('.eye-icon-show');
    const hideIcon = btn.querySelector('.eye-icon-hide');

    if (showIcon && hideIcon) {
      if (isPassword) {
        showIcon.style.display = 'none';
        hideIcon.style.display = 'block';
        btn.setAttribute('aria-label', 'Hide password');
        btn.setAttribute('title', 'Hide password');
      } else {
        showIcon.style.display = 'block';
        hideIcon.style.display = 'none';
        btn.setAttribute('aria-label', 'Show password');
        btn.setAttribute('title', 'Show password');
      }
    }
  };

  window.switchLoginTab = function (tab) {
    const btnCand = document.getElementById('tabLoginCandidate');
    const btnStaff = document.getElementById('tabLoginStaff');
    const paneCand = document.getElementById('loginCandidatePane');
    const paneStaff = document.getElementById('loginStaffPane');
    const errorBox = document.getElementById('candidateLoginError');
    if (errorBox) {
      errorBox.classList.add('hidden');
      errorBox.innerHTML = '';
    }

    if (tab === 'candidate') {
      btnCand.classList.add('active');
      btnStaff.classList.remove('active');
      paneCand.classList.remove('hidden');
      paneStaff.classList.add('hidden');
    } else {
      btnStaff.classList.add('active');
      btnCand.classList.remove('active');
      paneStaff.classList.remove('hidden');
      paneCand.classList.add('hidden');
    }
  };

  window.loginAs = function (roleKey) {
    const persona = PERSONAS[roleKey];
    if (!persona) return;

    window.closeLoginModal();
    state.currentUser = persona;
    sessionStorage.setItem('talenttrack_active_user', JSON.stringify(persona));

    if (persona.role === 'candidate') {
      state.activeView = 'candidate_portal';
    } else {
      state.activeView = 'recruiter_workspace';
    }

    updateView();

    // Auto-refresh candidates from backend upon role switch / login
    if (typeof window.loadCandidates === 'function') {
      window.loadCandidates();
    }

    // Auto-dismissing message without requiring continue click
    triggerAutoAuthBanner('login', `Logged in successfully!`, `Welcome, ${persona.name} (${persona.title})`);
  };

  window.submitCandidateLogin = async function () {
    const errorBox = document.getElementById('candidateLoginError');
    if (errorBox) {
      errorBox.classList.add('hidden');
      errorBox.innerHTML = '';
    }

    const email = document.getElementById('candidateEmailInput').value.trim();
    const pass = document.getElementById('candidatePasswordInput')?.value.trim();
    if (!email) {
      showToast('Please enter your registered candidate email address.');
      return;
    }
    if (!pass) {
      showToast('Please enter your candidate password.');
      return;
    }

    // Refresh candidate list from backend if reachable to sync latest applications
    try {
      const res = await fetch(`${API_BASE}/candidates`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          state.candidates = data;
        }
      }
    } catch (e) {
      // offline / local state fallback
    }

    // STRICT CHECK: Verify if this candidate has actually applied for any position
    const normalized = email.toLowerCase();
    const matched = state.candidates.find(c => 
      (c.email && c.email.toLowerCase() === normalized) ||
      (c.tracking_code && c.tracking_code.toLowerCase() === normalized) ||
      (c.id && c.id.toLowerCase() === normalized)
    );

    // If candidate has NOT applied for any position, DO NOT ALLOW LOGIN!
    if (!matched) {
      if (errorBox) {
        const safeEmail = email.replace(/[&<>'"]/g, t => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t] || t));
        errorBox.innerHTML = `
          <div class="login-error-header">
            <span>⛔ Access Denied: No Job Application Found</span>
          </div>
          <div class="login-error-msg">
            Candidate <strong>${safeEmail}</strong> has not applied for any position yet.
            Only candidates who have submitted an application can sign in to view their round evaluations and roadmap.
          </div>
          <button type="button" class="login-error-btn-action" onclick="window.closeLoginModal(); window.navigate('openings');">
            Browse Openings &amp; Apply Now &rarr;
          </button>
        `;
        errorBox.classList.remove('hidden');
      }
      showToast(`⛔ Login Denied: No application found for ${email}. Please apply first.`);
      return;
    }

    // Candidate has applied! Validate password (default: Candidate@123 or registered password)
    const expectedPassword = matched.password || 'Candidate@123';
    if (pass !== expectedPassword && pass !== 'Candidate@123') {
      if (errorBox) {
        errorBox.innerHTML = `
          <div class="login-error-header">
            <span>⚠️ Incorrect Password</span>
          </div>
          <div class="login-error-msg">
            The password entered for <strong>${matched.name}</strong> is incorrect.
            (Default candidate access password: <code>Candidate@123</code>).
          </div>
        `;
        errorBox.classList.remove('hidden');
      }
      showToast('Incorrect password. Try Candidate@123');
      return;
    }

    // Candidate verified and authorized
    const candidateUser = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      role: "candidate",
      title: "Candidate",
      initials: matched.initials || matched.name.slice(0, 2).toUpperCase(),
      roleTitle: matched.role,
      tracking_code: matched.tracking_code
    };

    window.closeLoginModal();
    state.currentUser = candidateUser;
    state.selectedCandidateId = matched.id;
    sessionStorage.setItem('talenttrack_active_user', JSON.stringify(candidateUser));
    state.activeView = 'candidate_portal';
    updateView();
    triggerAutoAuthBanner('login', `Logged in successfully!`, `Welcome, ${candidateUser.name} (${matched.role})`);
  };

  window.submitStaffLogin = function () {
    const role = document.getElementById('staffRoleSelect').value;
    const pass = document.getElementById('staffPasswordInput')?.value.trim();
    if (!pass) {
      showToast('Please enter your staff password.');
      return;
    }
    window.loginAs(role);
  };

  window.handleLogout = function () {
    state.currentUser = null;
    sessionStorage.removeItem('talenttrack_active_user');
    localStorage.removeItem('talenttrack_active_user');
    state.activeView = 'openings';
    updateView();

    // Auto-dismissing message without requiring continue click
    triggerAutoAuthBanner('logout', `Logged out successfully`, `Returning to public openings`);
  };

  // Self-dismissing banner (2 seconds duration, no clicks required!)
  function triggerAutoAuthBanner(type, title, sub) {
    const banner = document.getElementById('autoAuthBanner');
    if (!banner) return;

    const iconEl = document.getElementById('autoAuthIcon');
    const titleEl = document.getElementById('autoAuthTitle');
    const subEl = document.getElementById('autoAuthSub');

    iconEl.textContent = type === 'login' ? '✅' : '👋';
    titleEl.textContent = title;
    subEl.textContent = sub;

    banner.classList.add('show');
    setTimeout(() => {
      banner.classList.remove('show');
    }, 2200);
  }

  // Toast Helper
  function showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // Window Handlers for Interactive Candidate Journey Map & Selection State
  window.switchDemoCandidate = function (candId) {
    state.selectedCandidateId = candId;
    renderCandidatePortal();
  };

  window.simulateOfferCandidate = function () {
    state.selectedCandidateId = 'simulate-offer';
    renderCandidatePortal();
  };

  window.setCandidateSimStage = function (stepNum) {
    if (stepNum === 'rejected' || stepNum === 0) {
      state.selectedCandidateId = 'simulate-rejected';
      showToast('📋 Switched to Candidate View: Not Shortlisted (Regret Result & Feedback Card).');
    } else if (stepNum >= 4) {
      state.selectedCandidateId = 'simulate-offer';
      showToast('🎉 Switched to Selected Candidate View (Congratulations & Offer Letter)!');
    } else {
      state.selectedCandidateId = 'cand-1';
      showToast('⏳ Switched to Candidate View in Evaluation (Technical Round).');
    }
    renderCandidatePortal();
  };

  window.fillCandidateLogin = function (email) {
    const emailInput = document.getElementById('candidateEmailInput');
    const passInput = document.getElementById('candidatePasswordInput');
    if (emailInput) emailInput.value = email;
    if (passInput) passInput.value = 'Candidate@123';
  };

  window.viewRejectionFeedback = function (candName, roleTitle, refCode) {
    const modal = document.getElementById('evaluationFeedbackModal');
    const content = document.getElementById('evaluationFeedbackContent');
    if (!modal || !content) return;

    const name = candName || state.currentUser?.name || 'Candidate';
    const role = roleTitle || 'Software Engineer';
    const ref = refCode || 'TT-2026-4409';
    const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    content.innerHTML = `
      <div style="background: #FFF5F5; border: 1px solid #FECACA; border-radius: 8px; padding: 18px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; border-bottom: 1px dashed #FCA5A5; padding-bottom: 10px;">
          <div>
            <h4 style="font-size: 16px; font-weight: 800; color: #991B1B; margin: 0;">CANDIDATE EVALUATION SUMMARY</h4>
            <span style="font-size: 12px; color: #B91C1C;">TalentTrack Technologies Talent Acquisition</span>
          </div>
          <div style="text-align: right; font-size: 11.5px; color: #4B5563;">
            <div>Application Ref: <strong>${ref}</strong></div>
            <div>Evaluation Date: <strong>${todayStr}</strong></div>
          </div>
        </div>

        <p style="margin-bottom: 12px; color: #1F2937; line-height: 1.6;">
          Dear <strong>${name}</strong>,<br>
          Thank you for interviewing with our engineering and talent acquisition panels for the <strong>${role}</strong> role.
          We appreciate your dedication and preparation throughout the assessment process.
        </p>

        <p style="margin-bottom: 14px; color: #374151; line-height: 1.6;">
          Our committee has thoroughly reviewed evaluations across all rounds. While we noted commendable aspects in your profile, our benchmarks for this cycle required a higher score threshold, and we will not be moving forward with your application to subsequent rounds.
        </p>

        <div style="background: #FFFFFF; border: 1px solid #FEE2E2; border-radius: 6px; padding: 12px; margin-bottom: 14px;">
          <div style="font-size: 12px; font-weight: 700; color: #991B1B; margin-bottom: 6px;">Evaluation Notes &amp; Constructive Guidance:</div>
          <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #4B5563; line-height: 1.6;">
            <li>Continue honing deep domain fundamentals, problem-solving speed, and system edge-case handling.</li>
            <li>Hands-on familiarity with production architecture and scalable services will strengthen future candidature.</li>
            <li>Your candidate credentials and verified test history are retained in our talent database.</li>
          </ul>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; color: #6B7280; border-top: 1px solid #FEE2E2; padding-top: 10px;">
          <span>Re-application Eligibility: <strong>6 Months</strong></span>
          <span>Status: <strong>Evaluation Concluded</strong></span>
        </div>
      </div>
    `;

    modal.classList.add('active');
  };

  window.closeEvaluationFeedbackModal = function () {
    const modal = document.getElementById('evaluationFeedbackModal');
    if (modal) modal.classList.remove('active');
  };

  window.viewOfficialOfferLetter = function (candName, roleTitle, refCode) {
    const modal = document.getElementById('offerLetterModal');
    const content = document.getElementById('offerLetterContent');
    if (!modal || !content) return;

    const name = candName || state.currentUser?.name || 'Rahul Sharma';
    const role = roleTitle || 'Lead Frontend Engineer';
    const ref = refCode || 'TT-2026-8812';
    const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    content.innerHTML = `
      <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 18px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; border-bottom: 1px dashed #86EFAC; padding-bottom: 10px;">
          <div>
            <h4 style="font-size: 16px; font-weight: 800; color: #065F46; margin: 0;">OFFER OF EMPLOYMENT</h4>
            <span style="font-size: 12px; color: #047857;">TalentTrack Technologies Private Limited</span>
          </div>
          <div style="text-align: right; font-size: 11.5px; color: #4B5563;">
            <div>Requisition Ref: <strong>${ref}</strong></div>
            <div>Issued Date: <strong>${todayStr}</strong></div>
          </div>
        </div>

        <p style="margin-bottom: 10px; color: #1F2937;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin-bottom: 14px; color: #374151; line-height: 1.6;">
          Following the positive recommendation from your Technical Evaluation and Final HR panel reviews, the Management at TalentTrack is pleased to formally offer you employment as <strong>${role}</strong>.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #FFFFFF; border: 1px solid #D1FAE5; border-radius: 6px; padding: 12px; margin-bottom: 14px;">
          <div><span style="font-size: 11.5px; color: #6B7280;">Offered Role:</span><div style="font-weight: 700; color: #1E3553;">${role}</div></div>
          <div><span style="font-size: 11.5px; color: #6B7280;">Hiring Band:</span><div style="font-weight: 700; color: #059669;">Full-Time Executive</div></div>
          <div><span style="font-size: 11.5px; color: #6B7280;">Work Location:</span><div style="font-weight: 700; color: #1E3553;">Bengaluru (Hybrid Model)</div></div>
          <div><span style="font-size: 11.5px; color: #6B7280;">Joining Timeline:</span><div style="font-weight: 700; color: #1E3553;">Within 30 Calendar Days</div></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 14px; padding-top: 10px; border-top: 1px solid #D1FAE5;">
          <div>
            <div style="font-size: 11px; color: #6B7280;">Authorized by Final HR Lead:</div>
            <div style="font-size: 13px; font-weight: 700; color: #065F46;">${PERSONAS.hr_interviewer.name}</div>
            <div style="font-size: 10.5px; color: #9CA3AF;">Head of Talent Acquisition, TalentTrack</div>
          </div>
          <div style="text-align: right;">
            <div style="display: inline-block; padding: 4px 10px; background: #DCFCE7; border: 1px solid #86EFAC; border-radius: 4px; font-size: 11px; font-weight: 800; color: #065F46;">
              OFFICIAL OFFER CONFIRMED
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  };

  window.closeOfferLetterModal = function () {
    const modal = document.getElementById('offerLetterModal');
    if (modal) modal.classList.remove('active');
  };

  window.inspectStage = function (stepNum) {
    const titles = {
      1: `📍 Milestone 1: CV & Academic Screening — Credentials verified and shortlisted by ${PERSONAS.hr_screener.name} (${PERSONAS.hr_screener.title}).`,
      2: `📍 Milestone 2: Technical Evaluation & Code Architecture — Live interview with ${PERSONAS.tech_interviewer.name} (${PERSONAS.tech_interviewer.title}).`,
      3: `📍 Milestone 3: Final HR Leadership Discussion — Culture & leadership debrief with ${PERSONAS.hr_interviewer.name}.`,
      4: `🏆 Milestone 4: Official Offer & Selection — Final selection and onboarding package rollout.`
    };
    showToast(titles[stepNum] || `Milestone ${stepNum}`);
  };


  // ==============================================================================
  // BRAND LOGO MANAGER: Design 1 (Hex Shield) vs Design 2 (Infinity Helix)
  // ==============================================================================
  const LOGO_SVGS = {
    1: `<svg class="brand-logo-svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <!-- Accent Gradient: #5089BD -->
    <linearGradient id="freshIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6FA3D3"/>
      <stop offset="40%" stop-color="#5089BD"/>
      <stop offset="80%" stop-color="#3D6E9B"/>
      <stop offset="100%" stop-color="#2D5377"/>
    </linearGradient>

    <!-- Powder Blue / Platinum Facet Gradient: #DCEAF7 -->
    <linearGradient id="freshChrome" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="35%" stop-color="#DCEAF7"/>
      <stop offset="70%" stop-color="#BCD5EB"/>
      <stop offset="100%" stop-color="#8EADC9"/>
    </linearGradient>

    <!-- Deep Headings Shadow Bevel: #1E3553 -->
    <linearGradient id="freshIndigoDark" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2D5377"/>
      <stop offset="50%" stop-color="#1E3553"/>
      <stop offset="100%" stop-color="#122338"/>
    </linearGradient>

    <!-- Fresh Mint Emerald Velocity Runway Gradient -->
    <linearGradient id="freshMintTrack" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="50%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>

    <!-- Accent Cyan Gradient -->
    <linearGradient id="freshCyan" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3D6E9B"/>
      <stop offset="50%" stop-color="#5089BD"/>
      <stop offset="100%" stop-color="#DCEAF7"/>
    </linearGradient>

    <!-- Medallion Background: #1E3553 Deep Navy Dial -->
    <radialGradient id="freshDialBg" cx="45%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#3B577A"/>
      <stop offset="45%" stop-color="#1E3553"/>
      <stop offset="90%" stop-color="#122338"/>
      <stop offset="100%" stop-color="#0B1624"/>
    </radialGradient>

    <filter id="freshTShadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="5" stdDeviation="4.5" flood-color="#1E3553" flood-opacity="0.6"/>
      <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#5089BD" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- 1. BASE OBSIDIAN SAPPHIRE DISC WITH CHROME & INDIGO RIMS -->
  <circle cx="50" cy="50" r="47" fill="url(#freshChrome)" stroke="#5089BD" stroke-width="1.8" filter="url(#freshTShadow)"/>
  <circle cx="50" cy="50" r="44.5" fill="none" stroke="#1E3553" stroke-width="1.2"/>
  <circle cx="50" cy="50" r="43.2" fill="none" stroke="url(#freshCyan)" stroke-width="0.8" opacity="0.85"/>
  <circle cx="50" cy="50" r="42.5" fill="url(#freshDialBg)"/>

  <!-- Subtle Glaze Arc Reflection -->
  <path d="M8,50 A42,42 0 0,1 92,50 Z" fill="url(#freshChrome)" opacity="0.08"/>

  <!-- 2. SCULPTURAL 3D BEVELED MONOLITHIC 'T' IN FRESH COLORS (ZERO STARS) -->
  <g filter="url(#freshTShadow)">
    <!-- Base Shadow Extrusion -->
    <path d="M19,26 L81,26 L74,38 L58,38 L58,74 L42,74 L42,38 L26,38 Z" fill="#030712"/>

    <!-- Crossbar Left Chrome Chamfer -->
    <polygon points="19,26 50,26 44,32 24,32" fill="url(#freshChrome)"/>
    <polygon points="19,26 24,32 26,38 19,26" fill="#CBD5E1"/>

    <!-- Crossbar Right Shaded Bevel -->
    <polygon points="50,26 81,26 76,32 44,32" fill="url(#freshIndigoDark)"/>
    <polygon points="81,26 76,32 74,38 81,26" fill="#1E1B4B"/>

    <!-- Crossbar Front Face (Vibrant Electric Indigo) -->
    <polygon points="24,32 76,32 72,37 28,37" fill="url(#freshIndigo)"/>

    <!-- Crossbar Underside Chamfers -->
    <polygon points="26,37 42,37 40,40 28,40" fill="#312E81"/>
    <polygon points="58,37 74,37 72,40 60,40" fill="#1E1B4B"/>

    <!-- Vertical Stem Left Chrome Bevel -->
    <polygon points="42,37 50,37 50,71 42,67" fill="url(#freshChrome)"/>

    <!-- Vertical Stem Right Indigo Bevel -->
    <polygon points="50,37 58,37 58,67 50,71" fill="url(#freshIndigoDark)"/>

    <!-- Vertical Stem Front Face (Electric Indigo Core) -->
    <polygon points="46,37 54,37 54,68 46,68" fill="url(#freshIndigo)"/>

    <!-- Sculptural Beveled Foot -->
    <polygon points="42,67 50,71 58,67 50,75" fill="url(#freshIndigoDark)"/>

    <!-- Central Precision Runway Channel (Fresh Mint Emerald) -->
    <line x1="50" y1="36" x2="50" y2="67" stroke="#030712" stroke-width="2.6" stroke-linecap="round"/>
    <line x1="50" y1="36" x2="50" y2="67" stroke="url(#freshMintTrack)" stroke-width="1.6" stroke-linecap="round"/>

    <!-- 3 Milestone Progression Nodes (Screening, Interview, Offer) -->
    <circle cx="50" cy="62" r="2" fill="#10B981"/>
    <circle cx="50" cy="62" r="0.9" fill="#FFFFFF"/>
    <circle cx="50" cy="49" r="2" fill="#06B6D4"/>
    <circle cx="50" cy="49" r="0.9" fill="#FFFFFF"/>
    <circle cx="50" cy="38" r="2.2" fill="#FFFFFF"/>
    <circle cx="50" cy="38" r="1.1" fill="#4F46E5"/>
  </g>

  <!-- Precision Dial Accents -->
  <line x1="50" y1="7" x2="50" y2="10" stroke="#06B6D4" stroke-width="1.4" stroke-linecap="round"/>
  <line x1="50" y1="90" x2="50" y2="93" stroke="#4F46E5" stroke-width="1.4" stroke-linecap="round"/>
  <line x1="7" y1="50" x2="10" y2="50" stroke="#10B981" stroke-width="1.4" stroke-linecap="round"/>
  <line x1="90" y1="50" x2="93" y2="50" stroke="#38BDF8" stroke-width="1.4" stroke-linecap="round"/>
</svg>`,
    2: `<svg class="brand-logo-svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="v2FreshIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#818CF8"/>
      <stop offset="40%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#312E81"/>
    </linearGradient>

    <linearGradient id="v2FreshChrome" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#64748B"/>
    </linearGradient>

    <radialGradient id="v2FreshBg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="60%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#030712"/>
    </radialGradient>

    <filter id="v2FreshShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="4.5" flood-color="#0F172A" flood-opacity="0.65"/>
    </filter>
  </defs>

  <!-- Faceted Hex Shield Base -->
  <polygon points="50,5 88,24 88,72 50,95 12,72 12,24" 
           fill="url(#v2FreshBg)" 
           stroke="url(#v2FreshIndigo)" 
           stroke-width="2.4" 
           stroke-linejoin="round"
           filter="url(#v2FreshShadow)"/>

  <!-- Inner Inset Line -->
  <polygon points="50,12 81,28 81,68 50,88 19,68 19,28" 
           fill="none" 
           stroke="rgba(255, 255, 255, 0.15)" 
           stroke-width="1.2"/>

  <!-- Lower Emerald Guidance Chevron -->
  <path d="M26,70 L50,83 L74,70" fill="none" stroke="#10B981" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>

  <!-- 3D Beveled Sculptural 'T' in Electric Indigo & Chrome -->
  <g filter="url(#v2FreshShadow)">
    <polygon points="20,24 50,24 44,30 24,30" fill="url(#v2FreshChrome)"/>
    <polygon points="50,24 80,24 76,30 44,30" fill="url(#v2FreshIndigo)"/>
    <polygon points="24,30 76,30 72,36 28,36" fill="#818CF8"/>

    <polygon points="42,36 50,36 50,72 42,68" fill="url(#v2FreshChrome)"/>
    <polygon points="50,36 58,36 58,68 50,72" fill="#312E81"/>
    <polygon points="46,36 54,36 54,69 46,69" fill="#4F46E5"/>
    <polygon points="42,68 50,72 58,68 50,76" fill="#1E1B4B"/>

    <!-- Central Runway & Milestone Pips -->
    <line x1="50" y1="36" x2="50" y2="68" stroke="#030712" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="50" y1="36" x2="50" y2="68" stroke="#10B981" stroke-width="1.4" stroke-linecap="round"/>
    <circle cx="50" cy="62" r="2" fill="#10B981"/>
    <circle cx="50" cy="49" r="2" fill="#06B6D4"/>
    <circle cx="50" cy="38" r="2.2" fill="#FFFFFF"/>
  </g>
</svg>`
  };

  window.setBrandLogoDesign = function(designNum, silent = false) {
    const designId = String(designNum) === '2' ? 2 : 1;
    localStorage.setItem('talenttrack_logo_design', designId);
    
    // Update all logo containers in the page
    document.querySelectorAll('.brand-icon').forEach(el => {
      if (LOGO_SVGS[designId]) {
        el.innerHTML = LOGO_SVGS[designId];
      }
    });
    
    if (!silent) {
      const designName = designId === 2 ? 'Design 2 (Infinity Helix Monogram)' : 'Design 1 (Hex Shield Crest)';
      showToast('Active Logo Updated: ' + designName);
    }
  };

  window.toggleBrandLogoDesign = function() {
    const current = localStorage.getItem('talenttrack_logo_design') === '2' ? 2 : 1;
    const next = current === 1 ? 2 : 1;
    window.setBrandLogoDesign(next);
  };

  // Check URL parameters for logo or appliedConcept
  const urlParams = new URLSearchParams(window.location.search);
  const requestedConcept = urlParams.get('appliedConcept') || urlParams.get('logo');
  if (requestedConcept) {
    localStorage.setItem('talenttrack_logo_design', requestedConcept === '2' ? '2' : '1');
  }

  // Apply saved logo design on initial boot across all brand icons silently
  const initialDesign = localStorage.getItem('talenttrack_logo_design') === '2' ? 2 : 1;
  setTimeout(() => {
    window.setBrandLogoDesign(initialDesign, true);
  }, 10);

})();
