# オガワエコノス Circular Future — プロジェクト記録

更新日: 2026年11月12日（日本時間）

## 管理先

| 項目 | 内容 |
| --- | --- |
| 公開サイト | https://ogawa-circular-future.vercel.app |
| GitHub | https://github.com/takemasa0914/ogawa-circular-future |
| リポジトリ公開範囲 | Public（作成時の設定） |
| 運用ブランチ | main |
| Vercelプロジェクト | ogawa-circular-future |
| Vercel管理画面 | https://vercel.com/masafumitakeda394-2929s-projects/ogawa-circular-future |
| VercelプロジェクトID | prj_538WzJaFQddkaMcMGdL8ocUSNjdU |

今回のホームページ専用の新規プロジェクトです。既存の配車アプリとは独立しています。GitHubのmainに変更を登録すると、Vercelが自動ビルドして公開します。

## 初回公開

- 状態: READY / production
- 初回公開コミット: 27b298014113cc4b483bd5e79281642667efadd8
- 初回デプロイID: dpl_FmTMTHToLSRX5wVP4TMZs9th4BxH
- ビルド: `python3 build_site.py && python3 check_site.py`
- 公開ディレクトリ: `dist`
- フレームワーク: Other（静的HTML / CSS / JavaScript）
- 外部パッケージのインストール: 不要

## 実装内容

地球をドラッグして回転し、府中・ベトナム・世界・宇宙を選んで視点と説明を切り替えられます。循環図は水・資源・エネルギー・土と食・暮らしの要素を動かせ、地域と宇宙の構想を探索できます。スマートフォン表示、キーボード操作、動きの停止、WebGL非対応時の静止画に対応します。

トップ／私たちの未来／事業・サービス／働く人と未来／共創パートナーの5ページ構成です。問い合わせ窓口へのリンクと、ブラウザ内で完結する相談メモを用意しています。

## 検証

- Vercelビルドで全5ページ・ローカル参照145件・見出し・画像alt・ARIA参照の検査に合格。
- 本番の全5ページ、地球・循環のJavaScript、地球テクスチャのHTTP 200を確認。
- デスクトップとスマートフォン幅で表示、地球のドラッグ・地域切り替え、循環ノード移動・全要素接続・リセット・宇宙モードをブラウザ確認。
- 検索除外をHTML・robots.txt・X-Robots-Tagに設定。

## 更新手順

1. 本文・共通レイアウトを `build_site.py`、体験部分のHTMLを `interactive_sections.py` で編集する。
2. スタイルと動作は `dist/style.css`、`dist/interactive.css`、`dist/app.js`、`dist/planet.js`、`dist/circulation.js` を編集する。
3. `python build_site.py` と `python check_site.py` を実行し、変更した操作をブラウザで確認する。
4. mainへコミット・プッシュする。
5. VercelのビルドがREADYになり、公開サイトに反映されたことを確認する。

## 提案サイトとしての扱い

正式公開前のリブランディング提案です。現在の事業、海外展開の方針、長期の宇宙研究構想を区別しています。宇宙での実績やJAXAとの提携を主張するものではありません。地図の線や循環図は概念表現です。

サイトはURLで閲覧できます。検索除外はアクセス制限ではありません。相談メモは送信・永続保存されません。正式運用に移る際には掲載内容・画像利用・問い合わせ先を会社側で確認し、検索公開方針を決めます。
