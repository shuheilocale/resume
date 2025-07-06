#!/usr/bin/env python3
import os
import re
import textstat
import json
from pathlib import Path

def extract_text_from_markdown(file_path):
    """マークダウンファイルからテキストを抽出"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # マークダウン記法を除去
    # ヘッダー
    content = re.sub(r'^#{1,6}\s+', '', content, flags=re.MULTILINE)
    # リンク
    content = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', content)
    # 画像
    content = re.sub(r'!\[([^\]]*)\]\([^\)]+\)', '', content)
    # 強調
    content = re.sub(r'\*\*([^\*]+)\*\*', r'\1', content)
    content = re.sub(r'\*([^\*]+)\*', r'\1', content)
    # コードブロック
    content = re.sub(r'```[^`]*```', '', content, flags=re.DOTALL)
    # インラインコード
    content = re.sub(r'`([^`]+)`', r'\1', content)
    # テーブル記法
    content = re.sub(r'\|[^\n]+\|', '', content)
    # リスト記号
    content = re.sub(r'^[\*\-]\s+', '', content, flags=re.MULTILINE)
    # 数字リスト
    content = re.sub(r'^\d+\.\s+', '', content, flags=re.MULTILINE)
    # mermaidブロック
    content = re.sub(r'```mermaid[^`]*```', '', content, flags=re.DOTALL)
    
    return content.strip()

def analyze_readability(text, lang='ja'):
    """テキストの可読性を分析"""
    results = {}
    
    if lang == 'en':
        # 英語用の可読性指標
        results['flesch_reading_ease'] = textstat.flesch_reading_ease(text)
        results['flesch_kincaid_grade'] = textstat.flesch_kincaid_grade(text)
        results['gunning_fog'] = textstat.gunning_fog(text)
        results['automated_readability_index'] = textstat.automated_readability_index(text)
        results['coleman_liau_index'] = textstat.coleman_liau_index(text)
        results['reading_time_minutes'] = textstat.reading_time(text, ms_per_char=14.69) / 60
    
    # 共通の統計情報
    results['character_count'] = len(text)
    results['word_count'] = len(text.split())
    results['sentence_count'] = text.count('。') + text.count('.') + text.count('!') + text.count('?')
    
    if results['sentence_count'] > 0:
        results['avg_words_per_sentence'] = results['word_count'] / results['sentence_count']
    else:
        results['avg_words_per_sentence'] = 0
    
    return results

def interpret_scores(scores, lang='en'):
    """スコアを解釈して推奨事項を生成"""
    recommendations = []
    
    if lang == 'en':
        # Flesch Reading Ease (0-100: 高いほど読みやすい)
        if 'flesch_reading_ease' in scores:
            fre = scores['flesch_reading_ease']
            if fre < 30:
                recommendations.append("Very difficult to read. Consider simplifying sentences.")
            elif fre < 50:
                recommendations.append("Difficult to read. Suitable for college graduates.")
            elif fre < 60:
                recommendations.append("Fairly difficult. Suitable for high school seniors.")
            elif fre < 70:
                recommendations.append("Standard difficulty. Suitable for 8th-9th graders.")
            else:
                recommendations.append("Easy to read.")
        
        # Flesch-Kincaid Grade Level
        if 'flesch_kincaid_grade' in scores:
            fkg = scores['flesch_kincaid_grade']
            if fkg > 12:
                recommendations.append(f"Reading level: College (Grade {fkg:.1f})")
            elif fkg > 8:
                recommendations.append(f"Reading level: High School (Grade {fkg:.1f})")
            else:
                recommendations.append(f"Reading level: Middle School (Grade {fkg:.1f})")
    
    # 共通の推奨事項
    if scores.get('avg_words_per_sentence', 0) > 25:
        recommendations.append("Average sentence length is high. Consider breaking up long sentences.")
    
    return recommendations

def main():
    """メイン処理"""
    resume_files = {
        'ja': Path('ja/index.md'),
        'en': Path('en/index.md')
    }
    
    results = {}
    
    for lang, file_path in resume_files.items():
        if file_path.exists():
            print(f"\n{'='*60}")
            print(f"Analyzing {lang.upper()} resume: {file_path}")
            print('='*60)
            
            # テキスト抽出
            text = extract_text_from_markdown(file_path)
            
            # 可読性分析
            scores = analyze_readability(text, lang)
            results[lang] = scores
            
            # 結果表示
            print(f"\n📊 Readability Scores:")
            for metric, value in scores.items():
                if isinstance(value, float):
                    print(f"  - {metric.replace('_', ' ').title()}: {value:.2f}")
                else:
                    print(f"  - {metric.replace('_', ' ').title()}: {value}")
            
            # 推奨事項
            if lang == 'en':
                recommendations = interpret_scores(scores, lang)
                if recommendations:
                    print(f"\n💡 Recommendations:")
                    for rec in recommendations:
                        print(f"  - {rec}")
    
    # 結果をJSONファイルに保存
    output_dir = Path('assets/analytics')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    with open(output_dir / 'readability-scores.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Analysis complete! Results saved to {output_dir / 'readability-scores.json'}")

if __name__ == '__main__':
    main()