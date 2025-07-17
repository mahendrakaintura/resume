<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>スキルシート</title>
    <link rel="stylesheet" href=" asset('css/app.css') ">
    <style>
        @font-face {
            font-family: ipaexg;
            font-style: normal;
            font-weight: normal;
            src: url("{{ storage_path('fonts/ipaexg.ttf') }}");
        }

        body {
            font-family: ipaexg, sans-serif;
            font-size: 11pt;
        }

        table {
            border-collapse: collapse;
        }

        tr.top td {
            border: 1px solid transparent;
            border-bottom: 1px solid;
        }

        td {
            width: 20pt;
            text-align: center;
            border: 1px solid;
            word-break: break-word;
            word-wrap: break-word;
        }

        .label {
            background-color: rgb(212 212 216);
            word-wrap: normal;
        }
    </style>
</head>

<body>
    <table>
        <tr class="top">
            @for ($i = 0; $i < 50; $i++)
                <td style="width: 20pt;">
                </td>
                @endfor
        </tr>
        <tr>
            <td colspan="4">名前(イニシャル)</td>
            <td colspan="2">年齢</td>
            <td colspan="3">経験年数</td>
            <td colspan="2">性別</td>
            <td colspan="5">国籍</td>
            <td colspan="10">最終学歴</td>
            <td colspan="10">現在所</td>
            <td colspan="14">最寄り駅</td>
        </tr>
        <tr>
            <td colspan="4" style="height: 2.5rem">{{$user->initial}}</td>
            <td colspan="2">{{$user->age}}</td>
            <td colspan="3">{{$user->years_of_experience ? $user->years_of_experience . '年' : ''}}</td>
            <td colspan="2">{{$user->sex == 'woman' ? '女' : '男'}}</td>
            <td colspan="5">{{$user->nationality}}</td>
            <td colspan="10">{{$user->education}}</td>
            <td colspan="10">{{$user->address}}</td>
            <td colspan="6">{{$user->train_line}}</td>
            <td>線</td>
            <td colspan="6">{{$user->station}}</td>
            <td>駅</td>
        </tr>
    </table>
    <br />
    <table>
        <tr class="top">
            @for ($i = 0; $i < 50; $i++)
                <td style="width: 20pt;">
                </td>
                @endfor
        </tr>
        <tr>
            <td colspan="5" style="height: 2.5rem">資格</td>
            @for ($i = 0; $i < 5; $i++)
                <td colspan="9">{{$user->qualifications[$i] ?? ''}}</td>
                @endfor
        </tr>
    </table>
    <br />
    @php
    $workExperiences = $user->workExperiences;
    $workExperiencePages = collect([$workExperiences->slice(0, 2)])
    ->merge($workExperiences->slice(2)->chunk(3));
    @endphp
    @foreach ($workExperiencePages as $workExperiences)
    @if (count($workExperiences))
    <table style="page-break-inside: avoid;">
        <tr class="top">
            @for ($i = 0; $i < 50; $i++)
                <td style="width: 20pt;">
                </td>
                @endfor
        </tr>
        <tr class="label">
            <td colspan="1">No</td>
            <td colspan="3">期間</td>
            <td colspan="5">詳細</td>
            <td colspan="5">工程</td>
            <td colspan="20">業務内容</td>
            <td colspan="16">言語、OS、DB、FW、ツール　など</td>
        </tr>
        @foreach ($workExperiences as $workExperience)
        <tr>
            <td colspan="1" rowspan="13">{{$workExperience->display_order}}</td>
            <td colspan="3" rowspan="13">{{$workExperience->period}}ヶ月</td>
            <td colspan="5" class="label">業種</td>
            <td colspan="4" class="label">調査分析</td>
            <td colspan="1">{{$workExperience->analysis ? '〇' : ''}}</td>
            <td colspan="20" rowspan="13" style="vertical-align: top; text-align: left">{{$workExperience->description}}</td>
            <td colspan="3" rowspan="2" class="label">言語</td>
            <td colspan="13" rowspan="2" style="vertical-align: top; text-align: left">{{$workExperience->language}}</td>
        </tr>
        <tr>
            <td colspan="5" rowspan="2">{{$workExperience->business}}</td>
            <td colspan="4" class="label">要件定義</td>
            <td colspan="1">{{$workExperience->requirement_definition ? '〇' : ''}}</td>
        </tr>
        <tr>
            <td colspan="4" class="label">基本設計</td>
            <td colspan="1">{{$workExperience->basic_design ? '〇' : ''}}</td>
            <td colspan="3" class="label">OS</td>
            <td colspan="13" style="vertical-align: top; text-align: left">{{$workExperience->os}}</td>
        </tr>
        <tr>
            <td colspan="5" class="label">ＰＪ規模</td>
            <td colspan="4" class="label">詳細設計</td>
            <td colspan="1">{{$workExperience->detail_design ? '〇' : ''}}</td>
            <td colspan="3" class="label">DB</td>
            <td colspan="13" style="vertical-align: top; text-align: left">{{$workExperience->db}}</td>
        </tr>
        <tr>
            <td colspan="5">{{$pj_scale[$workExperience->pj_scale_id]}}</td>
            <td colspan="4" class="label">開発</td>
            <td colspan="1">{{$workExperience->programing ? '〇' : ''}}</td>
            <td colspan="3" class="label">FW</td>
            <td colspan="13" style="vertical-align: top; text-align: left">{{$workExperience->fw}}</td>
        </tr>
        <tr>
            <td colspan="5"></br></td>
            <td colspan="4" class="label">単体テスト</td>
            <td colspan="1">{{$workExperience->unit_test ? '〇' : ''}}</td>
            <td colspan="3" class="label">MW</td>
            <td colspan="13" style="vertical-align: top; text-align: left">{{$workExperience->mw}}</td>
        </tr>
        <tr>
            <td colspan="5" class="label">チーム人数</td>
            <td colspan="4" class="label">結合テスト</td>
            <td colspan="1">{{$workExperience->integration_test ? '〇' : ''}}</td>
            <td colspan="3" class="label">サーバー</td>
            <td colspan="13" style="vertical-align: top; text-align: left">{{$workExperience->server}}</td>
        </tr>
        <tr>
            <td colspan="4">{{$workExperience->team_size}}</td>
            <td>名</td>
            <td colspan="4" class="label">運用監視</td>
            <td colspan="1">{{$workExperience->monitoring ? '〇' : ''}}</td>
            <td colspan="3" class="label">開発環境</td>
            <td colspan="13" style="vertical-align: top; text-align: left">{{$workExperience->environment}}</td>
        </tr>
        <tr>
            <td colspan="5"></br></td>
            <td colspan="4" class="label">運用保守</td>
            <td colspan="1">{{$workExperience->maintenance ? '〇' : ''}}</td>
            <td colspan="3" class="label">ツール</td>
            <td colspan="13" style="vertical-align: top; text-align: left">{{$workExperience->tool}}</td>
        </tr>
        <tr>
            <td colspan="5" class="label">立場</td>
            <td colspan="4" class="label">サーバー設計</td>
            <td colspan="1">{{$workExperience->server_design ? '〇' : ''}}</td>
            <td colspan="3" class="label">ネットワーク</td>
            <td colspan="13" style="vertical-align: top; text-align: left">{{$workExperience->network}}</td>
        </tr>
        <tr>
            <td colspan="5" rowspan="3">{{$workExperience->position}}</td>
            <td colspan="4" class="label">サーバー構築</td>
            <td colspan="1">{{$workExperience->server_construction ? '〇' : ''}}</td>
            <td colspan="3" rowspan="3" class="label">その他</td>
            <td colspan="13" rowspan="3" style="vertical-align: top; text-align: left">{{$workExperience->others}}</td>
        </tr>
        <tr>
            <td colspan="4" class="label">ネットワーク設計</td>
            <td colspan="1">{{$workExperience->network_design ? '〇' : ''}}</td>
        </tr>
        <tr>
            <td colspan="4" class="label">ネットワーク構築</td>
            <td colspan="1">{{$workExperience->network_construction ? '〇' : ''}}</td>
        </tr>
        @endforeach
    </table>
    @endif
    @endforeach
    <br />
    <table style="page-break-inside: avoid;">
        <tr class="top">
            @for ($i = 0; $i < 50; $i++)
                <td style="width: 20pt; border-color: transparent">
                </td>
                @endfor
        </tr>
        <tr class="top">
            <td colspan="50" style="vertical-align: top; text-align: left">1 ：独学　2 ：指示が必要　　3：確認が必要　4 ：一人称でできる　5 ：指導できる</td>
        </tr>
        <tr>
            <td colspan="2" rowspan="31" class="label">保</br>有</br>技</br>術</td>
            <td colspan="8" class="label">業種</td>
            <td colspan="8" class="label">業務範囲</td>
            <td colspan="8" class="label">フロントエンド</td>
            <td colspan="8" class="label">バックエンド</td>
            <td colspan="8" class="label">OS</td>
            <td colspan="8" class="label">データベース</td>
        </tr>
        @php
        $businessKeys = array_keys($skill_score['business']);
        $workKeys = array_keys($skill_score['work']);
        $frontendKeys = array_keys($skill_score['frontend']);
        $backendKeys = array_keys($skill_score['backend']);
        $osKeys = array_keys($skill_score['os']);
        $databaseKeys = array_keys($skill_score['database']);
        @endphp
        @for ($i = 0; $i < 16; $i++)
            <tr>
            <td colspan="6">{{$skill_score['business'][$businessKeys[$i] ?? 'default_key']['display_name'] ?? ''}}<br /></td>
            <td colspan="2">{{$skill_score['business'][$businessKeys[$i] ?? 'default_key']['score'] ?? ''}}<br /></td>
            <td colspan="6">{{$skill_score['work'][$workKeys[$i] ?? 'default_key']['display_name'] ?? ''}}<br /></td>
            <td colspan="2">{{$skill_score['work'][$workKeys[$i] ?? 'default_key']['score'] ?? ''}}<br /></td>
            <td colspan="6">{{$skill_score['frontend'][$frontendKeys[$i] ?? 'default_key']['display_name'] ?? ''}}<br /></td>
            <td colspan="2">{{$skill_score['frontend'][$frontendKeys[$i] ?? 'default_key']['score'] ?? ''}}<br /></td>
            <td colspan="6">{{$skill_score['backend'][$backendKeys[$i] ?? 'default_key']['display_name'] ?? ''}}<br /></td>
            <td colspan="2">{{$skill_score['backend'][$backendKeys[$i] ?? 'default_key']['score'] ?? ''}}<br /></td>
            <td colspan="6">{{$skill_score['os'][$osKeys[$i] ?? 'default_key']['display_name'] ?? ''}}<br /></td>
            <td colspan="2">{{$skill_score['os'][$osKeys[$i] ?? 'default_key']['score'] ?? ''}}<br /></td>
            <td colspan="6">{{$skill_score['database'][$databaseKeys[$i] ?? 'default_key']['display_name'] ?? ''}}<br /></td>
            <td colspan="2">{{$skill_score['database'][$databaseKeys[$i] ?? 'default_key']['score'] ?? ''}}<br /></td>
            </tr>
            @endfor
            <tr>
                <td colspan="8" class="label">フレームワーク</td>
                <td colspan="8" class="label">ミドルウェア</td>
                <td colspan="8" class="label">サーバー</td>
                <td colspan="8" class="label">ツール</td>
                <td colspan="8" class="label">開発環境</td>
                <td colspan="8" class="label">その他</td>
            </tr>
            @php
            $frameworkKeys = array_keys($skill_score['framework'] ?? []);
            $middlewareKeys = array_keys($skill_score['middleware'] ?? []);
            $serverKeys = array_keys($skill_score['server'] ?? []);
            $toolKeys = array_keys($skill_score['tool'] ?? []);
            $environmentKeys = array_keys($skill_score['environment'] ?? []);
            $othersKeys = array_keys($skill_score['others'] ?? []);
            @endphp
            @for ($i = 0; $i < 13; $i++)
                <tr>
                <td colspan="6">{{$skill_score['framework'][$frameworkKeys[$i] ?? 'default_key']['display_name'] ?? ''}}<br /></td>
                <td colspan="2">{{$skill_score['framework'][$frameworkKeys[$i] ?? 'default_key']['score'] ?? ''}}<br /></td>
                <td colspan="6">{{$skill_score['middleware'][$middlewareKeys[$i] ?? 'default_key']['display_name'] ?? ''}}<br /></td>
                <td colspan="2">{{$skill_score['middleware'][$middlewareKeys[$i] ?? 'default_key']['score'] ?? ''}}<br /></td>
                <td colspan="6">{{$skill_score['server'][$serverKeys[$i] ?? 'default_key']['display_name'] ?? ''}}<br /></td>
                <td colspan="2">{{$skill_score['server'][$serverKeys[$i] ?? 'default_key']['score'] ?? ''}}<br /></td>
                <td colspan="6">{{$skill_score['tool'][$toolKeys[$i] ?? 'default_key']['display_name'] ?? ''}}<br /></td>
                <td colspan="2">{{$skill_score['tool'][$toolKeys[$i] ?? 'default_key']['score'] ?? ''}}<br /></td>
                <td colspan="6">{{$skill_score['environment'][$environmentKeys[$i] ?? 'default_key']['display_name'] ?? ''}}<br /></td>
                <td colspan="2">{{$skill_score['environment'][$environmentKeys[$i] ?? 'default_key']['score'] ?? ''}}<br /></td>
                <td colspan="6">{{$skill_score['others'][$othersKeys[$i] ?? 'default_key']['display_name'] ?? ''}}<br /></td>
                <td colspan="2">{{$skill_score['others'][$othersKeys[$i] ?? 'default_key']['score'] ?? ''}}<br /></td>
                </tr>
                @endfor
    </table>
    <br />
    <table style="page-break-inside: avoid;">
        <tbody>
            <tr class="top">
                @for ($i = 0; $i < 50; $i++)
                    <td style="width: 20pt; border-color: transparent">
                    </td>
                    @endfor
            </tr>
            <tr class="top">
                <td colspan="50" style="vertical-align: top; text-align: left">1 ：できない　2 ：少しできる　　3：普通　4 ：できる　5 ：良くできる</td>
            </tr>
            @php
            $personalityKeys = array_keys($personality);
            @endphp
            <tr>
                <td colspan="2" rowspan="5" class="label">人</br>物</br>像</td>
                @for ($i = 0; $i < 6; $i++)
                    <td colspan="6">{{$personality[$personalityKeys[$i] ?? 'default_key']['display_name'] ?? ''}}<br /></td>
                    <td colspan="2">{{$personality[$personalityKeys[$i] ?? 'default_key']['score'] ?? ''}}<br /></td>
                    @endfor
            </tr>
            @for ($i = 1; $i < 5; $i++)
                <tr>
                @for ($j = 0; $j < 6; $j++)
                    <td colspan="6">{{$personality[$personalityKeys[$i * 6 + $j] ?? 'default_key']['display_name'] ?? ''}}<br /></td>
                    <td colspan="2">{{$personality[$personalityKeys[$i * 6 + $j] ?? 'default_key']['score'] ?? ''}}<br /></td>
                    @endfor
                    </tr>
                    @endfor
        </tbody>
    </table>
</body>

</html>