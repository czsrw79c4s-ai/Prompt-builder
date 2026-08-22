/*
 * Conditional UI and prompt rules.
 * The base option dictionary stays in data.js; this file describes how the
 * builder behaves when selections change.
 */
const SECTION_RULES = {
  fantasyTraits: ({ selections }) => selections.fantasy?.includes('fantasy'),
  outfitColorRoles: ({ selections }) => !!selections.outfitType?.length && !selections.outfitType.includes('none'),
  upperClothing: ({ selections }) => selections.outfitType?.includes('hoodiePants'),
  lowerClothing: ({ selections }) => selections.outfitType?.includes('hoodiePants'),
  composition: () => true
};

const EXTRA_SECTIONS = [
  {
    id: 'fantasyTraits', title: 'ファンタジー特徴', mode: 'multi',
    options: [['none','選択しない',''],['animalEars','獣耳','animal ears'],['animalTail','獣尻尾','animal tail'],['wings','翼','wings'],['horns','角','horns'],['elfEars','エルフ耳','pointed elf ears'],['demonFeatures','魔族的特徴','demonic features'],['spiritFeatures','精霊的特徴','spiritual features']],
    visibleWhen: 'fantasyTraits'
  },
  {
    id: 'outfitColorRoles', title: '服のカラー構成', mode: 'roleColor',
    roles: [
      { id: 'main', title: 'メインカラー', max: 2, options: [['white','白','white'],['cream','クリーム','cream'],['black','黒','black'],['pink','ピンク','pink'],['blue','青','blue'],['lavender','ラベンダー','lavender']] },
      { id: 'sub', title: 'サブカラー', max: 2, options: [['white','白','white'],['cream','クリーム','cream'],['black','黒','black'],['pink','ピンク','pink'],['blue','青','blue'],['lavender','ラベンダー','lavender']] },
      { id: 'accent', title: 'アクセントカラー', max: 2, options: [['white','白','white'],['cream','クリーム','cream'],['black','黒','black'],['pink','ピンク','pink'],['blue','青','blue'],['lavender','ラベンダー','lavender']] }
    ],
    visibleWhen: 'outfitColorRoles'
  },
  {
    id: 'upperClothing', title: '上半身', mode: 'single',
    options: [['none','選択しない',''],['hoodie','パーカー','hoodie'],['shirt','シャツ','shirt'],['blouse','ブラウス','blouse'],['sweater','セーター','sweater']],
    visibleWhen: 'upperClothing'
  },
  {
    id: 'lowerClothing', title: '下半身', mode: 'single',
    options: [['none','選択しない',''],['pants','ズボン','pants'],['skirt','スカート','skirt'],['shorts','ショートパンツ','shorts']],
    visibleWhen: 'lowerClothing'
  },
  {
    id: 'composition', title: '構図・ポーズ', mode: 'collection',
    groups: [
      { id: 'pose', title: 'ポーズ', mode: 'multi', options: [['standing','立っている','standing'],['sitting','座っている','sitting'],['walking','歩いている','walking'],['waving','手を振る','waving'],['handsChest','手を胸元に置く','hands held near chest'],['armsOpen','両手を広げる','arms outstretched'],['lookingBack','振り返る','looking back']] },
      { id: 'gaze', title: '視線', mode: 'single', options: [['none','選択しない',''],['camera','カメラを見る','looking at the viewer'],['side','横を見る','looking to the side'],['up','上を見る','looking upward'],['down','下を見る','looking downward'],['closed','目を閉じる','eyes closed']] },
      { id: 'framing', title: '構図', mode: 'single', options: [['none','選択しない',''],['full','全身','full-body composition'],['upper','上半身','upper-body composition'],['bust','バストアップ','bust shot'],['close','顔アップ','close-up portrait'],['wide','ワイド','wide composition']] },
      { id: 'angle', title: 'カメラアングル', mode: 'single', options: [['none','選択しない',''],['front','正面','front view'],['side','横向き','side view'],['back','後ろ姿','back view'],['high','俯瞰','high-angle view'],['low','ローアングル','low-angle view']] }
    ],
    visibleWhen: 'composition'
  }
];

const PROMPT_RULES = [
  { when: ids => ids.includes('animalEars') && ids.includes('animalTail'), phrase: 'matching animal ears and tail' },
  { when: ids => ids.includes('wings') && ids.includes('elfEars'), phrase: 'ethereal winged elf character' },
  { when: ids => ids.includes('cute') && ids.includes('innocent'), phrase: 'adorably cute with an especially innocent expression' },
  { when: ids => ids.includes('cute') && ids.includes('innocent') && ids.includes('dreamy'), phrase: 'dreamily adorable, deeply innocent, with an ethereal charm' }
];
