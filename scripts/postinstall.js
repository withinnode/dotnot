import { spawn } from 'node:child_process';

if (process.env.NODE_ENV === 'production') {
  process.exit(0);
}

const cmd = spawn('npx patch-package', {
  shell: true,
  stdio: 'inherit'
});

cmd.on('exit', (code) => process.exit(code));
