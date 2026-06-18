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

import { parseMetricValue } from './utils';

test('parseMetricValue returns null for null input', () => {
  expect(parseMetricValue(null)).toBeNull();
});

test('parseMetricValue returns numeric values unchanged', () => {
  expect(parseMetricValue(0)).toBe(0);
  expect(parseMetricValue(42)).toBe(42);
  expect(parseMetricValue(-3.14)).toBe(-3.14);
});

test('parseMetricValue converts valid ISO date strings to timestamps', () => {
  const result = parseMetricValue('2020-01-01');
  expect(typeof result).toBe('number');
  expect(result).toBe(new Date('2020-01-01T00:00:00Z').getTime());
});

test('parseMetricValue converts full ISO datetime strings to timestamps', () => {
  const result = parseMetricValue('2021-06-15T12:30:00Z');
  expect(typeof result).toBe('number');
  expect(result).toBe(new Date('2021-06-15T12:30:00Z').getTime());
});

test('parseMetricValue passes through non-date strings', () => {
  expect(parseMetricValue('hello')).toBe('hello');
  expect(parseMetricValue('max_value_result')).toBe('max_value_result');
  expect(parseMetricValue('foo bar baz')).toBe('foo bar baz');
});

test('parseMetricValue passes through empty string', () => {
  expect(parseMetricValue('')).toBe('');
});
