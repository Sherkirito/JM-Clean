# 构建 JM 洁净版

本版本基于 JM2 1.8.2。仓库内的 `inputs/android-shell-r7.zip` 是项目沿用的 r7 ARM64 二进制底包。`build.py` 会校验输入哈希，并将 `src` 中的应用模块、清单修改和新增原生代码合入底包。

在 Windows 准备 Python 3、Node.js、JDK、Android SDK Platform 35 和 Build Tools 35.0.0。在仓库根目录运行以下 PowerShell 命令，Java 和 javac 需在 PATH 中。

```powershell
$tools = Join-Path $env:ANDROID_HOME 'build-tools/35.0.0'
$platform = Join-Path $env:ANDROID_HOME 'platforms/android-35/android.jar'
python build.py jm-clean-unsigned.apk --tools $tools --platform $platform
& "$tools/zipalign.exe" -P 16 -f 4 jm-clean-unsigned.apk jm-clean-aligned.apk
& "$tools/apksigner.bat" sign --ks my-release.jks --out jm-clean.apk jm-clean-aligned.apk
& "$tools/apksigner.bat" verify --verbose jm-clean.apk
```

将 `my-release.jks` 换成自己的签名库。覆盖升级官方发布的洁净版需要相同的签名，请从 Releases 获取维护者签名的 APK。`build.ps1` 是维护者使用本机签名库的发布入口。

## 回归测试

网络与备份测试可分别运行 `node tests/network.cjs` 和 `node tests/backup.cjs`。完整测试还需要 Microsoft Edge 和下列依赖。

```powershell
npm install --no-save --package-lock=false playwright-core@1 jquery@3 owl.carousel@2
Get-ChildItem tests/*.cjs | ForEach-Object { node $_.FullName; if ($LASTEXITCODE) { throw $_.Name } }
```

RE2JS 随项目分发，许可证位于 [vendor/re2js/LICENSE](vendor/re2js/LICENSE)。

## 发布应用内更新

使用 `v主版本.次版本.修订号` 标签创建 GitHub 正式 Release，同时递增 Android 内部版本号。上传原签名的 `JM-Clean-<版本>-arm64.apk`。更新检查读取 GitHub 的最新正式版，弹窗中的说明取自发布正文的「更新内容」二级标题。

为每个需要支持的旧版执行一次下列命令，输入须为当时实际分发的签名 APK。将生成的 `.jmd.gz` 与完整 APK 一起上传，保留工具生成的文件名。GitHub 提供各附件的 SHA-256。客户端按已安装 APK 的摘要选择补丁，校验还原文件及应用签名，再打开系统安装器。

```powershell
python tools/make_update.py JM-Clean-1.0.1-arm64.apk JM-Clean-1.1.0-arm64.apk
python tests/update-delta.py --base JM-Clean-1.0.1-arm64.apk --target JM-Clean-1.1.0-arm64.apk
```
