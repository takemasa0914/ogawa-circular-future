# オガワエコノス — Circular Future

「府中から、宇宙へ。」を軸にした5ページのリブランディング提案サイト。サーバーやデータベースは不要です。

公開サイト: https://ogawa-circular-future.vercel.app

## 体験

- ドラッグで回転する地球。府中・ベトナム・世界・宇宙の視点移動、拡縮、矢印キー操作。
- 5つの要素を動かせる循環図。光がつながりを流れ、地域／宇宙モードで説明が変わります。
- 共創テーマの絞り込み、仕事紹介、相談メモの作成とコピー。
- 動きの一時停止、視差効果軽減設定、WebGL非対応時の静止画表示。

## ページと編集場所

| URL | 内容 |
| --- | --- |
| `/` | トップ、地球、循環体験 |
| `/vision` | 原点、海外方針、長期構想 |
| `/services` | 事業・サービス |
| `/people` | 働く人と未来 |
| `/partners` | 共創テーマ、循環体験、相談メモ |

文章と共通レイアウトは `build_site.py`、体験のHTMLは `interactive_sections.py`。CSSとJavaScriptは `dist/` 内が編集元です。生成されたHTMLの直接編集は次のビルドで上書きされます。

## ローカル確認

Python 3.10以上。追加パッケージ不要。Nodeは構文チェックに使用します。

```sh
python build_site.py
python check_site.py
node --check dist/planet.js
node --check dist/circulation.js
python -m http.server 8765 --bind 127.0.0.1 --directory dist
```

`http://127.0.0.1:8765/` を開きます。

## GitHub / Vercel

このフォルダーをリポジトリのルートとして管理。VercelでGitHubリポジトリを接続し、Framework PresetはOther、Root Directoryは空欄。`vercel.json` が以下を設定します。

- Build: `python3 build_site.py && python3 check_site.py`
- Output: `dist`
- Install: なし
- `main` の更新をVercelのGit連携で自動デプロイします。

認証情報は保存しません。公開URL・管理先・検証結果は [PROJECT.md](PROJECT.md) に記録しています。

## 内容の扱い

正式な企業サイトを置き換えるものではない提案用試作です。HTML・robots.txt・Vercelヘッダーで検索除外しています。検索除外はアクセス制限ではありません。

現在の事業、海外展開方針、長期の宇宙研究構想を区別しています。地図の線と循環図は概念表現であり、実際の拠点・輸送ルート・物質収支シミュレーションではありません。宇宙事業の実績やJAXAとの提携は主張していません。

相談メモはブラウザ内のみで生成し、送信・永続保存しません。お問い合わせと採用は既存の外部窓口へ誘導します。

## 素材・出典

- 社員写真・ロゴ: https://www.pref.hiroshima.lg.jp/hcm-human-capital-jirei/1085907.html
- 地球静止画: NASA/JPL-Caltech PIA18033 https://images-assets.nasa.gov/image/PIA18033/PIA18033~orig.jpg
- 地球テクスチャ: three.js公開作例の earth_atmos_2048.jpg / earth_lights_2048.png https://threejs.org/examples/textures/planets/
- 経営方針: https://growth-100-oku.smrj.go.jp/companies/pdf/02240-00.pdf
- 宇宙関連の背景: https://www.ihub-tansa.jaxa.jp/assets/prev/files/RFP6/RecruitmentIssues.pdf
- フォント: Google Fonts（Noto Sans JP / Barlow Condensed）、システムフォントへフォールバック。

## 確認済み

全5ページのローカル参照145件、見出し、画像alt、ARIA参照、検索除外を自動確認。ブラウザで地球ドラッグ・地域切り替え・循環ノード移動・全要素接続・リセット・宇宙モードを確認。デスクトップとスマートフォン幅で表示確認済み。
