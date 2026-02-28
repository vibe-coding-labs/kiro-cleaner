# Kiro Cleaner

[简体中文](README.zh-CN.md) | English

**Clean up Kiro IDE data to speed it up instantly.** Automatically scans and safely removes redundant conversation data, cache files, and logs.

🌐 **Website**: [https://vibe-coding-labs.github.io/kiro-cleaner/](https://vibe-coding-labs.github.io/kiro-cleaner/)

## Demo

**Scan Command:**

![Kiro Cleaner Scan Demo](data/demo-scan-command-final.gif)

**Clean Command:**

![Kiro Cleaner Clean Demo](data/demo-clean-command-3x.gif)

## Quick Start

### Installation

```bash
# Build from source
git clone https://github.com/vibe-coding-labs/kiro-cleaner.git
cd kiro-cleaner
make build-local
sudo make install
```

Or download pre-compiled binaries from [Releases](https://github.com/vibe-coding-labs/kiro-cleaner/releases).

### Usage

```bash
# Scan Kiro data storage
./kiro-cleaner scan

# Preview cleanup operations
./kiro-cleaner preview

# Execute cleanup (with backup)
./kiro-cleaner clean --backup

# Manage backups
./kiro-cleaner backup list
./kiro-cleaner backup restore <backup-id>
```

## License

Apache 2.0 License. See [LICENSE](LICENSE) for details.
