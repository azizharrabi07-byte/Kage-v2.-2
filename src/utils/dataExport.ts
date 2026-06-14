import type { WorkoutSession, NutritionLog, ExercisePR } from '../types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function exportWorkoutsCSV(workouts: WorkoutSession[]): string {
  const header = 'Date,Program,Duration (s),Verified,Exercise,Set,Reps,Weight (kg),Timestamp';
  const rows = workouts.flatMap(w =>
    w.exercises.flatMap(ex =>
      ex.sets.map((s, i) =>
        [formatDate(w.date), w.programName, w.duration, w.verified, ex.name, i + 1, s.reps, s.weight, new Date(s.timestamp).toLocaleString()].join(',')
      )
    )
  );
  return [header, ...rows].join('\n');
}

export function exportNutritionCSV(meals: NutritionLog[]): string {
  const header = 'Date,Time,Meal Type,Name,Calories,Protein (g),Carbs (g),Fat (g)';
  const rows = meals.map(m =>
    [m.date, m.time, m.mealType, m.name, m.calories, m.protein, m.carbs, m.fat].join(',')
  );
  return [header, ...rows].join('\n');
}

export function exportPRsCSV(prs: Record<string, ExercisePR>): string {
  const header = 'Exercise,Max 1RM (kg),Max Weight (kg),Max Reps,Date';
  const rows = Object.entries(prs).map(([name, pr]) => {
    const bestDate = pr.bestSet ? new Date(pr.bestSet.timestamp).toLocaleDateString() : 'N/A';
    return [name, pr.max1RM, pr.maxWeight, pr.maxReps, bestDate].join(',');
  });
  return [header, ...rows].join('\n');
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportAsPDF(content: string, title: string): Promise<void> {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`
    <html><head><title>${title}</title>
    <style>body{font-family:monospace;padding:20px;white-space:pre-wrap}pre{font-size:12px}</style>
    </head><body><h2>${title}</h2><pre>${content}</pre></body></html>
  `);
  win.document.close();
  win.print();
}
