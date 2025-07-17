# JobStation

「JobStation」はフリーランスエンジニアに向けた案件紹介サイトです。ユーザー用と管理者用の2つのリポジトリがあり、こちらは前者となります。それぞれ「ジョブステーションサイト」「管理システム」という名称で呼び分けています。

## 機能概要

- 案件の掲載
- ユーザー認証
- お気に入り登録
- スキルシート登録
- 案件への応募
- 応募状況の確認
- その他基本的な機能

## 主要ディレクトリ構成

```
jobstation/
├── app/                   # アプリケーションのコアコード
│   ├── Http/              
│   │   ├── Controllers/   # 各機能のコントローラー
│   │       ├── Auth/      # 認証関連
│   │       ├── Entry/     # 応募関連
│   │       ├── Project/   # 案件関連
│   │       └── Skillsheet/# スキルシート関連
│   ├── Mail/              # メール送信クラス
│   └── Models/            # DBテーブル定義
├── config/
│   └── constants/         # 定数定義
├── database/              # DB関連
│   └── seeders/           # 開発用データ
├── resources/            
│   ├── js/               
│   │   ├── Components/    # 共通コンポーネント
│   │   │   ├── Entry/     # 応募関連
│   │   │   └── Project/   # 案件関連
│   │   ├── Layouts/       # レイアウト
│   │   └── Pages/         # 各ページ
│   └── views/
│       └── emails/        # メールテンプレート
├── routes/                # ルーティング定義
```

## 開発ガイドライン

### ブランチ戦略

- 統合ブランチ: `main`
- 作業ブランチ: `feature/jbst-{チケット番号}`
- ステージングブランチ: `staging`

### コミットメッセージ規約

```
type: 内容

# Type
feat: 実装
fix: 修正
update: 改善
change: 変更
clean: 整形
```

### コーディング規約

- 原則としてMVC+Routes以外は変更しないものとする
- コード品質を最優先とする
```

## 開発サーバー

```zsh
# アプリケーションサーバー起動
php artisan serve

# フロントエンド開発サーバー起動
npm run dev

# メール開発サーバー起動
mailpit
```

## コントリビューション

1. backlogを確認
2. ブランチを作成（`feature/jbst-{チケット番号}`）
3. 変更をコミットおよびプッシュ
4. プルリクエストを作成

## デプロイ手順

### 前提
- sshによる手動デプロイ
- 接続設定済
- Apache, PHP, Composer, Node.js, npmがサーバーにインストール済

1. ローカルマシンにてアーカイブの作成
```
cd /Users/Username/Desktop/jobstation
tar -czf jobstation.tar.gz src/
```

2. rootユーザー以外でサーバーのホームディレクトリへ転送
```
scp jobstation.tar.gz guest1@IPaddress:~/
```

3. rootユーザー以外でサーバーに接続
```
ssh guest1@IPaddress
```

4. rootユーザーに切り替え
```
su -
```

5. 転送したアーカイブを移動
```
mv /home/guest1/jobstation.tar.gz /var/www/
```

6. 移動して展開
```
cd /var/www
tar -xzf jobstation.tar.gz
```

7. 依存関係のインストール
```
cd jobstation
composer install --no-dev
npm install
```

8. 環境設定とビルド
```
cp .env.staging .env
php artisan key:generate
npm run build
```

9. キャッシュリセット
```
rm -f public/hot
rm -f bootstrap/cache/*
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
```

10. 権限設定とApache再起動
```
cd ../
chown -R guest1:guest1 jobstation
chmod -R 757 jobstation/storage
systemctl restart httpd
```

### スクリプトファイルによるデプロイ
```
./deploy.sh
```