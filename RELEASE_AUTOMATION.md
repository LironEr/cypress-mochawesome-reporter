# Release Automation Guide

This project uses **Release Please** to automate the release process on GitHub.

## 🚀 How It Works

### 1. Make Commits Using Conventional Commits

```bash
# Feature (bumps minor version: 1.0.14 → 1.1.0)
git commit -m "feat: add new feature"

# Bug fix (bumps patch version: 1.0.14 → 1.0.15)
git commit -m "fix: resolve bug"

# Breaking change (bumps major version: 1.0.14 → 2.0.0)
git commit -m "feat!: breaking change"
# or
git commit -m "feat: breaking change" -m "BREAKING CHANGE: details here"

# No version bump (included in next release)
git commit -m "chore: update dependencies"
git commit -m "docs: update readme"
```

### 2. Push to Main Branch

```bash
git push origin main
```

**Release Please will automatically:**
- Analyze your commits
- Calculate the next version based on conventional commits
- Create or update a "Release PR" that:
  - Updates `package.json` version
  - Updates `CHANGELOG.md` with all changes
  - Shows the version diff

### 3. Review and Merge the Release PR

When you merge the Release PR, Release Please automatically:
- Creates a GitHub Release with:
  - **Tag**: `v{version}` (e.g., `v1.0.15`)
  - **Title**: Version number or custom title
  - **Release notes**: From CHANGELOG
- This triggers the `publish.yml` workflow which publishes to npm

## 📋 Available Version Information

### In Release Please Workflow

The workflow exposes these outputs:

```yaml
${{ steps.release.outputs.release_created }}  # true/false
${{ steps.release.outputs.tag_name }}         # e.g., "v1.0.15"
${{ steps.release.outputs.major }}            # e.g., "1"
${{ steps.release.outputs.minor }}            # e.g., "0"
${{ steps.release.outputs.patch }}            # e.g., "15"
${{ steps.release.outputs.html_url }}         # GitHub release URL
```

### In Publish Workflow (Triggered by Release)

When a release is published, these are available:

```yaml
${{ github.event.release.name }}              # Release name
${{ github.event.release.tag_name }}          # e.g., "v1.0.15"
${{ github.event.release.prerelease }}        # true/false
```

## 📝 Configuration Files

### `.release-please-config.json`
Controls how Release Please operates:
- Release type (node/python/etc)
- Package name
- Changelog location
- Version bump strategy

### `.release-please-manifest.json`
Tracks the current version (syncs with `package.json`)

## 🎯 Common Scenarios

### Create a Patch Release (Bug Fix)
```bash
git commit -m "fix: correct validation logic"
git push origin main
# Creates: v1.0.15
```

### Create a Minor Release (New Feature)
```bash
git commit -m "feat: add export functionality"
git push origin main
# Creates: v1.1.0
```

### Create a Major Release (Breaking Change)
```bash
git commit -m "feat!: redesign API"
git push origin main
# Creates: v2.0.0
```

### Create a Prerelease
1. Create and push to a release branch (e.g., `release-v2`)
2. Mark the GitHub release as "prerelease"
3. npm will publish with `--tag next` instead of `--tag latest`

## 🔍 Reading Version in Other Workflows

If you need to access the version in custom workflows:

```yaml
- name: Get version from package.json
  id: package-version
  run: |
    VERSION=$(node -p "require('./package.json').version")
    echo "version=$VERSION" >> $GITHUB_OUTPUT

- name: Use the version
  run: |
    echo "Version: ${{ steps.package-version.outputs.version }}"
```

See `.github/workflows/version-example.yml` for a complete example.

## 🔧 Troubleshooting

### Publish Workflow Not Running After Release

If the publish workflow doesn't run after merging a Release PR:

**Solution 1: Integrated Publishing (Current Setup)**
The `release-please.yml` workflow now publishes to npm directly when a release is created. This is more reliable than triggering a separate workflow.

**Solution 2: Check GitHub Release Settings**
1. Go to your repository's Releases page
2. Check if the release was created as "Draft" or "Published"
3. If it's a draft, you need to manually publish it
4. Configuration: Set `"draft": false` in `.release-please-config.json`

**Solution 3: Verify Workflow Trigger**
The `publish.yml` workflow triggers on:
```yaml
on:
  release:
    types: [published]  # Only triggers on published releases, not drafts
```

**Check Workflow Logs:**
1. Go to Actions tab in GitHub
2. Look for the "Release Please" workflow run
3. Check if `release_created` output is `true`
4. Verify the npm publish step ran successfully

### Release PR Not Created

If Release Please doesn't create a PR:

1. **Check Conventional Commits**: Ensure commits follow the format
2. **Check Permissions**: Workflow needs `contents: write` and `pull-requests: write`
3. **Check Branch**: Must be pushing to `main` branch
4. **Check Logs**: Look at the Release Please workflow logs

### Version Mismatch

If versions don't match between files:

1. Update `.release-please-manifest.json` to match current version in `package.json`
2. Release Please uses the manifest as the source of truth

## 🛠️ Manual Release (If Needed)

If you need to manually create a release:

```bash
# Update version in package.json
npm version patch  # or minor, major

# Create and push tag
git push --follow-tags

# Create GitHub release manually
# Or use: gh release create v1.0.15 --generate-notes
```

## 🔍 Debugging

### Check if Release Please is Working

```bash
# Check workflow runs
gh run list --workflow=release-please.yml

# View latest run details
gh run view --log

# Check if release was created
gh release list
```

### Test Locally (Dry Run)

You can't fully test Release Please locally, but you can:
1. Verify your commits follow conventional commit format
2. Check `.release-please-manifest.json` has correct version
3. Ensure `package.json` version matches manifest

## 📚 References

- [Release Please Documentation](https://github.com/googleapis/release-please)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions: Release Please](https://github.com/googleapis/release-please-action)

