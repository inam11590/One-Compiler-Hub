"""OneCompilerHub Backend - Structured Logging & Audit Logger."""

import logging
import json
import sys
from datetime import datetime, timezone
from typing import Any, Dict, Optional


class JSONFormatter(logging.Formatter):
    """Formats log records as structured JSON for SIEM and cloud monitoring."""

    def format(self, record: logging.LogRecord) -> str:
        log_obj: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Include additional attributes if present
        for attr in ("event", "user_id", "execution_id", "client_ip", "path", "status_code"):
            if hasattr(record, attr):
                log_obj[attr] = getattr(record, attr)

        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_obj)


def setup_logging(debug: bool = False) -> logging.Logger:
    logger = logging.getLogger("onecompilerhub")
    logger.setLevel(logging.DEBUG if debug else logging.INFO)

    # Avoid duplicate handlers
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)

    return logger


logger = setup_logging()


def log_security_event(
    event: str,
    message: str,
    client_ip: Optional[str] = None,
    user_id: Optional[str] = None,
    extra: Optional[Dict[str, Any]] = None,
) -> None:
    """Logs an explicit security-relevant event for audit logging."""
    extra_dict: Dict[str, Any] = {
        "event": event,
        "client_ip": client_ip,
        "user_id": user_id,
    }
    if extra:
        extra_dict.update(extra)
    logger.warning(message, extra=extra_dict)
