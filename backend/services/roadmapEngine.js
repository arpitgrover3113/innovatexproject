import { dbStore } from './storage.js';

export const generatePersonalizedRoadmap = async (userId) => {
  const topics = await dbStore.getTopics();
  const progressList = await dbStore.getStudentProgress(userId);

  const masteryMap = new Map();
  for (const p of progressList) {
    masteryMap.set(p.topicSlug, p.masteryScore);
  }

  // Evaluate prerequisite status and categorize each topic
  const categorizedTopics = topics.map(topic => {
    const currentScore = masteryMap.get(topic.slug) ?? 0;
    const prereqs = topic.prerequisites || [];

    // Check prerequisites fulfillment
    let allPrereqsMet = true;
    const unmetPrereqs = [];

    for (const prereqSlug of prereqs) {
      const prereqScore = masteryMap.get(prereqSlug) ?? 0;
      if (prereqScore < 60) {
        allPrereqsMet = false;
        const prereqTopic = topics.find(t => t.slug === prereqSlug);
        unmetPrereqs.push({
          slug: prereqSlug,
          name: prereqTopic ? prereqTopic.name : prereqSlug,
          score: prereqScore
        });
      }
    }

    // Determine status & priority
    let status = 'ready'; // ready, in_progress, locked, mastered
    let priority = 'medium'; // critical, high, medium, mastered
    let reason = '';
    let recommendedAction = '';

    if (currentScore >= 80) {
      status = 'mastered';
      priority = 'mastered';
      reason = `Strong conceptual mastery demonstrated (${currentScore}%).`;
      recommendedAction = 'Maintain with occasional hard-tier practice or timed mock sprints.';
    } else if (!allPrereqsMet) {
      status = 'locked';
      priority = 'medium';
      const prereqNames = unmetPrereqs.map(u => `${u.name} (${u.score}%)`).join(', ');
      reason = `Locked pending prerequisite mastery: requires ${prereqNames} to reach ≥ 60%.`;
      recommendedAction = `Focus on unlocking prerequisites first before attempting ${topic.name}.`;
    } else {
      // Prerequisites are met but not mastered
      // Is this topic a prerequisite for downstream topics?
      const downstreamDependent = topics.filter(t => (t.prerequisites || []).includes(topic.slug));
      
      if (currentScore < 50 && downstreamDependent.length > 0) {
        status = 'in_progress';
        priority = 'critical';
        const dependentNames = downstreamDependent.map(d => d.name).slice(0, 2).join(' & ');
        reason = `Critical Gateway Topic: Current mastery is ${currentScore}%, blocking advancement into ${dependentNames}.`;
        recommendedAction = 'Prioritize immediate foundational practice and tutor assistance on base concepts.';
      } else if (currentScore < 60) {
        status = 'in_progress';
        priority = 'high';
        reason = `Prerequisites fulfilled. Solidify intermediate concepts to bring mastery above 75%.`;
        recommendedAction = 'Engage in adaptive practice starting at Medium difficulty.';
      } else {
        status = 'ready';
        priority = 'medium';
        reason = `Approaching mastery (${currentScore}%). Solve 2-3 hard problems to achieve certified mastery.`;
        recommendedAction = 'Take targeted challenge quizzes on edge-case scenarios.';
      }
    }

    return {
      topicSlug: topic.slug,
      topicName: topic.name,
      description: topic.description,
      order: topic.order,
      icon: topic.icon,
      estimatedHours: topic.estimatedHours,
      masteryScore: currentScore,
      prerequisites: prereqs,
      unmetPrereqs,
      status,
      priority,
      reason,
      recommendedAction
    };
  });

  // Sort logically for recommended sequence:
  // 1. Critical bottleneck topics first
  // 2. High priority unlocked topics
  // 3. Medium priority unlocked topics
  // 4. Locked topics (sorted by order)
  // 5. Mastered topics
  const priorityWeight = {
    critical: 1,
    high: 2,
    ready: 3,
    medium: 4,
    locked: 5,
    mastered: 6
  };

  const recommendedSequence = [...categorizedTopics].sort((a, b) => {
    const pA = priorityWeight[a.priority] || 99;
    const pB = priorityWeight[b.priority] || 99;
    if (pA !== pB) return pA - pB;
    return a.order - b.order;
  });

  const nextFocusTopic = recommendedSequence.find(t => t.status !== 'mastered' && t.status !== 'locked') || recommendedSequence[0];

  const roadmapPayload = {
    userId,
    nextFocusTopic,
    totalTopics: topics.length,
    masteredCount: categorizedTopics.filter(t => t.status === 'mastered').length,
    inProgressCount: categorizedTopics.filter(t => t.status === 'in_progress' || t.status === 'ready').length,
    lockedCount: categorizedTopics.filter(t => t.status === 'locked').length,
    recommendedSequence,
    allTopics: categorizedTopics
  };

  await dbStore.saveLearningPath(userId, roadmapPayload);
  return roadmapPayload;
};

