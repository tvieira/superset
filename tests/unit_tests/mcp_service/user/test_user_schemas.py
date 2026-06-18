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

"""Tests for user.schemas.UserInfo role coercion validator."""

from unittest.mock import MagicMock

from superset.mcp_service.user.schemas import UserInfo


def test_userinfo_coerces_role_orm_objects_to_strings() -> None:
    """UserInfo must accept Role ORM objects and extract .name strings.

    Reproduces the bug where from_attributes=True caused Pydantic to read
    raw Role ORM objects from user.roles, raising 'input_type=Role' errors.
    """
    role_admin = MagicMock()
    role_admin.name = "Admin"
    role_gamma = MagicMock()
    role_gamma.name = "Gamma"

    info = UserInfo(roles=[role_admin, role_gamma])

    assert info.roles == ["Admin", "Gamma"]


def test_userinfo_accepts_plain_string_roles() -> None:
    info = UserInfo(roles=["Admin", "Alpha"])

    assert info.roles == ["Admin", "Alpha"]


def test_userinfo_handles_none_roles() -> None:
    info = UserInfo(roles=None)

    assert info.roles is None


def test_userinfo_handles_non_iterable_roles() -> None:
    info = UserInfo(roles=42)

    assert info.roles is None


def test_userinfo_model_validate_with_from_attributes() -> None:
    """Simulate the exact failing code path: model_validate with ORM user."""
    role_admin = MagicMock()
    role_admin.name = "Admin"
    role_gamma = MagicMock()
    role_gamma.name = "Gamma"

    user = MagicMock()
    user.id = 1
    user.username = "admin"
    user.first_name = "Admin"
    user.last_name = "User"
    user.active = True
    user.email = "admin@example.com"
    user.roles = [role_admin, role_gamma]
    user.changed_on = None

    info = UserInfo.model_validate(user, from_attributes=True)

    assert info.roles == ["Admin", "Gamma"]
    assert info.username == "admin"
