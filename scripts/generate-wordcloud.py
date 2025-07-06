#!/usr/bin/env python3
import os
import re
from pathlib import Path
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # GitHub Actions環境用

# 日本語フォントの設定
def get_japanese_font_path():
    """利用可能な日本語フォントを探す"""
    font_paths = [
        # GitHub Actions Ubuntu
        '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',
        '/usr/share/fonts/truetype/fonts-japanese-gothic.ttf',
        # macOS
        '/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc',
        '/Library/Fonts/Arial Unicode.ttf',
        # 一般的なLinux
        '/usr/share/fonts/truetype/takao-gothic/TakaoPGothic.ttf',
    ]
    
    for font_path in font_paths:
        if os.path.exists(font_path):
            return font_path
    
    return None

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

def create_stopwords(lang='ja'):
    """言語に応じたストップワードを作成"""
    common_stopwords = {
        'ja': [
            'する', 'れる', 'なる', 'ある', 'こと', 'これ', 'それ', 'もの',
            'ため', 'よう', 'から', 'まで', 'など', 'ない', 'いる', 'おり',
            'および', 'また', '年', '月', '日', 'に', 'を', 'は', 'が', 'で',
            'と', 'の', 'へ', 'や', 'も', 'より', 'から', 'まで', 'にて',
            '及び', '等', '約', '〜', '・', '／', '＆', '：', '、', '。',
            '兼', 'フェーズ', '担当', '使用', '技術', 'チーム', '規模',
            '役割', '概要', '名', 'メンバー'
        ],
        'en': [
            'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
            'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
            'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
            'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
            'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get',
            'which', 'go', 'me', 'using', 'used', 'responsibilities', 'team',
            'size', 'role', 'overview', 'members', 'technologies', 'member',
            'amp', 'nbsp', 'implemented', 'business', 'etc', 'various'
        ]
    }
    
    return set(common_stopwords.get(lang, []))

def generate_wordcloud(text, output_path, lang='ja', title=''):
    """ワードクラウドを生成"""
    # 言語別の設定
    if lang == 'ja':
        font_path = get_japanese_font_path()
        if not font_path:
            print(f"Warning: No Japanese font found. Using default font.")
            font_path = None
        
        # 日本語の場合、簡易的な単語分割
        # 実際にはMeCabなどを使うべきだが、GitHub Actions環境を考慮して簡易版
        words = re.findall(r'[一-龯ぁ-んァ-ヶー]+|[a-zA-Z]+', text)
        text = ' '.join(words)
    else:
        font_path = None
    
    # ストップワード
    stopwords = create_stopwords(lang)
    
    # ワードクラウドの生成
    wordcloud = WordCloud(
        width=800,
        height=400,
        background_color='white',
        stopwords=stopwords,
        font_path=font_path,
        colormap='viridis',
        max_words=100,
        relative_scaling=0.5,
        min_font_size=10
    ).generate(text)
    
    # 図の作成
    plt.figure(figsize=(10, 6))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.title(title, fontsize=16, pad=20)
    
    # 保存
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    
    print(f"Generated word cloud: {output_path}")

def main():
    """メイン処理"""
    resume_files = {
        'ja': {
            'path': Path('ja/index.md'),
            'title': '職務経歴書 - 頻出キーワード',
            'output': 'wordcloud-ja.png'
        },
        'en': {
            'path': Path('en/index.md'),
            'title': 'Resume - Frequent Keywords',
            'output': 'wordcloud-en.png'
        }
    }
    
    # 出力ディレクトリの作成
    output_dir = Path('assets/analytics')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    for lang, config in resume_files.items():
        if config['path'].exists():
            print(f"\nProcessing {lang.upper()} resume...")
            
            # テキスト抽出
            text = extract_text_from_markdown(config['path'])
            
            # ワードクラウド生成
            output_path = output_dir / config['output']
            generate_wordcloud(text, output_path, lang, config['title'])
    
    print(f"\n✅ Word clouds generated successfully in {output_dir}/")

if __name__ == '__main__':
    main()