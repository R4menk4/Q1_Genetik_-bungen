(function () {
  "use strict";

  const TASKS_URL = "data/tasks.json";
  const CREDITS_URL = "data/imageCredits.json";
  const SELF_CHECK_URL = "data/selfCheckCompetencies.json";
  const EXAM_TRAINING_URL = "data/klausuraufgaben.json";
  const OPERATOR_TRAINING_URL = "data/operatorentraining.json";
  const STORAGE_PREFIX = "klausurtrainer_molekulargenetik";
  const SELF_CHECK_STORAGE_KEY = "molekulargenetik_selfcheck_status";
  const EXAM_TRAINING_PROGRESS_KEY = "klausurtrainingProgress";
  const EXAM_TRAINING_ANSWERS_KEY = "klausurtrainingAnswers";
  const EXAM_TRAINING_CHECKS_KEY = "klausurtrainingChecks";
  const OPERATOR_TRAINING_PROGRESS_KEY = "operatorentrainingProgress";
  const OPERATOR_TRAINING_ANSWERS_KEY = "operatorentrainingAnswers";
  const OPERATOR_TRAINING_CHECKS_KEY = "operatorentrainingChecks";
  const EXAM_ALLOWED_CATEGORIES = ["DNA-Aufbau", "DNA-Replikation", "Transkription", "Translation"];

  const topics = [
    { title: "Selbstcheck", subtitle: "Kann ich das schon?", active: true, view: "selfcheck" },
    { title: "Klausurtraining: Materialaufgaben", active: true, view: "examTraining", featured: true },
    { title: "DNA-Aufbau", active: true, taskId: "dna_aufbau_01" },
    { title: "DNA-Replikation", active: true, taskId: "dna_replikation_01" },
    { title: "Transkription", active: true, taskId: "transkription_01" },
    { title: "Translation", active: true, taskId: "translation_01" },
    { title: "Gemischte Klausuraufgaben", active: false },
    { title: "Operatoren-Trainer", active: true, view: "operatorTraining" }
  ];

  const fallbackContent = {
    dna_aufbau_01a: {
      hints: [
        "Beginne mit den drei Bausteinen eines Nukleotids: Phosphatgruppe, Desoxyribose und Base.",
        "Beschreibe danach, wie Nukleotide über Zucker und Phosphat zu einem Strang verbunden werden.",
        "Achte darauf, zwischen Phosphat-Zucker-Rückgrat und Basen im Inneren der DNA zu unterscheiden."
      ],
      expectation: [
        "Ein Nukleotid besteht aus Phosphatgruppe, Desoxyribose und einer Base.",
        "Viele Nukleotide sind zu einem langen DNA-Strang verbunden.",
        "Zucker und Phosphat bilden das außenliegende Phosphat-Zucker-Rückgrat.",
        "Die Basen ragen nach innen und tragen die genetische Information in ihrer Reihenfolge."
      ],
      solution:
        "Die DNA ist aus vielen Nukleotiden aufgebaut. Jedes Nukleotid besteht aus einer Phosphatgruppe, dem Zucker Desoxyribose und einer Base. Viele Nukleotide sind zu langen DNA-Strängen verbunden. Dabei bilden Zucker und Phosphat das Phosphat-Zucker-Rückgrat, während die Basen nach innen ragen. Die Reihenfolge der Basen enthält die genetische Information.",
      criteria: [
        { label: "Nukleotid aus Phosphat, Desoxyribose und Base", keywords: ["phosphat", "desoxyribose", "base"] },
        { label: "Viele Nukleotide bilden einen DNA-Strang", keywords: ["nukleotid", "strang"] },
        { label: "Phosphat-Zucker-Rückgrat wird erklärt", keywords: ["rückgrat", "phosphat", "zucker"] },
        { label: "Basen ragen nach innen", keywords: ["base", "innen"] }
      ]
    },
    dna_aufbau_01b: {
      hints: [
        "Nenne zuerst die komplementären Basenpaare.",
        "Ergänze dann die Anzahl der Wasserstoffbrückenbindungen.",
        "Erkläre, dass die Verbindungen zwischen den Basen die beiden Einzelstränge zusammenhalten."
      ],
      expectation: [
        "Adenin paart mit Thymin, Guanin paart mit Cytosin.",
        "A-T wird durch zwei Wasserstoffbrückenbindungen stabilisiert.",
        "G-C wird durch drei Wasserstoffbrückenbindungen stabilisiert.",
        "Die Basenpaarung ist komplementär und verbindet die beiden DNA-Einzelstränge."
      ],
      solution:
        "Die beiden DNA-Einzelstränge werden durch Wasserstoffbrückenbindungen zwischen komplementären Basen zusammengehalten. Adenin paart stets mit Thymin und bildet dabei zwei Wasserstoffbrückenbindungen. Guanin paart mit Cytosin und bildet drei Wasserstoffbrückenbindungen. Durch diese komplementäre Basenpaarung passt die Basenfolge des einen Strangs zur Basenfolge des anderen Strangs.",
      criteria: [
        { label: "Adenin-Thymin und Guanin-Cytosin werden korrekt zugeordnet", keywords: ["adenin", "thymin", "guanin", "cytosin"] },
        { label: "Wasserstoffbrückenbindungen werden als Verbindung der Stränge genannt", keywords: ["wasserstoffbrücke", "einzelsträng"] },
        { label: "Zwei Bindungen bei A-T", keywords: ["adenin", "thymin", "zwei"] },
        { label: "Drei Bindungen bei G-C", keywords: ["guanin", "cytosin", "drei"] }
      ]
    },
    dna_aufbau_01c: {
      hints: [
        "Die Bezeichnungen 3' und 5' beziehen sich auf Kohlenstoffatome der Desoxyribose.",
        "Überlege, welche Enden eines DNA-Strangs dadurch unterschieden werden.",
        "Antiparallel bedeutet, dass die beiden Stränge entgegengesetzt orientiert sind."
      ],
      expectation: [
        "3' und 5' beziehen sich auf nummerierte C-Atome der Desoxyribose.",
        "Ein DNA-Strang besitzt ein 5'-Ende und ein 3'-Ende.",
        "Die beiden Stränge verlaufen antiparallel, also in entgegengesetzter Richtung.",
        "Ein Strang verläuft 5' zu 3', der Gegenstrang 3' zu 5'."
      ],
      solution:
        "Die Bezeichnungen 3' und 5' beziehen sich auf die Nummerierung der Kohlenstoffatome in der Desoxyribose. Dadurch kann man die Richtung eines DNA-Strangs angeben: Ein Ende ist das 5'-Ende, das andere das 3'-Ende. In der Doppelhelix liegen die beiden Stränge antiparallel vor. Das bedeutet, dass ein Strang in 5'-zu-3'-Richtung verläuft, während der komplementäre Strang entgegengesetzt in 3'-zu-5'-Richtung orientiert ist.",
      criteria: [
        { label: "3' und 5' werden auf Desoxyribose/C-Atome bezogen", keywords: ["desoxyribose", "kohlenstoff"] },
        { label: "5'-Ende und 3'-Ende werden unterschieden", keywords: ["5", "3", "ende"] },
        { label: "Antiparallel als entgegengesetzte Orientierung erklärt", keywords: ["antiparallel", "entgegengesetzt"] },
        { label: "Richtungen 5' zu 3' und 3' zu 5' werden beschrieben", keywords: ["5", "3", "richtung"] }
      ]
    }
  };

  const state = {
    tasks: [],
    credits: [],
    selfCheckCompetencies: [],
    selfCheckStatus: readJson(SELF_CHECK_STORAGE_KEY, {}),
    examTrainingTasks: [],
    examTrainingMeta: {},
    examTrainingProgress: readJson(EXAM_TRAINING_PROGRESS_KEY, {}),
    examTrainingAnswers: readJson(EXAM_TRAINING_ANSWERS_KEY, {}),
    examTrainingChecks: readJson(EXAM_TRAINING_CHECKS_KEY, {}),
    currentExamTask: null,
    currentExamFilters: { category: "all" },
    operatorTrainingTasks: [],
    operatorTrainingMeta: {},
    operatorTrainingProgress: readJson(OPERATOR_TRAINING_PROGRESS_KEY, {}),
    operatorTrainingAnswers: readJson(OPERATOR_TRAINING_ANSWERS_KEY, {}),
    operatorTrainingChecks: readJson(OPERATOR_TRAINING_CHECKS_KEY, {}),
    currentOperatorTask: null,
    currentTask: null,
    openedFromSelfCheck: false,
    checks: readJson(`${STORAGE_PREFIX}_checks`, {}),
    anonymousId: getOrCreateAnonymousId()
  };

  let selfCheckPrintOpenStates = [];

  const elements = {
    homeView: document.getElementById("homeView"),
    taskView: document.getElementById("taskView"),
    selfCheckView: document.getElementById("selfCheckView"),
    examTrainingView: document.getElementById("examTrainingView"),
    operatorTrainingView: document.getElementById("operatorTrainingView"),
    topicGrid: document.getElementById("topicGrid"),
    taskContainer: document.getElementById("taskContainer"),
    selfCheckContainer: document.getElementById("selfCheckContainer"),
    examTrainingContainer: document.getElementById("examTrainingContainer"),
    operatorTrainingContainer: document.getElementById("operatorTrainingContainer"),
    backHomeButton: document.getElementById("backHomeButton"),
    backSelfCheckButton: document.getElementById("backSelfCheckButton"),
    selfCheckBackHomeButton: document.getElementById("selfCheckBackHomeButton"),
    examTrainingBackHomeButton: document.getElementById("examTrainingBackHomeButton"),
    examTrainingBackOverviewButton: document.getElementById("examTrainingBackOverviewButton"),
    operatorTrainingBackHomeButton: document.getElementById("operatorTrainingBackHomeButton"),
    operatorTrainingBackOverviewButton: document.getElementById("operatorTrainingBackOverviewButton"),
    exportButton: document.getElementById("exportButton"),
    navButtons: Array.from(document.querySelectorAll("[data-view-target]"))
  };

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    renderTopics();
    bindNavigation();

    try {
      const [tasksData, creditsData] = await Promise.all([
        fetchJson(TASKS_URL),
        fetchJson(CREDITS_URL).catch(() => [])
      ]);
      state.tasks = normalizeTasks(tasksData);
      state.credits = Array.isArray(creditsData) ? creditsData : [];
    } catch (error) {
      showTaskMessage(
        "Die Aufgaben konnten nicht geladen werden. Prüfe bitte, ob data/tasks.json vorhanden ist. Beim lokalen Testen kann ein kleiner lokaler Server nötig sein."
      );
      console.error(error);
    }
  }

  function bindNavigation() {
    elements.backHomeButton.addEventListener("click", () => showView("home"));
    elements.backSelfCheckButton.addEventListener("click", () => openSelfCheck());
    elements.selfCheckBackHomeButton.addEventListener("click", () => showView("home"));
    elements.examTrainingBackHomeButton.addEventListener("click", () => showView("home"));
    elements.examTrainingBackOverviewButton.addEventListener("click", () => openExamTrainingOverview());
    elements.operatorTrainingBackHomeButton.addEventListener("click", () => showView("home"));
    elements.operatorTrainingBackOverviewButton.addEventListener("click", () => openOperatorTrainingOverview());
    elements.exportButton.addEventListener("click", exportResults);
    window.addEventListener("beforeprint", prepareSelfCheckPrint);
    window.addEventListener("afterprint", restoreSelfCheckPrint);
    elements.navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        showView("home");
      });
    });
  }

  function prepareSelfCheckPrint() {
    const groups = Array.from(elements.selfCheckContainer.querySelectorAll("details.selfcheck-group"));
    selfCheckPrintOpenStates = groups.map((group) => group.open);
    groups.forEach((group) => {
      group.open = true;
    });
  }

  function restoreSelfCheckPrint() {
    const groups = Array.from(elements.selfCheckContainer.querySelectorAll("details.selfcheck-group"));
    groups.forEach((group, index) => {
      if (typeof selfCheckPrintOpenStates[index] === "boolean") {
        group.open = selfCheckPrintOpenStates[index];
      }
    });
    selfCheckPrintOpenStates = [];
  }

  function renderTopics() {
    elements.topicGrid.innerHTML = "";
    topics.forEach((topic) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = topic.view === "selfcheck" ? "topic-card topic-card-selfcheck" : "topic-card";
      if (topic.view === "examTraining") {
        card.classList.add("topic-card-exam");
      }
      if (topic.view === "operatorTraining") {
        card.classList.add("topic-card-operator");
      }
      card.disabled = !topic.active;
      card.innerHTML = `
        <span class="topic-title">${escapeHtml(topic.title)}</span>
        ${topic.subtitle ? `<span class="topic-subtitle">${escapeHtml(topic.subtitle)}</span>` : ""}
        <span class="topic-state">${topic.active ? getTopicStateText(topic) : "kommt später"}</span>
      `;
      if (topic.active) {
        card.addEventListener("click", () => {
          if (topic.view === "selfcheck") {
            openSelfCheck();
          } else if (topic.view === "examTraining") {
            openExamTrainingOverview();
          } else if (topic.view === "operatorTraining") {
            openOperatorTrainingOverview();
          } else {
            openTask(topic.taskId);
          }
        });
      }
      elements.topicGrid.append(card);
    });
  }

  function getTopicStateText(topic) {
    if (topic.view === "selfcheck") {
      return "Selbstcheck öffnen";
    }
    if (topic.view === "examTraining") {
      return "Klausurtraining öffnen";
    }
    if (topic.view === "operatorTraining") {
      return "Operatoren trainieren";
    }
    return "Aufgabe öffnen";
  }

  async function openTask(preferredId, options = {}) {
    if (!state.tasks.length) {
      try {
        state.tasks = normalizeTasks(await fetchJson(TASKS_URL));
      } catch (error) {
        showView("task");
        showTaskMessage("Die Aufgabe konnte nicht geladen werden. Prüfe bitte die Datei data/tasks.json.");
        return;
      }
    }

    if (!state.credits.length) {
      state.credits = await fetchJson(CREDITS_URL).catch(() => []);
    }

    const task = state.tasks.find((item) => item.id === preferredId) || state.tasks[0];
    if (!task) {
      showView("task");
      showTaskMessage("Es wurde keine Aufgabe in data/tasks.json gefunden.");
      return;
    }

    state.currentTask = task;
    state.openedFromSelfCheck = Boolean(options.fromSelfCheck);
    renderTask(task);
    showView("task");
    if (options.targetSubtaskId) {
      requestAnimationFrame(() => focusSubtask(options.targetSubtaskId));
    }
  }

  function showView(viewName) {
    const isTask = viewName === "task";
    const isSelfCheck = viewName === "selfcheck";
    const isExamTraining = viewName === "examTraining";
    const isOperatorTraining = viewName === "operatorTraining";
    elements.homeView.classList.toggle("active", viewName === "home");
    elements.taskView.classList.toggle("active", isTask);
    elements.selfCheckView.classList.toggle("active", isSelfCheck);
    elements.examTrainingView.classList.toggle("active", isExamTraining);
    elements.operatorTrainingView.classList.toggle("active", isOperatorTraining);
    elements.backSelfCheckButton.classList.toggle("hidden", !state.openedFromSelfCheck || !isTask);
    elements.navButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.viewTarget === viewName);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function openSelfCheck() {
    state.openedFromSelfCheck = false;
    showView("selfcheck");
    if (!state.selfCheckCompetencies.length) {
      try {
        state.selfCheckCompetencies = normalizeSelfCheckCompetencies(await fetchJson(SELF_CHECK_URL));
      } catch (error) {
        renderSelfCheckError("Der Selbstcheck konnte nicht geladen werden. Prüfe bitte, ob data/selfCheckCompetencies.json vorhanden ist.");
        return;
      }
    }
    renderSelfCheck();
  }

  function renderSelfCheckError(message) {
    elements.selfCheckContainer.innerHTML = `<div class="message-box">${escapeHtml(message)}</div>`;
  }

  async function openExamTrainingOverview() {
    showView("examTraining");
    elements.examTrainingBackOverviewButton.classList.add("hidden");
    state.currentExamTask = null;
    if (!state.examTrainingTasks.length) {
      try {
        await loadExamTrainingTasks();
      } catch (error) {
        renderExamTrainingMessage("Das Klausurtraining konnte nicht geladen werden. Prüfe bitte, ob data/klausuraufgaben.json vorhanden ist.");
        console.error(error);
        return;
      }
    }
    renderExamTrainingOverview();
  }

  async function loadExamTrainingTasks() {
    const data = await fetchJson(EXAM_TRAINING_URL);
    state.examTrainingMeta = {
      title: data && data.title ? String(data.title) : "Klausurtraining: Materialaufgaben",
      description: data && data.description ? String(data.description) : ""
    };
    state.examTrainingTasks = Array.isArray(data && data.tasks) ? data.tasks.filter((task) => task && task.id) : [];
  }

  function renderExamTrainingMessage(message) {
    elements.examTrainingContainer.innerHTML = `<div class="message-box">${escapeHtml(message)}</div>`;
  }

  async function openOperatorTrainingOverview() {
    showView("operatorTraining");
    elements.operatorTrainingBackOverviewButton.classList.add("hidden");
    state.currentOperatorTask = null;
    if (!state.operatorTrainingTasks.length) {
      try {
        await loadOperatorTrainingTasks();
      } catch (error) {
        renderOperatorTrainingMessage("Der Operatoren-Trainer konnte nicht geladen werden. Prüfe bitte, ob data/operatorentraining.json vorhanden ist.");
        console.error(error);
        return;
      }
    }
    renderOperatorTrainingOverview();
  }

  async function loadOperatorTrainingTasks() {
    const data = await fetchJson(OPERATOR_TRAINING_URL);
    state.operatorTrainingMeta = {
      title: data && data.title ? String(data.title) : "Operatoren-Trainer",
      description: data && data.description ? String(data.description) : ""
    };
    state.operatorTrainingTasks = Array.isArray(data && data.tasks) ? data.tasks.filter((task) => task && task.id) : [];
  }

  function renderOperatorTrainingMessage(message) {
    elements.operatorTrainingContainer.innerHTML = `<div class="message-box">${escapeHtml(message)}</div>`;
  }

  function renderOperatorTrainingOverview() {
    const tasks = state.operatorTrainingTasks;
    elements.operatorTrainingContainer.innerHTML = `
      <article class="operator-overview-header">
        <p class="eyebrow">Operatoren-Trainer</p>
        <h2 id="operatorTrainingTitle">Operatoren-Trainer</h2>
        <p>${escapeHtml(state.operatorTrainingMeta.description || "Trainiere, Aufgabenoperatoren sauber voneinander zu unterscheiden und passend zu beantworten.")}</p>
      </article>
      <div class="operator-task-grid">
        ${tasks.length ? tasks.map((task) => renderOperatorTaskCard(task)).join("") : '<div class="message-box">Es wurden keine Operatoren-Aufgaben gefunden.</div>'}
      </div>
    `;
    elements.operatorTrainingContainer.querySelectorAll("[data-operator-start]").forEach((button) => {
      button.addEventListener("click", () => openOperatorTrainingTask(button.dataset.operatorStart));
    });
  }

  function renderOperatorTaskCard(task) {
    const progress = getOperatorProgress(task.id);
    return `
      <article class="operator-task-card">
        <div>
          <h3>${escapeHtml(task.title || "Operatoren-Aufgabe")}</h3>
          ${task.subtitle ? `<p class="muted-small">${escapeHtml(task.subtitle)}</p>` : ""}
          <div class="exam-meta">
            ${normalizeList(task.categories).map((category) => `<span>${escapeHtml(category)}</span>`).join("")}
            ${normalizeList(task.focusOperators).map((operator) => `<span class="operator-tag">${escapeHtml(operator)}</span>`).join("")}
          </div>
          ${task.learningGoal ? `<p>${escapeHtml(task.learningGoal)}</p>` : ""}
          <p class="exam-progress-pill ${progress.className}">${escapeHtml(progress.label)}</p>
        </div>
        <button class="primary-button" type="button" data-operator-start="${escapeHtml(task.id)}">Aufgabe starten</button>
      </article>
    `;
  }

  function openOperatorTrainingTask(taskId) {
    const task = state.operatorTrainingTasks.find((item) => item.id === taskId);
    if (!task) {
      renderOperatorTrainingMessage("Diese Operatoren-Aufgabe ist noch nicht verfügbar.");
      return;
    }
    state.currentOperatorTask = task;
    elements.operatorTrainingBackOverviewButton.classList.remove("hidden");
    showView("operatorTraining");
    renderOperatorTrainingTask(task);
  }

  function renderOperatorTrainingTask(task) {
    const progress = getOperatorProgress(task.id);
    const answers = getOperatorAnswers(task.id);
    elements.operatorTrainingContainer.innerHTML = `
      <article class="operator-task-view" data-operator-task-id="${escapeHtml(task.id)}">
        <header class="operator-task-header">
          <p class="eyebrow">Operatoren-Trainer</p>
          <h2>${escapeHtml(task.title || "Operatoren-Aufgabe")}</h2>
          ${task.subtitle ? `<p class="subtitle-small">${escapeHtml(task.subtitle)}</p>` : ""}
          <div class="exam-meta">
            ${normalizeList(task.categories).map((category) => `<span>${escapeHtml(category)}</span>`).join("")}
            ${normalizeList(task.focusOperators).map((operator) => `<span class="operator-tag">${escapeHtml(operator)}</span>`).join("")}
            <span>${escapeHtml(progress.label)}</span>
          </div>
          ${task.learningGoal ? `<p>${escapeHtml(task.learningGoal)}</p>` : ""}
        </header>
        <section class="exam-material-section">
          <h3>Material</h3>
          ${normalizeList(task.material).length ? normalizeList(task.material).map((material) => renderOperatorMaterial(material)).join("") : '<p class="muted-small">Kein zusätzliches Material vorhanden.</p>'}
        </section>
        ${renderOperatorImage(task.image)}
        <section class="operator-question-section">
          <h3>Teilaufgaben</h3>
          ${normalizeList(task.questions).map((question, index) => renderOperatorQuestion(task, question, index, answers)).join("")}
        </section>
        <div class="button-row exam-action-row">
          <button class="secondary-button" type="button" data-operator-progress="done">Als bearbeitet markieren</button>
          <button class="secondary-button" type="button" data-operator-progress="secure">Das kann ich sicher</button>
          <button class="secondary-button" type="button" data-operator-progress="unsure">Das muss ich noch üben</button>
        </div>
        <div class="button-row exam-nav-row">
          <button class="secondary-button" type="button" id="operatorOverviewButton">Zurück zur Übersicht</button>
        </div>
      </article>
    `;
    bindOperatorTrainingTaskEvents(task);
  }

  function renderOperatorMaterial(material) {
    const title = material && material.title ? `<h4>${escapeHtml(material.title)}</h4>` : "";
    if (!material) {
      return "";
    }
    if (material.type === "text" || material.type === "imageTask") {
      return `<article class="exam-material-card">${title}<p>${escapeHtml(material.content || "")}</p></article>`;
    }
    return `<article class="exam-material-card">${title}<pre>${escapeHtml(JSON.stringify(material, null, 2))}</pre></article>`;
  }

  function renderOperatorImage(image) {
    if (!image || !image.src) {
      return "";
    }
    return `
      <figure class="exam-image-card operator-image-card">
        <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || "Bildmaterial zur Operatoren-Aufgabe")}" onerror="this.style.display='none'; this.parentElement.querySelector('.image-error').classList.remove('hidden');">
        <figcaption>${escapeHtml(image.alt || "Bildmaterial")}</figcaption>
        <p class="image-error hidden">Das Bild konnte nicht geladen werden. Nutze den Alternativtext: ${escapeHtml(image.alt || "Bildmaterial zur Operatoren-Aufgabe")}</p>
      </figure>
    `;
  }

  function renderOperatorQuestion(task, question, index, answers) {
    const questionId = question.id || `frage_${index + 1}`;
    const answer = answers[questionId] || "";
    const check = getOperatorQuestionCheck(task.id, questionId);
    return `
      <article class="operator-question-card" data-operator-question-card="${escapeHtml(questionId)}">
        <div class="operator-question-heading">
          ${question.label ? `<h4>${escapeHtml(question.label)}</h4>` : `<h4>Teilaufgabe ${index + 1}</h4>`}
          ${question.operator ? `<span class="operator-tag">${escapeHtml(question.operator)}</span>` : ""}
        </div>
        <p>${escapeHtml(question.text || "")}</p>
        <textarea data-operator-question-id="${escapeHtml(questionId)}" rows="7" placeholder="Antwort eingeben">${escapeHtml(answer)}</textarea>
        <div class="button-row exam-question-actions">
          ${question.operatorHelp ? `<button class="secondary-button" type="button" data-operator-help="${escapeHtml(questionId)}">Operator-Hilfe anzeigen</button>` : ""}
          <button class="primary-button" type="button" data-operator-check="${escapeHtml(questionId)}">Antwort prüfen</button>
          <button class="ghost-button" type="button" data-operator-solution="${escapeHtml(questionId)}">Lösung anzeigen</button>
        </div>
        <div class="operator-help-box hidden" data-operator-help-box="${escapeHtml(questionId)}"></div>
        <div class="feedback ${check ? "" : "hidden"}" data-operator-feedback="${escapeHtml(questionId)}">${check ? renderOperatorQuestionFeedback(check) : ""}</div>
        <div class="solution-box hidden" data-operator-solution-box="${escapeHtml(questionId)}"></div>
      </article>
    `;
  }

  function bindOperatorTrainingTaskEvents(task) {
    const container = elements.operatorTrainingContainer;
    container.querySelectorAll("[data-operator-question-id]").forEach((field) => {
      field.addEventListener("input", () => storeOperatorAnswers(task.id));
    });
    container.querySelectorAll("[data-operator-help]").forEach((button) => {
      button.addEventListener("click", () => {
        const question = normalizeList(task.questions).find((item) => (item.id || "") === button.dataset.operatorHelp);
        const helpBox = container.querySelector(`[data-operator-help-box="${cssEscape(button.dataset.operatorHelp)}"]`);
        if (!question || !helpBox) return;
        helpBox.classList.toggle("hidden");
        if (!helpBox.classList.contains("hidden")) {
          helpBox.innerHTML = renderOperatorHelp(question.operatorHelp);
        }
      });
    });
    container.querySelectorAll("[data-operator-check]").forEach((button) => {
      button.addEventListener("click", () => {
        storeOperatorAnswers(task.id);
        const question = normalizeList(task.questions).find((item) => (item.id || "") === button.dataset.operatorCheck);
        if (!question) return;
        const result = checkOperatorQuestion(question);
        setOperatorQuestionCheck(task.id, question.id, result);
        const feedback = container.querySelector(`[data-operator-feedback="${cssEscape(question.id)}"]`);
        if (feedback) {
          feedback.classList.remove("hidden");
          feedback.innerHTML = renderOperatorQuestionFeedback(result);
        }
      });
    });
    container.querySelectorAll("[data-operator-solution]").forEach((button) => {
      button.addEventListener("click", () => {
        const question = normalizeList(task.questions).find((item) => (item.id || "") === button.dataset.operatorSolution);
        const solutionBox = container.querySelector(`[data-operator-solution-box="${cssEscape(button.dataset.operatorSolution)}"]`);
        if (!question || !solutionBox) return;
        solutionBox.classList.toggle("hidden");
        if (!solutionBox.classList.contains("hidden")) {
          solutionBox.innerHTML = renderOperatorSolution(question.solution || {});
        }
      });
    });
    container.querySelector("#operatorOverviewButton").addEventListener("click", () => openOperatorTrainingOverview());
    container.querySelectorAll("[data-operator-progress]").forEach((button) => {
      button.addEventListener("click", () => {
        setOperatorProgress(task.id, button.dataset.operatorProgress);
        renderOperatorTrainingTask(task);
      });
    });
  }

  function renderOperatorHelp(help) {
    if (!help) {
      return "";
    }
    return `
      <h4>${escapeHtml(help.title || "Operator-Hilfe")}</h4>
      <p>${escapeHtml(help.content || "")}</p>
      ${normalizeList(help.tips).length ? renderList(help.tips) : ""}
    `;
  }

  function checkOperatorQuestion(question) {
    return {
      date: new Date().toISOString(),
      questionId: question.id || "",
      operator: question.operator || "",
      message: "Vergleiche deine Antwort mit der Musterlösung. Achte besonders darauf, ob du den Operator eingehalten hast.",
      operatorHint: getOperatorHint(question.operator)
    };
  }

  function getOperatorHint(operator) {
    const normalized = normalizeText(operator);
    if (normalized.includes("beschreiben")) {
      return "Hast du nur sichtbare Ergebnisse genannt und noch nicht gedeutet?";
    }
    if (normalized.includes("interpretieren")) {
      return "Hast du die Beobachtungen fachlich gedeutet?";
    }
    if (normalized.includes("erlautern") || normalized.includes("erläutern")) {
      return "Hast du das Ergebnis verständlich gemacht und Fachwissen passend eingebunden?";
    }
    if (normalized.includes("erklaren") || normalized.includes("erklären")) {
      return "Hast du Ursache und Wirkung klar verknüpft?";
    }
    return "";
  }

  function renderOperatorQuestionFeedback(result) {
    return `
      <p class="notice">${escapeHtml(result.message)}</p>
      ${result.operatorHint ? `<p>${escapeHtml(result.operatorHint)}</p>` : ""}
    `;
  }

  function renderOperatorSolution(solution) {
    return `
      <h4>${escapeHtml(solution.title || "Lösung")}</h4>
      <p>${escapeHtml(solution.answer || "")}</p>
    `;
  }

  function storeOperatorAnswers(taskId) {
    const taskAnswers = {};
    elements.operatorTrainingContainer.querySelectorAll("[data-operator-question-id]").forEach((field) => {
      taskAnswers[field.dataset.operatorQuestionId] = field.value;
    });
    state.operatorTrainingAnswers = { ...state.operatorTrainingAnswers, [taskId]: taskAnswers };
    writeJson(OPERATOR_TRAINING_ANSWERS_KEY, state.operatorTrainingAnswers);
  }

  function getOperatorAnswers(taskId) {
    return state.operatorTrainingAnswers[taskId] || {};
  }

  function getOperatorQuestionCheck(taskId, questionId) {
    const taskChecks = state.operatorTrainingChecks[taskId];
    return taskChecks && taskChecks.questions ? taskChecks.questions[questionId] || null : null;
  }

  function setOperatorQuestionCheck(taskId, questionId, result) {
    const current = state.operatorTrainingChecks[taskId] && state.operatorTrainingChecks[taskId].questions
      ? state.operatorTrainingChecks[taskId]
      : { questions: {} };
    state.operatorTrainingChecks = {
      ...state.operatorTrainingChecks,
      [taskId]: {
        ...current,
        questions: {
          ...current.questions,
          [questionId]: result
        }
      }
    };
    writeJson(OPERATOR_TRAINING_CHECKS_KEY, state.operatorTrainingChecks);
  }

  function getOperatorProgress(taskId) {
    const value = state.operatorTrainingProgress[taskId] || "none";
    const labels = {
      none: "noch nicht bearbeitet",
      done: "bearbeitet",
      secure: "sicher",
      unsure: "unsicher"
    };
    return { value, label: labels[value] || labels.none, className: `progress-${value}` };
  }

  function setOperatorProgress(taskId, value) {
    state.operatorTrainingProgress = { ...state.operatorTrainingProgress, [taskId]: value };
    writeJson(OPERATOR_TRAINING_PROGRESS_KEY, state.operatorTrainingProgress);
  }

  function renderExamTrainingOverview() {
    const tasks = state.examTrainingTasks;
    const filtered = tasks.filter((task) => {
      const categories = getExamTaskCategories(task);
      return state.currentExamFilters.category === "all" || categories.includes(state.currentExamFilters.category);
    });

    elements.examTrainingContainer.innerHTML = `
      <article class="exam-overview-header">
        <p class="eyebrow">Klausurtraining</p>
        <h2 id="examTrainingTitle">Klausurtraining: Materialaufgaben</h2>
        <p>Bearbeite materialgestützte Aufgaben wie in einer Klausur. Offene Antworten vergleichst du anschließend mit der Musterlösung.</p>
        <div class="exam-filter-row">
          <label>Kategorie
            <select id="examCategoryFilter">
              <option value="all">Alle anzeigen</option>
              ${EXAM_ALLOWED_CATEGORIES.map((category) => `<option value="${escapeHtml(category)}" ${state.currentExamFilters.category === category ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}
            </select>
          </label>
        </div>
      </article>
      <div class="exam-task-grid">
        ${filtered.length ? filtered.map((task) => renderExamTaskCard(task)).join("") : '<div class="message-box">Zu diesen Filtern wurden keine Aufgaben gefunden.</div>'}
      </div>
    `;

    elements.examTrainingContainer.querySelector("#examCategoryFilter").addEventListener("change", (event) => {
      state.currentExamFilters.category = event.target.value;
      renderExamTrainingOverview();
    });
    elements.examTrainingContainer.querySelectorAll("[data-exam-start]").forEach((button) => {
      button.addEventListener("click", () => openExamTrainingTask(button.dataset.examStart));
    });
  }

  function renderExamTaskCard(task) {
    const progress = getExamProgress(task.id);
    const categories = getExamTaskCategories(task);
    return `
      <article class="exam-task-card">
        <div>
          <h3>${escapeHtml(task.title || "Materialaufgabe")}</h3>
          <div class="exam-meta">
            ${categories.length ? categories.map((category) => `<span>${escapeHtml(category)}</span>`).join("") : "<span>ohne Kategorie</span>"}
            ${task.image && task.image.src ? "<span>mit Bildmaterial</span>" : ""}
          </div>
          <p class="exam-progress-pill ${progress.className}">${escapeHtml(progress.label)}</p>
        </div>
        <button class="primary-button" type="button" data-exam-start="${escapeHtml(task.id)}">Aufgabe starten</button>
      </article>
    `;
  }

  function openExamTrainingTask(taskId) {
    const task = state.examTrainingTasks.find((item) => item.id === taskId);
    if (!task) {
      renderExamTrainingMessage("Diese Klausuraufgabe ist noch nicht verfügbar.");
      return;
    }
    state.currentExamTask = task;
    elements.examTrainingBackOverviewButton.classList.remove("hidden");
    showView("examTraining");
    renderExamTrainingTask(task);
  }

  function renderExamTrainingTask(task) {
    const index = state.examTrainingTasks.findIndex((item) => item.id === task.id);
    const progress = getExamProgress(task.id);
    const answers = getExamAnswers(task.id);
    const categories = getExamTaskCategories(task);
    elements.examTrainingContainer.innerHTML = `
      <article class="exam-task-view" data-exam-task-id="${escapeHtml(task.id)}">
        <header class="exam-task-header">
          <p class="eyebrow">Klausurtraining</p>
          <h2>${escapeHtml(task.title || "Materialaufgabe")}</h2>
          <div class="exam-meta">
            ${categories.length ? categories.map((category) => `<span>${escapeHtml(category)}</span>`).join("") : "<span>ohne Kategorie</span>"}
            <span>${escapeHtml(progress.label)}</span>
          </div>
          ${normalizeList(task.competencies).length ? `<div class="competency-tags">${normalizeList(task.competencies).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : ""}
        </header>
        ${renderExamImage(task.image)}
        <section class="exam-material-section">
          <h3>Material</h3>
          ${normalizeList(task.material).length ? normalizeList(task.material).map((material) => renderExamMaterial(material)).join("") : '<p class="muted-small">Kein zusätzliches Material vorhanden.</p>'}
        </section>
        <section class="exam-question-section">
          <h3>Aufgaben</h3>
          ${normalizeList(task.questions).map((question, questionIndex) => renderExamQuestion(task, question, questionIndex, answers)).join("")}
        </section>
        <div class="button-row exam-action-row">
          <button class="secondary-button" type="button" data-progress="done">Als bearbeitet markieren</button>
          <button class="secondary-button" type="button" data-progress="secure">Das kann ich sicher</button>
          <button class="secondary-button" type="button" data-progress="unsure">Das muss ich noch üben</button>
        </div>
        <div class="button-row exam-nav-row">
          ${index > 0 ? `<button class="secondary-button" type="button" data-exam-nav="${escapeHtml(state.examTrainingTasks[index - 1].id)}">Vorherige Aufgabe</button>` : ""}
          <button class="secondary-button" type="button" id="examOverviewButton">Zurück zur Übersicht</button>
          ${index >= 0 && index < state.examTrainingTasks.length - 1 ? `<button class="primary-button" type="button" data-exam-nav="${escapeHtml(state.examTrainingTasks[index + 1].id)}">Nächste Aufgabe</button>` : ""}
        </div>
      </article>
    `;

    bindExamTrainingTaskEvents(task);
  }

  function bindExamTrainingTaskEvents(task) {
    const container = elements.examTrainingContainer;
    container.querySelectorAll("[data-question-id], [data-label-number], [data-match-key], [data-tf-part]").forEach((field) => {
      field.addEventListener("input", () => storeExamAnswers(task.id));
      field.addEventListener("change", () => storeExamAnswers(task.id));
    });
    container.querySelectorAll("[data-exam-question-check]").forEach((button) => {
      button.addEventListener("click", () => {
        storeExamAnswers(task.id);
        const question = normalizeList(task.questions).find((item) => (item.id || "") === button.dataset.examQuestionCheck);
        if (!question) return;
        const result = checkExamQuestion(task, question, getExamAnswers(task.id));
        setExamQuestionCheck(task.id, question.id, result);
        const feedback = container.querySelector(`[data-question-feedback="${cssEscape(question.id)}"]`);
        if (feedback) {
          feedback.classList.remove("hidden");
          feedback.innerHTML = renderExamQuestionFeedback(result);
        }
      });
    });
    container.querySelectorAll("[data-exam-question-solution]").forEach((button) => {
      button.addEventListener("click", () => {
        const question = normalizeList(task.questions).find((item) => (item.id || "") === button.dataset.examQuestionSolution);
        if (!question) return;
        const solutionBox = container.querySelector(`[data-question-solution-box="${cssEscape(question.id)}"]`);
        if (!solutionBox) return;
        solutionBox.classList.toggle("hidden");
        if (!solutionBox.classList.contains("hidden")) {
          solutionBox.innerHTML = renderExamQuestionSolution(question.solution || {});
        }
      });
    });
    container.querySelector("#examOverviewButton").addEventListener("click", () => openExamTrainingOverview());
    container.querySelectorAll("[data-exam-nav]").forEach((button) => {
      button.addEventListener("click", () => openExamTrainingTask(button.dataset.examNav));
    });
    container.querySelectorAll("[data-progress]").forEach((button) => {
      button.addEventListener("click", () => {
        setExamProgress(task.id, button.dataset.progress);
        renderExamTrainingTask(task);
      });
    });
  }

  function renderExamImage(image) {
    if (!image || !image.src) {
      return "";
    }
    return `
      <figure class="exam-image-card">
        <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || "Bildmaterial zur Aufgabe")}" onerror="this.style.display='none'; this.parentElement.querySelector('.image-error').classList.remove('hidden');">
        <figcaption>${escapeHtml(image.alt || "Bildmaterial")}</figcaption>
        <p class="image-error hidden">Das Bild konnte nicht geladen werden. Nutze den Alternativtext: ${escapeHtml(image.alt || "Bildmaterial zur Aufgabe")}</p>
      </figure>
    `;
  }

  function renderExamMaterial(material) {
    const title = material && material.title ? `<h4>${escapeHtml(material.title)}</h4>` : "";
    const type = material && material.type ? material.type : "text";
    if (type === "text" || type === "imageTask") {
      return `<article class="exam-material-card">${title}<p>${escapeHtml(material.content || "")}</p></article>`;
    }
    if (type === "sequence" || type === "sequenceComparison") {
      return `<article class="exam-material-card sequence-material">${title}<pre>${escapeHtml(material.content || "")}</pre></article>`;
    }
    if (type === "list" || type === "models") {
      return `<article class="exam-material-card">${title}${renderList(material.items || [])}</article>`;
    }
    if (type === "codeTable") {
      return `<article class="exam-material-card">${title}${renderCodeTable(material.entries || {})}</article>`;
    }
    if (type === "studentSolution") {
      return `<article class="exam-material-card student-solution-card">${title}<p>${escapeHtml(material.content || "")}</p></article>`;
    }
    return `<article class="exam-material-card">${title}<pre>${escapeHtml(JSON.stringify(material, null, 2))}</pre></article>`;
  }

  function renderExamQuestion(task, question, index, answers) {
    const questionId = question.id || `frage_${index + 1}`;
    const responseType = question.responseType || "shortText";
    const value = answers.questions && answers.questions[questionId] ? answers.questions[questionId] : "";
    const check = getExamQuestionCheck(task.id, questionId);
    return `
      <article class="exam-question-card" data-exam-question-card="${escapeHtml(questionId)}">
        <h4>${escapeHtml(index + 1)}. ${escapeHtml(question.text || "Aufgabe")}</h4>
        ${renderExamResponse(task, question, questionId, responseType, value)}
        <div class="button-row exam-question-actions">
          <button class="primary-button" type="button" data-exam-question-check="${escapeHtml(questionId)}">Antwort prüfen</button>
          <button class="ghost-button" type="button" data-exam-question-solution="${escapeHtml(questionId)}">Lösung anzeigen</button>
        </div>
        <div class="feedback ${check ? "" : "hidden"}" data-question-feedback="${escapeHtml(questionId)}">${check ? renderExamQuestionFeedback(check) : ""}</div>
        <div class="solution-box hidden" data-question-solution-box="${escapeHtml(questionId)}"></div>
      </article>
    `;
  }

  function renderExamResponse(task, question, questionId, responseType, value) {
    if (responseType === "dropdownLabeling") {
      return renderDropdownLabeling(task, question);
    }
    if (responseType === "sequenceInput" || responseType === "ordering") {
      return `<input class="exam-input" type="text" data-question-id="${escapeHtml(questionId)}" value="${escapeHtml(value)}" placeholder="${responseType === "ordering" ? "z. B. A-B-C-D" : ""}">`;
    }
    if (responseType === "matching") {
      return renderExamMatching(task, question, questionId);
    }
    if (responseType === "trueFalseExplain") {
      const stored = typeof value === "object" && value ? value : {};
      return `
        <div class="true-false-grid">
          <select data-question-id="${escapeHtml(questionId)}" data-tf-part="choice">
            <option value="">Bitte auswählen</option>
            <option value="richtig" ${stored.choice === "richtig" ? "selected" : ""}>richtig</option>
            <option value="falsch" ${stored.choice === "falsch" ? "selected" : ""}>falsch</option>
          </select>
          <textarea data-question-id="${escapeHtml(questionId)}" data-tf-part="explanation" rows="4" placeholder="Begründung">${escapeHtml(stored.explanation || "")}</textarea>
        </div>
      `;
    }
    const rows = responseType === "errorFinding" ? 7 : 5;
    return `<textarea data-question-id="${escapeHtml(questionId)}" rows="${rows}" placeholder="Antwort eingeben">${escapeHtml(value)}</textarea>`;
  }

  function renderDropdownLabeling(task, question) {
    const solutions = question.solution && question.solution.answer ? question.solution.answer : {};
    const numbers = Object.keys(solutions).sort((a, b) => Number(a) - Number(b));
    const options = getExamDropdownOptions(task);
    const labels = getExamAnswers(task.id).labels || {};
    return `
      <div class="dropdown-labeling-grid">
        ${numbers.map((number) => `
          <label>Zahl ${escapeHtml(number)}
            <select data-label-number="${escapeHtml(number)}">
              <option value="">Bitte auswählen</option>
              ${options.map((option) => `<option value="${escapeHtml(option)}" ${labels[number] === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
            </select>
          </label>
        `).join("")}
      </div>
    `;
  }

  function renderExamMatching(task, question, questionId) {
    const matching = question.solution && question.solution.answer ? question.solution.answer : {};
    const keys = Object.keys(matching);
    const options = stableShuffle(Object.values(matching), `${task.id}_${questionId}_matching`);
    const stored = (getExamAnswers(task.id).matching || {})[questionId] || {};
    if (!keys.length) {
      return `<textarea data-question-id="${escapeHtml(questionId)}" rows="5" placeholder="Zuordnung eingeben"></textarea>`;
    }
    return `
      <div class="exam-matching-grid">
        ${keys.map((key) => `
          <label>${escapeHtml(key)}
            <select data-question-id="${escapeHtml(questionId)}" data-match-key="${escapeHtml(key)}">
              <option value="">Bitte zuordnen</option>
              ${options.map((option) => `<option value="${escapeHtml(option)}" ${stored[key] === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
            </select>
          </label>
        `).join("")}
      </div>
    `;
  }

  function storeExamAnswers(taskId) {
    const taskAnswers = { questions: {}, labels: {}, matching: {} };
    elements.examTrainingContainer.querySelectorAll("[data-question-id]").forEach((field) => {
      const questionId = field.dataset.questionId;
      if (field.dataset.matchKey) {
        taskAnswers.matching[questionId] = taskAnswers.matching[questionId] || {};
        taskAnswers.matching[questionId][field.dataset.matchKey] = field.value;
      } else if (field.dataset.tfPart) {
        taskAnswers.questions[questionId] = taskAnswers.questions[questionId] || {};
        taskAnswers.questions[questionId][field.dataset.tfPart] = field.value;
      } else {
        taskAnswers.questions[questionId] = field.value;
      }
    });
    elements.examTrainingContainer.querySelectorAll("[data-label-number]").forEach((field) => {
      taskAnswers.labels[field.dataset.labelNumber] = field.value;
    });
    state.examTrainingAnswers = { ...state.examTrainingAnswers, [taskId]: taskAnswers };
    writeJson(EXAM_TRAINING_ANSWERS_KEY, state.examTrainingAnswers);
  }

  function getExamAnswers(taskId) {
    return state.examTrainingAnswers[taskId] || { questions: {}, labels: {}, matching: {} };
  }

  function getExamQuestionCheck(taskId, questionId) {
    const taskChecks = state.examTrainingChecks[taskId];
    if (!taskChecks) {
      return null;
    }
    if (taskChecks.questions) {
      return taskChecks.questions[questionId] || null;
    }
    return taskChecks.questionId === questionId ? taskChecks : null;
  }

  function setExamQuestionCheck(taskId, questionId, result) {
    const current = state.examTrainingChecks[taskId] && state.examTrainingChecks[taskId].questions
      ? state.examTrainingChecks[taskId]
      : { questions: {} };
    state.examTrainingChecks = {
      ...state.examTrainingChecks,
      [taskId]: {
        ...current,
        questions: {
          ...current.questions,
          [questionId]: result
        }
      }
    };
    writeJson(EXAM_TRAINING_CHECKS_KEY, state.examTrainingChecks);
  }

  function checkExamQuestion(task, question, answers) {
    const questionId = question.id || "";
    const solution = question.solution || {};
    const solutionType = solution.type || "";
    const expected = solution.answer;
    const result = {
      date: new Date().toISOString(),
      questionId,
      responseType: question.responseType || "shortText",
      solutionType,
      summary: "Vergleiche deine Antwort mit der Musterlösung.",
      items: [],
      autoChecked: false
    };

    if (question.responseType === "dropdownLabeling" || solutionType === "labelSolutions") {
      Object.entries(expected || {}).forEach(([number, correctValue]) => {
        const entered = answers.labels && answers.labels[number] ? answers.labels[number] : "";
        result.items.push({
          label: `Zahl ${number}`,
          entered,
          expected: correctValue,
          correct: normalizeExamText(entered) === normalizeExamText(correctValue)
        });
      });
      result.autoChecked = true;
      result.summary = summarizeClosedCheck(result.items, "Zuordnungen");
      return result;
    }

    if (question.responseType === "matching" || solutionType === "matching") {
      const stored = (answers.matching && answers.matching[questionId]) || {};
      Object.entries(expected || {}).forEach(([key, correctValue]) => {
        const entered = stored[key] || "";
        result.items.push({ label: key, entered, expected: correctValue, correct: entered === correctValue });
      });
      result.autoChecked = true;
      result.summary = summarizeClosedCheck(result.items, "Zuordnungen");
      return result;
    }

    const entered = answers.questions && answers.questions[questionId] ? answers.questions[questionId] : "";
    if (question.responseType === "sequenceInput" || solutionType === "sequence") {
      result.items.push({
        label: "Sequenz",
        entered,
        expected,
        correct: normalizeSequence(entered) === normalizeSequence(expected)
      });
      result.autoChecked = true;
      result.summary = result.items[0].correct ? "Die Sequenz passt zur hinterlegten Lösung." : "Prüfe die Sequenz noch einmal und vergleiche sie mit der Lösung.";
      return result;
    }

    if (question.responseType === "ordering" || solutionType === "order") {
      result.items.push({
        label: "Reihenfolge",
        entered,
        expected: normalizeList(expected).join(" – "),
        correct: normalizeOrderingAnswer(entered) === normalizeOrderingAnswer(expected)
      });
      result.autoChecked = true;
      result.summary = result.items[0].correct ? "Die Reihenfolge passt zur hinterlegten Lösung." : "Prüfe die Reihenfolge noch einmal.";
      return result;
    }

    if (solutionType === "shortAnswer") {
      result.items.push({
        label: "Kurzantwort",
        entered,
        expected,
        correct: normalizeShortAnswer(entered) === normalizeShortAnswer(expected)
      });
      result.autoChecked = true;
      result.summary = result.items[0].correct ? "Die Kurzantwort passt zur hinterlegten Lösung." : "Prüfe deine Kurzantwort noch einmal.";
      return result;
    }

    if (solutionType === "codons") {
      result.items.push({
        label: "Codons",
        entered,
        expected: normalizeList(expected).join(" | "),
        correct: normalizeOrderAnswer(entered) === normalizeOrderAnswer(expected)
      });
      result.autoChecked = true;
      result.summary = result.items[0].correct ? "Die Codon-Reihenfolge passt." : "Prüfe die Codon-Reihenfolge noch einmal.";
      return result;
    }

    if (solutionType === "trueFalseExplain") {
      const stored = typeof entered === "object" && entered ? entered : {};
      const expectedChoice = expected === true ? "richtig" : "falsch";
      result.items.push({
        label: "Richtig/Falsch",
        entered: stored.choice || "",
        expected: expectedChoice,
        correct: stored.choice === expectedChoice
      });
      result.autoChecked = true;
      result.summary = result.items[0].correct
        ? "Die Richtig/Falsch-Auswahl passt. Vergleiche deine Begründung mit der Musterlösung."
        : "Prüfe die Richtig/Falsch-Auswahl noch einmal. Vergleiche deine Begründung mit der Musterlösung.";
      return result;
    }

    return result;
  }

  function renderExamQuestionFeedback(result) {
    if (!result.autoChecked) {
      return `
        <p class="notice">Dieses Klausurtraining dient der Selbstkontrolle und ersetzt keine Bewertung.</p>
        <p>Vergleiche deine Antwort mit der Musterlösung.</p>
      `;
    }
    return `
      <p class="notice">Dieses Klausurtraining dient der Selbstkontrolle und ersetzt keine Bewertung.</p>
      <p>${escapeHtml(result.summary)}</p>
      ${renderExamResultList(result.items.map((item) => item.correct
        ? `${item.label}: richtig`
        : `${item.label}: noch prüfen${item.expected ? `, korrekt wäre ${item.expected}` : ""}`))}
    `;
  }

  function renderExamResultList(items) {
    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function renderExamQuestionSolution(solution) {
    const type = solution.type || "modelAnswer";
    const answer = solution.answer;
    let content = "";

    if (type === "modelAnswer") {
      content = `<p>${escapeHtml(answer || "")}</p>`;
    } else if (type === "sequence") {
      content = `<p class="sequence-line">${escapeHtml(answer || "")}</p>`;
    } else if (type === "order") {
      content = `<p class="sequence-line">${escapeHtml(solution.displayAnswer || normalizeList(answer).join(" → "))}</p>`;
    } else if (type === "matching" || type === "labelSolutions") {
      content = renderKeyValueTable(answer || {}, type === "labelSolutions" ? "Nummer" : "Begriff", "Lösung");
    } else if (type === "codons") {
      content = `<p class="sequence-line">${escapeHtml(solution.displayAnswer || normalizeList(answer).join(" | "))}</p>`;
    } else if (type === "aminoAcidSequence") {
      content = `<p class="sequence-line">${escapeHtml(solution.displayAnswer || normalizeList(answer).join(" – "))}</p>`;
    } else if (type === "shortAnswer") {
      content = `<p class="sequence-line">${escapeHtml(answer || "")}</p>`;
    } else if (type === "trueFalseExplain") {
      content = `<p>${escapeHtml(solution.displayAnswer || (answer === true ? "richtig" : "falsch"))}</p>`;
    } else if (type === "comparison") {
      content = renderKeyValueTable(answer || {}, "Vergleich", "Lösung");
    } else if (type === "errors") {
      content = renderList(answer || []);
    } else if (type === "requiredTerms") {
      content = `${solution.displayAnswer ? `<p>${escapeHtml(solution.displayAnswer)}</p>` : ""}${renderList(answer || [])}`;
    } else if (type === "exampleTerms") {
      content = renderNestedSolutionObject(answer || {});
    } else {
      content = renderSolutionValue(answer != null ? answer : solution);
    }

    return `<h4>Lösung</h4>${content}`;
  }

  function renderSolutionValue(value) {
    if (Array.isArray(value)) {
      return renderList(value);
    }
    if (value && typeof value === "object") {
      return renderKeyValueTable(value);
    }
    return `<p>${escapeHtml(value || "")}</p>`;
  }

  function renderKeyValueTable(value, firstLabel = "Begriff", secondLabel = "Lösung") {
    const rows = Object.entries(value || {}).map(([key, entry]) => `<tr><th scope="row">${escapeHtml(key)}</th><td>${Array.isArray(entry) ? escapeHtml(entry.join(", ")) : escapeHtml(entry)}</td></tr>`).join("");
    return `<div class="table-scroll"><table class="mini-table"><thead><tr><th>${escapeHtml(firstLabel)}</th><th>${escapeHtml(secondLabel)}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function renderCodeTable(entries) {
    if (Array.isArray(entries)) {
      const keys = Array.from(new Set(entries.flatMap((entry) => entry && typeof entry === "object" ? Object.keys(entry) : [])));
      if (keys.length) {
        const labels = keys.map((key) => key === "abbr3" ? "3-Buchstaben-Code" : key === "fullName" ? "vollständiger Name" : key);
        const rows = entries.map((entry) => `<tr>${keys.map((key) => `<td>${escapeHtml(entry && entry[key] != null ? entry[key] : "")}</td>`).join("")}</tr>`).join("");
        return `<div class="table-scroll"><table class="mini-table"><thead><tr>${labels.map((label) => `<th>${escapeHtml(label)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>`;
      }
      return renderList(entries);
    }
    const firstKey = Object.keys(entries || {})[0] || "";
    const firstLabel = /^[AUCGT]{3}$/i.test(firstKey) ? "Codon" : "3-Buchstaben-Code";
    const secondLabel = /^[AUCGT]{3}$/i.test(firstKey) ? "Aminosäure" : "vollständiger Name";
    return renderKeyValueTable(entries || {}, firstLabel, secondLabel);
  }

  function renderNestedSolutionObject(value) {
    return Object.entries(value || {}).map(([key, entries]) => `<h5>${escapeHtml(key)}</h5>${renderList(entries)}`).join("");
  }

  function getExamDropdownOptions(task) {
    const options = normalizeList(task.dropdownOptions);
    if (task.shuffleDropdownOptions) {
      return stableShuffle(options, `${task.id}_dropdown_options`);
    }
    return options;
  }

  function getExamTaskCategories(task) {
    const rawCategories = Array.isArray(task.categories)
      ? task.categories
      : task.category
        ? [task.category]
        : [];
    return rawCategories
      .map((category) => String(category))
      .filter((category) => EXAM_ALLOWED_CATEGORIES.includes(category));
  }

  function getExamProgress(taskId) {
    const value = state.examTrainingProgress[taskId] || "none";
    const labels = {
      none: "noch nicht bearbeitet",
      done: "bearbeitet",
      secure: "sicher",
      unsure: "unsicher"
    };
    return { value, label: labels[value] || labels.none, className: `progress-${value}` };
  }

  function setExamProgress(taskId, value) {
    state.examTrainingProgress = { ...state.examTrainingProgress, [taskId]: value };
    writeJson(EXAM_TRAINING_PROGRESS_KEY, state.examTrainingProgress);
  }

  function uniqueSorted(values) {
    return Array.from(new Set(values.map((value) => String(value)))).sort((a, b) => a.localeCompare(b, "de"));
  }

  function stableShuffle(values, seed) {
    const withScores = normalizeList(values).map((value) => ({
      value,
      score: seededHash(`${seed}_${value}`)
    }));
    return withScores.sort((a, b) => a.score - b.score).map((item) => item.value);
  }

  function seededHash(value) {
    let hash = 2166136261;
    const text = String(value);
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function normalizeExamText(value) {
    return normalizeText(value).replace(/[-–—]/g, " ").replace(/\s+/g, " ").trim();
  }

  function normalizeSequence(value) {
    return normalizeText(value).replace(/[^acgut]/g, "");
  }

  function normalizeOrderAnswer(value) {
    return normalizeList(value)
      .join(" ")
      .toUpperCase()
      .replace(/→|->|–|—/g, " ")
      .replace(/[^A-Z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .join("-");
  }

  function normalizeOrderingAnswer(value) {
    const text = normalizeList(value).join(" ").toUpperCase();
    const tokens = text
      .replace(/→|->|–|—/g, " ")
      .replace(/[^A-Z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (tokens.length === 1 && /^[A-Z]+$/.test(tokens[0])) {
      return tokens[0].split("").join("-");
    }
    return tokens.join("-");
  }

  function normalizeShortAnswer(value) {
    return normalizeText(value).replace(/\s+/g, "");
  }

  function summarizeClosedCheck(items, label) {
    const correct = items.filter((item) => item.correct).length;
    return `${correct} von ${items.length} ${label} passend.`;
  }

  function renderSelfCheck() {
    const competencies = state.selfCheckCompetencies;
    const total = competencies.length;
    const checkedTotal = competencies.filter((item) => isSelfCheckChecked(item.id)).length;
    const grouped = groupCompetenciesByCategory(competencies);

    elements.selfCheckContainer.innerHTML = `
      <article class="selfcheck-header">
        <p class="eyebrow">Freiwillige Selbsteinschätzung</p>
        <h2 id="selfCheckTitle">Selbstcheck: Kann ich das schon?</h2>
        <p class="selfcheck-instruction">Hake ab, was du schon sicher kannst. Wenn du auf eine Kompetenz klickst, gelangst du direkt zu der passenden Übungsaufgabe.</p>
        <p class="selfcheck-print-date">Datum: ${formatDateForPrint(new Date())}</p>
        <div class="selfcheck-progress" aria-label="Gesamtfortschritt">
          <div class="selfcheck-progress-label">Gesamtfortschritt: ${checkedTotal} von ${total} Kompetenzen abgehakt</div>
          <div class="selfcheck-progress-track"><span style="width: ${total ? Math.round((checkedTotal / total) * 100) : 0}%"></span></div>
        </div>
        <div class="button-row selfcheck-actions">
          <button class="secondary-button" type="button" id="printSelfCheckButton">Selbstcheck drucken / als PDF speichern</button>
          <button class="secondary-button" type="button" id="resetSelfCheckButton">Selbstcheck zurücksetzen</button>
          <button class="ghost-button" type="button" id="exportSelfCheckButton">Selbstcheck exportieren</button>
        </div>
        <p class="selfcheck-print-hint">Am Laptop im Druckdialog „Als PDF speichern“ wählen. Am iPad über Drucken/Teilen als PDF sichern.</p>
      </article>
      <div class="selfcheck-groups"></div>
    `;

    const groupsContainer = elements.selfCheckContainer.querySelector(".selfcheck-groups");
    grouped.forEach(([category, items]) => {
      groupsContainer.append(renderSelfCheckGroup(category, items));
    });

    elements.selfCheckContainer.querySelector("#resetSelfCheckButton").addEventListener("click", resetSelfCheck);
    elements.selfCheckContainer.querySelector("#exportSelfCheckButton").addEventListener("click", exportSelfCheck);
    elements.selfCheckContainer.querySelector("#printSelfCheckButton").addEventListener("click", () => window.print());
  }

  function renderSelfCheckGroup(category, items) {
    const checkedCount = items.filter((item) => isSelfCheckChecked(item.id)).length;
    const details = document.createElement("details");
    details.className = "selfcheck-group";
    details.open = true;
    details.innerHTML = `
      <summary>
        <span>${escapeHtml(category)}</span>
        <span>${checkedCount} von ${items.length} abgehakt</span>
      </summary>
      <div class="selfcheck-list"></div>
    `;

    const list = details.querySelector(".selfcheck-list");
    items.forEach((item) => {
      const checked = isSelfCheckChecked(item.id);
      const row = document.createElement("div");
      row.className = "selfcheck-item";
      row.classList.toggle("checked", checked);
      row.innerHTML = `
        <span class="selfcheck-print-status" aria-hidden="true">${checked ? "☑" : "☐"}</span>
        <label class="selfcheck-checkbox">
          <input type="checkbox" ${checked ? "checked" : ""} aria-label="${escapeHtml(item.text)} abhaken">
        </label>
        <button class="selfcheck-link" type="button">${escapeHtml(item.text)}</button>
        <span class="selfcheck-print-text">${escapeHtml(item.text)}</span>
      `;
      row.querySelector("input").addEventListener("change", (event) => {
        setSelfCheckStatus(item.id, event.target.checked);
        renderSelfCheck();
      });
      row.querySelector(".selfcheck-link").addEventListener("click", () => openCompetencyTarget(item));
      list.append(row);
    });

    return details;
  }

  async function openCompetencyTarget(competency) {
    if (!competency.targetTaskId) {
      renderSelfCheckError("Diese Übungsaufgabe ist noch nicht verfügbar.");
      return;
    }

    if (!state.tasks.length) {
      try {
        state.tasks = normalizeTasks(await fetchJson(TASKS_URL));
      } catch (error) {
        renderSelfCheckError("Die Aufgaben konnten nicht geladen werden.");
        return;
      }
    }

    const task = state.tasks.find((item) => item.id === competency.targetTaskId);
    if (!task) {
      renderSelfCheckError("Diese Übungsaufgabe ist noch nicht verfügbar.");
      return;
    }

    const subtasks = normalizeSubtasks(task);
    const hasTargetSubtask = subtasks.some((subtask, index) => {
      const subtaskId = subtask.id || `${task.id}_${index + 1}`;
      return subtaskId === competency.targetSubtaskId;
    });

    await openTask(competency.targetTaskId, {
      fromSelfCheck: true,
      targetSubtaskId: hasTargetSubtask ? competency.targetSubtaskId : ""
    });
  }

  function focusSubtask(subtaskId) {
    const target = elements.taskContainer.querySelector(`[data-subtask-id="${cssEscape(subtaskId)}"]`);
    if (!target) {
      showInlineTaskNotice("Die passende Aufgabe wurde geöffnet.");
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.classList.add("target-highlight");
    window.setTimeout(() => target.classList.remove("target-highlight"), 2200);
  }

  function showInlineTaskNotice(message) {
    const notice = document.createElement("div");
    notice.className = "notice";
    notice.textContent = message;
    elements.taskContainer.prepend(notice);
    window.setTimeout(() => notice.remove(), 2600);
  }

  function resetSelfCheck() {
    if (!window.confirm("Möchtest du wirklich alle Häkchen im Selbstcheck löschen?")) {
      return;
    }
    state.selfCheckStatus = {};
    localStorage.removeItem(SELF_CHECK_STORAGE_KEY);
    renderSelfCheck();
  }

  function exportSelfCheck() {
    const competencies = state.selfCheckCompetencies;
    const categories = {};
    groupCompetenciesByCategory(competencies).forEach(([category, items]) => {
      categories[category] = {
        total: items.length,
        checked: items.filter((item) => isSelfCheckChecked(item.id)).length
      };
    });
    const exportData = {
      anonymousId: state.anonymousId,
      date: new Date().toISOString(),
      selfCheckStatus: competencies.map((item) => ({
        id: item.id,
        category: item.category,
        text: item.text,
        checked: isSelfCheckChecked(item.id)
      })),
      totalCompetencies: competencies.length,
      checkedCompetencies: competencies.filter((item) => isSelfCheckChecked(item.id)).length,
      categories
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `selbstcheck_molekulargenetik_${state.anonymousId}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function exportResults() {
    const taskEntries = state.tasks.map((task) => ({
      taskId: task.id,
      title: task.title || "",
      subtasks: normalizeSubtasks(task).map((subtask, index) => {
        const subtaskId = subtask.id || `${task.id}_${index + 1}`;
        return {
          subtaskId,
          title: subtask.title || "",
          answer: localStorage.getItem(answerKey(task.id, subtaskId)) || "",
          phaseAnswers: readJson(phaseKey(task.id, subtaskId), {}),
          assignments: readJson(assignmentKey(task.id, subtaskId), {}),
          dnaRnaCompare: readJson(compareKey(task.id, subtaskId), {}),
          transcriptionInputs: readJson(transcriptionKey(task.id, subtaskId), {}),
          translationInputs: readJson(translationKey(task.id, subtaskId), {}),
          sequenceInputs: readJson(sequenceKey(task.id, subtaskId), {}),
          aminoAcidInputs: readJson(aminoSequenceKey(task.id, subtaskId), {}),
          selfAssessment: localStorage.getItem(assessmentKey(task.id, subtaskId)) || "",
          lastCheckResult: state.checks[checkKey(task.id, subtaskId)] || null
        };
      })
    }));
    const competencies = state.selfCheckCompetencies || [];
    const exportData = {
      anonymousId: state.anonymousId,
      date: new Date().toISOString(),
      currentTaskId: state.currentTask ? state.currentTask.id : "",
      tasks: taskEntries,
      selfCheck: {
        totalCompetencies: competencies.length,
        checkedCompetencies: competencies.filter((item) => isSelfCheckChecked(item.id)).length,
        status: state.selfCheckStatus
      },
      klausurtraining: {
        progress: state.examTrainingProgress,
        answers: state.examTrainingAnswers,
        checks: state.examTrainingChecks
      },
      operatorentraining: {
        progress: state.operatorTrainingProgress,
        answers: state.operatorTrainingAnswers,
        checks: state.operatorTrainingChecks
      }
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `klausurtrainer_molekulargenetik_${state.anonymousId}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function groupCompetenciesByCategory(competencies) {
    const order = ["DNA-Aufbau", "DNA-Replikation", "DNA und RNA", "Transkription", "Translation"];
    const map = new Map();
    competencies.forEach((item) => {
      const category = item.category || "Weitere Kompetenzen";
      if (!map.has(category)) {
        map.set(category, []);
      }
      map.get(category).push(item);
    });
    return Array.from(map.entries()).sort((a, b) => {
      const indexA = order.indexOf(a[0]);
      const indexB = order.indexOf(b[0]);
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });
  }

  function formatDateForPrint(date) {
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  function isSelfCheckChecked(id) {
    return Boolean(state.selfCheckStatus && state.selfCheckStatus[id]);
  }

  function setSelfCheckStatus(id, checked) {
    state.selfCheckStatus = {
      ...state.selfCheckStatus,
      [id]: checked
    };
    writeJson(SELF_CHECK_STORAGE_KEY, state.selfCheckStatus);
  }

  function normalizeSelfCheckCompetencies(data) {
    return Array.isArray(data)
      ? data
          .filter((item) => item && item.id && item.text)
          .map((item) => ({
            id: String(item.id),
            category: item.category || "Weitere Kompetenzen",
            text: item.text || "",
            targetTaskId: item.targetTaskId || "",
            targetSubtaskId: item.targetSubtaskId || ""
          }))
      : [];
  }

  function renderTask(task) {
    elements.taskContainer.innerHTML = "";
    const header = document.createElement("article");
    header.className = "task-header";
    header.innerHTML = `
      <p class="eyebrow">${escapeHtml(task.topic || "Molekulargenetik")}</p>
      <h2 id="taskTitle">${escapeHtml(task.title || "Aufgabe")}</h2>
      <div class="meta-row">
        ${task.id ? `<span class="meta-pill">Aufgabe: ${escapeHtml(task.id)}</span>` : ""}
      </div>
    `;
    elements.taskContainer.append(header);

    renderMaterials(task.materials || []);
    renderSubtasks(task, normalizeSubtasks(task));
  }

  function renderMaterials(materials) {
    if (!materials.length) {
      return;
    }

    const section = document.createElement("section");
    section.className = "materials-section";
    section.innerHTML = "<h2>Materialien</h2>";
    const grid = document.createElement("div");
    grid.className = "materials-grid";

    materials.forEach((material, index) => {
      grid.append(renderMaterial(material, index + 1));
    });

    section.append(grid);
    elements.taskContainer.append(section);
  }

  function renderMaterial(material, index) {
    const card = document.createElement("article");
    card.className = "material-card";
    const title = material.title || `Material ${index}`;
    card.append(createHeading("h3", title));

    if (material.type === "image") {
      const img = document.createElement("img");
      img.className = "material-image";
      img.src = material.src || "";
      img.alt = material.alt || title;
      img.addEventListener("error", () => {
        const fallback = document.createElement("div");
        fallback.className = "image-fallback";
        fallback.textContent = `Bild konnte nicht geladen werden: ${material.alt || material.src || title}`;
        img.replaceWith(fallback);
      });
      card.append(img);
      card.append(renderCredit(material.creditId));
      return card;
    }

    if (material.type === "table") {
      card.append(renderTable(material));
      return card;
    }

    if (material.type === "sequence") {
      const sequence = document.createElement("div");
      sequence.className = "sequence-box";
      sequence.textContent = material.sequence || material.content || material.text || "";
      card.append(sequence);
      return card;
    }

    const text = document.createElement("div");
    text.className = "material-text";
    text.textContent = material.text || material.content || "Kein Materialtext hinterlegt.";
    card.append(text);
    return card;
  }

  function renderCredit(creditId) {
    const note = document.createElement("p");
    note.className = "credit";
    const credit = state.credits.find((item) => item.id === creditId);
    if (credit) {
      note.textContent = `Bild: ${credit.author || "unbekannt"}, ${credit.sourceName || "Quelle unbekannt"}, ${credit.license || "Lizenz siehe Credits"}`;
    } else {
      note.textContent = "Bildnachweis: siehe CREDITS.md";
    }
    return note;
  }

  function renderTable(material) {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    const table = document.createElement("table");
    const rows = material.rows || material.data || [];
    const headers = material.headers || [];

    if (headers.length) {
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      headers.forEach((header) => tr.append(createCell("th", header)));
      thead.append(tr);
      table.append(thead);
    }

    const tbody = document.createElement("tbody");
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      const cells = Array.isArray(row) ? row : Object.values(row || {});
      cells.forEach((cell) => tr.append(createCell("td", cell)));
      tbody.append(tr);
    });
    table.append(tbody);
    wrap.append(table);
    return wrap;
  }

  function renderSubtasks(task, subtasks) {
    const section = document.createElement("section");
    section.className = "subtasks-section";
    section.innerHTML = "<h2>Teilaufgaben</h2>";

    subtasks.forEach((subtask, index) => {
      section.append(renderSubtask(task, subtask, index));
    });

    elements.taskContainer.append(section);
  }

  function renderSubtask(task, subtask, index) {
    const subtaskId = subtask.id || `${task.id || "aufgabe"}_${index + 1}`;
    const content = fallbackContent[subtaskId] || {};
    const hints = normalizeList(subtask.hints || subtask.help || subtask.scaffolds || content.hints);
    const expectation = normalizeList(subtask.expectationHorizon || subtask.expectations || subtask.criteriaHorizon || content.expectation);
    const solution = subtask.sampleSolution || subtask.solution || subtask.modelAnswer || content.solution || "";
    const criteria = normalizeCriteria(subtask.checkCriteria || subtask.criteria || content.criteria || task.checkCriteria || task.criteria);

    if (subtask.format === "image-label-dnd") {
      return renderImageLabelSubtask(task, subtask, subtaskId, index, solution);
    }

    if (subtask.format === "number-label-match") {
      return renderNumberLabelSubtask(task, subtask, subtaskId, index, solution);
    }

    if (subtask.format === "definition-match") {
      return renderDefinitionMatchSubtask(task, subtask, subtaskId, index, solution);
    }

    if (subtask.format === "dna-rna-compare") {
      return renderDnaRnaCompareSubtask(task, subtask, subtaskId, index);
    }

    if (subtask.format === "transcription-structure-match") {
      return renderTranscriptionStructureSubtask(task, subtask, subtaskId, index);
    }

    if (subtask.format === "transcription-process-text") {
      return renderTranscriptionProcessSubtask(task, subtask, subtaskId, index);
    }

    if (subtask.format === "transcription-phases") {
      return renderPhaseTextSubtask(task, subtask, subtaskId, index, "transcription");
    }

    if (subtask.format === "mrna-sequence") {
      return renderMrnaSequenceSubtask(task, subtask, subtaskId, index);
    }

    if (subtask.format === "transcription-error-analysis") {
      return renderTranscriptionErrorSubtask(task, subtask, subtaskId, index);
    }

    if (subtask.format === "translation-structure-match") {
      return renderTranslationStructureSubtask(task, subtask, subtaskId, index);
    }

    if (subtask.format === "translation-process-text") {
      return renderTranslationProcessSubtask(task, subtask, subtaskId, index);
    }

    if (subtask.format === "translation-phases") {
      return renderPhaseTextSubtask(task, subtask, subtaskId, index, "translation");
    }

    if (subtask.format === "amino-acid-sequence") {
      return renderAminoAcidSequenceSubtask(task, subtask, subtaskId, index);
    }

    if (subtask.format === "translation-error-analysis") {
      return renderTranslationErrorSubtask(task, subtask, subtaskId, index);
    }

    const card = document.createElement("article");
    card.className = "subtask-card";
    card.dataset.subtaskId = subtaskId;

    const storedAnswer = localStorage.getItem(answerKey(task.id, subtaskId)) || "";
    const storedAssessment = localStorage.getItem(assessmentKey(task.id, subtaskId)) || "";

    card.innerHTML = `
      <p class="operator">${escapeHtml(subtask.operator || "Aufgabe")}</p>
      <h3>${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}</h3>
      <p class="task-prompt">${escapeHtml(subtask.task || subtask.prompt || subtask.text || "")}</p>
      <textarea class="answer-field" aria-label="Antwort zu ${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}" placeholder="Formuliere hier deine Antwort wie in einer Klausur.">${escapeHtml(storedAnswer)}</textarea>
      <div class="self-assessment">
        <label for="self-${escapeHtml(subtaskId)}">Selbsteinschätzung</label>
        <select id="self-${escapeHtml(subtaskId)}">
          <option value="">Noch nicht eingeschätzt</option>
          <option value="sicher">Ich fühle mich sicher.</option>
          <option value="teilweise">Ich bin teilweise sicher.</option>
          <option value="unsicher">Ich brauche noch Wiederholung.</option>
        </select>
      </div>
      <div class="button-row">
        <button class="primary-button check-button" type="button">Antwort prüfen</button>
        <button class="secondary-button hint-button" type="button">Hilfe anzeigen</button>
        <button class="ghost-button expectation-button" type="button">Erwartungshorizont anzeigen</button>
        <button class="ghost-button solution-button" type="button">Musterlösung anzeigen</button>
      </div>
      <div class="hint-list hidden" aria-live="polite"></div>
      <div class="feedback hidden" aria-live="polite"></div>
      <div class="reveal-box expectation-box hidden"></div>
      <div class="reveal-box solution-box hidden"></div>
    `;

    const answerField = card.querySelector(".answer-field");
    const assessment = card.querySelector("select");
    const hintButton = card.querySelector(".hint-button");
    const expectationButton = card.querySelector(".expectation-button");
    const solutionButton = card.querySelector(".solution-button");

    assessment.value = storedAssessment;
    answerField.addEventListener("input", () => {
      localStorage.setItem(answerKey(task.id, subtaskId), answerField.value);
    });
    assessment.addEventListener("change", () => {
      localStorage.setItem(assessmentKey(task.id, subtaskId), assessment.value);
    });

    let visibleHintCount = 0;
    hintButton.disabled = hints.length === 0;
    hintButton.addEventListener("click", () => {
      visibleHintCount = Math.min(visibleHintCount + 1, hints.length);
      renderHints(card.querySelector(".hint-list"), hints.slice(0, visibleHintCount));
      hintButton.textContent = visibleHintCount >= hints.length ? "Alle Hilfen sichtbar" : "Weitere Hilfe anzeigen";
      hintButton.disabled = visibleHintCount >= hints.length;
    });

    expectationButton.disabled = expectation.length === 0;
    expectationButton.addEventListener("click", () => {
      toggleReveal(card.querySelector(".expectation-box"), "Erwartungshorizont", expectation);
    });

    solutionButton.disabled = !solution;
    solutionButton.addEventListener("click", () => {
      toggleReveal(card.querySelector(".solution-box"), "Musterlösung", solution);
    });

    card.querySelector(".check-button").addEventListener("click", () => {
      const result = checkAnswer(answerField.value, criteria);
      state.checks[checkKey(task.id, subtaskId)] = result;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      renderFeedback(card.querySelector(".feedback"), result);
    });

    return card;
  }

  function renderImageLabelSubtask(task, subtask, subtaskId, index, solution) {
    const card = document.createElement("article");
    card.className = "subtask-card";
    card.dataset.subtaskId = subtaskId;

    const terms = normalizeList(subtask.terms);
    const zones = normalizeList(subtask.dropZones);
    const correctAssignments = subtask.correctAssignments || {};
    let assignments = readJson(assignmentKey(task.id, subtaskId), {});
    let selectedTerm = "";
    let lastResult = state.checks[checkKey(task.id, subtaskId)] || null;

    card.innerHTML = `
      <p class="operator">${escapeHtml(subtask.operator || "Zuordnung")}</p>
      <h3>${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}</h3>
      <p class="task-prompt">${escapeHtml(subtask.task || "")}</p>
      ${subtask.hintText ? `<p class="drag-note">${escapeHtml(subtask.hintText)}</p>` : ""}
      <label class="debug-toggle"><input type="checkbox" class="debug-checkbox"> Dropzonen anzeigen</label>
      <div class="image-label-task">
        <div class="term-bank" aria-label="Begriffsliste"></div>
        <div class="image-drop-stage">
          <img class="drop-image" src="${escapeHtml((subtask.image && subtask.image.src) || "")}" alt="${escapeHtml((subtask.image && subtask.image.alt) || subtask.title || "")}">
          <div class="drop-zone-layer"></div>
        </div>
      </div>
      <div class="button-row">
        <button class="primary-button dnd-check-button" type="button">Lösung prüfen</button>
        <button class="ghost-button dnd-solution-button" type="button">Lösung anzeigen</button>
        <button class="secondary-button dnd-reset-button" type="button">Zurücksetzen</button>
        <button class="ghost-button solution-button" type="button">Musterlösung anzeigen</button>
      </div>
      <div class="feedback hidden" aria-live="polite"></div>
      <div class="reveal-box solution-box hidden"></div>
    `;

    const bank = card.querySelector(".term-bank");
    const layer = card.querySelector(".drop-zone-layer");
    const feedback = card.querySelector(".feedback");
    const debugCheckbox = card.querySelector(".debug-checkbox");

    card.querySelector(".drop-image").addEventListener("error", (event) => {
      const fallback = document.createElement("div");
      fallback.className = "image-fallback";
      fallback.textContent = `Bild konnte nicht geladen werden: ${(subtask.image && subtask.image.alt) || subtask.title || "Replikationsgabel"}`;
      event.currentTarget.replaceWith(fallback);
    });

    zones.forEach((zone) => {
      const dropZone = document.createElement("button");
      dropZone.type = "button";
      dropZone.className = `image-drop-zone ${zone.targetType === "added-box" ? "added-label-box" : "visible-label-box"}`;
      dropZone.dataset.zoneId = zone.id;
      dropZone.style.left = `${zone.x}%`;
      dropZone.style.top = `${zone.y}%`;
      dropZone.style.width = `${zone.width}%`;
      dropZone.style.height = `${zone.height}%`;
      dropZone.title = zone.note || zone.label || "Dropzone";
      dropZone.addEventListener("dragover", (event) => event.preventDefault());
      dropZone.addEventListener("drop", (event) => {
        event.preventDefault();
        const term = event.dataTransfer.getData("text/plain");
        if (term) {
          assignValue(assignments, zone.id, term);
          persistAndRender();
        }
      });
      dropZone.addEventListener("click", () => {
        if (selectedTerm) {
          assignValue(assignments, zone.id, selectedTerm);
          selectedTerm = "";
          persistAndRender();
        } else if (assignments[zone.id]) {
          delete assignments[zone.id];
          persistAndRender();
        }
      });
      layer.append(dropZone);
    });

    bank.addEventListener("dragover", (event) => event.preventDefault());
    bank.addEventListener("drop", (event) => {
      event.preventDefault();
      const term = event.dataTransfer.getData("text/plain");
      if (term) {
        removeAssignedValue(assignments, term);
        persistAndRender();
      }
    });

    debugCheckbox.addEventListener("change", () => {
      card.classList.toggle("show-drop-debug", debugCheckbox.checked);
    });

    card.querySelector(".dnd-check-button").addEventListener("click", () => {
      lastResult = evaluateAssignments(assignments, correctAssignments);
      state.checks[checkKey(task.id, subtaskId)] = lastResult;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      renderAssignmentFeedback(feedback, lastResult, zones.length, "Strukturen");
      render();
    });

    card.querySelector(".dnd-solution-button").addEventListener("click", () => {
      assignments = { ...correctAssignments };
      lastResult = evaluateAssignments(assignments, correctAssignments);
      state.checks[checkKey(task.id, subtaskId)] = lastResult;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      persistAndRender();
      renderAssignmentFeedback(feedback, lastResult, zones.length, "Strukturen");
    });

    card.querySelector(".dnd-reset-button").addEventListener("click", () => {
      assignments = {};
      selectedTerm = "";
      lastResult = null;
      localStorage.removeItem(assignmentKey(task.id, subtaskId));
      delete state.checks[checkKey(task.id, subtaskId)];
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      feedback.classList.add("hidden");
      render();
    });

    card.querySelector(".solution-button").addEventListener("click", () => {
      toggleReveal(card.querySelector(".solution-box"), "Musterlösung", solution);
    });

    function persistAndRender() {
      writeJson(assignmentKey(task.id, subtaskId), assignments);
      render();
    }

    function render() {
      const assignedTerms = new Set(Object.values(assignments));
      bank.innerHTML = "<h4>Begriffe</h4>";
      const chipWrap = document.createElement("div");
      chipWrap.className = "chip-wrap";
      terms.filter((term) => !assignedTerms.has(term)).forEach((term) => {
        chipWrap.append(createDraggableChip(term, selectedTerm, () => {
          selectedTerm = selectedTerm === term ? "" : term;
          render();
        }));
      });
      if (!chipWrap.children.length) {
        const empty = document.createElement("p");
        empty.className = "muted-small";
        empty.textContent = "Alle Begriffe sind abgelegt.";
        chipWrap.append(empty);
      }
      bank.append(chipWrap);

      zones.forEach((zone) => {
        const dropZone = layer.querySelector(`[data-zone-id="${cssEscape(zone.id)}"]`);
        const value = assignments[zone.id] || "";
        dropZone.classList.remove("is-correct", "is-incorrect");
        if (lastResult) {
          dropZone.classList.add(lastResult.correctItems.includes(zone.id) ? "is-correct" : "is-incorrect");
        }
        dropZone.innerHTML = value
          ? `<span class="placed-label">${escapeHtml(value)}</span>`
          : `<span class="drop-placeholder">Begriff hier ablegen</span>`;
      });
    }

    render();
    return card;
  }

  function renderNumberLabelSubtask(task, subtask, subtaskId, index, solution) {
    const card = document.createElement("article");
    card.className = "subtask-card";
    card.dataset.subtaskId = subtaskId;

    const terms = normalizeList(subtask.terms);
    const numbers = normalizeList(subtask.numbers).map((number) => String(number));
    const correctAssignments = subtask.correctAssignments || {};
    let assignments = readJson(assignmentKey(task.id, subtaskId), {});
    let selectedTerm = "";
    let lastResult = state.checks[checkKey(task.id, subtaskId)] || null;

    card.innerHTML = `
      <p class="operator">${escapeHtml(subtask.operator || "Zuordnung")}</p>
      <h3>${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}</h3>
      <p class="task-prompt">${escapeHtml(subtask.task || "")}</p>
      ${subtask.hintText ? `<p class="drag-note">${escapeHtml(subtask.hintText)}</p>` : ""}
      <article class="material-card inline-material">
        <h4>${escapeHtml((subtask.image && subtask.image.title) || "Material: Replikationsgabel")}</h4>
        <img class="material-image" src="${escapeHtml((subtask.image && subtask.image.src) || "")}" alt="${escapeHtml((subtask.image && subtask.image.alt) || "")}">
        <p class="credit">Bildnachweis: siehe CREDITS.md</p>
      </article>
      <div class="number-label-task">
        <div class="term-bank" aria-label="Fachbegriffe"></div>
        <div class="number-label-table-wrap">
          <table class="number-label-table">
            <thead>
              <tr>
                <th>Nummer</th>
                <th>Struktur</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div class="button-row">
        <button class="primary-button number-check-button" type="button">Antwort prüfen</button>
        <button class="ghost-button number-solution-button" type="button">Lösung anzeigen</button>
        <button class="secondary-button number-reset-button" type="button">Zurücksetzen</button>
        <button class="ghost-button solution-button" type="button">Musterlösung anzeigen</button>
      </div>
      <div class="feedback hidden" aria-live="polite"></div>
      <div class="reveal-box solution-box hidden"></div>
    `;

    const image = card.querySelector(".material-image");
    image.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "image-fallback";
      fallback.textContent = `Bild konnte nicht geladen werden: ${(subtask.image && subtask.image.alt) || "Replikationsgabel"}`;
      image.replaceWith(fallback);
    });

    const bank = card.querySelector(".term-bank");
    const tbody = card.querySelector("tbody");
    const feedback = card.querySelector(".feedback");

    bank.addEventListener("dragover", (event) => event.preventDefault());
    bank.addEventListener("drop", (event) => {
      event.preventDefault();
      const term = event.dataTransfer.getData("text/plain");
      if (term) {
        removeAssignedValue(assignments, term);
        persistAndRender();
      }
    });

    card.querySelector(".number-check-button").addEventListener("click", () => {
      lastResult = evaluateAssignments(assignments, correctAssignments);
      state.checks[checkKey(task.id, subtaskId)] = lastResult;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      renderNumberLabelFeedback(feedback, lastResult, correctAssignments);
      render();
    });

    card.querySelector(".number-solution-button").addEventListener("click", () => {
      assignments = { ...correctAssignments };
      lastResult = evaluateAssignments(assignments, correctAssignments);
      state.checks[checkKey(task.id, subtaskId)] = lastResult;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      persistAndRender();
      renderNumberLabelFeedback(feedback, lastResult, correctAssignments);
    });

    card.querySelector(".number-reset-button").addEventListener("click", () => {
      assignments = {};
      selectedTerm = "";
      lastResult = null;
      localStorage.removeItem(assignmentKey(task.id, subtaskId));
      delete state.checks[checkKey(task.id, subtaskId)];
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      feedback.classList.add("hidden");
      render();
    });

    card.querySelector(".solution-button").addEventListener("click", () => {
      toggleReveal(card.querySelector(".solution-box"), "Musterlösung", solution);
    });

    function persistAndRender() {
      writeJson(assignmentKey(task.id, subtaskId), assignments);
      render();
    }

    function render() {
      const assignedTerms = new Set(Object.values(assignments));
      tbody.innerHTML = "";
      numbers.forEach((number) => {
        const currentTerm = assignments[number] || "";
        const row = document.createElement("tr");
        if (lastResult) {
          row.classList.add(lastResult.correctItems.includes(number) ? "is-correct" : "is-incorrect");
        }
        row.innerHTML = `
          <th scope="row">${escapeHtml(number)}</th>
          <td>
            <button class="number-drop" type="button" data-number="${escapeHtml(number)}">
              ${currentTerm ? `<span class="placed-chip">${escapeHtml(currentTerm)}</span>` : '<span class="drop-placeholder">Begriff hier ablegen</span>'}
            </button>
          </td>
        `;
        const drop = row.querySelector(".number-drop");
        drop.addEventListener("dragover", (event) => event.preventDefault());
        drop.addEventListener("drop", (event) => {
          event.preventDefault();
          const term = event.dataTransfer.getData("text/plain");
          if (term) {
            assignValue(assignments, number, term);
            persistAndRender();
          }
        });
        drop.addEventListener("click", () => {
          if (selectedTerm) {
            assignValue(assignments, number, selectedTerm);
            selectedTerm = "";
            persistAndRender();
          } else if (assignments[number]) {
            delete assignments[number];
            persistAndRender();
          }
        });
        tbody.append(row);
      });

      bank.innerHTML = "<h4>Fachbegriffe</h4>";
      const chipWrap = document.createElement("div");
      chipWrap.className = "term-chip-list";
      terms.filter((term) => !assignedTerms.has(term)).forEach((term) => {
        chipWrap.append(createDraggableChip(term, selectedTerm, () => {
          selectedTerm = selectedTerm === term ? "" : term;
          render();
        }));
      });
      if (!chipWrap.children.length) {
        const empty = document.createElement("p");
        empty.className = "muted-small";
        empty.textContent = "Alle Begriffe sind zugeordnet.";
        chipWrap.append(empty);
      }
      bank.append(chipWrap);
    }

    render();
    return card;
  }

  function renderDefinitionMatchSubtask(task, subtask, subtaskId, index, solution) {
    const card = document.createElement("article");
    card.className = "subtask-card";
    card.dataset.subtaskId = subtaskId;

    const terms = normalizeList(subtask.terms);
    const definitions = normalizeList(subtask.definitions);
    const correctAssignments = subtask.correctAssignments || {};
    let assignments = readJson(assignmentKey(task.id, subtaskId), {});
    let selectedDefinition = "";
    let lastResult = state.checks[checkKey(task.id, subtaskId)] || null;

    card.innerHTML = `
      <p class="operator">${escapeHtml(subtask.operator || "Zuordnung")}</p>
      <h3>${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}</h3>
      <p class="task-prompt">${escapeHtml(subtask.task || "")}</p>
      <div class="definition-match-task">
        <div class="definition-rows"></div>
        <div class="definition-bank" aria-label="Definitionskarten"></div>
      </div>
      <div class="button-row">
        <button class="primary-button match-check-button" type="button">Lösung prüfen</button>
        <button class="ghost-button match-solution-button" type="button">Lösung anzeigen</button>
        <button class="secondary-button match-reset-button" type="button">Zurücksetzen</button>
        <button class="ghost-button solution-button" type="button">Musterlösung anzeigen</button>
      </div>
      <div class="feedback hidden" aria-live="polite"></div>
      <div class="reveal-box solution-box hidden"></div>
    `;

    const rows = card.querySelector(".definition-rows");
    const bank = card.querySelector(".definition-bank");
    const feedback = card.querySelector(".feedback");

    bank.addEventListener("dragover", (event) => event.preventDefault());
    bank.addEventListener("drop", (event) => {
      event.preventDefault();
      const definitionId = event.dataTransfer.getData("text/plain");
      if (definitionId) {
        removeAssignedValue(assignments, definitionId);
        persistAndRender();
      }
    });

    card.querySelector(".match-check-button").addEventListener("click", () => {
      lastResult = evaluateAssignments(assignments, correctAssignments);
      state.checks[checkKey(task.id, subtaskId)] = lastResult;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      renderAssignmentFeedback(feedback, lastResult, terms.length, "Definitionen");
      render();
    });

    card.querySelector(".match-solution-button").addEventListener("click", () => {
      assignments = { ...correctAssignments };
      lastResult = evaluateAssignments(assignments, correctAssignments);
      state.checks[checkKey(task.id, subtaskId)] = lastResult;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      persistAndRender();
      renderAssignmentFeedback(feedback, lastResult, terms.length, "Definitionen");
    });

    card.querySelector(".match-reset-button").addEventListener("click", () => {
      assignments = {};
      selectedDefinition = "";
      lastResult = null;
      localStorage.removeItem(assignmentKey(task.id, subtaskId));
      delete state.checks[checkKey(task.id, subtaskId)];
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      feedback.classList.add("hidden");
      render();
    });

    card.querySelector(".solution-button").addEventListener("click", () => {
      toggleReveal(card.querySelector(".solution-box"), "Musterlösung", solution);
    });

    function persistAndRender() {
      writeJson(assignmentKey(task.id, subtaskId), assignments);
      render();
    }

    function render() {
      const assignedDefinitions = new Set(Object.values(assignments));
      rows.innerHTML = "";
      terms.forEach((term) => {
        const row = document.createElement("div");
        row.className = "definition-row";
        const currentId = assignments[term] || "";
        if (lastResult) {
          row.classList.add(lastResult.correctItems.includes(term) ? "is-correct" : "is-incorrect");
        }
        row.innerHTML = `
          <div class="definition-term">${escapeHtml(term)}</div>
          <button class="definition-drop" type="button" data-term="${escapeHtml(term)}">
            ${currentId ? renderDefinitionCardText(currentId, definitions) : '<span class="drop-placeholder">Definition hier ablegen</span>'}
          </button>
        `;
        const drop = row.querySelector(".definition-drop");
        drop.addEventListener("dragover", (event) => event.preventDefault());
        drop.addEventListener("drop", (event) => {
          event.preventDefault();
          const definitionId = event.dataTransfer.getData("text/plain");
          if (definitionId) {
            assignValue(assignments, term, definitionId);
            persistAndRender();
          }
        });
        drop.addEventListener("click", () => {
          if (selectedDefinition) {
            assignValue(assignments, term, selectedDefinition);
            selectedDefinition = "";
            persistAndRender();
          } else if (assignments[term]) {
            delete assignments[term];
            persistAndRender();
          }
        });
        rows.append(row);
      });

      bank.innerHTML = "<h4>Definitionen</h4>";
      const chipWrap = document.createElement("div");
      chipWrap.className = "definition-card-list";
      definitions.filter((definition) => !assignedDefinitions.has(definition.id)).forEach((definition) => {
        const cardButton = createDraggableChip(definition.id, selectedDefinition, () => {
          selectedDefinition = selectedDefinition === definition.id ? "" : definition.id;
          render();
        });
        cardButton.classList.add("definition-card");
        cardButton.innerHTML = escapeHtml(definition.text);
        chipWrap.append(cardButton);
      });
      if (!chipWrap.children.length) {
        const empty = document.createElement("p");
        empty.className = "muted-small";
        empty.textContent = "Alle Definitionen sind zugeordnet.";
        chipWrap.append(empty);
      }
      bank.append(chipWrap);
    }

    render();
    return card;
  }

  function renderDnaRnaCompareSubtask(task, subtask, subtaskId, index) {
    const card = document.createElement("article");
    card.className = "subtask-card";
    card.dataset.subtaskId = subtaskId;

    const stored = readJson(compareKey(task.id, subtaskId), defaultCompareInputs());

    card.innerHTML = `
      <p class="operator">${escapeHtml(subtask.operator || "Vergleich")}</p>
      <h3>${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}</h3>
      <p class="task-prompt">${escapeHtml(subtask.task || "")}</p>

      <section class="compare-section" aria-labelledby="${escapeHtml(subtaskId)}-a">
        <h4 id="${escapeHtml(subtaskId)}-a">Abschnitt A: Zucker benennen</h4>
        <p>${escapeHtml(subtask.sugarTask || "")}</p>
        <div class="sugar-input-grid">
          <label>Linker Zucker
            <input class="compare-input" data-field="leftSugar" type="text" value="${escapeHtml(stored.leftSugar)}" autocomplete="off">
          </label>
          <label>Rechter Zucker
            <input class="compare-input" data-field="rightSugar" type="text" value="${escapeHtml(stored.rightSugar)}" autocomplete="off">
          </label>
        </div>
      </section>

      <section class="compare-section" aria-labelledby="${escapeHtml(subtaskId)}-b">
        <h4 id="${escapeHtml(subtaskId)}-b">Abschnitt B: Unterschied erläutern</h4>
        <p>${escapeHtml(subtask.differenceTask || "")}</p>
        <textarea class="answer-field compare-input" data-field="difference" placeholder="Erläutere hier den Unterschied an der 2'-Stelle.">${escapeHtml(stored.difference)}</textarea>
      </section>

      <section class="compare-section" aria-labelledby="${escapeHtml(subtaskId)}-c">
        <h4 id="${escapeHtml(subtaskId)}-c">Abschnitt C: Vergleichstabelle DNA/RNA ausfüllen</h4>
        <p>${escapeHtml(subtask.tableTask || "")}</p>
        <div class="compare-table-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th>Merkmal</th>
                <th>DNA</th>
                <th>RNA</th>
              </tr>
            </thead>
            <tbody>
              ${renderCompareTableRows(stored.table)}
            </tbody>
          </table>
        </div>
      </section>

      <div class="button-row">
        <button class="primary-button compare-check-button" type="button">Antworten prüfen</button>
        <button class="ghost-button expectation-button" type="button">Erwartungshorizont anzeigen</button>
        <button class="ghost-button solution-button" type="button">Musterlösung anzeigen</button>
        <button class="secondary-button compare-reset-button" type="button">Zurücksetzen</button>
      </div>
      <div class="feedback hidden" aria-live="polite"></div>
      <div class="reveal-box expectation-box hidden"></div>
      <div class="reveal-box solution-box hidden"></div>
    `;

    card.querySelectorAll(".compare-input").forEach((input) => {
      input.addEventListener("input", () => {
        writeJson(compareKey(task.id, subtaskId), collectCompareInputs(card));
      });
    });

    card.querySelector(".expectation-button").addEventListener("click", () => {
      toggleReveal(card.querySelector(".expectation-box"), "Erwartungshorizont", normalizeList(subtask.expectationHorizon));
    });

    card.querySelector(".solution-button").addEventListener("click", () => {
      renderCompareSolution(card.querySelector(".solution-box"), subtask.sampleSolution);
    });

    card.querySelector(".compare-check-button").addEventListener("click", () => {
      const inputs = collectCompareInputs(card);
      writeJson(compareKey(task.id, subtaskId), inputs);
      const result = checkDnaRnaCompare(inputs);
      state.checks[checkKey(task.id, subtaskId)] = result;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      renderCompareFeedback(card.querySelector(".feedback"), result);
    });

    card.querySelector(".compare-reset-button").addEventListener("click", () => {
      localStorage.removeItem(compareKey(task.id, subtaskId));
      delete state.checks[checkKey(task.id, subtaskId)];
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      card.querySelectorAll(".compare-input").forEach((input) => {
        input.value = "";
      });
      card.querySelector(".feedback").classList.add("hidden");
    });

    return card;
  }

  function renderTranscriptionStructureSubtask(task, subtask, subtaskId, index) {
    const card = document.createElement("article");
    card.className = "subtask-card";
    card.dataset.subtaskId = subtaskId;

    const items = normalizeList(subtask.items);
    const functions = normalizeList(subtask.functions);
    let stored = readJson(transcriptionKey(task.id, subtaskId), defaultTranscriptionInputs(items));
    let selectedFunction = "";
    let visibleHintCount = 0;
    let lastResult = state.checks[checkKey(task.id, subtaskId)] || null;

    card.innerHTML = `
      <p class="operator">${escapeHtml(subtask.operator || "Benennen und zuordnen")}</p>
      <h3>${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}</h3>
      <p class="task-prompt">${escapeHtml(subtask.task || "")}</p>
      ${subtask.hintText ? `<p class="drag-note">${escapeHtml(subtask.hintText)}</p>` : ""}
      <article class="material-card inline-material">
        <h4>${escapeHtml((subtask.material && subtask.material.title) || "Material")}</h4>
        <img class="material-image transcription-image" src="${escapeHtml((subtask.material && subtask.material.src) || "")}" alt="${escapeHtml((subtask.material && subtask.material.alt) || "")}">
        <p class="credit">Bildnachweis: siehe CREDITS.md</p>
      </article>
      <div class="transcription-match-task">
        <div class="transcription-table-wrap">
          <table class="transcription-table">
            <thead>
              <tr>
                <th>Nummer</th>
                <th>Struktur benennen</th>
                <th>Funktion zuordnen</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="function-bank" aria-label="Funktionskarten"></div>
      </div>
      <div class="button-row">
        <button class="primary-button transcription-check-button" type="button">Antworten prüfen</button>
        <button class="secondary-button hint-button" type="button">Hilfe anzeigen</button>
        <button class="ghost-button transcription-solution-button" type="button">Musterlösung anzeigen</button>
        <button class="secondary-button transcription-reset-button" type="button">Zurücksetzen</button>
      </div>
      <div class="hint-list hidden" aria-live="polite"></div>
      <div class="feedback hidden" aria-live="polite"></div>
      <div class="reveal-box solution-box hidden"></div>
    `;

    const image = card.querySelector(".transcription-image");
    image.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "image-fallback";
      fallback.textContent = `Bild konnte nicht geladen werden: ${(subtask.material && subtask.material.alt) || "Transkriptionsblase"}`;
      image.replaceWith(fallback);
    });

    const tbody = card.querySelector("tbody");
    const bank = card.querySelector(".function-bank");
    const feedback = card.querySelector(".feedback");

    bank.addEventListener("dragover", (event) => event.preventDefault());
    bank.addEventListener("drop", (event) => {
      event.preventDefault();
      const functionId = event.dataTransfer.getData("text/plain");
      if (functionId) {
        removeAssignedValue(stored.functions, functionId);
        persistAndRender();
      }
    });

    card.querySelector(".hint-button").addEventListener("click", () => {
      const hints = normalizeList(subtask.hints);
      visibleHintCount = Math.min(visibleHintCount + 1, hints.length);
      renderHints(card.querySelector(".hint-list"), hints.slice(0, visibleHintCount));
      const button = card.querySelector(".hint-button");
      button.textContent = visibleHintCount >= hints.length ? "Alle Hilfen sichtbar" : "Weitere Hilfe anzeigen";
      button.disabled = visibleHintCount >= hints.length;
    });

    card.querySelector(".transcription-check-button").addEventListener("click", () => {
      stored = collectTranscriptionInputs(card, stored);
      writeJson(transcriptionKey(task.id, subtaskId), stored);
      lastResult = checkTranscriptionStructure(stored, items);
      state.checks[checkKey(task.id, subtaskId)] = lastResult;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      renderTranscriptionFeedback(feedback, lastResult);
      render();
    });

    card.querySelector(".transcription-solution-button").addEventListener("click", () => {
      renderTranscriptionSolution(card.querySelector(".solution-box"), items, functions);
    });

    card.querySelector(".transcription-reset-button").addEventListener("click", () => {
      stored = defaultTranscriptionInputs(items);
      selectedFunction = "";
      lastResult = null;
      localStorage.removeItem(transcriptionKey(task.id, subtaskId));
      delete state.checks[checkKey(task.id, subtaskId)];
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      feedback.classList.add("hidden");
      card.querySelector(".hint-list").classList.add("hidden");
      visibleHintCount = 0;
      const hintButton = card.querySelector(".hint-button");
      hintButton.textContent = "Hilfe anzeigen";
      hintButton.disabled = false;
      render();
    });

    function persistAndRender() {
      writeJson(transcriptionKey(task.id, subtaskId), collectTranscriptionInputs(card, stored));
      stored = readJson(transcriptionKey(task.id, subtaskId), defaultTranscriptionInputs(items));
      render();
    }

    function render() {
      const assignedFunctions = new Set(Object.values(stored.functions || {}));
      tbody.innerHTML = "";
      items.forEach((item) => {
        const number = String(item.number);
        const functionId = stored.functions[number] || "";
        const rowResult = lastResult && lastResult.rows[number];
        const tr = document.createElement("tr");
        if (rowResult) {
          tr.classList.add(rowResult.structureCorrect ? "structure-correct" : "structure-incorrect");
          tr.classList.add(rowResult.functionCorrect ? "function-correct" : "function-incorrect");
        }
        tr.innerHTML = `
          <th scope="row">${escapeHtml(number)}</th>
          <td>
            <input class="transcription-structure-input" data-number="${escapeHtml(number)}" type="text" value="${escapeHtml((stored.structures && stored.structures[number]) || "")}" autocomplete="off">
          </td>
          <td>
            <button class="function-drop" type="button" data-number="${escapeHtml(number)}">
              ${functionId ? renderFunctionCardText(functionId, functions) : '<span class="drop-placeholder">Funktion hier ablegen</span>'}
            </button>
          </td>
        `;
        tr.querySelector(".transcription-structure-input").addEventListener("input", () => {
          stored = collectTranscriptionInputs(card, stored);
          writeJson(transcriptionKey(task.id, subtaskId), stored);
        });
        const drop = tr.querySelector(".function-drop");
        drop.addEventListener("dragover", (event) => event.preventDefault());
        drop.addEventListener("drop", (event) => {
          event.preventDefault();
          const droppedId = event.dataTransfer.getData("text/plain");
          if (droppedId) {
            assignValue(stored.functions, number, droppedId);
            persistAndRender();
          }
        });
        drop.addEventListener("click", () => {
          if (selectedFunction) {
            assignValue(stored.functions, number, selectedFunction);
            selectedFunction = "";
            persistAndRender();
          } else if (stored.functions[number]) {
            delete stored.functions[number];
            persistAndRender();
          }
        });
        tbody.append(tr);
      });

      bank.innerHTML = "<h4>Funktionskarten</h4>";
      const list = document.createElement("div");
      list.className = "function-card-list";
      orderCards(functions, ["D", "F", "B", "E", "A", "C"]).filter((fn) => !assignedFunctions.has(fn.id)).forEach((fn) => {
        const chip = createDraggableChip(fn.id, selectedFunction, () => {
          selectedFunction = selectedFunction === fn.id ? "" : fn.id;
          render();
        });
        chip.classList.add("function-card");
        chip.innerHTML = escapeHtml(fn.text);
        list.append(chip);
      });
      if (!list.children.length) {
        const empty = document.createElement("p");
        empty.className = "muted-small";
        empty.textContent = "Alle Funktionen sind zugeordnet.";
        list.append(empty);
      }
      bank.append(list);
    }

    render();
    return card;
  }

  function renderTranscriptionProcessSubtask(task, subtask, subtaskId, index) {
    const card = document.createElement("article");
    card.className = "subtask-card";
    card.dataset.subtaskId = subtaskId;

    const storedAnswer = localStorage.getItem(answerKey(task.id, subtaskId)) || "";
    let visibleHintCount = 0;
    const hints = normalizeList(subtask.hints);

    card.innerHTML = `
      <p class="operator">${escapeHtml(subtask.operator || "Aufgabe")}</p>
      <h3>${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}</h3>
      <p class="task-prompt">${escapeHtml(subtask.task || "")}</p>
      ${subtask.hintText ? `<p class="drag-note">${escapeHtml(subtask.hintText)}</p>` : ""}
      <textarea class="answer-field large-answer-field" aria-label="Antwort zu ${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}" placeholder="Formulieren Sie hier Ihre Erläuterung in 6 bis 10 Sätzen.">${escapeHtml(storedAnswer)}</textarea>
      <div class="button-row">
        <button class="primary-button process-check-button" type="button">Antwort prüfen</button>
        <button class="secondary-button hint-button" type="button">Hilfe anzeigen</button>
        <button class="ghost-button expectation-button" type="button">Erwartungshorizont anzeigen</button>
        <button class="ghost-button solution-button" type="button">Musterlösung anzeigen</button>
        <button class="secondary-button process-reset-button" type="button">Zurücksetzen</button>
      </div>
      <div class="hint-list hidden" aria-live="polite"></div>
      <div class="feedback hidden" aria-live="polite"></div>
      <div class="reveal-box expectation-box hidden"></div>
      <div class="reveal-box solution-box hidden"></div>
    `;

    const answerField = card.querySelector(".answer-field");
    const feedback = card.querySelector(".feedback");
    const hintButton = card.querySelector(".hint-button");

    answerField.addEventListener("input", () => {
      localStorage.setItem(answerKey(task.id, subtaskId), answerField.value);
    });

    card.querySelector(".process-check-button").addEventListener("click", () => {
      const result = checkTranscriptionProcess(answerField.value);
      state.checks[checkKey(task.id, subtaskId)] = result;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      localStorage.setItem(answerKey(task.id, subtaskId), answerField.value);
      renderTranscriptionProcessFeedback(feedback, result);
    });

    hintButton.addEventListener("click", () => {
      visibleHintCount = Math.min(visibleHintCount + 1, hints.length);
      renderHints(card.querySelector(".hint-list"), hints.slice(0, visibleHintCount));
      hintButton.textContent = visibleHintCount >= hints.length ? "Alle Hilfen sichtbar" : "Weitere Hilfe anzeigen";
      hintButton.disabled = visibleHintCount >= hints.length;
    });

    card.querySelector(".expectation-button").addEventListener("click", () => {
      toggleReveal(card.querySelector(".expectation-box"), "Erwartungshorizont", normalizeList(subtask.expectationHorizon));
    });

    card.querySelector(".solution-button").addEventListener("click", () => {
      toggleReveal(card.querySelector(".solution-box"), "Musterlösung", subtask.sampleSolution || "");
    });

    card.querySelector(".process-reset-button").addEventListener("click", () => {
      answerField.value = "";
      localStorage.removeItem(answerKey(task.id, subtaskId));
      delete state.checks[checkKey(task.id, subtaskId)];
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      feedback.classList.add("hidden");
      card.querySelector(".hint-list").classList.add("hidden");
      card.querySelector(".expectation-box").classList.add("hidden");
      card.querySelector(".solution-box").classList.add("hidden");
      visibleHintCount = 0;
      hintButton.textContent = "Hilfe anzeigen";
      hintButton.disabled = false;
    });

    return card;
  }

  function renderPhaseTextSubtask(task, subtask, subtaskId, index, kind) {
    const card = document.createElement("article");
    card.className = "subtask-card";
    card.dataset.subtaskId = subtaskId;

    const stored = readJson(phaseKey(task.id, subtaskId), { initiation: "", elongation: "", termination: "" });
    const hints = normalizeList(subtask.hints);
    let visibleHintCount = 0;

    card.innerHTML = `
      <p class="operator">${escapeHtml(subtask.operator || "Aufgabe")}</p>
      <h3>${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}</h3>
      <p class="task-prompt">${escapeHtml(subtask.task || "")}</p>
      ${subtask.hintText ? `<p class="drag-note">${escapeHtml(subtask.hintText)}</p>` : ""}
      <div class="phase-answer-grid">
        ${renderPhaseField("initiation", "Initiation", stored.initiation)}
        ${renderPhaseField("elongation", "Elongation", stored.elongation)}
        ${renderPhaseField("termination", "Termination", stored.termination)}
      </div>
      <div class="button-row">
        <button class="primary-button phase-check-button" type="button">Antwort prüfen</button>
        <button class="secondary-button hint-button" type="button">Hilfe anzeigen</button>
        <button class="ghost-button expectation-button" type="button">Erwartungshorizont anzeigen</button>
        <button class="ghost-button solution-button" type="button">Musterlösung anzeigen</button>
        <button class="secondary-button phase-reset-button" type="button">Zurücksetzen</button>
      </div>
      <div class="hint-list hidden" aria-live="polite"></div>
      <div class="feedback hidden" aria-live="polite"></div>
      <div class="reveal-box expectation-box hidden"></div>
      <div class="reveal-box solution-box hidden"></div>
    `;

    const feedback = card.querySelector(".feedback");
    const hintButton = card.querySelector(".hint-button");

    card.querySelectorAll(".phase-input").forEach((field) => {
      field.addEventListener("input", () => {
        writeJson(phaseKey(task.id, subtaskId), collectPhaseInputs(card));
      });
    });

    card.querySelector(".phase-check-button").addEventListener("click", () => {
      const inputs = collectPhaseInputs(card);
      writeJson(phaseKey(task.id, subtaskId), inputs);
      const result = kind === "translation" ? checkTranslationPhases(inputs) : checkTranscriptionPhases(inputs);
      state.checks[checkKey(task.id, subtaskId)] = result;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      renderPhaseFeedback(feedback, result);
    });

    hintButton.addEventListener("click", () => {
      visibleHintCount = Math.min(visibleHintCount + 1, hints.length);
      renderHints(card.querySelector(".hint-list"), hints.slice(0, visibleHintCount));
      hintButton.textContent = visibleHintCount >= hints.length ? "Alle Hilfen sichtbar" : "Weitere Hilfe anzeigen";
      hintButton.disabled = visibleHintCount >= hints.length;
    });

    card.querySelector(".expectation-button").addEventListener("click", () => {
      toggleReveal(card.querySelector(".expectation-box"), "Erwartungshorizont", normalizeList(subtask.expectationHorizon));
    });

    card.querySelector(".solution-button").addEventListener("click", () => {
      toggleReveal(card.querySelector(".solution-box"), "Musterlösung", subtask.sampleSolution || "");
    });

    card.querySelector(".phase-reset-button").addEventListener("click", () => {
      card.querySelectorAll(".phase-input").forEach((field) => {
        field.value = "";
      });
      localStorage.removeItem(phaseKey(task.id, subtaskId));
      delete state.checks[checkKey(task.id, subtaskId)];
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      feedback.classList.add("hidden");
      card.querySelector(".hint-list").classList.add("hidden");
      card.querySelector(".expectation-box").classList.add("hidden");
      card.querySelector(".solution-box").classList.add("hidden");
      visibleHintCount = 0;
      hintButton.textContent = "Hilfe anzeigen";
      hintButton.disabled = false;
    });

    return card;
  }

  function renderPhaseField(field, label, value) {
    return `
      <label class="phase-field">
        <span>${escapeHtml(label)}</span>
        <textarea class="phase-input" data-phase="${escapeHtml(field)}" rows="4" placeholder="2 bis 4 Sätze">${escapeHtml(value || "")}</textarea>
      </label>
    `;
  }

  function collectPhaseInputs(card) {
    const inputs = { initiation: "", elongation: "", termination: "" };
    card.querySelectorAll(".phase-input").forEach((field) => {
      inputs[field.dataset.phase] = field.value;
    });
    return inputs;
  }

  function renderMrnaSequenceSubtask(task, subtask, subtaskId, index) {
    const card = document.createElement("article");
    card.className = "subtask-card";
    card.dataset.subtaskId = subtaskId;
    const stored = readJson(sequenceKey(task.id, subtaskId), { sequence: "", reason: "" });
    let visibleHintCount = 0;
    const hints = normalizeList(subtask.hints);

    card.innerHTML = `
      <p class="operator">${escapeHtml(subtask.operator || "Aufgabe")}</p>
      <h3>${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}</h3>
      <div class="sequence-box prominent-sequence">${escapeHtml(subtask.sequenceMaterial || "")}</div>
      <p class="task-prompt">${escapeHtml(subtask.task || "")}</p>
      <div class="sequence-input-grid">
        <label>mRNA-Sequenz
          <input class="compare-input sequence-answer" type="text" value="${escapeHtml(stored.sequence)}">
        </label>
        <label>Begründung / Vorgehen
          <textarea class="answer-field sequence-reason" placeholder="Erklären Sie kurz Ihr Vorgehen.">${escapeHtml(stored.reason)}</textarea>
        </label>
      </div>
      <div class="button-row">
        <button class="primary-button sequence-check-button" type="button">Antwort prüfen</button>
        <button class="secondary-button hint-button" type="button">Hilfe anzeigen</button>
        <button class="ghost-button expectation-button" type="button">Erwartungshorizont anzeigen</button>
        <button class="ghost-button solution-button" type="button">Musterlösung anzeigen</button>
        <button class="secondary-button reset-button" type="button">Zurücksetzen</button>
      </div>
      <div class="hint-list hidden" aria-live="polite"></div>
      <div class="feedback hidden" aria-live="polite"></div>
      <div class="reveal-box expectation-box hidden"></div>
      <div class="reveal-box solution-box hidden"></div>
    `;

    const sequenceInput = card.querySelector(".sequence-answer");
    const reasonInput = card.querySelector(".sequence-reason");
    const save = () => writeJson(sequenceKey(task.id, subtaskId), { sequence: sequenceInput.value, reason: reasonInput.value });
    sequenceInput.addEventListener("input", save);
    reasonInput.addEventListener("input", save);

    card.querySelector(".sequence-check-button").addEventListener("click", () => {
      const result = checkMrnaSequence(sequenceInput.value, reasonInput.value);
      state.checks[checkKey(task.id, subtaskId)] = result;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      save();
      renderSequenceFeedback(card.querySelector(".feedback"), result);
    });
    card.querySelector(".hint-button").addEventListener("click", () => {
      visibleHintCount = Math.min(visibleHintCount + 1, hints.length);
      renderHints(card.querySelector(".hint-list"), hints.slice(0, visibleHintCount));
      const button = card.querySelector(".hint-button");
      button.textContent = visibleHintCount >= hints.length ? "Alle Hilfen sichtbar" : "Weitere Hilfe anzeigen";
      button.disabled = visibleHintCount >= hints.length;
    });
    card.querySelector(".expectation-button").addEventListener("click", () => {
      toggleReveal(card.querySelector(".expectation-box"), "Erwartungshorizont", normalizeList(subtask.expectationHorizon));
    });
    card.querySelector(".solution-button").addEventListener("click", () => {
      toggleReveal(card.querySelector(".solution-box"), "Musterlösung", subtask.sampleSolution || "");
    });
    card.querySelector(".reset-button").addEventListener("click", () => {
      sequenceInput.value = "";
      reasonInput.value = "";
      localStorage.removeItem(sequenceKey(task.id, subtaskId));
      delete state.checks[checkKey(task.id, subtaskId)];
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      resetReveals(card);
      visibleHintCount = 0;
    });
    return card;
  }

  function renderTranscriptionErrorSubtask(task, subtask, subtaskId, index) {
    const card = document.createElement("article");
    card.className = "subtask-card";
    card.dataset.subtaskId = subtaskId;
    const storedAnswer = localStorage.getItem(answerKey(task.id, subtaskId)) || "";
    let visibleHintCount = 0;
    const hints = normalizeList(subtask.hints);

    card.innerHTML = `
      <p class="operator">${escapeHtml(subtask.operator || "Aufgabe")}</p>
      <h3>${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}</h3>
      <div class="student-solution-box"><strong>Schülerlösung</strong><p>${escapeHtml(subtask.studentSolution || "")}</p></div>
      <p class="task-prompt">${escapeHtml(subtask.task || "")}</p>
      <textarea class="answer-field large-answer-field" placeholder="Beurteilen und korrigieren Sie die Schülerlösung.">${escapeHtml(storedAnswer)}</textarea>
      <div class="button-row">
        <button class="primary-button error-check-button" type="button">Antwort prüfen</button>
        <button class="secondary-button hint-button" type="button">Hilfe anzeigen</button>
        <button class="ghost-button expectation-button" type="button">Erwartungshorizont anzeigen</button>
        <button class="ghost-button solution-button" type="button">Musterlösung anzeigen</button>
        <button class="secondary-button reset-button" type="button">Zurücksetzen</button>
      </div>
      <div class="hint-list hidden" aria-live="polite"></div>
      <div class="feedback hidden" aria-live="polite"></div>
      <div class="reveal-box expectation-box hidden"></div>
      <div class="reveal-box solution-box hidden"></div>
    `;

    const answerField = card.querySelector(".answer-field");
    answerField.addEventListener("input", () => localStorage.setItem(answerKey(task.id, subtaskId), answerField.value));
    card.querySelector(".error-check-button").addEventListener("click", () => {
      const result = checkTranscriptionError(answerField.value);
      state.checks[checkKey(task.id, subtaskId)] = result;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      localStorage.setItem(answerKey(task.id, subtaskId), answerField.value);
      renderSimpleCriterionFeedback(card.querySelector(".feedback"), result);
    });
    card.querySelector(".hint-button").addEventListener("click", () => {
      visibleHintCount = Math.min(visibleHintCount + 1, hints.length);
      renderHints(card.querySelector(".hint-list"), hints.slice(0, visibleHintCount));
      const button = card.querySelector(".hint-button");
      button.textContent = visibleHintCount >= hints.length ? "Alle Hilfen sichtbar" : "Weitere Hilfe anzeigen";
      button.disabled = visibleHintCount >= hints.length;
    });
    card.querySelector(".expectation-button").addEventListener("click", () => {
      toggleReveal(card.querySelector(".expectation-box"), "Erwartungshorizont", normalizeList(subtask.expectationHorizon));
    });
    card.querySelector(".solution-button").addEventListener("click", () => {
      toggleReveal(card.querySelector(".solution-box"), "Musterlösung", subtask.sampleSolution || "");
    });
    card.querySelector(".reset-button").addEventListener("click", () => {
      answerField.value = "";
      localStorage.removeItem(answerKey(task.id, subtaskId));
      delete state.checks[checkKey(task.id, subtaskId)];
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      resetReveals(card);
      visibleHintCount = 0;
    });
    return card;
  }

  function renderTranslationStructureSubtask(task, subtask, subtaskId, index) {
    const card = document.createElement("article");
    card.className = "subtask-card";
    card.dataset.subtaskId = subtaskId;

    const items = normalizeList(subtask.items);
    const functions = normalizeList(subtask.functions);
    let stored = readJson(translationKey(task.id, subtaskId), defaultTranslationInputs(items));
    let selectedFunction = "";
    let visibleHintCount = 0;
    let lastResult = state.checks[checkKey(task.id, subtaskId)] || null;

    card.innerHTML = `
      <p class="operator">${escapeHtml(subtask.operator || "Benennen und zuordnen")}</p>
      <h3>${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}</h3>
      <p class="task-prompt">${escapeHtml(subtask.task || "")}</p>
      ${subtask.hintText ? `<p class="drag-note">${escapeHtml(subtask.hintText)}</p>` : ""}
      <article class="material-card inline-material">
        <h4>${escapeHtml((subtask.material && subtask.material.title) || "Material")}</h4>
        <img class="material-image transcription-image" src="${escapeHtml((subtask.material && subtask.material.src) || "")}" alt="${escapeHtml((subtask.material && subtask.material.alt) || "")}">
        <p class="credit">Bildnachweis: siehe CREDITS.md</p>
      </article>
      <div class="transcription-match-task">
        <div class="transcription-table-wrap">
          <table class="transcription-table">
            <thead><tr><th>Nummer</th><th>Struktur benennen</th><th>Funktion zuordnen</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="function-bank" aria-label="Funktionskarten"></div>
      </div>
      <section class="compare-section">
        <h4>A-, P- und E-Stelle kurz erläutern</h4>
        <p>Erklären Sie die Funktion der A-, P- und E-Stelle jeweils in genau einem Satz.</p>
        <div class="ape-grid">
          <label>A-Stelle<textarea class="ape-input" data-site="a">${escapeHtml(stored.ape.a)}</textarea></label>
          <label>P-Stelle<textarea class="ape-input" data-site="p">${escapeHtml(stored.ape.p)}</textarea></label>
          <label>E-Stelle<textarea class="ape-input" data-site="e">${escapeHtml(stored.ape.e)}</textarea></label>
        </div>
      </section>
      <div class="button-row">
        <button class="primary-button translation-check-button" type="button">Antworten prüfen</button>
        <button class="secondary-button hint-button" type="button">Hilfe anzeigen</button>
        <button class="ghost-button translation-solution-button" type="button">Musterlösung anzeigen</button>
        <button class="secondary-button translation-reset-button" type="button">Zurücksetzen</button>
      </div>
      <div class="hint-list hidden" aria-live="polite"></div>
      <div class="feedback hidden" aria-live="polite"></div>
      <div class="reveal-box solution-box hidden"></div>
    `;

    const image = card.querySelector(".material-image");
    image.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "image-fallback";
      fallback.textContent = `Bild konnte nicht geladen werden: ${(subtask.material && subtask.material.alt) || "Translation"}`;
      image.replaceWith(fallback);
    });

    const tbody = card.querySelector("tbody");
    const bank = card.querySelector(".function-bank");
    const feedback = card.querySelector(".feedback");

    bank.addEventListener("dragover", (event) => event.preventDefault());
    bank.addEventListener("drop", (event) => {
      event.preventDefault();
      const functionId = event.dataTransfer.getData("text/plain");
      if (functionId) {
        removeAssignedValue(stored.functions, functionId);
        persistAndRender();
      }
    });

    card.querySelectorAll(".ape-input").forEach((input) => {
      input.addEventListener("input", () => {
        stored = collectTranslationInputs(card, stored);
        writeJson(translationKey(task.id, subtaskId), stored);
      });
    });

    card.querySelector(".hint-button").addEventListener("click", () => {
      const hints = normalizeList(subtask.hints);
      visibleHintCount = Math.min(visibleHintCount + 1, hints.length);
      renderHints(card.querySelector(".hint-list"), hints.slice(0, visibleHintCount));
      const button = card.querySelector(".hint-button");
      button.textContent = visibleHintCount >= hints.length ? "Alle Hilfen sichtbar" : "Weitere Hilfe anzeigen";
      button.disabled = visibleHintCount >= hints.length;
    });

    card.querySelector(".translation-check-button").addEventListener("click", () => {
      stored = collectTranslationInputs(card, stored);
      writeJson(translationKey(task.id, subtaskId), stored);
      lastResult = checkTranslationStructure(stored, items);
      state.checks[checkKey(task.id, subtaskId)] = lastResult;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      renderTranslationFeedback(feedback, lastResult);
      render();
    });

    card.querySelector(".translation-solution-button").addEventListener("click", () => {
      renderTranslationSolution(card.querySelector(".solution-box"), items, functions, subtask.apeSolution || {});
    });

    card.querySelector(".translation-reset-button").addEventListener("click", () => {
      stored = defaultTranslationInputs(items);
      selectedFunction = "";
      lastResult = null;
      localStorage.removeItem(translationKey(task.id, subtaskId));
      delete state.checks[checkKey(task.id, subtaskId)];
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      feedback.classList.add("hidden");
      card.querySelector(".hint-list").classList.add("hidden");
      visibleHintCount = 0;
      const hintButton = card.querySelector(".hint-button");
      hintButton.textContent = "Hilfe anzeigen";
      hintButton.disabled = false;
      render();
    });

    function persistAndRender() {
      writeJson(translationKey(task.id, subtaskId), collectTranslationInputs(card, stored));
      stored = readJson(translationKey(task.id, subtaskId), defaultTranslationInputs(items));
      render();
    }

    function render() {
      const assignedFunctions = new Set(Object.values(stored.functions || {}));
      tbody.innerHTML = "";
      items.forEach((item) => {
        const number = String(item.number);
        const functionId = stored.functions[number] || "";
        const rowResult = lastResult && lastResult.rows[number];
        const tr = document.createElement("tr");
        if (rowResult) {
          tr.classList.add(rowResult.structureCorrect ? "structure-correct" : "structure-incorrect");
          tr.classList.add(rowResult.functionCorrect ? "function-correct" : "function-incorrect");
        }
        tr.innerHTML = `
          <th scope="row">${escapeHtml(number)}</th>
          <td><input class="translation-structure-input transcription-structure-input" data-number="${escapeHtml(number)}" type="text" value="${escapeHtml((stored.structures && stored.structures[number]) || "")}" autocomplete="off"></td>
          <td><button class="function-drop" type="button" data-number="${escapeHtml(number)}">${functionId ? renderFunctionCardText(functionId, functions) : '<span class="drop-placeholder">Funktion hier ablegen</span>'}</button></td>
        `;
        tr.querySelector(".translation-structure-input").addEventListener("input", () => {
          stored = collectTranslationInputs(card, stored);
          writeJson(translationKey(task.id, subtaskId), stored);
        });
        const drop = tr.querySelector(".function-drop");
        drop.addEventListener("dragover", (event) => event.preventDefault());
        drop.addEventListener("drop", (event) => {
          event.preventDefault();
          const droppedId = event.dataTransfer.getData("text/plain");
          if (droppedId) {
            assignValue(stored.functions, number, droppedId);
            persistAndRender();
          }
        });
        drop.addEventListener("click", () => {
          if (selectedFunction) {
            assignValue(stored.functions, number, selectedFunction);
            selectedFunction = "";
            persistAndRender();
          } else if (stored.functions[number]) {
            delete stored.functions[number];
            persistAndRender();
          }
        });
        tbody.append(tr);
      });

      bank.innerHTML = "<h4>Funktionskarten</h4>";
      const list = document.createElement("div");
      list.className = "function-card-list";
      orderCards(functions, ["F", "C", "H", "A", "G", "D", "B", "E"]).filter((fn) => !assignedFunctions.has(fn.id)).forEach((fn) => {
        const chip = createDraggableChip(fn.id, selectedFunction, () => {
          selectedFunction = selectedFunction === fn.id ? "" : fn.id;
          render();
        });
        chip.classList.add("function-card");
        chip.innerHTML = escapeHtml(fn.text);
        list.append(chip);
      });
      if (!list.children.length) {
        const empty = document.createElement("p");
        empty.className = "muted-small";
        empty.textContent = "Alle Funktionen sind zugeordnet.";
        list.append(empty);
      }
      bank.append(list);
    }

    render();
    return card;
  }

  function renderTranslationProcessSubtask(task, subtask, subtaskId, index) {
    const card = document.createElement("article");
    card.className = "subtask-card";
    card.dataset.subtaskId = subtaskId;

    const storedAnswer = localStorage.getItem(answerKey(task.id, subtaskId)) || "";
    let visibleHintCount = 0;
    const hints = normalizeList(subtask.hints);

    card.innerHTML = `
      <p class="operator">${escapeHtml(subtask.operator || "Aufgabe")}</p>
      <h3>${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}</h3>
      <p class="task-prompt">${escapeHtml(subtask.task || "")}</p>
      ${subtask.hintText ? `<p class="drag-note">${escapeHtml(subtask.hintText)}</p>` : ""}
      <textarea class="answer-field large-answer-field" aria-label="Antwort zu ${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}" placeholder="Formulieren Sie hier Ihre Erläuterung in 6 bis 10 Sätzen.">${escapeHtml(storedAnswer)}</textarea>
      <div class="button-row">
        <button class="primary-button translation-process-check-button" type="button">Antwort prüfen</button>
        <button class="secondary-button hint-button" type="button">Hilfe anzeigen</button>
        <button class="ghost-button expectation-button" type="button">Erwartungshorizont anzeigen</button>
        <button class="ghost-button solution-button" type="button">Musterlösung anzeigen</button>
        <button class="secondary-button reset-button" type="button">Zurücksetzen</button>
      </div>
      <div class="hint-list hidden" aria-live="polite"></div>
      <div class="feedback hidden" aria-live="polite"></div>
      <div class="reveal-box expectation-box hidden"></div>
      <div class="reveal-box solution-box hidden"></div>
    `;

    const answerField = card.querySelector(".answer-field");
    answerField.addEventListener("input", () => localStorage.setItem(answerKey(task.id, subtaskId), answerField.value));

    card.querySelector(".translation-process-check-button").addEventListener("click", () => {
      const result = checkTranslationProcess(answerField.value);
      state.checks[checkKey(task.id, subtaskId)] = result;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      localStorage.setItem(answerKey(task.id, subtaskId), answerField.value);
      renderTranscriptionProcessFeedback(card.querySelector(".feedback"), result);
    });
    card.querySelector(".hint-button").addEventListener("click", () => {
      visibleHintCount = Math.min(visibleHintCount + 1, hints.length);
      renderHints(card.querySelector(".hint-list"), hints.slice(0, visibleHintCount));
      const button = card.querySelector(".hint-button");
      button.textContent = visibleHintCount >= hints.length ? "Alle Hilfen sichtbar" : "Weitere Hilfe anzeigen";
      button.disabled = visibleHintCount >= hints.length;
    });
    card.querySelector(".expectation-button").addEventListener("click", () => {
      toggleReveal(card.querySelector(".expectation-box"), "Erwartungshorizont", normalizeList(subtask.expectationHorizon));
    });
    card.querySelector(".solution-button").addEventListener("click", () => {
      toggleReveal(card.querySelector(".solution-box"), "Musterlösung", subtask.sampleSolution || "");
    });
    card.querySelector(".reset-button").addEventListener("click", () => {
      answerField.value = "";
      localStorage.removeItem(answerKey(task.id, subtaskId));
      delete state.checks[checkKey(task.id, subtaskId)];
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      resetReveals(card);
      visibleHintCount = 0;
    });
    return card;
  }

  function renderAminoAcidSequenceSubtask(task, subtask, subtaskId, index) {
    const card = document.createElement("article");
    card.className = "subtask-card";
    card.dataset.subtaskId = subtaskId;
    const stored = readJson(aminoSequenceKey(task.id, subtaskId), defaultAminoSequenceInputs(subtask.codons));
    let visibleHintCount = 0;
    const hints = normalizeList(subtask.hints);

    card.innerHTML = `
      <p class="operator">${escapeHtml(subtask.operator || "Aufgabe")}</p>
      <h3>${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}</h3>
      <article class="material-card inline-material">
        <h4>${escapeHtml((subtask.material && subtask.material.title) || "Material")}</h4>
        <img class="material-image codesun-image" src="${escapeHtml((subtask.material && subtask.material.src) || "")}" alt="${escapeHtml((subtask.material && subtask.material.alt) || "")}">
        <p class="credit">Bildnachweis: siehe CREDITS.md</p>
      </article>
      <div class="sequence-box prominent-sequence">${escapeHtml(subtask.sequenceMaterial || "")}</div>
      <div class="amino-acid-reference"></div>
      <p class="task-prompt">${escapeHtml(subtask.task || "")}</p>
      ${subtask.hintText ? `<p class="drag-note">${escapeHtml(subtask.hintText)}</p>` : ""}
      <div class="compare-table-wrap">
        <table class="compare-table amino-input-table">
          <thead><tr><th>Codon der mRNA</th><th>Aminosäure (3-Buchstaben-Abkürzung)</th><th>vollständiger Name</th></tr></thead>
          <tbody>${renderAminoInputRows(subtask.codons, stored)}</tbody>
        </table>
      </div>
      <div class="button-row">
        <button class="primary-button amino-check-button" type="button">Antwort prüfen</button>
        <button class="secondary-button hint-button" type="button">Hilfe anzeigen</button>
        <button class="ghost-button expectation-button" type="button">Erwartungshorizont anzeigen</button>
        <button class="ghost-button solution-button" type="button">Musterlösung anzeigen</button>
        <button class="secondary-button reset-button" type="button">Zurücksetzen</button>
      </div>
      <div class="hint-list hidden" aria-live="polite"></div>
      <div class="feedback hidden" aria-live="polite"></div>
      <div class="reveal-box expectation-box hidden"></div>
      <div class="reveal-box solution-box hidden"></div>
    `;

    const image = card.querySelector(".codesun-image");
    image.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "image-fallback";
      fallback.textContent = `Bild konnte nicht geladen werden: ${(subtask.material && subtask.material.alt) || "Codesonne"}`;
      image.replaceWith(fallback);
    });
    renderAminoAcidReference(card.querySelector(".amino-acid-reference"));

    const save = () => writeJson(aminoSequenceKey(task.id, subtaskId), collectAminoSequenceInputs(card, subtask.codons));
    card.querySelectorAll(".amino-input").forEach((input) => input.addEventListener("input", save));
    card.querySelector(".amino-check-button").addEventListener("click", () => {
      const inputs = collectAminoSequenceInputs(card, subtask.codons);
      const result = checkAminoAcidSequence(inputs, subtask.codons);
      state.checks[checkKey(task.id, subtaskId)] = result;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      writeJson(aminoSequenceKey(task.id, subtaskId), inputs);
      renderAminoSequenceFeedback(card.querySelector(".feedback"), result);
    });
    card.querySelector(".hint-button").addEventListener("click", () => {
      visibleHintCount = Math.min(visibleHintCount + 1, hints.length);
      renderHints(card.querySelector(".hint-list"), hints.slice(0, visibleHintCount));
      const button = card.querySelector(".hint-button");
      button.textContent = visibleHintCount >= hints.length ? "Alle Hilfen sichtbar" : "Weitere Hilfe anzeigen";
      button.disabled = visibleHintCount >= hints.length;
    });
    card.querySelector(".expectation-button").addEventListener("click", () => toggleReveal(card.querySelector(".expectation-box"), "Erwartungshorizont", subtask.expectationHorizon));
    card.querySelector(".solution-button").addEventListener("click", () => renderAminoSolution(card.querySelector(".solution-box"), subtask));
    card.querySelector(".reset-button").addEventListener("click", () => {
      card.querySelectorAll(".amino-input").forEach((input) => { input.value = ""; });
      localStorage.removeItem(aminoSequenceKey(task.id, subtaskId));
      delete state.checks[checkKey(task.id, subtaskId)];
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      resetReveals(card);
      visibleHintCount = 0;
    });
    return card;
  }

  function renderTranslationErrorSubtask(task, subtask, subtaskId, index) {
    const card = document.createElement("article");
    card.className = "subtask-card";
    card.dataset.subtaskId = subtaskId;
    const storedAnswer = localStorage.getItem(answerKey(task.id, subtaskId)) || "";
    let visibleHintCount = 0;
    const hints = normalizeList(subtask.hints);
    card.innerHTML = `
      <p class="operator">${escapeHtml(subtask.operator || "Aufgabe")}</p>
      <h3>${escapeHtml(subtask.title || `Teilaufgabe ${index + 1}`)}</h3>
      <div class="student-solution-box"><strong>Schülerlösung</strong><p>${escapeHtml(subtask.studentSolution || "")}</p></div>
      <p class="task-prompt">${escapeHtml(subtask.task || "")}</p>
      <textarea class="answer-field large-answer-field">${escapeHtml(storedAnswer)}</textarea>
      <div class="button-row">
        <button class="primary-button translation-error-check-button" type="button">Antwort prüfen</button>
        <button class="secondary-button hint-button" type="button">Hilfe anzeigen</button>
        <button class="ghost-button expectation-button" type="button">Erwartungshorizont anzeigen</button>
        <button class="ghost-button solution-button" type="button">Musterlösung anzeigen</button>
        <button class="secondary-button reset-button" type="button">Zurücksetzen</button>
      </div>
      <div class="hint-list hidden" aria-live="polite"></div>
      <div class="feedback hidden" aria-live="polite"></div>
      <div class="reveal-box expectation-box hidden"></div>
      <div class="reveal-box solution-box hidden"></div>
    `;
    const answerField = card.querySelector(".answer-field");
    answerField.addEventListener("input", () => localStorage.setItem(answerKey(task.id, subtaskId), answerField.value));
    card.querySelector(".translation-error-check-button").addEventListener("click", () => {
      const result = checkTranslationError(answerField.value);
      state.checks[checkKey(task.id, subtaskId)] = result;
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      localStorage.setItem(answerKey(task.id, subtaskId), answerField.value);
      renderSimpleCriterionFeedback(card.querySelector(".feedback"), result);
    });
    card.querySelector(".hint-button").addEventListener("click", () => {
      visibleHintCount = Math.min(visibleHintCount + 1, hints.length);
      renderHints(card.querySelector(".hint-list"), hints.slice(0, visibleHintCount));
      const button = card.querySelector(".hint-button");
      button.textContent = visibleHintCount >= hints.length ? "Alle Hilfen sichtbar" : "Weitere Hilfe anzeigen";
      button.disabled = visibleHintCount >= hints.length;
    });
    card.querySelector(".expectation-button").addEventListener("click", () => toggleReveal(card.querySelector(".expectation-box"), "Erwartungshorizont", subtask.expectationHorizon));
    card.querySelector(".solution-button").addEventListener("click", () => toggleReveal(card.querySelector(".solution-box"), "Musterlösung", subtask.sampleSolution || ""));
    card.querySelector(".reset-button").addEventListener("click", () => {
      answerField.value = "";
      localStorage.removeItem(answerKey(task.id, subtaskId));
      delete state.checks[checkKey(task.id, subtaskId)];
      writeJson(`${STORAGE_PREFIX}_checks`, state.checks);
      resetReveals(card);
      visibleHintCount = 0;
    });
    return card;
  }

  function defaultCompareInputs() {
    return {
      leftSugar: "",
      rightSugar: "",
      difference: "",
      table: {
        sugar: { dna: "", rna: "" },
        bases: { dna: "", rna: "" },
        structure: { dna: "", rna: "" },
        function: { dna: "", rna: "" }
      }
    };
  }

  function defaultTranscriptionInputs(items) {
    const structures = {};
    const functions = {};
    normalizeList(items).forEach((item) => {
      structures[String(item.number)] = "";
      functions[String(item.number)] = "";
    });
    return { structures, functions };
  }

  function defaultTranslationInputs(items) {
    const base = defaultTranscriptionInputs(items);
    return { ...base, ape: { a: "", p: "", e: "" } };
  }

  function defaultAminoSequenceInputs(codons) {
    const rows = {};
    normalizeList(codons).forEach((item) => {
      rows[item.codon] = { abbr3: "", fullName: "" };
    });
    return { rows };
  }

  function renderAminoInputRows(codons, stored) {
    return normalizeList(codons).map((item) => {
      const row = (stored.rows && stored.rows[item.codon]) || { abbr3: "", fullName: "" };
      return `<tr><th scope="row">${escapeHtml(item.codon)}</th><td><input class="compare-input amino-input" data-codon="${escapeHtml(item.codon)}" data-field="abbr3" value="${escapeHtml(row.abbr3)}"></td><td><input class="compare-input amino-input" data-codon="${escapeHtml(item.codon)}" data-field="fullName" value="${escapeHtml(row.fullName)}"></td></tr>`;
    }).join("");
  }

  function collectAminoSequenceInputs(card, codons) {
    const inputs = defaultAminoSequenceInputs(codons);
    card.querySelectorAll(".amino-input").forEach((input) => {
      inputs.rows[input.dataset.codon][input.dataset.field] = input.value;
    });
    return inputs;
  }

  function renderAminoAcidReference(container) {
    fetchJson("data/aminoAcids.json").then((items) => {
      const rows = normalizeList(items).map((item) => `<tr><td>${escapeHtml(item.abbr3)}</td><td>${escapeHtml(item.fullName)}</td></tr>`).join("");
      container.innerHTML = `<h4>Aminosäure-Abkürzungen</h4><div class="compare-table-wrap"><table class="amino-reference-table"><thead><tr><th>3-Buchstaben-Abkürzung</th><th>vollständiger Name</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    }).catch(() => {
      container.innerHTML = "";
    });
  }

  function checkAminoAcidSequence(inputs, codons) {
    const codonFeedback = [];
    const pitfalls = [];
    let abbrCorrect = 0;
    let nameCorrect = 0;
    normalizeList(codons).forEach((item) => {
      const row = (inputs.rows && inputs.rows[item.codon]) || {};
      const abbrOk = item.codon === "UGA" ? isStopAnswer(row.abbr3) : normalizeText(row.abbr3).trim() === normalizeText(item.abbr3).trim();
      const nameOk = item.codon === "UGA" ? isStopAnswer(row.fullName) : normalizeText(row.fullName).trim() === normalizeText(item.fullName).trim();
      if (abbrOk) abbrCorrect += 1;
      if (nameOk) nameCorrect += 1;
      codonFeedback.push(`${item.codon}: Abkürzung ${abbrOk ? "passend" : "noch prüfen"}, vollständiger Name ${nameOk ? "passend" : "noch prüfen"}`);
    });
    if (abbrCorrect + nameCorrect < 8) {
      pitfalls.push("Prüfen Sie, ob Sie die Codesonne mit den Codons der mRNA verwendet haben.");
    }
    return { date: new Date().toISOString(), codonFeedback, pitfalls, abbrCorrect, nameCorrect, inputs };
  }

  function isStopAnswer(value) {
    const text = normalizeText(value).trim();
    return ["stopp", "stop", "stoppcodon", "stopcodon", "keine", "keine aminosaure", "keine aminosäure", "-"].includes(text);
  }

  function renderAminoSequenceFeedback(container, result) {
    container.classList.remove("hidden");
    container.innerHTML = `
      <p class="notice">Dieser Check ersetzt keine Bewertung. Er zeigt dir nur, welche fachlichen Aspekte du noch einmal überprüfen solltest.</p>
      <p>Mehrere Codons wurden korrekt zugeordnet. Prüfen Sie noch einmal, wie mit dem Stoppcodon umzugehen ist.</p>
      <div class="feedback-section"><h4>Codons und Aminosäuren</h4>${renderList(result.codonFeedback)}</div>
      <div class="feedback-section"><h4>Mögliche fachliche Stolperstellen</h4>${renderList(result.pitfalls.length ? result.pitfalls : ["Keine typische Stolperstelle wurde automatisch erkannt."])}</div>
    `;
  }

  function renderAminoSolution(container, subtask) {
    container.classList.toggle("hidden");
    if (container.classList.contains("hidden")) return;
    const rows = normalizeList(subtask.codons).map((item) => `<tr><th scope="row">${escapeHtml(item.codon)}</th><td>${escapeHtml(item.abbr3)}</td><td>${escapeHtml(item.fullName)}</td></tr>`).join("");
    container.innerHTML = `<h4>Musterlösung</h4><div class="compare-table-wrap"><table class="compare-table solution-table"><thead><tr><th>Codon</th><th>3-Buchstaben-Abkürzung</th><th>vollständiger Name</th></tr></thead><tbody>${rows}</tbody></table></div><p><strong>Aminosäuresequenz:</strong> Met – Ala – Phe – Pro – Asn</p><p>Methionin – Alanin – Phenylalanin – Prolin – Asparagin</p>`;
  }

  function checkTranslationError(answer) {
    const text = normalizeTranslationText(answer);
    const recognized = [];
    const missing = [];
    const pitfalls = [];
    addCheck({ recognized, missing }, text.includes("mrna") && (text.includes("nicht dna") || text.includes("dna ist falsch") || text.includes("ribosom")), "mRNA statt DNA als Vorlage wird korrigiert.", "Prüfen Sie, welches Molekül bei der Translation am Ribosom abgelesen wird: die mRNA, nicht die DNA.");
    addCheck({ recognized, missing }, text.includes("codon") && text.includes("anticodon") && text.includes("mrna") && text.includes("trna"), "Codon und Anticodon werden unterschieden.", "Ergänzen Sie den Unterschied zwischen Codon und Anticodon: Das Codon liegt auf der mRNA, das Anticodon auf der tRNA.");
    addCheck({ recognized, missing }, text.includes("codesonne") && text.includes("mrna") && text.includes("codon"), "Codesonne mit mRNA-Codons wird genannt.", "Ergänzen Sie, dass die Codesonne mit den Codons der mRNA verwendet wird.");
    addCheck({ recognized, missing }, text.includes("trna") && (text.includes("aminosaure") || text.includes("aminosäure")) && (text.includes("bringt") || text.includes("transportiert")), "Die tRNA-Funktion wird korrigiert.", "Prüfen Sie die Funktion der tRNA: Sie bringt eine passende Aminosäure zum Ribosom.");
    addCheck({ recognized, missing }, hasStopCodon(text) && (text.includes("keine aminosaure") || text.includes("keine aminosäure") || text.includes("nicht fur eine aminosaure") || text.includes("nicht für eine aminosäure")) && text.includes("beendet"), "Stoppcodon wird korrekt erklärt.", "Ergänzen Sie die Funktion des Stoppcodons: Es codiert nicht für eine Aminosäure, sondern beendet die Translation.");
    if (text.includes("dna") && text.includes("abgelesen") && !text.includes("nicht dna")) pitfalls.push("Achten Sie auf die Vorlage der Translation: Abgelesen wird die mRNA, nicht die DNA.");
    if (hasStopCodon(text) && text.includes("codiert") && (text.includes("aminosaure") || text.includes("aminosäure")) && !text.includes("nicht")) pitfalls.push("Prüfen Sie die Funktion des Stoppcodons: Es codiert nicht für eine Aminosäure.");
    return { date: new Date().toISOString(), recognized, missing, pitfalls, answerLength: answer.trim().length };
  }

  function collectTranslationInputs(card, stored) {
    const next = {
      structures: { ...(stored.structures || {}) },
      functions: { ...(stored.functions || {}) },
      ape: { ...(stored.ape || { a: "", p: "", e: "" }) }
    };
    card.querySelectorAll(".translation-structure-input").forEach((input) => {
      next.structures[input.dataset.number] = input.value;
    });
    card.querySelectorAll(".ape-input").forEach((input) => {
      next.ape[input.dataset.site] = input.value;
    });
    return next;
  }

  function checkTranslationStructure(inputs, items) {
    const rows = {};
    let structureCorrect = 0;
    let functionCorrect = 0;
    const vagueHints = [];
    normalizeList(items).forEach((item) => {
      const number = String(item.number);
      const entered = (inputs.structures && inputs.structures[number]) || "";
      const normalizedEntered = normalizeStructureTerm(entered);
      const isVague = normalizeList(item.vague).some((vague) => normalizedEntered === normalizeStructureTerm(vague));
      const isStructureCorrect = normalizeList(item.accepted).some((accepted) => normalizedEntered === normalizeStructureTerm(accepted));
      const assignedFunction = (inputs.functions && inputs.functions[number]) || "";
      const isFunctionCorrect = assignedFunction === item.functionId;
      if (isStructureCorrect) structureCorrect += 1;
      if (isFunctionCorrect) functionCorrect += 1;
      if (isVague) vagueHints.push(`Nr. ${number}: Präzisieren Sie, ob die kleine oder große ribosomale Untereinheit gemeint ist.`);
      rows[number] = { entered, assignedFunction, expectedStructure: item.structure, expectedFunction: item.functionId, structureCorrect: isStructureCorrect, functionCorrect: isFunctionCorrect, isVague };
    });
    return {
      date: new Date().toISOString(),
      structureCorrect,
      functionCorrect,
      total: normalizeList(items).length,
      rows,
      vagueHints,
      ape: checkApeSites(inputs.ape || {})
    };
  }

  function checkApeSites(ape) {
    const result = {
      recognized: [],
      missing: [],
      styleHints: []
    };
    const a = normalizeText(ape.a || "");
    const p = normalizeText(ape.p || "");
    const e = normalizeText(ape.e || "");
    addCheck(result, a.includes("trna") && (a.includes("aminosaure") || a.includes("aminosäure")), "A-Stelle: passende tRNA mit Aminosäure ist erkennbar.", "Prüfen Sie die A-Stelle: Dort bindet die nächste passende tRNA mit ihrer Aminosäure.");
    addCheck(result, p.includes("trna") && (p.includes("polypeptid") || p.includes("aminosaurekette") || p.includes("aminosäurekette") || p.includes("wachsend")), "P-Stelle: tRNA mit wachsender Polypeptidkette ist erkennbar.", "Prüfen Sie die P-Stelle: Dort befindet sich die tRNA mit der wachsenden Polypeptidkette.");
    addCheck(result, e.includes("trna") && (e.includes("verlasst") || e.includes("verlässt") || e.includes("entladen") || e.includes("abgegeben")), "E-Stelle: entladene tRNA verlässt das Ribosom.", "Prüfen Sie die E-Stelle: Dort verlässt die entladene tRNA das Ribosom.");
    ["a", "p", "e"].forEach((site) => {
      if (sentenceCount(ape[site] || "") > 1) result.styleHints.push(`${site.toUpperCase()}-Stelle: Formulieren Sie die Funktion möglichst knapp in einem Satz.`);
    });
    return result;
  }

  function sentenceCount(value) {
    return (String(value || "").match(/[.!?]+/g) || []).length;
  }

  function renderTranslationFeedback(container, result) {
    container.classList.remove("hidden");
    const structureLines = Object.keys(result.rows).map((number) => {
      const row = result.rows[number];
      return `Nr. ${number}: Struktur ${row.structureCorrect ? "passend" : "noch prüfen"}`;
    });
    const functionLines = Object.keys(result.rows).map((number) => {
      const row = result.rows[number];
      return `Nr. ${number}: Funktion ${row.functionCorrect ? "passend" : "noch prüfen"}`;
    });
    container.innerHTML = `
      <p class="notice">Dieser Check ersetzt keine Bewertung. Er zeigt dir nur, welche fachlichen Aspekte du noch einmal überprüfen solltest.</p>
      <p>Sie haben ${result.structureCorrect} von ${result.total} Strukturen passend benannt und ${result.functionCorrect} von ${result.total} Funktionen passend zugeordnet.</p>
      <div class="feedback-section"><h4>Strukturen benennen</h4>${renderList([...structureLines, ...result.vagueHints])}</div>
      <div class="feedback-section"><h4>Funktionen zuordnen</h4>${renderList(functionLines)}</div>
      <div class="feedback-section"><h4>A-, P- und E-Stelle</h4><strong>Das ist bereits erkennbar</strong>${renderList(result.ape.recognized.length ? result.ape.recognized : ["Noch kein Aspekt wurde sicher automatisch erkannt."])}<strong>Das solltest du noch prüfen oder ergänzen</strong>${renderList(result.ape.missing.length ? result.ape.missing : ["Der Check erkennt hier keine offenen Ergänzungen."])}${result.ape.styleHints.length ? `<strong>Formulierung</strong>${renderList(result.ape.styleHints)}` : ""}</div>
    `;
  }

  function renderTranslationSolution(container, items, functions, apeSolution) {
    container.classList.toggle("hidden");
    if (container.classList.contains("hidden")) return;
    const rows = normalizeList(items).map((item) => {
      const fn = normalizeList(functions).find((entry) => entry.id === item.functionId);
      return `<tr><th scope="row">${escapeHtml(item.number)}</th><td>${escapeHtml(item.structure)}</td><td>${escapeHtml(fn ? fn.text : "")}</td></tr>`;
    }).join("");
    container.innerHTML = `
      <h4>Musterlösung</h4>
      <div class="transcription-table-wrap">
        <table class="transcription-table solution-table">
          <thead><tr><th>Nummer</th><th>Struktur</th><th>Funktion</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <h4>A-, P- und E-Stelle</h4>
      <p><strong>A-Stelle:</strong> ${escapeHtml(apeSolution.a || "")}</p>
      <p><strong>P-Stelle:</strong> ${escapeHtml(apeSolution.p || "")}</p>
      <p><strong>E-Stelle:</strong> ${escapeHtml(apeSolution.e || "")}</p>
    `;
  }

  function checkTranscriptionProcess(answer) {
    const text = normalizeProcessText(answer);
    const recognized = [];
    const missing = [];
    const pitfalls = [];

    addCheck(
      { recognized, missing },
      includesAll(text, ["dna", "mrna"]) && hasAnyText(text, ["umschreib", "abschreib", "transkrib", "gebildet", "entsteht"]),
      "Transkription als Umschreiben eines DNA-Abschnitts in mRNA ist erkennbar.",
      "Ergänzen Sie, dass bei der Transkription ein DNA-Abschnitt in mRNA umgeschrieben wird."
    );
    addCheck(
      { recognized, missing },
      text.includes("proteinbiosynthese"),
      "Transkription wird in den Zusammenhang der Proteinbiosynthese eingeordnet.",
      "Prüfen Sie, ob Sie Transkription als Teilprozess der Proteinbiosynthese einordnen."
    );
    addCheck(
      { recognized, missing },
      text.includes("zellkern"),
      "Der Zellkern als Ort bei Eukaryoten wird genannt.",
      "Ergänzen Sie den Ort bei Eukaryoten: Die Transkription findet im Zellkern statt."
    );

    const hasRnaPolymerase = hasAnyText(text, ["rna polymerase", "polymerase"]);
    addCheck(
      { recognized, missing },
      hasRnaPolymerase,
      "RNA-Polymerase wird als beteiligtes Enzym genannt.",
      "Ergänzen Sie das beteiligte Enzym: die RNA-Polymerase."
    );
    addCheck(
      { recognized, missing },
      hasRnaPolymerase && hasAnyText(text, ["bindet", "offnet", "oeffnet", "synthetisiert", "bildet", "verknupft", "verknuepft"]),
      "Die Funktion der RNA-Polymerase wird beschrieben.",
      "Beschreiben Sie genauer, dass die RNA-Polymerase an DNA bindet, lokal öffnet und die mRNA synthetisiert."
    );

    addCheck(
      { recognized, missing },
      hasAnyText(text, ["codogener strang", "codogenen strang", "matrizenstrang", "template"]) && text.includes("vorlage"),
      "Der codogene Strang bzw. Matrizenstrang wird als Vorlage benannt.",
      "Ergänzen Sie, welcher DNA-Strang als Vorlage dient: der codogene Strang bzw. Matrizenstrang."
    );

    addCheck(
      { recognized, missing },
      hasAnyText(text, ["rna nukleotide", "nukleotide"]) && hasAnyText(text, ["mrna entsteht", "mrna gebildet", "mrna bildet", "transkript"]),
      "Die Bildung der mRNA aus RNA-Nukleotiden ist erkennbar.",
      "Ergänzen Sie, dass freie RNA-Nukleotide angelagert und zu einer mRNA verknüpft werden."
    );
    addCheck(
      { recognized, missing },
      text.includes("mrna") && hasAnyText(text, ["lost sich", "loest sich", "verlasst", "verlaesst"]),
      "Das Lösen der mRNA von der DNA am Ende wird genannt.",
      "Ergänzen Sie, dass sich die mRNA am Ende von der DNA löst."
    );

    addCheck(
      { recognized, missing },
      text.includes("komplement") || text.includes("basenpaarung"),
      "Komplementäre Bildung bzw. Basenpaarung wird genannt.",
      "Ergänzen Sie, dass die mRNA komplementär zum codogenen Strang gebildet wird."
    );
    addCheck(
      { recognized, missing },
      hasBasePairing(text),
      "Die Basenpaarung A-U und G-C ist erkennbar.",
      "Prüfen Sie, ob Sie die Basenpaarung A-U und G-C genau genug genannt haben."
    );
    addCheck(
      { recognized, missing },
      text.includes("uracil") && hasAnyText(text, ["statt thymin", "anstelle thymin", "kein thymin"]),
      "Uracil statt Thymin in RNA wird erklärt.",
      "Ergänzen Sie, dass in RNA Uracil statt Thymin verwendet wird."
    );

    addCheck(
      { recognized, missing },
      hasFiveToThree(text),
      "Die Syntheserichtung 5'→3' wird genannt.",
      "Als fachliche Ergänzung können Sie die Syntheserichtung nennen: Die mRNA wird in 5'→3'-Richtung gebildet."
    );

    if (text.includes("dna polymerase")) {
      pitfalls.push("Prüfen Sie das beteiligte Enzym: Bei der Transkription ist die RNA-Polymerase beteiligt, nicht die DNA-Polymerase.");
    }
    if (hasMrnaThyminProblem(text)) {
      pitfalls.push("Prüfen Sie die Basen der mRNA: In RNA kommt Uracil statt Thymin vor.");
    }
    if (hasTranslationMixup(text)) {
      pitfalls.push("Achten Sie darauf, Transkription und Translation zu trennen: Bei der Transkription entsteht zunächst mRNA. Die Bildung der Aminosäurekette findet erst bei der Translation statt.");
    }

    return {
      date: new Date().toISOString(),
      recognized,
      missing,
      pitfalls,
      summary: buildTranscriptionProcessSummary(recognized.length, missing.length, pitfalls.length),
      answerLength: answer.trim().length
    };
  }

  function normalizeProcessText(value) {
    return normalizeText(value)
      .replace(/-/g, " ")
      .replace(/[→–—]/g, " ")
      .replace(/['’´`]/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  function includesAll(text, terms) {
    return terms.every((term) => text.includes(term));
  }

  function hasAnyText(text, terms) {
    return terms.some((term) => text.includes(term));
  }

  function hasBasePairing(text) {
    const compact = text.replace(/\s+/g, "");
    const au = compact.includes("a-u") || compact.includes("au") || text.includes("adenin uracil") || text.includes("adenin paart mit uracil");
    const gc = compact.includes("g-c") || compact.includes("gc") || text.includes("guanin cytosin") || text.includes("guanin paart mit cytosin");
    return au && gc;
  }

  function hasFiveToThree(text) {
    const compact = text.replace(/\s+/g, "");
    return compact.includes("5'3'") || compact.includes("5zu3") || compact.includes("5nach3") || compact.includes("5-3") || compact.includes("5→3") || (text.includes("5") && text.includes("3") && text.includes("richtung"));
  }

  function hasMrnaThyminProblem(text) {
    return text.includes("mrna") && (text.includes("thymin") || /\bt\b/.test(text)) && !text.includes("statt thymin") && !text.includes("kein thymin");
  }

  function hasTranslationMixup(text) {
    const translationTerms = ["ribosom", "trna", "aminosaure", "aminosäure", "aminosaurekette", "aminosäurekette", "protein", "translation"];
    if (!hasAnyText(text, translationTerms)) {
      return false;
    }
    const laterSignals = ["anschliessend", "anschließend", "spater", "später", "danach", "nach der transkription", "bei der translation", "fur die translation", "für die translation"];
    return !hasAnyText(text, laterSignals);
  }

  function buildTranscriptionProcessSummary(recognizedCount, missingCount, pitfallCount) {
    if (recognizedCount >= 7 && missingCount <= 2 && pitfallCount === 0) {
      return "Mehrere zentrale Aspekte sind bereits erkennbar. Prüfen Sie nur noch, ob einzelne fachliche Details präzise genug formuliert sind.";
    }
    if (recognizedCount >= 4) {
      return "Mehrere zentrale Aspekte sind bereits erkennbar. Prüfen Sie noch, ob Sie den codogenen Strang, die Basenpaarung und die mRNA-Bildung genau genug erklärt haben.";
    }
    return "Einige Ansatzpunkte sind erkennbar. Ergänzen Sie noch die zentralen Schritte der Transkription in einer klaren Reihenfolge.";
  }

  function renderTranscriptionProcessFeedback(container, result) {
    container.classList.remove("hidden");
    container.innerHTML = `
      <p class="notice">Dieser Check ersetzt keine Bewertung. Er zeigt dir nur, welche fachlichen Aspekte du noch einmal überprüfen solltest.</p>
      <p>${escapeHtml(result.summary)}</p>
      <h4>Das ist bereits erkennbar:</h4>
      ${renderList(result.recognized.length ? result.recognized : ["Noch kein zentraler Aspekt wurde sicher automatisch erkannt."])}
      <h4>Das solltest du noch prüfen oder ergänzen:</h4>
      ${renderList(result.missing.length ? result.missing : ["Der Check erkennt hier keine offenen Ergänzungen."])}
      <h4>Mögliche fachliche Stolperstellen:</h4>
      ${renderList(result.pitfalls.length ? result.pitfalls : ["Keine typische Stolperstelle wurde automatisch erkannt."])}
    `;
  }

  function checkTranscriptionPhases(inputs) {
    const result = {
      date: new Date().toISOString(),
      phases: {
        initiation: checkPhase(
          inputs.initiation,
          [
            [hasAnyText, ["rna polymerase", "polymerase"], "Initiation: RNA-Polymerase wird genannt.", "Ergänzen Sie, dass die RNA-Polymerase an einen bestimmten DNA-Abschnitt bindet."],
            [hasAnyText, ["bindet", "promotor", "bestimmter dna abschnitt"], "Initiation: Bindung an einen bestimmten DNA-Abschnitt ist erkennbar.", "Ergänzen Sie, dass die RNA-Polymerase an einen bestimmten DNA-Abschnitt bindet."],
            [hasAnyText, ["offnet", "oeffnet", "geoffnet", "transkriptionsblase"], "Initiation: lokales Öffnen der DNA bzw. Transkriptionsblase wird genannt.", "Ergänzen Sie, dass die DNA lokal geöffnet wird und eine Transkriptionsblase entsteht."],
            [hasAnyText, ["codogener strang", "vorlage", "matrizenstrang"], "Initiation: codogener Strang als Vorlage ist erkennbar.", "Prüfen Sie, ob Sie den codogenen Strang als Vorlage genannt haben."]
          ]
        ),
        elongation: checkPhase(
          inputs.elongation,
          [
            [hasAnyText, ["rna polymerase", "polymerase", "bewegt", "wandert", "codogener strang"], "Elongation: Arbeiten entlang des codogenen Strangs ist erkennbar.", "Ergänzen Sie, dass die RNA-Polymerase entlang des codogenen Strangs arbeitet."],
            [hasAnyText, ["rna nukleotide", "nukleotide", "komplement"], "Elongation: komplementäre RNA-Nukleotide werden genannt.", "Ergänzen Sie, dass freie RNA-Nukleotide komplementär angelagert werden."],
            [hasAnyText, ["uracil", "thymin", "u statt t"], "Elongation: Uracil statt Thymin ist erkennbar.", "Prüfen Sie, ob Sie erwähnt haben, dass in der RNA Uracil statt Thymin vorkommt."],
            [hasFiveToThree, [], "Elongation: Syntheserichtung 5'→3' wird genannt.", "Ergänzen Sie nach Möglichkeit die Syntheserichtung der mRNA in 5'→3'-Richtung."],
            [hasAnyText, ["mrna", "verlängert", "verlangert", "synthetisiert"], "Elongation: Verlängerung der mRNA ist erkennbar.", "Ergänzen Sie, dass die mRNA verlängert wird."]
          ]
        ),
        termination: checkPhase(
          inputs.termination,
          [
            [hasAnyText, ["stoppsignal", "terminator"], "Termination: Stoppsignal bzw. Terminator wird genannt.", "Ergänzen Sie, dass ein Stoppsignal bzw. Terminatorbereich die Transkription beendet."],
            [hasAnyText, ["endet", "beendet"], "Termination: Ende der Transkription ist erkennbar.", "Ergänzen Sie, dass die Transkription endet."],
            [hasAnyText, ["mrna", "lost sich", "löst sich", "freigesetzt"], "Termination: Freisetzung der mRNA ist erkennbar.", "Ergänzen Sie, dass die mRNA freigesetzt wird bzw. sich von der DNA löst."],
            [hasAnyText, ["dna stränge schließen", "dna strange schliessen", "dna schliesst", "dna schließt"], "Termination: Schließen der DNA-Stränge wird genannt.", "Ergänzen Sie, dass sich die DNA-Stränge wieder schließen."]
          ]
        )
      },
      pitfalls: []
    };
    const combined = normalizeProcessText(`${inputs.initiation || ""} ${inputs.elongation || ""} ${inputs.termination || ""}`);
    if (hasAnyText(combined, ["ribosom", "trna", "aminosaure", "aminosäure", "codon", "anticodon", "antikodon", "stoppcodon"])) {
      result.pitfalls.push("Prüfen Sie, ob Sie Transkription und Translation vermischen. Bei der Transkription wird mRNA mithilfe der RNA-Polymerase an der DNA gebildet.");
    }
    result.inputs = inputs;
    return result;
  }

  function checkTranslationPhases(inputs) {
    const result = {
      date: new Date().toISOString(),
      phases: {
        initiation: checkPhase(
          inputs.initiation,
          [
            [hasAnyText, ["mrna", "kleine untereinheit", "kleine ribosomale untereinheit"], "Initiation: mRNA und kleine ribosomale Untereinheit sind erkennbar.", "Ergänzen Sie, dass die mRNA an die kleine ribosomale Untereinheit bindet."],
            [hasAnyText, ["startcodon", "start codon", "aug"], "Initiation: Startcodon AUG wird genannt.", "Prüfen Sie, ob Sie das Startcodon AUG erwähnt haben."],
            [hasAnyText, ["start trna", "trna", "anticodon", "antikodon"], "Initiation: passende Start-tRNA ist erkennbar.", "Ergänzen Sie, dass eine passende Start-tRNA bindet."],
            [hasAnyText, ["grosse untereinheit", "große untereinheit", "ribosom"], "Initiation: große Untereinheit bzw. funktionsfähiges Ribosom wird genannt.", "Ergänzen Sie, dass sich die große ribosomale Untereinheit anlagert."]
          ]
        ),
        elongation: checkPhase(
          inputs.elongation,
          [
            [hasAnyText, ["basentriplett", "codon", "codons"], "Elongation: Basentripletts/Codons werden genannt.", "Ergänzen Sie, dass die mRNA in Basentripletts/Codons gelesen wird."],
            [hasAnyText, ["trna", "anticodon", "antikodon", "komplement"], "Elongation: tRNA mit Anticodon wird beschrieben.", "Prüfen Sie, ob Sie Codon und Anticodon korrekt zugeordnet haben."],
            [hasAnyText, ["aminosaure", "aminosäure"], "Elongation: Aminosäuren werden genannt.", "Ergänzen Sie, dass tRNAs passende Aminosäuren zum Ribosom bringen."],
            [hasAnyText, ["verknupft", "verknüpft", "peptidbindung", "aminosaurekette", "aminosäurekette", "polypeptidkette"], "Elongation: wachsende Aminosäurekette bzw. Polypeptidkette ist erkennbar.", "Ergänzen Sie, dass eine wachsende Aminosäurekette bzw. Polypeptidkette entsteht."],
            [hasAnyText, ["ribosom bewegt", "wandert", "entlang der mrna", "a stelle", "p stelle", "e stelle"], "Elongation: Bewegung des Ribosoms bzw. A-, P- und E-Stelle wird genannt.", "Als Ergänzung können Sie A-, P- und E-Stelle oder das Weiterwandern des Ribosoms nennen."]
          ]
        ),
        termination: checkPhase(
          inputs.termination,
          [
            [hasStopCodon, [], "Termination: Stoppcodon wird genannt.", "Ergänzen Sie, dass ein Stoppcodon die Termination auslöst."],
            [hasAnyText, ["keine aminosaure", "keine aminosäure", "codiert nicht", "keine trna"], "Termination: Stoppcodon codiert nicht für eine Aminosäure.", "Prüfen Sie, ob Sie erwähnt haben, dass ein Stoppcodon nicht für eine Aminosäure codiert."],
            [hasAnyText, ["endet", "beendet"], "Termination: Ende der Translation ist erkennbar.", "Ergänzen Sie, dass die Translation endet."],
            [hasAnyText, ["freigesetzt", "aminosaurekette", "aminosäurekette", "polypeptidkette"], "Termination: Freisetzung der Aminosäurekette ist erkennbar.", "Ergänzen Sie, dass die Aminosäurekette bzw. Polypeptidkette freigesetzt wird."]
          ]
        )
      },
      pitfalls: []
    };
    const combined = normalizeTranslationText(`${inputs.initiation || ""} ${inputs.elongation || ""} ${inputs.termination || ""}`);
    if (combined.includes("dna") && (combined.includes("vorlage") || combined.includes("abgelesen"))) {
      result.pitfalls.push("Prüfen Sie die Vorlage der Translation: Bei der Translation wird die mRNA am Ribosom abgelesen, nicht die DNA.");
    }
    if (hasAnyText(combined, ["rna polymerase", "codogener strang", "transkriptionsblase", "mrna wird gebildet"])) {
      result.pitfalls.push("Achten Sie darauf, Transkription und Translation zu trennen: Bei der Transkription entsteht mRNA. Bei der Translation wird mRNA am Ribosom in eine Aminosäurekette übersetzt.");
    }
    if (hasCodonAnticodonMixup(combined)) {
      result.pitfalls.push("Prüfen Sie den Unterschied zwischen Codon und Anticodon: Das Codon liegt auf der mRNA, das Anticodon auf der tRNA.");
    }
    if (hasStopCodon(combined) && combined.includes("codiert") && hasAnyText(combined, ["aminosaure", "aminosäure"]) && !combined.includes("nicht")) {
      result.pitfalls.push("Prüfen Sie die Funktion von Stoppcodons: Stoppcodons codieren nicht für eine Aminosäure, sondern beenden die Translation.");
    }
    result.inputs = inputs;
    return result;
  }

  function checkPhase(answer, checks) {
    const text = normalizeProcessText(answer || "");
    const phase = { recognized: [], missing: [] };
    checks.forEach(([fn, keywords, recognizedText, missingText]) => {
      const condition = keywords.length ? fn(text, keywords) : fn(text);
      addCheck(phase, condition, recognizedText, missingText);
    });
    return phase;
  }

  function renderPhaseFeedback(container, result) {
    container.classList.remove("hidden");
    container.innerHTML = `
      <p class="notice">Dieser Check ersetzt keine Bewertung. Er zeigt dir nur, welche fachlichen Aspekte du noch einmal überprüfen solltest.</p>
      ${renderSinglePhaseFeedback("Initiation", result.phases.initiation)}
      ${renderSinglePhaseFeedback("Elongation", result.phases.elongation)}
      ${renderSinglePhaseFeedback("Termination", result.phases.termination)}
      <div class="feedback-section">
        <h4>Mögliche fachliche Stolperstellen</h4>
        ${renderList(result.pitfalls.length ? result.pitfalls : ["Keine typische Stolperstelle wurde automatisch erkannt."])}
      </div>
    `;
  }

  function renderSinglePhaseFeedback(title, phase) {
    return `
      <div class="feedback-section">
        <h4>${escapeHtml(title)}</h4>
        <strong>Das ist bereits erkennbar:</strong>
        ${renderList(phase.recognized.length ? phase.recognized : ["Noch kein zentraler Aspekt wurde sicher automatisch erkannt."])}
        <strong>Das solltest du noch prüfen oder ergänzen:</strong>
        ${renderList(phase.missing.length ? phase.missing : ["Der Check erkennt hier keine offenen Ergänzungen."])}
      </div>
    `;
  }

  function checkMrnaSequence(sequence, reason) {
    const recognized = [];
    const missing = [];
    const pitfalls = [];
    const seq = normalizeSequence(sequence);
    const correct = "AUGCCUGAAUGG";
    const baseCorrect = seq.bases === correct || hasCorrectMrnaBases(sequence);

    if (baseCorrect && seq.direction !== "3to5") {
      recognized.push("Die mRNA-Basenfolge ist korrekt.");
      if (seq.direction === "none") {
        missing.push("Die Basenfolge ist richtig. Zur Übersicht können Sie die mRNA in Codons/Tripletts gliedern und mit 5'→3' angeben.");
      } else {
        recognized.push("Die Richtung 5'→3' ist erkennbar.");
      }
    } else if (baseCorrect && seq.direction === "3to5") {
      recognized.push("Die Basenfolge ist korrekt.");
      pitfalls.push("Die Basenfolge ist richtig, aber prüfen Sie die Richtung: mRNA wird üblicherweise in 5'→3'-Richtung angegeben.");
    } else {
      missing.push("Prüfen Sie die komplementäre Basenpaarung zum codogenen Strang: DNA-A wird zu RNA-U, DNA-T zu RNA-A, DNA-G zu RNA-C und DNA-C zu RNA-G.");
    }
    if (containsThymine(sequence)) {
      pitfalls.push("Prüfen Sie die Basen der mRNA: In RNA kommt Uracil statt Thymin vor.");
    }

    const r = normalizeProcessText(reason);
    addCheck({ recognized, missing }, hasAnyText(r, ["codogener strang", "matrizenstrang", "vorlage"]), "Der codogene Strang wird als Vorlage benannt.", "Ergänzen Sie, dass der codogene Strang bzw. Matrizenstrang als Vorlage dient.");
    addCheck({ recognized, missing }, r.includes("komplement") || r.includes("basenpaarung"), "Komplementäre Basenpaarung wird als Vorgehen genannt.", "Ergänzen Sie, dass die mRNA komplementär gebildet wird.");
    addCheck({ recognized, missing }, r.includes("uracil") || r.includes("u statt t"), "Uracil statt Thymin wird erwähnt.", "Ergänzen Sie, dass RNA Uracil statt Thymin enthält.");
    addCheck({ recognized, missing }, hasFiveToThree(r), "Die Richtung 5'→3' wird in der Begründung genannt.", "Ergänzen Sie, dass die mRNA in 5'→3'-Richtung angegeben wird.");

    return { date: new Date().toISOString(), recognized, missing, pitfalls, sequence: sequence.trim(), reason: reason.trim() };
  }

  function checkTranslationProcess(answer) {
    const text = normalizeTranslationText(answer);
    const recognized = [];
    const missing = [];
    const pitfalls = [];

    addCheck({ recognized, missing }, text.includes("proteinbiosynthese"), "Translation wird als Teil der Proteinbiosynthese eingeordnet.", "Ergänzen Sie, dass Translation ein Teilprozess der Proteinbiosynthese ist.");
    addCheck({ recognized, missing }, text.includes("mrna") && hasAnyText(text, ["aminosauresequenz", "aminosäuresequenz", "ubersetzt", "übersetzt"]), "mRNA wird als Grundlage einer Aminosäuresequenz beschrieben.", "Ergänzen Sie, dass die mRNA in eine Aminosäuresequenz übersetzt wird.");
    addCheck({ recognized, missing }, text.includes("ribosom") || text.includes("ribosomen") || text.includes("cytoplasma") || text.includes("zytoplasma"), "Ribosom bzw. Cytoplasma als Ort ist erkennbar.", "Ergänzen Sie, dass die Translation an Ribosomen stattfindet und die mRNA als Vorlage genutzt wird.");

    addCheck({ recognized, missing }, text.includes("mrna") && (text.includes("vorlage") || text.includes("abgelesen") || text.includes("liest")) && text.includes("ribosom"), "mRNA wird als Vorlage am Ribosom beschrieben.", "Ergänzen Sie, dass die mRNA am Ribosom abgelesen wird.");
    if (text.includes("dna") && text.includes("vorlage") && !text.includes("mrna")) {
      pitfalls.push("Prüfen Sie die Vorlage der Translation: Bei der Translation wird die mRNA am Ribosom abgelesen, nicht die DNA.");
    }

    const hasBasentriplett = text.includes("basentriplett");
    const hasTriplettOnly = !hasBasentriplett && text.includes("triplett");
    addCheck({ recognized, missing }, hasBasentriplett && text.includes("codon"), "Basentripletts auf der mRNA werden als Codons benannt.", hasTriplettOnly ? "Präzisieren Sie möglichst, dass es sich um ein Basentriplett handelt." : "Ergänzen Sie, dass die mRNA in Basentripletts gelesen wird und diese Basentripletts Codons heißen.");
    if (hasTriplettOnly) pitfalls.push("Präzisieren Sie möglichst, dass es sich um ein Basentriplett handelt.");

    addCheck({ recognized, missing }, text.includes("startcodon") || text.includes("aug") || text.includes("methionin"), "Startcodon AUG als Beginn der Translation ist erkennbar.", "Ergänzen Sie, dass die Translation am Startcodon AUG beginnt.");

    addCheck({ recognized, missing }, text.includes("trna") && (text.includes("aminosaure") || text.includes("aminosäure")) && (text.includes("anticodon") || text.includes("antikodon")) && text.includes("codon"), "tRNA, Anticodon und komplementäres Codon werden beschrieben.", "Ergänzen Sie die Rolle der tRNA: Sie bringt Aminosäuren zum Ribosom und besitzt ein Anticodon, das komplementär zum Codon der mRNA passt.");
    if (hasCodonAnticodonMixup(text)) {
      pitfalls.push("Prüfen Sie den Unterschied zwischen Codon und Anticodon: Das Codon liegt auf der mRNA, das Anticodon auf der tRNA.");
    }

    addCheck({ recognized, missing }, hasAnyText(text, ["aminosaurekette", "aminosäurekette", "polypeptidkette", "peptidkette"]) || (text.includes("aminosauren") && text.includes("verknupft")) || (text.includes("aminosäuren") && text.includes("verknüpft")), "Bildung einer Aminosäurekette bzw. Polypeptidkette ist erkennbar.", "Ergänzen Sie, dass die Aminosäuren zu einer Aminosäurekette bzw. Polypeptidkette verknüpft werden.");

    addCheck({ recognized, missing }, hasAnyText(text, ["ribosom bewegt sich", "wandert", "entlang der mrna", "schrittweise", "weiterliest"]), "Schrittweises Weiterlesen der mRNA wird beschrieben.", "Als Ergänzung können Sie beschreiben, dass das Ribosom die mRNA schrittweise weiterliest.");

    addCheck({ recognized, missing }, hasStopCodon(text) && (text.includes("beendet") || text.includes("ende") || text.includes("freigesetzt")), "Stoppcodon und Ende der Translation werden genannt.", "Ergänzen Sie, dass ein Stoppcodon die Translation beendet und die Aminosäurekette bzw. Polypeptidkette freigesetzt wird.");
    if (hasStopCodon(text) && (text.includes("codiert") || text.includes("steht fur") || text.includes("steht für")) && (text.includes("aminosaure") || text.includes("aminosäure")) && !text.includes("keine")) {
      pitfalls.push("Prüfen Sie die Funktion von Stoppcodons: Stoppcodons codieren nicht für eine Aminosäure, sondern beenden die Translation.");
    }

    if ((text.includes("mrna") && text.includes("dna") && hasAnyText(text, ["gebildet", "entsteht", "synthetisiert"])) || text.includes("rna polymerase") || text.includes("codogener strang") || text.includes("transkriptionsblase") || text.includes("dna strang als vorlage")) {
      pitfalls.push(text.includes("mrna") && text.includes("dna") && hasAnyText(text, ["gebildet", "entsteht", "synthetisiert"])
        ? "Achten Sie darauf, Transkription und Translation zu trennen: Bei der Transkription entsteht mRNA. Bei der Translation wird die mRNA am Ribosom in eine Aminosäurekette übersetzt."
        : "Prüfen Sie, ob Sie gerade Merkmale der Transkription beschreiben. Bei der Translation stehen mRNA, Ribosom, tRNA, Codon, Anticodon und Aminosäuren im Mittelpunkt.");
    }

    return {
      date: new Date().toISOString(),
      recognized,
      missing,
      pitfalls,
      summary: buildTranslationProcessSummary(recognized.length, missing.length, pitfalls.length),
      answerLength: answer.trim().length
    };
  }

  function normalizeTranslationText(value) {
    return normalizeText(value)
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .replace(/aminosaeure/g, "aminosaure")
      .trim();
  }

  function hasStopCodon(text) {
    return text.includes("stoppcodon") || text.includes("stopcodon") || text.includes("stopp codon") || text.includes("stop codon");
  }

  function hasCodonAnticodonMixup(text) {
    return (text.includes("codon") && text.includes("trna") && !text.includes("anticodon")) ||
      (text.includes("anticodon") && text.includes("mrna") && !text.includes("trna"));
  }

  function buildTranslationProcessSummary(recognizedCount, missingCount, pitfallCount) {
    if (recognizedCount >= 7 && missingCount <= 2 && pitfallCount === 0) {
      return "Mehrere zentrale Aspekte sind bereits erkennbar. Prüfen Sie nur noch, ob Start- und Stoppcodon präzise genug erklärt sind.";
    }
    if (recognizedCount >= 4) {
      return "Mehrere zentrale Aspekte sind bereits erkennbar. Prüfen Sie noch, ob Sie Startcodon, Codon/Anticodon und Stoppcodon genau genug erklärt haben.";
    }
    return "Einige Ansatzpunkte sind erkennbar. Ergänzen Sie noch die zentralen Schritte der Translation in einer klaren Reihenfolge.";
  }

  function checkTranscriptionError(answer) {
    const recognized = [];
    const missing = [];
    const pitfalls = [];
    const text = normalizeProcessText(answer);
    const seq = normalizeSequence(answer);

    addCheck({ recognized, missing }, hasAnyText(text, ["richtung", "falsch herum", "5 zu 3"]) || hasFiveToThree(text), "Die falsche Richtung der mRNA wird erkannt.", "Prüfen Sie, ob Sie die Richtung der angegebenen mRNA korrigiert haben.");
    addCheck({ recognized, missing }, hasCorrectMrnaBases(answer) && (seq.direction === "5to3" || hasFiveToThree(text)), "Die korrigierte mRNA-Sequenz wird angegeben.", "Geben Sie die korrigierte mRNA-Sequenz an: `5'-AUG CCU GAA UGG-3'`.");
    addCheck({ recognized, missing }, text.includes("uracil") && (hasAnyText(text, ["statt thymin", "kein thymin", "nicht thymin"]) || text.includes("u statt t")), "Uracil statt Thymin wird korrekt erklärt.", "Ergänzen Sie die Korrektur zur Base: RNA enthält Uracil statt Thymin.");
    addCheck({ recognized, missing }, hasAnyText(text, ["basenfolge", "sequenz"]) && hasAnyText(text, ["grundsatzlich", "grundsätzlich", "stimmt", "passt"]) && text.includes("richtung"), "Die Basenfolge wird differenziert beurteilt.", "Sie können noch ergänzen, dass die Basenfolge grundsätzlich passt, aber die Richtungsangabe falsch ist.");

    if (text.includes("rna enthalt thymin") || text.includes("mrna enthalt thymin") || text.includes("thymin statt uracil")) {
      pitfalls.push("Achten Sie auf die RNA-Basen: RNA enthält Uracil, nicht Thymin.");
    }
    if (normalizeSequence(answer).direction === "3to5" && hasCorrectMrnaBases(answer)) {
      pitfalls.push("Prüfen Sie die Richtungsangabe: Die mRNA sollte in 5'→3'-Richtung angegeben werden.");
    }

    return { date: new Date().toISOString(), recognized, missing, pitfalls, answerLength: answer.trim().length };
  }

  function normalizeSequence(value) {
    const raw = String(value || "").toUpperCase();
    const noNames = raw.replace(/THYMIN/g, "T").replace(/URACIL/g, "U");
    const bases = (noNames.match(/[AUGCT]/g) || []).join("").replace(/T/g, "T");
    const compact = noNames.replace(/\s+/g, "").replace(/[’´`]/g, "'");
    let direction = "none";
    if (/5'?[- ]*[AUGCU\s-]+[- ]*3'?/.test(compact)) direction = "5to3";
    if (/3'?[- ]*[AUGCU\s-]+[- ]*5'?/.test(compact)) direction = "3to5";
    return { bases: bases.replace(/[^AUGC]/g, ""), direction };
  }

  function hasCorrectMrnaBases(value) {
    return /A[^A-Z]*U[^A-Z]*G[^A-Z]*C[^A-Z]*C[^A-Z]*U[^A-Z]*G[^A-Z]*A[^A-Z]*A[^A-Z]*U[^A-Z]*G[^A-Z]*G/i.test(String(value || ""));
  }

  function containsThymine(value) {
    const text = normalizeText(value);
    return text.includes("thymin") || /\bt\b/i.test(String(value || ""));
  }

  function renderSequenceFeedback(container, result) {
    container.classList.remove("hidden");
    container.innerHTML = `
      <p class="notice">Dieser Check ersetzt keine Bewertung. Er zeigt dir nur, welche fachlichen Aspekte du noch einmal überprüfen solltest.</p>
      <h4>Das ist bereits erkennbar:</h4>
      ${renderList(result.recognized.length ? result.recognized : ["Noch kein zentraler Aspekt wurde sicher automatisch erkannt."])}
      <h4>Das solltest du noch prüfen oder ergänzen:</h4>
      ${renderList(result.missing.length ? result.missing : ["Der Check erkennt hier keine offenen Ergänzungen."])}
      ${result.pitfalls.length ? `<h4>Mögliche fachliche Stolperstellen:</h4>${renderList(result.pitfalls)}` : ""}
    `;
  }

  function renderSimpleCriterionFeedback(container, result) {
    container.classList.remove("hidden");
    container.innerHTML = `
      <p class="notice">Dieser Check ersetzt keine Bewertung. Er zeigt dir nur, welche fachlichen Aspekte du noch einmal überprüfen solltest.</p>
      <h4>Das ist bereits erkennbar:</h4>
      ${renderList(result.recognized.length ? result.recognized : ["Noch kein zentraler Aspekt wurde sicher automatisch erkannt."])}
      <h4>Das solltest du noch prüfen oder ergänzen:</h4>
      ${renderList(result.missing.length ? result.missing : ["Der Check erkennt hier keine offenen Ergänzungen."])}
      ${result.pitfalls.length ? `<h4>Mögliche fachliche Stolperstellen:</h4>${renderList(result.pitfalls)}` : ""}
    `;
  }

  function resetReveals(card) {
    card.querySelectorAll(".feedback, .hint-list, .expectation-box, .solution-box").forEach((box) => box.classList.add("hidden"));
    const hintButton = card.querySelector(".hint-button");
    if (hintButton) {
      hintButton.textContent = "Hilfe anzeigen";
      hintButton.disabled = false;
    }
  }

  function collectTranscriptionInputs(card, stored) {
    const next = {
      structures: { ...(stored.structures || {}) },
      functions: { ...(stored.functions || {}) }
    };
    card.querySelectorAll(".transcription-structure-input").forEach((input) => {
      next.structures[input.dataset.number] = input.value;
    });
    return next;
  }

  function checkTranscriptionStructure(inputs, items) {
    const rows = {};
    let structureCorrect = 0;
    let functionCorrect = 0;

    normalizeList(items).forEach((item) => {
      const number = String(item.number);
      const entered = (inputs.structures && inputs.structures[number]) || "";
      const assignedFunction = (inputs.functions && inputs.functions[number]) || "";
      const isStructureCorrect = normalizeList(item.accepted).some((accepted) => normalizeStructureTerm(entered) === normalizeStructureTerm(accepted));
      const isFunctionCorrect = assignedFunction === item.functionId;
      if (isStructureCorrect) {
        structureCorrect += 1;
      }
      if (isFunctionCorrect) {
        functionCorrect += 1;
      }
      rows[number] = {
        entered,
        assignedFunction,
        expectedStructure: item.structure,
        expectedFunction: item.functionId,
        structureCorrect: isStructureCorrect,
        functionCorrect: isFunctionCorrect
      };
    });

    const swappedCodogenic =
      normalizeStructureTerm((inputs.structures && inputs.structures["2"]) || "") === normalizeStructureTerm("codogener Strang") &&
      normalizeStructureTerm((inputs.structures && inputs.structures["3"]) || "") === normalizeStructureTerm("nicht codogener Strang");

    return {
      date: new Date().toISOString(),
      structureCorrect,
      functionCorrect,
      total: normalizeList(items).length,
      rows,
      swappedCodogenic,
      inputs
    };
  }

  function normalizeStructureTerm(value) {
    return normalizeText(value)
      .replace(/['’´`]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function renderTranscriptionFeedback(container, result) {
    container.classList.remove("hidden");
    const lines = Object.keys(result.rows).map((number) => {
      const row = result.rows[number];
      return `Nr. ${number}: Struktur ${row.structureCorrect ? "korrekt" : "noch prüfen"}, Funktion ${row.functionCorrect ? "korrekt" : "noch prüfen"}`;
    });
    container.innerHTML = `
      <p class="notice">Dieser Check ersetzt keine Bewertung. Er zeigt dir nur, welche fachlichen Aspekte du noch einmal überprüfen solltest.</p>
      <h4>Rückmeldung</h4>
      <p>Sie haben ${result.structureCorrect} von ${result.total} Strukturen korrekt benannt und ${result.functionCorrect} von ${result.total} Funktionen korrekt zugeordnet.</p>
      ${result.swappedCodogenic ? '<p class="warning-text">Prüfen Sie noch einmal den Unterschied zwischen codogenem und nicht-codogenem Strang: Der codogene Strang dient als Vorlage für die mRNA.</p>' : ""}
      ${renderList(lines)}
    `;
  }

  function renderTranscriptionSolution(container, items, functions) {
    container.classList.toggle("hidden");
    if (container.classList.contains("hidden")) {
      return;
    }
    const rows = normalizeList(items).map((item) => {
      const fn = normalizeList(functions).find((entry) => entry.id === item.functionId);
      return `
        <tr>
          <th scope="row">${escapeHtml(item.number)}</th>
          <td>${escapeHtml(item.structure)}</td>
          <td>${escapeHtml(fn ? fn.text : "")}</td>
        </tr>
      `;
    }).join("");
    container.innerHTML = `
      <h4>Musterlösung</h4>
      <div class="transcription-table-wrap">
        <table class="transcription-table solution-table">
          <thead><tr><th>Nummer</th><th>Struktur</th><th>Funktion</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  function renderFunctionCardText(functionId, functions) {
    const fn = normalizeList(functions).find((entry) => entry.id === functionId);
    if (!fn) {
      return `<span class="definition-card-inline">Funktion ausgewählt</span>`;
    }
    return `<span class="definition-card-inline">${escapeHtml(fn.text)}</span>`;
  }

  function orderCards(items, order) {
    const orderMap = new Map(order.map((id, index) => [id, index]));
    return [...normalizeList(items)].sort((a, b) => {
      const aIndex = orderMap.has(a.id) ? orderMap.get(a.id) : 99;
      const bIndex = orderMap.has(b.id) ? orderMap.get(b.id) : 99;
      return aIndex - bIndex;
    });
  }

  function renderCompareTableRows(tableValues) {
    const rows = [
      ["sugar", "Zucker"],
      ["bases", "Basen"],
      ["structure", "Strangstruktur"],
      ["function", "Funktion im Kontext der Proteinbiosynthese"]
    ];
    return rows.map(([key, label]) => `
      <tr>
        <th scope="row">${escapeHtml(label)}</th>
        <td><input class="compare-input table-input" data-table-row="${key}" data-table-col="dna" type="text" value="${escapeHtml((tableValues[key] && tableValues[key].dna) || "")}"></td>
        <td><input class="compare-input table-input" data-table-row="${key}" data-table-col="rna" type="text" value="${escapeHtml((tableValues[key] && tableValues[key].rna) || "")}"></td>
      </tr>
    `).join("");
  }

  function collectCompareInputs(card) {
    const inputs = defaultCompareInputs();
    card.querySelectorAll("[data-field]").forEach((field) => {
      inputs[field.dataset.field] = field.value;
    });
    card.querySelectorAll("[data-table-row][data-table-col]").forEach((field) => {
      const row = field.dataset.tableRow;
      const col = field.dataset.tableCol;
      inputs.table[row][col] = field.value;
    });
    return inputs;
  }

  function checkDnaRnaCompare(inputs) {
    const sections = {
      sugar: { recognized: [], missing: [] },
      difference: { recognized: [], missing: [] },
      table: { recognized: [], missing: [] }
    };

    const left = normalizeText(inputs.leftSugar).trim();
    const right = normalizeText(inputs.rightSugar).trim();
    const leftCorrect = left === "ribose";
    const rightCorrect = right === "desoxyribose" || right === "deoxyribose";

    if (leftCorrect && rightCorrect) {
      sections.sugar.recognized.push("Ribose und Desoxyribose wurden korrekt zugeordnet.");
    } else {
      if (leftCorrect) {
        sections.sugar.recognized.push("Der linke Zucker wurde als Ribose erkannt.");
      } else {
        sections.sugar.missing.push("Prüfen Sie den linken Zucker noch einmal. Dort ist an der 2'-Stelle eine OH-Gruppe zu erkennen.");
      }
      if (rightCorrect) {
        sections.sugar.recognized.push("Der rechte Zucker wurde als Desoxyribose erkannt.");
      } else {
        sections.sugar.missing.push("Prüfen Sie den rechten Zucker noch einmal. Dort befindet sich an der 2'-Stelle nur ein H-Atom.");
      }
    }

    const diff = normalizeText(inputs.difference);
    addCheck(sections.difference, hasSecondPosition(diff), "Die 2'-Stelle wird genannt.", "Prüfen Sie, ob Sie die 2'-Stelle ausdrücklich genannt haben.");
    addCheck(sections.difference, /\boh\b/.test(diff) || diff.includes("hydroxygruppe"), "Die OH-Gruppe der Ribose wird erwähnt.", "Ergänzen Sie, dass Ribose dort eine OH-Gruppe besitzt.");
    addCheck(sections.difference, diff.includes("h-atom") || diff.includes("wasserstoff"), "Das H-Atom bzw. Wasserstoff bei Desoxyribose wird erwähnt.", "Ergänzen Sie, dass bei Desoxyribose dort nur ein H-Atom vorhanden ist.");
    addCheck(sections.difference, hasMissingOxygen(diff), "Das fehlende Sauerstoffatom wird beschrieben.", "Ergänzen Sie, dass bei Desoxyribose dort ein Sauerstoffatom fehlt.");
    addCheck(sections.difference, diff.includes("desoxyribose") || diff.includes("deoxyribose"), "Desoxyribose wird ausdrücklich genannt.", "Prüfen Sie, ob Sie Desoxyribose ausdrücklich genannt haben.");

    const table = inputs.table;
    addCheck(sections.table, isDesoxyribose(table.sugar.dna), "DNA-Zucker: Desoxyribose.", "Prüfen Sie den Zucker der DNA: DNA enthält Desoxyribose.");
    addCheck(sections.table, isRibose(table.sugar.rna), "RNA-Zucker: Ribose.", "Prüfen Sie den Zucker der RNA: RNA enthält Ribose.");

    const dnaBases = checkBases(table.bases.dna, ["a", "t", "g", "c"], ["u"]);
    const rnaBases = checkBases(table.bases.rna, ["a", "u", "g", "c"], ["t"]);
    addCheck(sections.table, dnaBases.ok, "DNA-Basen: Adenin, Thymin, Guanin und Cytosin.", dnaBases.wrongForbidden ? "Prüfen Sie die Basen der DNA: In DNA kommt Thymin statt Uracil vor." : "Ergänzen Sie bei DNA alle vier Basen: Adenin, Thymin, Guanin und Cytosin.");
    addCheck(sections.table, rnaBases.ok, "RNA-Basen: Adenin, Uracil, Guanin und Cytosin.", rnaBases.wrongForbidden ? "Prüfen Sie die Basen der RNA: In RNA kommt Uracil statt Thymin vor." : "Ergänzen Sie bei RNA alle vier Basen: Adenin, Uracil, Guanin und Cytosin.");

    addCheck(sections.table, hasAny(table.structure.dna, ["doppelstrang", "doppelstraengig", "doppelsträngig", "zwei strang", "zwei sträng"]), "DNA-Strangstruktur: meist Doppelstrang.", "Prüfen Sie die Strangstruktur der DNA: Sie liegt meist als Doppelstrang vor.");
    addCheck(sections.table, hasAny(table.structure.rna, ["einzelstrang", "einzelstraengig", "einzelsträngig", "ein strang"]), "RNA-Strangstruktur: meist Einzelstrang.", "Prüfen Sie die Strangstruktur der RNA: Sie liegt meist als Einzelstrang vor.");

    addCheck(sections.table, hasDnaFunction(table.function.dna), "DNA-Funktion im Kontext der Proteinbiosynthese ist fachlich passend.", "Ergänzen Sie bei DNA, dass sie Erbinformation speichert oder als Vorlage für die Transkription dient.");
    addCheck(sections.table, hasRnaFunction(table.function.rna), "RNA-Funktion im Kontext der Proteinbiosynthese ist fachlich passend.", "Ergänzen Sie bei RNA/mRNA, dass sie Information überträgt, für die Translation nutzbar macht oder als Vorlage der Translation dient.");

    return {
      date: new Date().toISOString(),
      sections,
      inputs
    };
  }

  function addCheck(section, condition, recognizedText, missingText) {
    if (condition) {
      section.recognized.push(recognizedText);
    } else {
      section.missing.push(missingText);
    }
  }

  function hasSecondPosition(text) {
    return text.includes("2'") || text.includes("2-stelle") || text.includes("2. stelle") || text.includes("2.stelle") || text.includes("2 stelle");
  }

  function hasMissingOxygen(text) {
    return (text.includes("sauerstoff") && (text.includes("fehlt") || text.includes("fehlend"))) || text.includes("ohne sauerstoff");
  }

  function isDesoxyribose(value) {
    const text = normalizeText(value).trim();
    return text.includes("desoxyribose") || text.includes("deoxyribose");
  }

  function isRibose(value) {
    const text = normalizeText(value).trim();
    return text === "ribose" || /\bribose\b/.test(text);
  }

  function checkBases(value, required, forbidden) {
    const tokens = baseTokens(value);
    const ok = required.every((base) => tokens.has(base)) && !forbidden.some((base) => tokens.has(base));
    return {
      ok,
      wrongForbidden: forbidden.some((base) => tokens.has(base))
    };
  }

  function baseTokens(value) {
    const normalized = normalizeText(value)
      .replace(/cytosin/g, " c ")
      .replace(/adenin/g, " a ")
      .replace(/thymin/g, " t ")
      .replace(/uracil/g, " u ")
      .replace(/guanin/g, " g ");
    return new Set((normalized.match(/\b[a-z]\b/g) || []).filter((token) => ["a", "t", "g", "c", "u"].includes(token)));
  }

  function hasAny(value, patterns) {
    const text = normalizeText(value);
    return patterns.some((pattern) => text.includes(normalizeText(pattern)));
  }

  function hasDnaFunction(value) {
    const text = normalizeText(value);
    return text.includes("erbinformation") || text.includes("genetische information") || text.includes("vorlage") || text.includes("transkription") || text.includes("speichert");
  }

  function hasRnaFunction(value) {
    const text = normalizeText(value);
    return text.includes("mrna") || text.includes("translation") || text.includes("ribosom") || text.includes("ubertragt") || text.includes("überträgt") || text.includes("nutzt") || text.includes("protein");
  }

  function renderCompareFeedback(container, result) {
    container.classList.remove("hidden");
    container.innerHTML = `
      <p class="notice">Dieser Check ersetzt keine Bewertung. Er zeigt dir nur, welche fachlichen Aspekte du noch einmal überprüfen solltest.</p>
      ${renderFeedbackSection("Abschnitt A: Zucker benennen", result.sections.sugar)}
      ${renderFeedbackSection("Abschnitt B: Unterschied erläutern", result.sections.difference)}
      ${renderFeedbackSection("Abschnitt C: Vergleichstabelle", result.sections.table)}
    `;
  }

  function renderFeedbackSection(title, section) {
    return `
      <div class="feedback-section">
        <h4>${escapeHtml(title)}</h4>
        <strong>Das ist bereits erkennbar:</strong>
        ${renderList(section.recognized.length ? section.recognized : ["Noch kein Aspekt wurde hier sicher automatisch erkannt."])}
        <strong>Das solltest du noch prüfen oder ergänzen:</strong>
        ${renderList(section.missing.length ? section.missing : ["Für diesen Abschnitt erkennt der Check keine offenen Hinweise."])}
      </div>
    `;
  }

  function renderCompareSolution(container, solution) {
    container.classList.toggle("hidden");
    if (container.classList.contains("hidden")) {
      return;
    }
    const rows = normalizeList(solution && solution.table).map((row) => `
      <tr>
        <th scope="row">${escapeHtml(row.feature)}</th>
        <td>${escapeHtml(row.dna)}</td>
        <td>${escapeHtml(row.rna)}</td>
      </tr>
    `).join("");
    container.innerHTML = `
      <h4>Musterlösung</h4>
      <p><strong>Linker Zucker:</strong> ${escapeHtml(solution.sugars.left)}</p>
      <p><strong>Rechter Zucker:</strong> ${escapeHtml(solution.sugars.right)}</p>
      <p>${escapeHtml(solution.difference)}</p>
      <div class="compare-table-wrap">
        <table class="compare-table solution-table">
          <thead><tr><th>Merkmal</th><th>DNA</th><th>RNA</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  function checkAnswer(answer, criteria) {
    const normalizedAnswer = normalizeText(answer);
    const recognized = [];
    const missing = [];
    const selfChecks = [];

    criteria.forEach((criterion) => {
      const keywords = normalizeList(criterion.keywords || criterion.terms || criterion.keyword);
      if (!keywords.length) {
        selfChecks.push(`Prüfe selbst: ${criterion.question || criterion.label || criterion.text || "Ist dieser fachliche Aspekt in deiner Antwort erklärt?"}`);
        return;
      }

      const found = keywords.every((keyword) => normalizedAnswer.includes(normalizeText(keyword)));
      if (found) {
        recognized.push(criterion.label || criterion.text || `Aspekt mit ${keywords.join(", ")}`);
      } else {
        missing.push(criterion.label || criterion.text || `Prüfe die Begriffe: ${keywords.join(", ")}`);
      }
    });

    if (!criteria.length) {
      selfChecks.push("Prüfe selbst: Sind die zentralen Fachbegriffe genannt und in einem zusammenhängenden Satz erklärt?");
      selfChecks.push("Prüfe selbst: Bezieht sich deine Antwort erkennbar auf das Material?");
    }

    return {
      date: new Date().toISOString(),
      recognized,
      missing,
      selfChecks,
      answerLength: answer.trim().length
    };
  }

  function renderFeedback(container, result) {
    container.classList.remove("hidden");
    container.innerHTML = `
      <p class="notice">Dieser Check ersetzt keine Bewertung. Er zeigt dir nur, welche fachlichen Aspekte du noch einmal überprüfen solltest.</p>
      <h4>Das ist bereits erkennbar</h4>
      ${renderList(result.recognized.length ? result.recognized : ["Noch kein Kriterium wurde sicher automatisch erkannt. Das kann auch an Formulierungen liegen."])}
      <h4>Das solltest du noch prüfen oder ergänzen</h4>
      ${renderList([...(result.missing || []), ...(result.selfChecks || [])])}
    `;
  }

  function createDraggableChip(value, selectedValue, onClick) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "drag-chip";
    chip.draggable = true;
    chip.dataset.value = value;
    chip.textContent = value;
    chip.classList.toggle("is-selected", value === selectedValue);
    chip.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", value);
      event.dataTransfer.effectAllowed = "move";
    });
    chip.addEventListener("click", onClick);
    return chip;
  }

  function assignValue(assignments, targetId, value) {
    removeAssignedValue(assignments, value);
    assignments[targetId] = value;
  }

  function removeAssignedValue(assignments, value) {
    Object.keys(assignments).forEach((key) => {
      if (assignments[key] === value) {
        delete assignments[key];
      }
    });
  }

  function evaluateAssignments(assignments, correctAssignments) {
    const correctItems = [];
    const incorrectItems = [];
    Object.keys(correctAssignments).forEach((key) => {
      if (assignments[key] === correctAssignments[key]) {
        correctItems.push(key);
      } else {
        incorrectItems.push(key);
      }
    });
    return {
      date: new Date().toISOString(),
      correct: correctItems.length,
      total: Object.keys(correctAssignments).length,
      correctItems,
      incorrectItems,
      assignments: { ...assignments }
    };
  }

  function renderAssignmentFeedback(container, result, total, label) {
    container.classList.remove("hidden");
    container.innerHTML = `
      <p class="notice">Dieser Check ersetzt keine Bewertung. Er zeigt dir nur, welche Zuordnungen du noch einmal überprüfen solltest.</p>
      <h4>Rückmeldung</h4>
      <p>Du hast ${result.correct} von ${total} ${escapeHtml(label)} korrekt zugeordnet.</p>
    `;
  }

  function renderNumberLabelFeedback(container, result, correctAssignments) {
    container.classList.remove("hidden");
    const correctLines = result.correctItems.map((number) => `Nr. ${number}: ${correctAssignments[number]} ist korrekt zugeordnet.`);
    const missingLines = result.incorrectItems.map((number) => `Nr. ${number}: Prüfen Sie diese Zuordnung noch einmal.`);
    const focusHint =
      result.incorrectItems.includes("1") || result.incorrectItems.includes("2") || result.incorrectItems.includes("7")
        ? "<p>Prüfen Sie besonders die Unterscheidung zwischen Leitstrang und Folgestrang sowie die Funktion der Ligase.</p>"
        : "";
    container.innerHTML = `
      <p class="notice">Dieser Check ersetzt keine Bewertung. Er zeigt dir nur, welche Zuordnungen du noch einmal überprüfen solltest.</p>
      <h4>Rückmeldung</h4>
      <p>Mehrere Strukturen wurden korrekt zugeordnet, wenn sie unten unter „korrekt“ erscheinen.</p>
      <div class="feedback-section"><h4>Korrekt zugeordnet</h4>${renderList(correctLines.length ? correctLines : ["Noch keine Zuordnung wurde sicher erkannt."])}</div>
      <div class="feedback-section"><h4>Noch prüfen</h4>${renderList(missingLines.length ? missingLines : ["Alle Zuordnungen wurden passend erkannt."])}</div>
      ${focusHint}
    `;
  }

  function renderDefinitionCardText(definitionId, definitions) {
    const definition = definitions.find((item) => item.id === definitionId);
    if (!definition) {
      return `<span class="placed-chip">${escapeHtml(definitionId)}</span>`;
    }
    return `<span class="definition-card-inline">${escapeHtml(definition.text)}</span>`;
  }

  function renderHints(container, hints) {
    container.classList.remove("hidden");
    container.innerHTML = `<h4>Hilfen</h4>${renderOrderedList(hints)}`;
  }

  function toggleReveal(container, title, content) {
    container.classList.toggle("hidden");
    if (container.classList.contains("hidden")) {
      return;
    }
    const body = Array.isArray(content) ? renderList(content) : `<p>${escapeHtml(content)}</p>`;
    container.innerHTML = `<h4>${escapeHtml(title)}</h4>${body}`;
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} beim Laden von ${url}`);
    }
    return response.json();
  }

  function normalizeTasks(data) {
    if (Array.isArray(data)) {
      return data;
    }
    if (Array.isArray(data.tasks)) {
      return data.tasks;
    }
    return data && typeof data === "object" ? [data] : [];
  }

  function normalizeSubtasks(task) {
    return normalizeList(task.subtasks || task.parts || task.questions).map((item, index) => {
      if (typeof item === "string") {
        return { id: `${task.id || "aufgabe"}_${index + 1}`, task: item };
      }
      return item || {};
    });
  }

  function normalizeCriteria(criteria) {
    return normalizeList(criteria).map((criterion) => {
      if (typeof criterion === "string") {
        return { label: criterion, question: `Hast du ${criterion} berücksichtigt?` };
      }
      return criterion || {};
    });
  }

  function normalizeList(value) {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value;
    }
    return [value];
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ß/g, "ss");
  }

  function answerKey(taskId, subtaskId) {
    return `${STORAGE_PREFIX}_answer_${taskId}_${subtaskId}`;
  }

  function assignmentKey(taskId, subtaskId) {
    return `${STORAGE_PREFIX}_assignment_${taskId}_${subtaskId}`;
  }

  function compareKey(taskId, subtaskId) {
    return `${STORAGE_PREFIX}_compare_${taskId}_${subtaskId}`;
  }

  function transcriptionKey(taskId, subtaskId) {
    return `${STORAGE_PREFIX}_transcription_${taskId}_${subtaskId}`;
  }

  function phaseKey(taskId, subtaskId) {
    return `${STORAGE_PREFIX}_phases_${taskId}_${subtaskId}`;
  }

  function sequenceKey(taskId, subtaskId) {
    return `${STORAGE_PREFIX}_sequence_${taskId}_${subtaskId}`;
  }

  function aminoSequenceKey(taskId, subtaskId) {
    return `${STORAGE_PREFIX}_amino_sequence_${taskId}_${subtaskId}`;
  }

  function translationKey(taskId, subtaskId) {
    return `${STORAGE_PREFIX}_translation_${taskId}_${subtaskId}`;
  }

  function assessmentKey(taskId, subtaskId) {
    return `${STORAGE_PREFIX}_assessment_${taskId}_${subtaskId}`;
  }

  function checkKey(taskId, subtaskId) {
    return `${taskId}_${subtaskId}`;
  }

  function getOrCreateAnonymousId() {
    const key = `${STORAGE_PREFIX}_anonymous_id`;
    const existing = localStorage.getItem(key);
    if (existing) {
      return existing;
    }
    const id = `anon-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
    localStorage.setItem(key, id);
    return id;
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function showTaskMessage(message) {
    elements.taskContainer.innerHTML = "";
    const box = document.getElementById("messageTemplate").content.cloneNode(true);
    box.querySelector(".message-box").textContent = message;
    elements.taskContainer.append(box);
  }

  function createHeading(level, text) {
    const heading = document.createElement(level);
    heading.textContent = text;
    return heading;
  }

  function createCell(type, text) {
    const cell = document.createElement(type);
    cell.textContent = text == null ? "" : text;
    return cell;
  }

  function renderList(items) {
    return `<ul>${normalizeList(items).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function renderOrderedList(items) {
    return `<ol>${normalizeList(items).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }
    return String(value).replace(/"/g, '\\"');
  }
})();
