import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCandidateEligibilityQuery,
  getDeploymentWindowState,
  isCandidateEligible
} from '../src/utils/examEligibility.js';

test('buildCandidateEligibilityQuery preserves all targeting dimensions', () => {
  const query = buildCandidateEligibilityQuery({
    universityCampus: 'North',
    branch: 'CSE',
    semester: 4,
    section: 'A'
  });

  assert.equal(query.$and.length, 4);
  assert.equal(query.$and[0].$or[2].universityCampus, 'North');
  assert.equal(query.$and[1].$or[2].branch, 'CSE');
  assert.equal(query.$and[2].$or[1].semester, 4);
  assert.equal(query.$and[3].$or[2].section, 'A');
});

test('isCandidateEligible accepts matching and unscoped deployments', () => {
  const candidate = { universityCampus: 'North', branch: 'CSE', semester: 4, section: 'A', course: 'bca' };
  assert.equal(isCandidateEligible({
    universityCampus: 'North', branch: 'CSE', semester: 4, section: 'A', quiz: { course: 'bca' }
  }, candidate), true);
  assert.equal(isCandidateEligible({ quiz: {} }, candidate), true);
  assert.equal(isCandidateEligible({ branch: 'ECE', quiz: {} }, candidate), false);
});

test('getDeploymentWindowState handles live, upcoming, paused, and completed exams', () => {
  const now = new Date('2026-08-17T10:00:00.000Z');
  assert.equal(getDeploymentWindowState({ startTime: '2026-08-17T09:00:00.000Z', duration: 120 }, now), 'LIVE');
  assert.equal(getDeploymentWindowState({ startTime: '2026-08-17T11:00:00.000Z', duration: 60 }, now), 'UPCOMING');
  assert.equal(getDeploymentWindowState({ startTime: '2026-08-17T09:00:00.000Z', duration: 30 }, now), 'COMPLETED');
  assert.equal(getDeploymentWindowState({ startTime: '2026-08-17T09:00:00.000Z', duration: 120, isPaused: true }, now), 'PAUSED');
});
