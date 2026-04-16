import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Calendar,
  Sparkles,
  TrendingUp,
  Target
} from 'lucide-react';
import './index.css'; // Make sure we use index.css

const DailyPlanner = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('dailyPlannerTasks');
    const lastReset = localStorage.getItem('dailyPlannerLastReset');
    const todayStr = new Date().toDateString();
    
    let parsedTasks = savedTasks ? JSON.parse(savedTasks) : [
      { id: 1, text: 'Plan out the day', completed: false, category: 'Productivity' },
      { id: 2, text: 'Review project goals', completed: false, category: 'Work' }
    ];

    if (lastReset !== todayStr) {
      // New day: delete completed tasks to start fresh
      parsedTasks = parsedTasks.filter(t => !t.completed);
      localStorage.setItem('dailyPlannerLastReset', todayStr);
      localStorage.setItem('dailyPlannerTasks', JSON.stringify(parsedTasks));
    }

    return parsedTasks;
  });
  
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Productivity');

  const categories = ['Productivity', 'Work', 'Health', 'Personal', 'Learning'];

  useEffect(() => {
    localStorage.setItem('dailyPlannerTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
      category: selectedCategory
    };

    setTasks([newTask, ...tasks]);
    setNewTaskText('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '2rem' }}>
      <header style={{ maxWidth: '800px', margin: '0 auto', width: '100%', marginBottom: '2rem' }}>
        <div className="glass-panel animate-fade-in header-content" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={32} color="#3B82F6" />
              Ascend
            </h1>
            <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <Calendar size={18} />
              {today}
            </p>
          </div>
          <div className="progress-container" style={{ textAlign: 'right' }}>
            <div className="progress-text-row" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
              <TrendingUp size={20} color={progressPercent === 100 ? 'var(--success-color)' : 'var(--accent-primary)'} />
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{progressPercent}% Complete</span>
            </div>
            <div className="progress-bar" style={{ width: '150px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                className="progress-fill"
                style={{ 
                  width: `${progressPercent}%`, 
                  height: '100%', 
                  background: progressPercent === 100 ? 'var(--success-color)' : 'var(--accent-gradient)',
                  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Add Task Form */}
        <section className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s', padding: '1.5rem' }}>
          <form onSubmit={addTask} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="What needs to be done today?" 
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              style={{ flex: '1', minWidth: '250px' }}
            />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ 
                padding: '0.75rem 1rem', 
                background: 'rgba(15, 23, 42, 0.5)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '8px',
                color: 'white',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button type="submit" style={{ background: 'var(--accent-primary)', color: 'white' }}>
              <Plus size={20} />
              Add Task
            </button>
          </form>
        </section>

        {/* Task List */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={24} color="var(--accent-primary)" />
              Today's Plan
            </h2>
            <span style={{ color: 'var(--text-secondary)' }}>
              {completedCount} / {totalCount} tasks
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Target size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <p>Your day is a blank canvas. Start planning!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tasks.map((task, idx) => (
                <div 
                  key={task.id} 
                  className="glass-panel task-item"
                  style={{ 
                    padding: '1rem 1.5rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    transition: 'all 0.2s ease',
                    borderLeft: task.completed ? '4px solid var(--success-color)' : '4px solid var(--accent-primary)',
                    animationDelay: `${0.1 * (idx % 5)}s`,
                    opacity: task.completed ? 0.7 : 1
                  }}
                >
                  <button 
                    onClick={() => toggleTask(task.id)}
                    style={{ 
                      padding: 0, 
                      background: 'none', 
                      color: task.completed ? 'var(--success-color)' : 'var(--text-secondary)',
                      border: 'none',
                      flexShrink: 0
                    }}
                  >
                    {task.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                  </button>
                  
                  <div style={{ flex: 1, minWidth: '150px', textDecoration: task.completed ? 'line-through' : 'none' }}>
                    <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{task.text}</p>
                  </div>

                  <span className="task-category" style={{ 
                    fontSize: '0.8rem', 
                    padding: '0.25rem 0.75rem', 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: '999px',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap'
                  }}>
                    {task.category}
                  </span>

                  <button 
                    onClick={() => deleteTask(task.id)}
                    style={{ padding: '0.5rem', background: 'none', color: 'var(--danger-color)', opacity: 0.7, flexShrink: 0 }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default DailyPlanner;
