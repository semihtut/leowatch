#!/usr/bin/env node

/**
 * Intelleo Briefing Adder Script
 *
 * Usage:
 *   node scripts/add-briefing.js <json-file>
 *   node scripts/add-briefing.js --paste
 *
 * Flags:
 *   --no-git       Skip git commit/push prompt
 *   --overwrite    Auto-overwrite existing briefings without prompting
 *
 * Examples:
 *   node scripts/add-briefing.js ~/Downloads/new-briefing.json
 *   node scripts/add-briefing.js ~/Downloads/briefing.json --no-git --overwrite
 *   node scripts/add-briefing.js --paste  (then paste JSON and press Ctrl+D)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const BRIEFINGS_DIR = path.join(__dirname, '../public/data/briefings');
const INDEX_FILE = path.join(BRIEFINGS_DIR, 'index.json');
const MAIN_INDEX_FILE = path.join(__dirname, '../public/data/index.json');

// Required fields for validation
const REQUIRED_FIELDS = [
  'briefing_id',
  'title',
  'generated_date',
  'status',
  'severity',
  'cves',
  'tags',
  'affected_products',
  'sources_analyzed',
  'sources',
  'timeline',
  'simple_summary',
  'mitre_attack',
  'detection_guidance',
  'immediate_actions'
];

const SEVERITY_LEVELS = ['Critical', 'High', 'Medium', 'Low'];
const SOURCE_TYPES = ['Research', 'Vendor Advisory', 'Government', 'News'];

// Colors for terminal output
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};

function log(message, type = 'info') {
  const prefix = {
    info: colors.cyan('ℹ'),
    success: colors.green('✓'),
    warning: colors.yellow('⚠'),
    error: colors.red('✗'),
  };
  console.log(`${prefix[type]} ${message}`);
}

function validateBriefing(briefing) {
  const errors = [];
  const warnings = [];

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in briefing)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }

  // Validate briefing_id format
  if (!/^TB-\d{4}-\d{2}-\d{2}-\d{3}$/.test(briefing.briefing_id)) {
    errors.push(`Invalid briefing_id format. Expected: TB-YYYY-MM-DD-XXX, got: ${briefing.briefing_id}`);
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(briefing.generated_date)) {
    errors.push(`Invalid generated_date format. Expected: YYYY-MM-DD`);
  }

  // Validate severity
  if (briefing.severity) {
    if (!SEVERITY_LEVELS.includes(briefing.severity.level)) {
      errors.push(`Invalid severity level. Expected one of: ${SEVERITY_LEVELS.join(', ')}`);
    }
    if (briefing.severity.cvss && (briefing.severity.cvss < 0 || briefing.severity.cvss > 10)) {
      errors.push(`Invalid CVSS score. Must be between 0 and 10`);
    }
  }

  // Validate sources
  if (briefing.sources && Array.isArray(briefing.sources)) {
    briefing.sources.forEach((source, i) => {
      if (!source.name || !source.url || !source.date || !source.type) {
        errors.push(`Source ${i + 1} missing required fields (name, url, date, type)`);
      }
      if (source.type && !SOURCE_TYPES.includes(source.type)) {
        warnings.push(`Source ${i + 1} has non-standard type: ${source.type}`);
      }
    });
  }

  // Validate simple_summary
  if (briefing.simple_summary) {
    const summaryFields = ['what_happened', 'who_is_affected', 'what_attackers_do', 'what_you_should_do', 'why_this_is_serious'];
    for (const field of summaryFields) {
      if (!(field in briefing.simple_summary)) {
        errors.push(`Missing simple_summary.${field}`);
      }
    }
    // Check what_attackers_do format
    if (briefing.simple_summary.what_attackers_do &&
        !briefing.simple_summary.what_attackers_do.includes('Step')) {
      warnings.push(`what_attackers_do should use "Step 1:", "Step 2:" format for proper visualization`);
    }
  }

  // Validate immediate_actions have priority
  if (briefing.immediate_actions && Array.isArray(briefing.immediate_actions)) {
    briefing.immediate_actions.forEach((action, i) => {
      if (typeof action.priority !== 'number') {
        warnings.push(`Immediate action ${i + 1} missing numeric priority`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function updateIndex(briefingId) {
  let index = [];

  if (fs.existsSync(INDEX_FILE)) {
    const content = fs.readFileSync(INDEX_FILE, 'utf-8');
    index = JSON.parse(content);
  }

  if (!index.includes(briefingId)) {
    index.unshift(briefingId); // Add to beginning (newest first)
    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2) + '\n');
    return true;
  }

  return false;
}

function updateMainIndex(briefing) {
  let mainIndex = {
    lastUpdated: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    stats: { total: 0, critical: 0, high: 0, medium: 0, low: 0, cisaKev: 0, activeExploits: 0, totalSources: 0 },
    topTags: [],
    topVendors: [],
    featuredBriefing: null,
    briefings: []
  };

  if (fs.existsSync(MAIN_INDEX_FILE)) {
    const content = fs.readFileSync(MAIN_INDEX_FILE, 'utf-8');
    mainIndex = JSON.parse(content);
  }

  // Check if briefing already exists
  const existingIndex = mainIndex.briefings.findIndex(b => b.id === briefing.briefing_id);

  // Create summary object for the briefing
  const briefingSummary = {
    id: briefing.briefing_id,
    title: briefing.title,
    severity: briefing.severity.level,
    date: briefing.generated_date,
    cves: briefing.cves,
    tags: briefing.tags.slice(0, 6),
    sourcesCount: briefing.sources_analyzed,
    excerpt: briefing.simple_summary.what_happened.substring(0, 200) + '...'
  };

  if (existingIndex >= 0) {
    // Update existing
    mainIndex.briefings[existingIndex] = briefingSummary;
  } else {
    // Add new at the beginning
    mainIndex.briefings.unshift(briefingSummary);
  }

  // Update stats
  const severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  let cisaKevCount = 0;
  let totalSources = 0;

  // Re-read all briefing files to calculate accurate stats
  const briefingFiles = fs.readdirSync(BRIEFINGS_DIR).filter(f => f.endsWith('.json') && f !== 'index.json');

  for (const file of briefingFiles) {
    try {
      const content = fs.readFileSync(path.join(BRIEFINGS_DIR, file), 'utf-8');
      const b = JSON.parse(content);
      if (b.severity?.level) {
        severityCounts[b.severity.level] = (severityCounts[b.severity.level] || 0) + 1;
      }
      if (b.severity?.cisa_kev) cisaKevCount++;
      if (b.sources_analyzed) totalSources += b.sources_analyzed;
    } catch (e) {
      // Skip invalid files
    }
  }

  mainIndex.stats = {
    total: briefingFiles.length,
    critical: severityCounts.Critical,
    high: severityCounts.High,
    medium: severityCounts.Medium,
    low: severityCounts.Low,
    cisaKev: cisaKevCount,
    activeExploits: mainIndex.stats.activeExploits || 0,
    totalSources: totalSources
  };

  mainIndex.lastUpdated = new Date().toISOString();
  mainIndex.date = new Date().toISOString().split('T')[0];

  // Set featured briefing to the newest critical one
  const criticalBriefing = mainIndex.briefings.find(b => b.severity === 'Critical');
  if (criticalBriefing) {
    mainIndex.featuredBriefing = criticalBriefing.id;
  }

  fs.writeFileSync(MAIN_INDEX_FILE, JSON.stringify(mainIndex, null, 2) + '\n');
  return true;
}

function gitCommitAndPush(briefingId, title) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\nGit\'e commit ve push yapmak ister misin? (y/n): ', (answer) => {
      rl.close();

      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'e' || answer.toLowerCase() === 'evet') {
        try {
          log('Staging files...', 'info');
          execSync('git add public/data/', { cwd: path.join(__dirname, '..') });

          log('Creating commit...', 'info');
          const commitMsg = `Add briefing: ${briefingId} - ${title}`;
          execSync(`git commit -m "${commitMsg}"`, { cwd: path.join(__dirname, '..') });

          log('Pushing to remote...', 'info');
          execSync('git push', { cwd: path.join(__dirname, '..') });

          log('Successfully pushed to GitHub!', 'success');
          resolve(true);
        } catch (error) {
          log(`Git error: ${error.message}`, 'error');
          resolve(false);
        }
      } else {
        log('Git push skipped', 'info');
        resolve(false);
      }
    });
  });
}

async function readFromStdin() {
  return new Promise((resolve) => {
    let data = '';
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    console.log(colors.cyan('\nJSON\'u yapistir ve Ctrl+D (Mac/Linux) veya Ctrl+Z (Windows) bas:\n'));

    rl.on('line', (line) => {
      data += line + '\n';
    });

    rl.on('close', () => {
      resolve(data);
    });
  });
}

async function main() {
  console.log(colors.bold('\n📋 Intelleo Briefing Adder\n'));

  let jsonContent;
  const args = process.argv.slice(2);
  const flags = args.filter(a => a.startsWith('--'));
  const positional = args.filter(a => !a.startsWith('--') && a !== '-p');
  const noGit = flags.includes('--no-git');
  const autoOverwrite = flags.includes('--overwrite');

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node scripts/add-briefing.js <json-file>');
    console.log('  node scripts/add-briefing.js --paste');
    console.log('\nFlags:');
    console.log('  --no-git       Skip git commit/push prompt');
    console.log('  --overwrite    Auto-overwrite existing briefings');
    console.log('\nExamples:');
    console.log('  node scripts/add-briefing.js ~/Downloads/briefing.json');
    console.log('  node scripts/add-briefing.js ~/Downloads/briefing.json --no-git --overwrite');
    console.log('  node scripts/add-briefing.js --paste');
    process.exit(1);
  }

  if (args.includes('--paste') || args.includes('-p')) {
    jsonContent = await readFromStdin();
  } else if (positional.length > 0) {
    const filePath = positional[0];
    if (!fs.existsSync(filePath)) {
      log(`File not found: ${filePath}`, 'error');
      process.exit(1);
    }
    jsonContent = fs.readFileSync(filePath, 'utf-8');
  } else {
    log('No input file specified', 'error');
    process.exit(1);
  }

  // Parse JSON
  let briefing;
  try {
    briefing = JSON.parse(jsonContent);
  } catch (error) {
    log(`Invalid JSON: ${error.message}`, 'error');
    process.exit(1);
  }

  // Validate
  log('Validating briefing...', 'info');
  const { valid, errors, warnings } = validateBriefing(briefing);

  if (warnings.length > 0) {
    console.log(colors.yellow('\nWarnings:'));
    warnings.forEach(w => console.log(`  ${colors.yellow('⚠')} ${w}`));
  }

  if (!valid) {
    console.log(colors.red('\nValidation errors:'));
    errors.forEach(e => console.log(`  ${colors.red('✗')} ${e}`));
    process.exit(1);
  }

  log('Validation passed!', 'success');

  // Check if file already exists
  const fileName = `${briefing.briefing_id}.json`;
  const filePath = path.join(BRIEFINGS_DIR, fileName);

  if (fs.existsSync(filePath)) {
    log(`Briefing ${briefing.briefing_id} already exists!`, 'warning');
    if (!autoOverwrite) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise((resolve) => {
        rl.question('Overwrite? (y/n): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        log('Aborted', 'info');
        process.exit(0);
      }
    } else {
      log('Auto-overwriting (--overwrite flag)', 'info');
    }
  }

  // Save briefing
  fs.writeFileSync(filePath, JSON.stringify(briefing, null, 2) + '\n');
  log(`Saved: ${fileName}`, 'success');

  // Update briefings index
  const indexUpdated = updateIndex(briefing.briefing_id);
  if (indexUpdated) {
    log('Updated briefings/index.json', 'success');
  } else {
    log('Briefing already in briefings index', 'info');
  }

  // Update main index
  updateMainIndex(briefing);
  log('Updated main index.json', 'success');

  // Summary
  console.log(colors.bold('\n📄 Briefing Summary:'));
  console.log(`   ID:       ${briefing.briefing_id}`);
  console.log(`   Title:    ${briefing.title}`);
  console.log(`   Severity: ${briefing.severity.level} (CVSS: ${briefing.severity.cvss})`);
  console.log(`   CVEs:     ${briefing.cves.join(', ')}`);
  console.log(`   Sources:  ${briefing.sources_analyzed}`);

  // Git commit/push (skip if --no-git flag)
  if (!noGit) {
    await gitCommitAndPush(briefing.briefing_id, briefing.title);
  } else {
    log('Git skipped (--no-git flag)', 'info');
  }

  console.log(colors.green('\n✨ Done!\n'));
}

main().catch(console.error);
