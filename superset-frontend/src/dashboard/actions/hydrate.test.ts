/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { HYDRATE_DASHBOARD, hydrateDashboard } from './hydrate';

jest.mock('src/dashboard/util/crossFilters', () => ({
  getCrossFiltersConfiguration: () => ({
    chartConfiguration: {},
    globalChartConfiguration: {},
  }),
  isCrossFiltersEnabled: () => true,
}));

const mockHistory = { replace: jest.fn() } as any;

const mockGetState = () => ({
  user: {
    userId: 1,
    roles: { Admin: [['can_write', 'Dashboard']] },
  },
  common: {
    conf: {
      SUPERSET_WEBSERVER_TIMEOUT: 60,
      SQL_MAX_ROW: 1000,
    },
  },
  dashboardState: {},
});

const SLICE_ID = 42;

const makeDashboard = (metadata = {}) => ({
  id: 1,
  slug: null,
  url: '/superset/dashboard/1/',
  dashboard_title: 'Test',
  published: true,
  css: '',
  changed_on: '2024-01-01T00:00:00',
  owners: [],
  roles: [],
  metadata: {
    expanded_slices: { [SLICE_ID]: true },
    ...metadata,
  },
  position_data: null,
});

const makeChart = (overrides = {}) => ({
  slice_id: SLICE_ID,
  slice_url: `/explore/?slice_id=${SLICE_ID}`,
  slice_name: 'My Chart',
  form_data: {
    slice_id: SLICE_ID,
    viz_type: 'table',
    datasource: '1__table',
  },
  description: 'A test chart',
  description_markeddown: '<p>A test chart</p>',
  owners: [],
  modified: '1 hour ago',
  changed_on: '2024-01-01T00:00:00',
  ...overrides,
});

test('hydrateDashboard maps description_markeddown to description_markdown in sliceEntities', () => {
  const dispatch = jest.fn();
  const thunk = hydrateDashboard({
    history: mockHistory,
    dashboard: makeDashboard() as any,
    charts: [makeChart()],
    dataMask: {},
    activeTabs: null,
    chartStates: null,
  });
  thunk(dispatch, mockGetState as any);

  expect(dispatch).toHaveBeenCalledTimes(1);
  const action = dispatch.mock.calls[0][0];
  expect(action.type).toBe(HYDRATE_DASHBOARD);

  const slice = action.data.sliceEntities.slices[SLICE_ID];
  expect(slice).toBeDefined();
  expect(slice.description_markdown).toBe('<p>A test chart</p>');
  expect(slice).not.toHaveProperty('description_markeddown');
});

test('hydrateDashboard populates expandedSlices from metadata.expanded_slices', () => {
  const dispatch = jest.fn();
  const thunk = hydrateDashboard({
    history: mockHistory,
    dashboard: makeDashboard({ expanded_slices: { [SLICE_ID]: true } }) as any,
    charts: [makeChart()],
    dataMask: {},
    activeTabs: null,
    chartStates: null,
  });
  thunk(dispatch, mockGetState as any);

  const action = dispatch.mock.calls[0][0];
  expect(action.data.dashboardState.expandedSlices).toEqual({
    [SLICE_ID]: true,
  });
});
