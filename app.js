(() => {
  'use strict';
  const KEY = 'kaytlin-garden-v1';
  const fresh = () => ({ tasks: [], goals: [], checkins: [], note: '' });
  const read = () => {
    try { return { ...fresh(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
    catch { return fresh(); }
  };
  let data = read();
  let taskFilter = 'all';
  let chosenMood = '';
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* Browser storage may be unavailable. */ } };
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const todayKey = () => new Date().toLocaleDateString('en-CA');
  const dateLabel = value => new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const tasksForToday = () => data.tasks.filter(item => item.date === todayKey());
  const renderTasks = () => {
    const today = tasksForToday();
    const todayList = document.getElementById('today-task-list');
    const fullList = document.getElementById('all-task-list');
    const count = document.getElementById('task-count');
    const total = document.getElementById('tasks-total-label');
    if (!todayList && !fullList) return;
    const row = item => `<div class="task-row ${item.done ? 'done' : ''}"><button type="button" class="task-check" data-toggle-task="${esc(item.id)}" aria-label="${item.done ? 'Mark incomplete' : 'Complete'}: ${esc(item.text)}">${item.done ? '✓' : ''}</button><span class="task-text">${esc(item.text)}</span><button type="button" class="task-delete" data-delete-task="${esc(item.id)}" aria-label="Delete task: ${esc(item.text)}">×</button></div>`;
    if (todayList) todayList.innerHTML = today.slice(0, 4).map(row).join('') || '<p class="empty-note">Your little list is waiting for you.</p>';
    if (fullList) {
      const visible = data.tasks.filter(item => taskFilter === 'all' || (taskFilter === 'open' && !item.done) || (taskFilter === 'done' && item.done));
      fullList.innerHTML = visible.map(row).join('');
      const empty = document.getElementById('task-empty');
      if (empty) empty.hidden = visible.length > 0;
    }
    if (count) count.textContent = String(today.filter(item => !item.done).length);
    if (total) total.textContent = `${data.tasks.length} ${data.tasks.length === 1 ? 'thing' : 'things'} on your list`;
  };
  const goalProgress = goal => goal.steps.length ? Math.round(goal.steps.filter(step => step.done).length / goal.steps.length * 100) : 0;
  const renderGoals = () => {
    const list = document.getElementById('goal-list');
    const empty = document.getElementById('goal-empty');
    if (!list) return;
    if (empty) empty.hidden = data.goals.length > 0;
    list.innerHTML = data.goals.map(goal => {
      const progress = goalProgress(goal);
      const steps = goal.steps.map(step => `<li class="${step.done ? 'done' : ''}"><button type="button" class="step-toggle" data-toggle-step="${esc(goal.id)}:${esc(step.id)}" aria-label="${step.done ? 'Reopen' : 'Complete'} step: ${esc(step.text)}">${step.done ? '✓' : ''}</button><span class="step-label">${esc(step.text)}</span><button type="button" class="step-remove" data-delete-step="${esc(goal.id)}:${esc(step.id)}" aria-label="Remove step">×</button></li>`).join('');
      return `<article class="goal-item"><div class="goal-item-head"><div class="goal-name">${esc(goal.title)}</div><button type="button" class="goal-delete" data-delete-goal="${esc(goal.id)}" aria-label="Delete goal: ${esc(goal.title)}">×</button></div><div class="goal-progress-row"><div class="progress-track" aria-label="${progress}% complete"><div class="progress-fill" style="width:${progress}%"></div></div><span>${progress}%</span></div><ul class="steps-list">${steps}</ul><form class="goal-step-form" data-goal-form="${esc(goal.id)}"><label class="sr-only">Add a small step</label><input name="step" maxlength="90" placeholder="Add a small step..."><button aria-label="Add step">＋</button></form></article>`;
    }).join('');
  };
  const renderCheckins = () => {
    const history = document.getElementById('checkin-history');
    const preview = document.getElementById('today-checkin-preview');
    const today = data.checkins.find(item => item.date === todayKey());
    if (preview) preview.innerHTML = today ? `<p class="saved-preview"><strong>${esc(today.mood)}</strong>${today.note ? ` — ${esc(today.note)}` : ''}</p>` : '<p class="empty-note">Your reflections will find a home here.</p>';
    if (history) history.innerHTML = data.checkins.length ? data.checkins.slice(0, 12).map(item => `<article class="history-entry"><div class="history-entry-head"><strong>${esc(item.mood)}</strong><span>${esc(dateLabel(item.date))}</span></div>${item.note ? `<p>${esc(item.note)}</p>` : ''}</article>`).join('') : '<p class="empty-note">Your check-ins will gather here, one day at a time.</p>';
    const textarea = document.getElementById('checkin-note');
    const label = document.getElementById('checkin-saved-label');
    if (textarea && !textarea.dataset.edited) textarea.value = today?.note || '';
    if (label && today) label.textContent = `Saved for today · ${today.mood}`;
    if (today) document.querySelectorAll('.mood-choice').forEach(button => button.classList.toggle('selected', button.dataset.mood === today.mood));
  };
  const renderTodayGoal = () => {
    const target = document.getElementById('today-goal-preview');
    if (!target) return;
    const goal = data.goals[0];
    target.innerHTML = goal ? `<div class="goal-preview"><div class="goal-preview-title">${esc(goal.title)}</div><div class="progress-track"><div class="progress-fill" style="width:${goalProgress(goal)}%"></div></div><div class="progress-meta"><span>${goal.steps.filter(step => step.done).length} of ${goal.steps.length} little steps</span><span>${goalProgress(goal)}%</span></div></div>` : '<p class="empty-note">Plant a goal when something calls to you.</p>';
  };
  const render = () => { renderTasks(); renderGoals(); renderCheckins(); renderTodayGoal(); };
  const makeId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

  const now = new Date();
  const date = document.getElementById('today-date');
  if (date) date.textContent = now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
  const day = document.getElementById('day-number');
  const month = document.getElementById('month-name');
  if (day) day.textContent = String(now.getDate()).padStart(2, '0');
  if (month) month.textContent = now.toLocaleDateString('en-US', { month:'short' }).toUpperCase();

  const showView = (name, updateHash = true) => {
    const target = document.querySelector(`[data-section="${CSS.escape(name)}"]`);
    if (!target) return;
    document.querySelectorAll('.dash-view').forEach(view => view.classList.toggle('is-visible', view === target));
    document.querySelectorAll('.nav-item').forEach(link => link.classList.toggle('active', link.dataset.view === name));
    const select = document.getElementById('mobile-view');
    if (select) select.value = name;
    if (updateHash && location.hash !== `#${name}`) history.replaceState(null, '', `#${name}`);
    window.scrollTo({ top:0, behavior:'smooth' });
  };
  if (document.querySelector('.workbench-layout')) {
    document.querySelectorAll('[data-view]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); showView(link.dataset.view); }));
    document.querySelectorAll('[data-jump]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); showView(link.dataset.jump); }));
    document.getElementById('mobile-view')?.addEventListener('change', event => showView(event.target.value));
    const initial = location.hash.slice(1);
    showView(['today','tasks','goals','checkin','notes'].includes(initial) ? initial : 'today', false);
    window.addEventListener('hashchange', () => showView(location.hash.slice(1), false));
  }

  const addTask = input => {
    const text = input.value.trim(); if (!text) return;
    data.tasks.unshift({ id:makeId(), text, done:false, date:todayKey() }); input.value=''; save(); renderTasks();
  };
  document.getElementById('quick-task-form')?.addEventListener('submit', event => { event.preventDefault(); addTask(document.getElementById('quick-task-input')); });
  document.getElementById('task-form')?.addEventListener('submit', event => { event.preventDefault(); addTask(document.getElementById('task-input')); });
  document.querySelectorAll('.filter-tab').forEach(button => button.addEventListener('click', () => { taskFilter=button.dataset.filter; document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.toggle('active', tab===button)); renderTasks(); }));
  document.addEventListener('click', event => {
    const toggle = event.target.closest('[data-toggle-task]');
    const remove = event.target.closest('[data-delete-task]');
    if (toggle) { const item=data.tasks.find(task => task.id===toggle.dataset.toggleTask); if (item) item.done=!item.done; save(); renderTasks(); }
    if (remove) { data.tasks=data.tasks.filter(task => task.id!==remove.dataset.deleteTask); save(); renderTasks(); }
    const stepToggle=event.target.closest('[data-toggle-step]');
    if (stepToggle) { const [goalId,stepId]=stepToggle.dataset.toggleStep.split(':'); const goal=data.goals.find(item=>item.id===goalId); const step=goal?.steps.find(item=>item.id===stepId); if(step) step.done=!step.done; save(); renderGoals(); renderTodayGoal(); }
    const stepRemove=event.target.closest('[data-delete-step]');
    if (stepRemove) { const [goalId,stepId]=stepRemove.dataset.deleteStep.split(':'); const goal=data.goals.find(item=>item.id===goalId); if(goal) goal.steps=goal.steps.filter(item=>item.id!==stepId); save(); renderGoals(); renderTodayGoal(); }
    const goalRemove=event.target.closest('[data-delete-goal]');
    if (goalRemove) { data.goals=data.goals.filter(item=>item.id!==goalRemove.dataset.deleteGoal); save(); renderGoals(); renderTodayGoal(); }
  });

  document.getElementById('goal-form')?.addEventListener('submit', event => {
    event.preventDefault(); const input=document.getElementById('goal-input'); const title=input.value.trim(); if(!title)return;
    data.goals.unshift({id:makeId(),title,steps:[]}); input.value=''; save(); renderGoals(); renderTodayGoal();
  });
  document.addEventListener('submit', event => {
    const form=event.target.closest('[data-goal-form]'); if(!form)return; event.preventDefault();
    const input=form.elements.step; const text=input.value.trim(); if(!text)return;
    const goal=data.goals.find(item=>item.id===form.dataset.goalForm); if(goal)goal.steps.push({id:makeId(),text,done:false}); save(); renderGoals(); renderTodayGoal();
  });
  document.querySelectorAll('.mood-choice').forEach(button => button.addEventListener('click', () => {
    chosenMood=button.dataset.mood; document.querySelectorAll('.mood-choice').forEach(choice=>choice.classList.toggle('selected',choice===button));
  }));
  const checkinText=document.getElementById('checkin-note');
  checkinText?.addEventListener('input',()=>{ checkinText.dataset.edited='true'; });
  document.getElementById('save-checkin')?.addEventListener('click', () => {
    const input=document.getElementById('checkin-note'); const label=document.getElementById('checkin-saved-label');
    const previous=data.checkins.find(item=>item.date===todayKey()); const mood=chosenMood||previous?.mood;
    if(!mood){ if(label)label.textContent='Choose a feeling first, then save your moment.'; return; }
    const item={date:todayKey(),mood,note:input?.value.trim()||''};
    data.checkins=data.checkins.filter(entry=>entry.date!==item.date); data.checkins.unshift(item); data.checkins.sort((a,b)=>b.date.localeCompare(a.date));
    if(input)delete input.dataset.edited; chosenMood=mood; save(); renderCheckins();
  });
  const notes=document.getElementById('notes-editor');
  const wordCount=document.getElementById('notes-word-count');
  const status=document.getElementById('notes-save-status');
  if(notes){
    notes.value=data.note||'';
    const countWords=()=>{const count=notes.value.trim()?notes.value.trim().split(/\s+/).length:0;if(wordCount)wordCount.textContent=`${count} ${count===1?'word':'words'}`;};
    countWords(); let saveTimer;
    notes.addEventListener('input',()=>{data.note=notes.value;save();countWords();if(status){status.textContent='Saving…';clearTimeout(saveTimer);saveTimer=setTimeout(()=>status.textContent='Saved in this browser',350);}});
  }

  document.querySelector('.menu-toggle')?.addEventListener('click', event => {
    const button=event.currentTarget; const nav=document.querySelector('.top-nav'); const open=button.getAttribute('aria-expanded')!=='true';
    button.setAttribute('aria-expanded',String(open)); button.setAttribute('aria-label',open?'Close navigation':'Open navigation'); nav?.classList.toggle('open',open);
  });
  document.querySelectorAll('.top-nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelector('.top-nav')?.classList.remove('open');document.querySelector('.menu-toggle')?.setAttribute('aria-expanded','false');}));
  render();
})();