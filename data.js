const STEPS = [
  {
    id: 'basic', title: '基本設定', description: '作品全体の土台になる設定なのだ。',
    sections: [
      { id: 'animeStyle', title: 'アニメスタイル', mode: 'single', options: [
        ['none','選択しない',''], ['soft','やわらかいアニメ調','soft anime style'], ['cute','キュートなアニメ調','cute anime style'], ['cinematic','シネマティックなアニメ調','cinematic anime style'], ['detailed','精密なアニメ調','highly detailed anime style']
      ]},
      { id: 'fantasy', title: 'ファンタジー設定', mode: 'single', options: [
        ['none','選択しない',''], ['realistic','現代・日常寄り','non-fantasy setting'], ['fantasy','ファンタジー','fantasy setting']
      ]}
    ]
  },
  {
    id: 'character', title: 'キャラクター', description: '性別・年齢・髪などを選ぶのだ。',
    sections: [
      { id: 'gender', title: '性別', mode: 'single', options: [['none','選択しない',''],['female','女性','female'],['male','男性','male'],['androgynous','中性的','androgynous']] },
      { id: 'age', title: '年齢層', mode: 'single', options: [['none','選択しない',''],['child','子ども','child'],['teen','ティーン','teenage'],['young','若者','young adult'],['adult','大人','adult']] },
      { id: 'hairPresence', title: '髪', mode: 'single', options: [['none','選択しない',''],['noneHair','髪なし','no hair'],['withHair','髪あり','hair']] },
      { id: 'hairLength', title: '髪の長さ', mode: 'single', options: [['none','選択しない',''],['short','ショート','short hair'],['medium','ミディアム','medium-length hair'],['long','ロング','long hair'],['verylong','とても長い','very long hair']] },
      { id: 'hairColor', title: '髪色', mode: 'multi', options: [['none','選択しない',''],['pink','淡いピンク','pale pink hair'],['blue','水色','light blue hair'],['white','白','white hair'],['black','黒','black hair'],['brown','茶','brown hair'],['silver','銀','silver hair']] },
      { id: 'hairTexture', title: '髪の質感', mode: 'multi', options: [['none','選択しない',''],['soft','ふわふわ','soft fluffy hair'],['silky','さらさら','silky smooth hair'],['messy','無造作','tousled hair'],['wavy','ウェーブ','wavy hair']] }
    ]
  },
  {
    id: 'clothing', title: '服装', description: '服の系統を選んで、あとから細部を詰めるのだ。',
    sections: [
      { id: 'outfitType', title: '服装タイプ', mode: 'single', options: [['none','選択しない',''],['maid','メイド服','maid outfit'],['hoodiePants','パーカー＋ズボン','hoodie and pants'],['dress','ワンピース','dress'],['school','制服','school uniform'],['robe','ローブ','robe'],['armor','鎧','armor']] },
      { id: 'clothingTexture', title: '質感', mode: 'multi', options: [['none','選択しない',''],['cotton','コットン','cotton fabric'],['soft','やわらかい','soft fabric'],['smooth','なめらか','smooth fabric'],['lace','レース','delicate lace']] },
      { id: 'clothingColor', title: '色', mode: 'multi', options: [['none','選択しない',''],['pink','ピンク','pink'],['blue','青','blue'],['white','白','white'],['black','黒','black'],['cream','クリーム色','cream'],['lavender','ラベンダー','lavender']] },
      { id: 'clothingSize', title: 'サイズ感', mode: 'single', options: [['none','選択しない',''],['fitted','ぴったり','fitted'],['normal','標準','regular fit'],['oversized','大きめ','oversized']] },
      { id: 'specialClothing', title: '特殊設定', mode: 'multi', options: [['none','選択しない',''],['sleeves','萌え袖','extra-long sleeves'],['ribbon','大きなリボン','large ribbon'],['frills','フリル多め','abundant frills']] }
    ]
  },
  {
    id: 'eyes', title: '瞳', description: '左右を別々に設定できるのだ。',
    sections: [
      { id: 'rightEye', title: '右目の色', mode: 'single', options: [['none','選択しない',''],['blue','青','blue'],['pink','ピンク','pink'],['green','緑','green'],['purple','紫','purple'],['gold','金','gold'],['red','赤','red']] },
      { id: 'leftEye', title: '左目の色', mode: 'single', options: [['none','選択しない',''],['blue','青','blue'],['pink','ピンク','pink'],['green','緑','green'],['purple','紫','purple'],['gold','金','gold'],['red','赤','red']] },
      { id: 'eyeExpression', title: '瞳の雰囲気', mode: 'multi', options: [['none','選択しない',''],['lively','いきいき','lively eyes'],['sparkling','キラキラ','sparkling eyes'],['empty','虚ろ','empty eyes'],['gentle','優しい','gentle eyes']] }
    ]
  },
  {
    id: 'items', title: '持ち物', description: 'キャラクターが持っているものを選ぶのだ。',
    sections: [
      { id: 'item', title: 'アイテム', mode: 'multi', options: [['none','選択しない',''],['teddy','くまのぬいぐるみ','a teddy bear plushie'],['catPlush','猫のぬいぐるみ','a cat plushie'],['book','本','a book'],['umbrella','傘','an umbrella'],['wand','魔法の杖','a magic wand']] },
      { id: 'itemSize', title: 'ぬいぐるみサイズ', mode: 'single', options: [['none','選択しない',''],['small','小さい','small'],['medium','普通','medium-sized'],['large','大きい','large']] }
    ]
  },
  {
    id: 'expression', title: '表情・特徴', description: '表情や身長、職業などを決めるのだ。',
    sections: [
      { id: 'expression', title: '表情', mode: 'multi', options: [['none','選択しない',''],['happy','嬉しい','happy expression'],['sad','悲しい','sad expression'],['proud','自慢げ','proud expression'],['shy','照れた','shy expression'],['calm','穏やか','calm expression']] },
      { id: 'height', title: '身長', mode: 'single', options: [['none','選択しない',''],['short','小柄','short stature'],['average','標準','average height'],['tall','長身','tall stature']] },
      { id: 'job', title: '職業・役割', mode: 'multi', options: [['none','選択しない',''],['student','学生','student'],['maid','メイド','maid'],['mage','魔法使い','mage'],['ghost','幽霊','ghost'],['adventurer','冒険者','adventurer']] }
    ]
  },
  {
    id: 'mood', title: '全体の雰囲気', description: '複数選択できる雰囲気設定なのだ。競合するものは同時に選ばないようにするのだ。',
    sections: [
      { id: 'overallMood', title: '印象', mode: 'multi', options: [['none','選択しない',''],['cute','可愛い','cute'],['innocent','あどけない','innocent'],['elegant','上品','elegant'],['mysterious','神秘的','mysterious'],['energetic','元気','energetic'],['dreamy','夢幻的','dreamy']] },
      { id: 'lineMood', title: '線の雰囲気', mode: 'multi', options: [['none','選択しない',''],['delicate','繊細','delicate linework'],['clean','すっきり','clean linework'],['soft','柔らかい','soft linework'],['bold','力強い','bold linework']] },
      { id: 'colorMood', title: '色の雰囲気', mode: 'multi', options: [['none','選択しない',''],['pastel','パステル','pastel colors'],['vivid','鮮やか','vivid colors'],['soft','淡い','soft colors'],['warm','暖色系','warm color palette'],['cool','寒色系','cool color palette']] }
    ]
  },
  {
    id: 'background', title: '背景', description: '最後に背景を選ぶのだ。',
    sections: [
      { id: 'background', title: '背景', mode: 'single', options: [['none','選択しない',''],['noneBg','背景なし','simple background'],['bedroom','部屋','cozy bedroom'],['forest','森','fantasy forest'],['city','街','city street'],['school','学校','school interior'],['aquarium','水族館','aquarium'],['castle','城','fantasy castle']] }
    ]
  }
];

const COMBINATION_RULES = [
  { ids: ['cute','innocent'], phrase: 'adorably cute and deeply innocent' },
  { ids: ['cute','dreamy'], phrase: 'dreamily cute' },
  { ids: ['elegant','mysterious'], phrase: 'elegant and mysteriously refined' },
  { ids: ['pastel','soft'], phrase: 'soft pastel color harmony' },
  { ids: ['delicate','soft'], phrase: 'delicate, soft linework' }
];
