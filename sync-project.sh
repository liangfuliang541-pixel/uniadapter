#!/bin/bash
# UniAdapter 项目同步脚本

echo "UniAdapter 项目同步脚本"
echo "======================"

echo "当前时间: $(date)"
echo "当前分支状态:"
git status

echo ""
echo "尝试推送代码到远程仓库..."
git push origin main

if [ $? -eq 0 ]; then
    echo "推送成功！"
    echo "最新提交:"
    git log --oneline -3
else
    echo "推送失败，创建本地备份..."
    
    echo "备份当前代码..."
    backup_dir="backup_$(date +%Y%m%d_%H%M%S)"
    mkdir "$backup_dir"
    
    echo "复制项目文件到备份目录..."
    cp -r . "$backup_dir" 2>/dev/null
    
    echo "备份完成: $backup_dir"
    echo "请稍后重试推送或手动处理"
fi

echo ""
echo "脚本执行完成"