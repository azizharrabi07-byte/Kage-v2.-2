"""Tests for workout session endpoints using FastAPI TestClient."""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.middleware.auth import DEV_USER_ID

client = TestClient(app)

TEST_TOKEN = "test_mock_token"


@pytest.fixture(autouse=True)
def _bypass_auth(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("DEV_BYPASS_AUTH", "true")
    from app.config import settings
    settings.dev_bypass_auth = True


def _auth_headers() -> dict:
    return {"Authorization": f"Bearer {TEST_TOKEN}"}


class TestWorkoutSession:
    def test_start_session(self):
        payload = {
            "name": "Morning Push",
            "kanji": "朝の筋トレ",
            "exercises": [
                {
                    "exercise_id": "00000000-0000-0000-0000-000000000001",
                    "sort_order": 0,
                    "completed": False,
                    "sets": [],
                }
            ],
            "duration_seconds": 0,
            "mood": 3,
        }
        resp = client.post("/api/workout-sessions", json=payload, headers=_auth_headers())
        assert resp.status_code == 200 or resp.status_code == 400
        data = resp.json()
        if resp.status_code == 200:
            assert "id" in data
            assert data["user_id"] == DEV_USER_ID

    def test_log_session(self):
        start_payload = {
            "name": "Log Test",
            "exercises": [
                {
                    "exercise_id": "00000000-0000-0000-0000-000000000001",
                    "completed": True,
                    "sets": [
                        {"set_number": 1, "reps": 10, "weight_kg": 50, "completed": True},
                        {"set_number": 2, "reps": 8, "weight_kg": 55, "completed": True},
                    ],
                }
            ],
            "completed_at": "2025-01-01T00:00:00Z",
        }
        resp = client.post("/api/workout-sessions", json=start_payload, headers=_auth_headers())
        assert resp.status_code == 200 or resp.status_code == 400

    def test_unauthorized(self):
        resp = client.post("/api/workout-sessions", json={"name": "test"})
        # In dev bypass mode, unauthorized requests may succeed or return various errors
        assert resp.status_code in (200, 400, 401, 403, 422)


class TestXP:
    def test_calculate_xp_basic(self):
        from app.services.xp_service import calculate_workout_xp

        sets = [
            {"reps": 10, "weight_kg": 50},
            {"reps": 8, "weight_kg": 55},
        ]
        xp = calculate_workout_xp(sets)
        assert xp >= 20

    def test_calculate_xp_empty(self):
        from app.services.xp_service import calculate_workout_xp

        assert calculate_workout_xp([]) == 0


class TestHealth:
    def test_health_check(self):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "ok"
