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
