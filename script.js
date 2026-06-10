(function () {
  "use strict";

  const TASKS_URL = "data/tasks.json";
  const CREDITS_URL = "data/imageCredits.json";
  const STORAGE_PREFIX = "klausurtrainer_molekulargenetik";

  const topics = [
    { title: "DNA-Aufbau", active: true, taskId: "dna_aufbau_01" },
    { title: "DNA-Replikation", active: false },
    { title: "Transkription", active: false },
    { title: "Translation", active: false },
    { title: "Mutationen", active: false },
    { title: "Gemischte Klausuraufgaben", active: false }
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
        "Nukleotide sind über Phosphodiesterbindungen zu einem DNA-Strang verknüpft.",
        "Zucker und Phosphat bilden das außenliegende Phosphat-Zucker-Rückgrat.",
        "Die Basen ragen nach innen und tragen die genetische Information in ihrer Reihenfolge."
      ],
      solution:
        "Die DNA ist aus vielen Nukleotiden aufgebaut. Jedes Nukleotid besteht aus einer Phosphatgruppe, dem Zucker Desoxyribose und einer Base. Die Nukleotide werden über Phosphodiesterbindungen zwischen Zucker und Phosphat miteinander verbunden. Dadurch entsteht ein stabiler DNA-Strang mit einem Phosphat-Zucker-Rückgrat, während die Basen nach innen zeigen und die Reihenfolge der Erbinformation bilden.",
      criteria: [
        { label: "Nukleotid aus Phosphat, Desoxyribose und Base", keywords: ["phosphat", "desoxyribose", "base"] },
        { label: "Verknüpfung der Nukleotide über Zucker und Phosphat", keywords: ["zucker", "phosphat", "verknüpf"] },
        { label: "Phosphat-Zucker-Rückgrat wird erklärt", keywords: ["rückgrat", "phosphat", "zucker"] },
        { label: "Basen als Träger der Information werden benannt", keywords: ["base", "information"] }
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
    currentTask: null,
    checks: readJson(`${STORAGE_PREFIX}_checks`, {}),
    anonymousId: getOrCreateAnonymousId()
  };

  const elements = {
    homeView: document.getElementById("homeView"),
    taskView: document.getElementById("taskView"),
    topicGrid: document.getElementById("topicGrid"),
    taskContainer: document.getElementById("taskContainer"),
    backHomeButton: document.getElementById("backHomeButton"),
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
    elements.exportButton.addEventListener("click", exportResults);
    elements.navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.viewTarget === "task") {
          openTask("dna_aufbau_01");
        } else {
          showView("home");
        }
      });
    });
  }

  function renderTopics() {
    elements.topicGrid.innerHTML = "";
    topics.forEach((topic) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "topic-card";
      card.disabled = !topic.active;
      card.innerHTML = `
        <span class="topic-title">${escapeHtml(topic.title)}</span>
        <span class="topic-state">${topic.active ? "Aufgabe öffnen" : "kommt später"}</span>
      `;
      if (topic.active) {
        card.addEventListener("click", () => openTask(topic.taskId));
      }
      elements.topicGrid.append(card);
    });
  }

  async function openTask(preferredId) {
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
    renderTask(task);
    showView("task");
  }

  function showView(viewName) {
    const isTask = viewName === "task";
    elements.homeView.classList.toggle("active", !isTask);
    elements.taskView.classList.toggle("active", isTask);
    elements.navButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.viewTarget === viewName);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        ${task.difficulty ? `<span class="meta-pill">Schwierigkeit: ${escapeHtml(task.difficulty)}</span>` : ""}
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

  function exportResults() {
    const task = state.currentTask || state.tasks[0];
    if (!task) {
      showTaskMessage("Es gibt noch keine geladene Aufgabe für den Export.");
      return;
    }

    const subtasks = normalizeSubtasks(task).map((subtask, index) => {
      const subtaskId = subtask.id || `${task.id || "aufgabe"}_${index + 1}`;
      return {
        id: subtaskId,
        title: subtask.title || `Teilaufgabe ${index + 1}`,
        operator: subtask.operator || "",
        answer: localStorage.getItem(answerKey(task.id, subtaskId)) || "",
        checkResult: state.checks[checkKey(task.id, subtaskId)] || null,
        selfAssessment: localStorage.getItem(assessmentKey(task.id, subtaskId)) || ""
      };
    });

    const exportData = {
      anonymousId: state.anonymousId,
      date: new Date().toISOString(),
      task: {
        id: task.id || "",
        title: task.title || "",
        topic: task.topic || "",
        difficulty: task.difficulty || ""
      },
      subtasks
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `molekulargenetik-export-${state.anonymousId}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
})();
