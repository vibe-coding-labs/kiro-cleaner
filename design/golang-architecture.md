# Kiro Cleaner Golang 工具架构设计

## 1. 项目结构

```
kiro-cleaner/
├── cmd/
│   └── kiro-cleaner/
│       └── main.go                 # 主程序入口
├── internal/
│   ├── config/                     # 配置管理
│   │   ├── config.go
│   │   └── loader.go
│   ├── scanner/                    # 数据扫描
│   │   ├── file_scanner.go
│   │   ├── db_scanner.go
│   │   └── analyzer.go
│   ├── cleaner/                    # 清理引擎
│   │   ├── engine.go
│   │   ├── rules.go
│   │   └── executor.go
│   ├── backup/                     # 备份管理
│   │   ├── manager.go
│   │   └── archiver.go
│   ├── database/                   # 数据库操作
│   │   ├── connection.go
│   │   ├── queries.go
│   │   └── models.go
│   ├── storage/                    # 存储管理
│   │   ├── detector.go
│   │   └── paths.go
│   ├── ui/                         # 用户界面
│   │   ├── progress.go
│   │   ├── display.go
│   │   └── prompts.go
│   └── utils/                      # 工具函数
│       ├── fileops.go
│       ├── time.go
│       └── errors.go
├── pkg/
│   └── types/                      # 公共类型定义
│       └── types.go
├── assets/                         # 静态资源
│   ├── default-config.json
│   └── rules/
│       └── default-rules.json
├── test/                           # 测试数据
│   ├── mock_data/
│   └── fixtures/
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

## 2. 核心接口设计

### 2.1 Scanner 接口
```go
type Scanner interface {
    Scan() ([]FileInfo, error)
    GetStorageStats() (*StorageStats, error)
    Analyze() (*AnalysisResult, error)
}
```

### 2.2 Cleaner 接口
```go
type Cleaner interface {
    SetRules(rules []CleanupRule) error
    Preview(targets []FileInfo) (*CleanupPreview, error)
    Execute(targets []FileInfo, dryRun bool) (*CleanupResult, error)
    Rollback(operationID string) error
}
```

### 2.3 BackupManager 接口
```go
type BackupManager interface {
    CreateBackup(items []FileInfo) (string, error)
    Restore(backupID string) error
    ListBackups() ([]BackupInfo, error)
    CleanupOldBackups() error
}
```

### 2.4 Database 接口
```go
type Database interface {
    Connect(path string) error
    GetConversations() ([]Conversation, error)
    GetMessages(conversationID int64) ([]Message, error)
    DeleteConversation(id int64) error
    DeleteOldMessages(days int) error
    GetStorageInfo() (*DBInfo, error)
    Optimize() error
}
```

## 3. 主要模块设计

### 3.1 配置模块 (config)

```go
type Config struct {
    Version       string         `json:"version"`
    KiroPaths     []string       `json:"kiro_paths"`
    CleanupRules  []CleanupRule  `json:"cleanup_rules"`
    BackupConfig  BackupConfig   `json:"backup_config"`
    SafetyChecks  SafetyConfig   `json:"safety_checks"`
    UIConfig      UIConfig       `json:"ui_config"`
}

type ConfigManager struct {
    configPath string
    config     *Config
    mu         sync.RWMutex
}

func (cm *ConfigManager) Load() error
func (cm *ConfigManager) Save() error
func (cm *ConfigManager) Get() *Config
func (cm *ConfigManager) Update(updates map[string]interface{}) error
func (cm *ConfigManager) ResetToDefault() error
```

### 3.2 扫描模块 (scanner)

```go
type FileScanner struct {
    config     *Config
    pathFinder *storage.PathFinder
    fileAnalyzer *Analyzer
}

type DBScanner struct {
    db         *sql.DB
    detector   *storage.StorageDetector
}

type Analyzer struct {
    rules []CleanupRule
}

func (fs *FileScanner) Scan() ([]FileInfo, error)
func (fs *FileScanner) GetStorageStats() (*StorageStats, error)
func (fs *FileScanner) Analyze() (*AnalysisResult, error)
func (dbs *DBScanner) Scan() ([]FileInfo, error)
func (a *Analyzer) Evaluate(file FileInfo) (*EvaluationResult, error)
```

### 3.3 清理模块 (cleaner)

```go
type CleanupEngine struct {
    scanner    Scanner
    executor   *RuleExecutor
    backupMgr  BackupManager
    db         Database
    rules      []CleanupRule
    safety     *SafetyChecker
}

type RuleExecutor struct {
    backupMgr BackupManager
    db        Database
    safety    *SafetyChecker
    ui        *ui.ProgressDisplay
}

func (ce *CleanupEngine) Preview(targets []FileInfo) (*CleanupPreview, error)
func (ce *CleanupEngine) Execute(targets []FileInfo, dryRun bool) (*CleanupResult, error)
func (re *RuleExecutor) ExecuteRules(targets []FileInfo, rules []CleanupRule) ([]CleanupAction, error)
```

### 3.4 备份模块 (backup)

```go
type BackupManager struct {
    config     *BackupConfig
    archive    *Archiver
    pathFinder *storage.PathFinder
    ui         *ui.ProgressDisplay
}

type Archiver struct {
    compressor zip.Compressor
    encryptor  crypto.Encryptor
}

func (bm *BackupManager) CreateBackup(items []FileInfo) (string, error)
func (bm *BackupManager) Restore(backupID string) error
func (bm *BackupManager) ListBackups() ([]BackupInfo, error)
func (a *Archiver) CreateArchive(files []FileInfo, destPath string) error
```

### 3.5 数据库模块 (database)

```go
type DatabaseManager struct {
    db         *sql.DB
    path       string
    connected  bool
}

