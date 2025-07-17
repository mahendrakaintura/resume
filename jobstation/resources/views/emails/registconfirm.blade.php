@component('mail::message')
# 会員登録確認のお知らせ

会員登録を完了するために、以下のリンクをクリックしてください。

@component('mail::button', ['url' => $verificationUrl])
メールアドレスを確認
@endcomponent

このリンクは60分後に無効となります。

※このメールに心当たりがない場合は、お手数ですが破棄してください。<br><br>
Thanks,jobstation
@endcomponent