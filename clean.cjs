const { execSync } = require('child_process');
const os = require('os');

const platform = os.platform();

if (platform === 'win32') {
  execSync('for /d /r . %d in (node_modules) do @if exist "%d" (rd /s /q "%d") & echo Deleted "%d" && if exist "yarn.lock" (del /q "yarn.lock")');
} else {
  execSync("find . -name 'node_modules' -type d -prune -exec rm -rf '{}' + && find . -name 'yarn.lock' -type f -delete");
}