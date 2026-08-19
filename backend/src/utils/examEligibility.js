const isUnset = (value) => value === undefined || value === null || value === '';

const matchesTarget = (deploymentValue, candidateValue) => (
  isUnset(deploymentValue) || String(deploymentValue) === String(candidateValue)
);

export const isCandidateEligible = (deployment, candidate) => (
  matchesTarget(deployment.universityCampus, candidate.universityCampus)
  && matchesTarget(deployment.branch, candidate.branch)
  && matchesTarget(deployment.semester, candidate.semester)
  && matchesTarget(deployment.section, candidate.section)
  && (!deployment.quiz?.course
    || String(deployment.quiz.course?._id || deployment.quiz.course) === String(candidate.course?._id || candidate.course))
);

export const buildCandidateEligibilityQuery = (candidate) => ({
  $and: [
    {
      $or: [
        { universityCampus: { $exists: false } },
        { universityCampus: '' },
        { universityCampus: candidate.universityCampus }
      ]
    },
    {
      $or: [
        { branch: { $exists: false } },
        { branch: '' },
        { branch: candidate.branch }
      ]
    },
    {
      $or: [
        { semester: { $exists: false } },
        { semester: candidate.semester }
      ]
    },
    {
      $or: [
        { section: { $exists: false } },
        { section: '' },
        { section: candidate.section }
      ]
    }
  ]
});

export const getDeploymentWindowState = (deployment, now = new Date()) => {
  const currentTime = new Date(now).getTime();
  const startTime = deployment.startTime ? new Date(deployment.startTime).getTime() : null;
  const endTime = deployment.endTime
    ? new Date(deployment.endTime).getTime()
    : (startTime ? startTime + (deployment.duration * 60 * 1000) : null);

  if (deployment.status === 'ARCHIVED' || deployment.status === 'COMPLETED') return 'COMPLETED';
  if (deployment.isPaused) return 'PAUSED';
  if (!startTime) return 'UNSCHEDULED';
  if (currentTime < startTime) return 'UPCOMING';
  if (endTime && currentTime > endTime) return 'COMPLETED';
  return 'LIVE';
};
