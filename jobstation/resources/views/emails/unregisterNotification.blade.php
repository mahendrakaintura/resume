@component('mail::message')
# 退会完了のお知らせ

{{ $name ? $name . ' 様' : '' }}

ジョブステーションをご利用いただき、ありがとうございました。  
{{ $name ? $name . ' 様の' : '' }}退会手続きが完了しましたのでお知らせいたします。

{{ config('app.name') }}
@endcomponent