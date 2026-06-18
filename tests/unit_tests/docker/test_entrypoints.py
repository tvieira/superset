# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]


def test_run_server_uses_exec() -> None:
    """Ensure run-server.sh execs gunicorn so it becomes PID 1 in containers.

    Without exec, bash remains PID 1 and swallows SIGTERM, preventing
    gunicorn from performing a graceful shutdown.
    """
    script = REPO_ROOT / "docker" / "entrypoints" / "run-server.sh"
    content = script.read_text()

    lines = [
        line
        for line in content.splitlines()
        if "gunicorn" in line and not line.lstrip().startswith("#")
    ]
    assert lines, "run-server.sh must contain a gunicorn invocation"

    gunicorn_line = lines[0].lstrip()
    assert gunicorn_line.startswith("exec "), (
        "run-server.sh must use 'exec gunicorn ...' so that gunicorn replaces "
        "the shell process and receives SIGTERM directly for graceful shutdown"
    )
