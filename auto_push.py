import os
import subprocess
from datetime import datetime

def run_command(command):
    """执行shell命令并返回输出"""
    try:
        # 设置环境变量，强制使用UTF-8编码
        my_env = os.environ.copy()
        my_env["PYTHONIOENCODING"] = "utf-8"
        
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True,
            encoding='utf-8',
            env=my_env
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"命令执行出错: {e}")
        print(f"错误输出: {e.stderr}")
        return None

def setup_gitea_remote():
    """设置Gitea远程仓库"""
    # 检查是否已配置gitea远程仓库
    remotes = run_command("git remote -v")
    if remotes and "gitea" not in remotes:
        gitea_url = input("请输入Gitea仓库URL (格式: git@your-gitea-instance.com:username/repository.git): ")
        if gitea_url:
            run_command(f"git remote add gitea {gitea_url}")
            print("Gitea远程仓库配置成功")
            return True
    return False

def get_current_branch():
    """获取当前分支名"""
    branch = run_command("git rev-parse --abbrev-ref HEAD")
    return branch.strip() if branch else "main"

def git_auto_push():
    # 检查是否有修改的文件
    status = run_command("git status --porcelain")
    
    if not status:
        print("没有需要提交的修改")
        return
    
    # 设置Gitea远程仓库（如果需要）
    setup_gitea_remote()
    
    # 获取当前分支
    current_branch = get_current_branch()
    
    # 获取当前时间作为提交信息
    commit_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_message = f"自动提交于 {commit_time}"
    
    # Git 操作序列
    commands = [
        "git add .",
        f'git commit -m "{commit_message}"'
    ]
    
    # 添加推送命令
    remotes = run_command("git remote -v")
    if "origin" in remotes:
        commands.append(f"git push origin {current_branch}")
    if "gitea" in remotes:
        commands.append(f"git push gitea {current_branch}")
    
    # 执行所有Git命令
    for cmd in commands:
        print(f"执行: {cmd}")
        output = run_command(cmd)
        if output:
            print(output)

if __name__ == "__main__":
    # 确保在git仓库目录中
    if not os.path.exists(".git"):
        print("错误：当前目录不是git仓库")
    else:
        git_auto_push() 