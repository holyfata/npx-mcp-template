#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_JSON="${SCRIPT_DIR}/package.json"

# 读取当前的 name 值
ORIGINAL_NAME=$(grep -o '"name": "[^"]*"' "$PACKAGE_JSON" | cut -d'"' -f4)
if [ -z "$ORIGINAL_NAME" ]; then
    echo "❌ 无法读取 package.json 中的 name 字段"
    exit 1
fi

# 将 @betterhyq/ 替换为 @dj-lib/
TEMP_NAME=$(echo "$ORIGINAL_NAME" | sed 's/@betterhyq\//@dj-lib\//')

# 如果名称没有变化，说明不包含 @betterhyq/
if [ "$ORIGINAL_NAME" = "$TEMP_NAME" ]; then
    echo "⚠️  警告: name 字段不包含 @betterhyq/，无需修改"
    echo "当前 name: $ORIGINAL_NAME"
    exit 1
fi

# 定义清理函数，确保在脚本退出时还原
cleanup() {
    echo "正在还原 package.json 的 name 字段..."
    sed -i '' "s|@dj-lib/|@betterhyq/|g" "$PACKAGE_JSON"
    echo "已还原 name 字段为: $ORIGINAL_NAME"
}

# 注册清理函数，在脚本退出时（正常或异常）都会执行
trap cleanup EXIT

# 修改 name 字段：将 @betterhyq/ 替换为 @dj-lib/
echo "正在修改 package.json 的 name 字段..."
echo "原始值: $ORIGINAL_NAME"
echo "临时值: $TEMP_NAME"

sed -i '' "s|@betterhyq/|@dj-lib/|g" "$PACKAGE_JSON"

echo "已修改 name 字段为: $TEMP_NAME"

# 执行 npm publish
echo "正在执行 npm publish..."
npm publish --registry=http://registry.m.jd.com/

# 检查发布结果
if [ $? -eq 0 ]; then
    echo "✅ npm publish 成功完成"
else
    echo "❌ npm publish 失败"
    exit 1
fi