type ConversationDAO struct {
    db *sql.DB
}

func (dm *DatabaseManager) Connect(path string) error
func (dm *DatabaseManager) Close() error
func (cdao *ConversationDAO) GetAll() ([]Conversation, error)
func (cdao *ConversationDAO) Delete(id int64) error
func (cdao *ConversationDAO) DeleteOld(days int) error
```

### 3.6 UI模块 (ui)

```go
type ProgressDisplay struct {
    writer     io.Writer
    useColors  bool
    verbose    bool
}

type Prompter struct {
    reader     io.Reader
    writer     io.Writer
}

func (pd *ProgressDisplay) ShowScanProgress(current, total int, filename string)
func (pd *ShowCleanupPreview(preview *CleanupPreview)
func (p *Prompter) Confirm(message string) (bool, error)
func (p *Prompter) Select(message string, options []string) (int, error)
```

## 4. 命令行接口设计

### 4.1 主命令结构
```go
type CLI struct {
    configMgr *config.ConfigManager
    scanner   Scanner
    cleaner   Cleaner
    backupMgr BackupManager
    ui        *ui.Prompter
}

var (
    configPath = flag.String("config", "", "配置文件路径")
    dryRun     = flag.Bool("dry-run", false, "预览模式，不执行实际清理")
    verbose    = flag.Bool("verbose", false, "详细输出")
    backup     = flag.Bool("backup", true, "清理前创建备份")
    force      = flag.Bool("force", false, "跳过确认直接执行")
)

func main() {
    flag.Parse()
    
    cmd := flag.Arg(0)
    switch cmd {
    case "scan":
        runScan()
    case "clean":
        runClean()
    case "preview":
        runPreview()
    case "backup":
        runBackup()
    case "restore":
        runRestore()
    case "config":
        runConfig()
    default:
        showHelp()
    }
}
```

### 4.2 子命令设计

#### 4.2.1 scan 命令
```bash
kiro-cleaner scan [选项]

选项:
  --output, -o    输出格式 (table|json|csv)
  --path, -p      指定扫描路径
  --analyze, -a   包含详细分析
  --save, -s      保存结果到文件
```

#### 4.2.2 clean 命令
```bash
kiro-cleaner clean [选项]

选项:
  --dry-run       预览模式
  --rules         指定规则文件
  --backup        清理前备份
  --backup-path   备份路径
  --confirm       自动确认
  --force         跳过安全检查
```

#### 4.2.3 preview 命令
```bash
kiro-cleaner preview [选项]

选项:
  --rules         显示将应用的规则
  --impact        显示影响评估
  --output        输出格式
```

## 5. 依赖管理

### 5.1 Go模块依赖
```go
require (
    github.com/spf13/cobra v1.8.0
    github.com/spf13/viper v1.18.2
    github.com/mattn/go-sqlite3 v1.14.17
    github.com/cheggaaa/pb/v3 v3.1.5
    github.com/fatih/color v1.15.0
    github.com/jedib0t/go-pretty/v6 v6.4.6
    golang.org/x/sys v0.14.0
)
```

### 5.2 内部依赖关系
- config → utils
- scanner → storage, database, utils
- cleaner → scanner, backup, database, ui
- backup → utils, ui
- database → utils
- ui → utils

## 6. 错误处理策略

### 6.1 错误类型定义
```go
type ErrorType string

const (
    ErrorConfig    ErrorType = "config_error"
    ErrorScan      ErrorType = "scan_error"
    ErrorClean     ErrorType = "clean_error"
    ErrorBackup    ErrorType = "backup_error"
    ErrorDatabase  ErrorType = "database_error"
    ErrorIO        ErrorType = "io_error"
    ErrorSafety    ErrorType = "safety_error"
)

type KiroError struct {
    Type        ErrorType `json:"type"`
    Code        string    `json:"code"`
    Message     string    `json:"message"`
    Details     string    `json:"details"`
    FilePath    string    `json:"file_path,omitempty"`
    Timestamp   time.Time `json:"timestamp"`
    Recoverable bool      `json:"recoverable"`
}
```

### 6.2 错误处理机制
- 分层错误处理：每层只处理自己职责范围内的错误
- 错误包装：保留原始错误信息
- 恢复策略：可恢复错误的自动重试机制
- 用户友好：错误信息本地化和简化

## 7. 日志系统

### 7.1 日志配置
```go
type LogConfig struct {
    Level      string    `json:"level"`
    Output     string    `json:"output"`
    Format     string    `json:"format"`
    Rotation   Rotation  `json:"rotation"`
    Structured bool      `json:"structured"`
}

type Rotation struct {
    MaxSize    string `json:"max_size"`
    MaxAge     string `json:"max_age"`
    MaxBackups int    `json:"max_backups"`
    Compress   bool   `json:"compress"`
}
```

### 7.2 日志级别
- DEBUG: 详细调试信息
- INFO: 一般信息
- WARN: 警告信息
- ERROR: 错误信息
- FATAL: 严重错误

## 8. 测试策略

### 8.1 测试结构
```
test/
├── unit/                    # 单元测试
│   ├── config/
│   ├── scanner/
│   ├── cleaner/
│   └── backup/
├── integration/             # 集成测试
│   ├── full_workflow_test.go
│   └── error_handling_test.go
├── fixtures/               # 测试数据
│   ├── mock_db/
│   ├── test_config/
│   └── sample_files/
└── performance/            # 性能测试
    ├── large_dataset_test.go
    └── memory_usage_test.go
```

### 8.2 测试工具
- 测试数据库：SQLite内存数据库
- 模拟文件系统：os.TempDir() + 临时文件
- 性能分析：builtin testing package + pprof

这个架构设计为后续的实现提供了清晰的技术路线图和模块边界。