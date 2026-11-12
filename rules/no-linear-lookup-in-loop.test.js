import test from 'ava';
import AvaRuleTester from 'eslint-ava-rule-tester';

import rule from './no-linear-lookup-in-loop.js';

const ruleTester = new AvaRuleTester(test);
const errors = [{ messageId: 'linearLookupInLoop' }];

ruleTester.run('no-linear-lookup-in-loop', rule, {
  valid: [
    {
      name: 'Lookup outside any loop',
      code: 'const skill = skills.find((skill) => skill.id === skillId);',
    },
    {
      name: 'Collection indexed before the loop',
      code: 'const skillsById = new Map(skills.map((skill) => [skill.id, skill])); ids.map((id) => skillsById.get(id));',
    },
    {
      name: 'Lookup that is not an equality',
      code: 'ids.map((id) => names.find((name) => name.startsWith(id)));',
    },
    {
      name: 'Filter that is not nested',
      code: 'ids.filter((id) => id !== undefined);',
    },
    {
      name: 'Lookup comparing against a constant',
      code: "learners.map((learner) => learner.assessments.find((assessment) => assessment.status === 'completed'));",
    },
    {
      name: 'Lookup comparing against a variable declared outside the loop',
      code: "const lang = 'fr'; skills.map((skill) => skill.tutorials.filter((tutorial) => tutorial.locale === lang));",
    },
  ],

  invalid: [
    {
      name: 'find in a map callback',
      code: 'ids.map((skillId) => targetSkills.find((skill) => skill.id === skillId));',
      errors,
    },
    {
      name: 'filter in a forEach callback with a block body',
      code: 'organizationIds.forEach((organizationId) => { results.filter((result) => result.organizationId === organizationId); });',
      errors,
    },
    {
      name: 'some in a for...of loop',
      code: 'for (const id of ids) { rows.some((row) => row.id === id); }',
      errors,
    },
    {
      name: 'findIndex in a reduce callback',
      code: 'rows.reduce((total, row) => total + others.findIndex((other) => other.id === row.id), 0);',
      errors,
    },
    {
      name: 'Function expressions with a single return',
      code: 'ids.map(function (id) { return rows.find(function (row) { return row.id === id; }); });',
      errors,
    },
    {
      name: 'Destructured loop parameter',
      code: 'triggers.map(({ tubeId }) => tubes.find(({ id }) => id === tubeId));',
      errors,
    },
    {
      name: 'Variable derived from the loop variable inside the loop body',
      code: 'competences.map((competence) => { const areaId = competence.areaId; return areas.find((area) => area.id === areaId); });',
      errors,
    },
    {
      name: 'Both sides wrapped in a call',
      code: 'elements.filter((element) => ids.some((id) => String(id) === String(element.skillId)));',
      errors,
    },
  ],
});
