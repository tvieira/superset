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

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { supersetTheme, ThemeProvider } from '@apache-superset/core/theme';
import Tooltip from './Tooltip';

const renderTooltip = (variant?: 'default' | 'custom') =>
  render(
    <ThemeProvider theme={supersetTheme}>
      <Tooltip
        tooltip={{ x: 10, y: 20, content: 'Tooltip content' }}
        variant={variant}
      />
    </ThemeProvider>,
  );

test('renders the default variant with an opaque background', () => {
  renderTooltip('default');

  const tooltip = screen.getByTestId('tooltip-default');
  expect(tooltip).toHaveStyleRule('background', supersetTheme.colorBgElevated);
  expect(tooltip).toHaveStyleRule('color', supersetTheme.colorText);
});

test('renders the custom (handlebars) variant with an opaque background', () => {
  renderTooltip('custom');

  // The handlebars-powered tooltip previously had no background, making its
  // contents hard to read against the map. It should share the readable
  // surface styling of the default tooltip.
  const tooltip = screen.getByTestId('tooltip-custom');
  expect(tooltip).toHaveStyleRule('background', supersetTheme.colorBgElevated);
  expect(tooltip).toHaveStyleRule('color', supersetTheme.colorText);
  expect(tooltip).toHaveStyleRule(
    'border-radius',
    `${supersetTheme.borderRadius}px`,
  );
});
