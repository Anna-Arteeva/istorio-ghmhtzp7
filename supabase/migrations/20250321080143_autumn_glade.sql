/*
  # Add Info Cards Columns and Welcome Card

  1. Schema Changes
    - Add "order" column to info_cards table (optional integer)
    - Add target_languages column as language_code array
  
  2. Data
    - Insert welcome card with translations for all supported languages
    - Set target languages to all supported languages
    - Set order to 1 to ensure it appears first
*/

-- Add new columns to info_cards table
ALTER TABLE info_cards 
ADD COLUMN IF NOT EXISTS "order" integer,
ADD COLUMN IF NOT EXISTS target_languages language_code[] DEFAULT '{}';

-- Insert welcome card with proper language_code array casting
INSERT INTO info_cards (
  name,
  active_days,
  "order",
  target_languages,
  content_json
) VALUES (
  'welcome',
  1,
  1,
  ARRAY['de', 'en', 'es', 'fr', 'it', 'nl', 'pt', 'ru', 'ua']::language_code[],
  '{
    "de": {
      "title": "Willkommen bei Istorio!",
      "description": "Lerne eine neue Sprache durch lustige Geschichten.\n\nDein Story-Feed ist voller kurzer Texte, die du anhören, über die du lachen und aus denen du lernen kannst.\n\nBrauchst du Hilfe? Tippe auf einen beliebigen Satz für eine Übersetzung in deine Muttersprache.\n\nDu verstehst den Witz nicht? Kein Problem—der Humor-Decoder hilft dir! 😄\n\nBereit, dich lachend zur Sprachbeherrschung zu bringen?"
    },
    "en": {
      "title": "Welcome to Istorio!",
      "description": "Learn a new language through funny stories.\n\nYour story feed is packed with short reads you can listen to, laugh at, and learn from.\n\nNeed help? Tap on any sentence for a translation into your native language.\n\nDon''t get the joke? No worries—Humor Decoder to the rescue! 😄\n\nReady to laugh your way to fluency?"
    },
    "es": {
      "title": "¡Bienvenido a Istorio!",
      "description": "Aprende un nuevo idioma a través de historias divertidas.\n\nTu feed de historias está lleno de lecturas cortas que puedes escuchar, reírte y aprender.\n\n¿Necesitas ayuda? Toca cualquier frase para obtener una traducción a tu idioma nativo.\n\n¿No entiendes el chiste? ¡No te preocupes, el Decodificador de Humor al rescate! 😄\n\n¿Listo para reírte mientras aprendes?"
    },
    "fr": {
      "title": "Bienvenue sur Istorio !",
      "description": "Apprenez une nouvelle langue à travers des histoires amusantes.\n\nVotre fil d''actualité est rempli de courtes lectures que vous pouvez écouter, rire et apprendre.\n\nBesoin d''aide ? Appuyez sur n''importe quelle phrase pour obtenir une traduction dans votre langue maternelle.\n\nVous ne comprenez pas la blague ? Pas de souci, le Décodeur d''Humour est là ! 😄\n\nPrêt à apprendre en riant ?"
    },
    "it": {
      "title": "Benvenuto su Istorio!",
      "description": "Impara una nuova lingua attraverso storie divertenti.\n\nIl tuo feed di storie è pieno di brevi letture che puoi ascoltare, ridere e imparare.\n\nHai bisogno di aiuto? Tocca qualsiasi frase per una traduzione nella tua lingua madre.\n\nNon capisci la battuta? Non preoccuparti, il Decoder dell''Umorismo ti aiuterà! 😄\n\nPronto a ridere mentre impari?"
    },
    "nl": {
      "title": "Welkom bij Istorio!",
      "description": "Leer een nieuwe taal door grappige verhalen.\n\nJe verhalenfeed zit vol korte teksten om naar te luisteren, om te lachen en van te leren.\n\nHulp nodig? Tik op een zin voor een vertaling in je moedertaal.\n\nSnap je de grap niet? Geen zorgen—de Humor Decoder helpt je! 😄\n\nKlaar om al lachend vloeiend te worden?"
    },
    "pt": {
      "title": "Bem-vindo ao Istorio!",
      "description": "Aprenda um novo idioma através de histórias engraçadas.\n\nSeu feed de histórias está cheio de leituras curtas para ouvir, rir e aprender.\n\nPrecisa de ajuda? Toque em qualquer frase para uma tradução em seu idioma nativo.\n\nNão entendeu a piada? Sem problemas—o Decodificador de Humor está aqui! 😄\n\nPronto para aprender entre risadas?"
    },
    "ru": {
      "title": "Добро пожаловать в Istorio!",
      "description": "Изучайте новый язык через забавные истории.\n\nВаша лента историй полна коротких текстов, которые можно слушать, над которыми можно смеяться и учиться.\n\nНужна помощь? Нажмите на любое предложение для перевода на ваш родной язык.\n\nНе поняли шутку? Не беда—Декодер Юмора спешит на помощь! 😄\n\nГотовы учиться со смехом?"
    },
    "ua": {
      "title": "Ласкаво просимо до Istorio!",
      "description": "Вивчайте нову мову через кумедні історії.\n\nВаша стрічка історій повна коротких текстів, які можна слухати, сміятися та вчитися.\n\nПотрібна допомога? Торкніться будь-якого речення для перекладу вашою рідною мовою.\n\nНе зрозуміли жарт? Не хвилюйтеся—Декодер Гумору прийде на допомогу! 😄\n\nГотові вчитися зі сміхом?"
    }
  }'
);