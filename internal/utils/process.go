package utils

import (
	"fmt"
	"os/exec"
	"runtime"
	"strconv"
	"strings"
	"time"
)

// KiroProcess Kiro 进程信息
type KiroProcess struct {
	PID  int
	Name string
}

// IsKiroRunning 检测 Kiro 是否正在运行
func IsKiroRunning() (bool, []KiroProcess, error) {
	var processes []KiroProcess

	switch runtime.GOOS {
	case "darwin", "linux":
		// 使用 pgrep 查找 Kiro 进程
		out, err := exec.Command("pgrep", "-l", "-i", "kiro").Output()
		if err != nil {
			// pgrep 没找到进程时返回 exit code 1，这不是错误
			if exitErr, ok := err.(*exec.ExitError); ok && exitErr.ExitCode() == 1 {
				return false, nil, nil
			}
			return false, nil, err
		}

		lines := strings.Split(strings.TrimSpace(string(out)), "\n")
		for _, line := range lines {
			if line == "" {
				continue
			}
			parts := strings.SplitN(line, " ", 2)
			if len(parts) >= 1 {
				pid, _ := strconv.Atoi(parts[0])
				name := "Kiro"
				if len(parts) >= 2 {
					name = parts[1]
				}
				processes = append(processes, KiroProcess{PID: pid, Name: name})
			}
		}

	case "windows":
		// Windows 使用 tasklist
		out, err := exec.Command("tasklist", "/FI", "IMAGENAME eq Kiro.exe", "/FO", "CSV", "/NH").Output()
		if err != nil {
			return false, nil, err
		}

		lines := strings.Split(strings.TrimSpace(string(out)), "\n")
		for _, line := range lines {
			if strings.Contains(line, "Kiro") {
				// CSV 格式: "Kiro.exe","1234",...
				parts := strings.Split(line, ",")
				if len(parts) >= 2 {
					pidStr := strings.Trim(parts[1], "\"")
					pid, _ := strconv.Atoi(pidStr)
					processes = append(processes, KiroProcess{PID: pid, Name: "Kiro.exe"})
				}
			}
		}
	}

	return len(processes) > 0, processes, nil
}

// StopKiro 停止 Kiro 进程
func StopKiro(graceful bool) error {
	running, processes, err := IsKiroRunning()
	if err != nil {
		return fmt.Errorf("检测 Kiro 进程失败: %v", err)
	}

	if !running {
		return nil // Kiro 没有运行
	}

	for _, proc := range processes {
		if err := stopProcess(proc.PID, graceful); err != nil {
			return fmt.Errorf("停止进程 %d 失败: %v", proc.PID, err)
		}
	}

	// 等待进程退出
	for i := 0; i < 10; i++ {
		time.Sleep(500 * time.Millisecond)
		running, _, _ = IsKiroRunning()
		if !running {
			return nil
		}
	}

	return fmt.Errorf("Kiro 进程未能在 5 秒内退出")
}

// stopProcess 停止单个进程
func stopProcess(pid int, graceful bool) error {
	switch runtime.GOOS {
	case "darwin", "linux":
		signal := "-TERM"
		if !graceful {
			signal = "-KILL"
		}
		return exec.Command("kill", signal, strconv.Itoa(pid)).Run()

	case "windows":
		return exec.Command("taskkill", "/PID", strconv.Itoa(pid), "/F").Run()
	}

	return fmt.Errorf("不支持的操作系统: %s", runtime.GOOS)
}

// WaitForKiroExit 等待 Kiro 退出
func WaitForKiroExit(timeout time.Duration) bool {
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		running, _, _ := IsKiroRunning()
		if !running {
			return true
		}
		time.Sleep(500 * time.Millisecond)
	}
	return false
}
