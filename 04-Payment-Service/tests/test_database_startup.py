import sqlite3
from unittest.mock import Mock

import pytest

from app import enable_wal


def locked_error():
    error = sqlite3.OperationalError("database is locked")
    error.sqlite_errorcode = sqlite3.SQLITE_BUSY
    return error


def test_wal_retries_busy_startup_without_replaying_transactions(monkeypatch):
    connection = Mock()
    connection.execute.side_effect = [locked_error(), None]
    pause = Mock()
    monkeypatch.setattr("app.time.sleep", pause)
    enable_wal(connection)
    assert connection.execute.call_count == 2
    connection.execute.assert_called_with("PRAGMA journal_mode=WAL")
    pause.assert_called_once_with(0.05)


def test_wal_fails_after_bounded_wait(monkeypatch):
    connection = Mock()
    connection.execute.side_effect = locked_error()
    monkeypatch.setattr("app.time.monotonic", Mock(side_effect=[0, 11]))
    with pytest.raises(sqlite3.OperationalError):
        enable_wal(connection)
    assert connection.execute.call_count == 1


def test_wal_does_not_retry_unrelated_database_errors():
    connection = Mock()
    connection.execute.side_effect = sqlite3.OperationalError("database disk image is malformed")
    with pytest.raises(sqlite3.OperationalError):
        enable_wal(connection)
    assert connection.execute.call_count == 1
