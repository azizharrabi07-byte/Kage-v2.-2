import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    optimizeDeps: {
      include: ['three', '@react-three/fiber', '@react-three/drei'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three', '@react-three/fiber', '@react-three/drei'],
            'data-exercises': ['./src/data/exercises.ts'],
            'data-programs': ['./src/data/programs.ts'],
            'data-diets': ['./src/data/dietPrograms.ts'],
            landing: ['./src/components/EpicLanding.tsx'],
            'components-exercise': [
              './src/components/ExerciseLibrary.tsx',
              './src/components/ExerciseDetail.tsx',
              './src/components/ExerciseImage.tsx',
            ],
            'components-program': [
              './src/components/ProgramBrowser.tsx',
              './src/components/ProgramBoard.tsx',
              './src/components/DataTable.tsx',
            ],
            'components-diet': ['./src/components/DietPlanView.tsx'],
            'components-extra': [
              './src/components/BattleChallenge.tsx',
              './src/components/PoseDetector.tsx',
              './src/components/WorkoutComplete.tsx',
              './src/components/CameraCheckIn.tsx',
              './src/components/PushupVerification.tsx',
            ],
            'components-tabs': [
              './src/components/HomeTab.tsx',
              './src/components/TrainTab.tsx',
              './src/components/DojoTab.tsx',
              './src/components/SenseiTab.tsx',
              './src/components/FuelTab.tsx',
              './src/components/SoulTab.tsx',
            ],
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
