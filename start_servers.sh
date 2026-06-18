#!/bin/bash
export PYTHONPATH=/tmp/kage-v2/backend
cd /tmp/kage-v2/backend
/tmp/kage-v2/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 &
cd /tmp/kage-v2
npx vite preview --host 0.0.0.0 --port 5173 &
wait
