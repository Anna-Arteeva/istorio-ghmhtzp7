/*
  # Add Well Done Info Card
  
  1. Data Changes
    - Insert new info card with translations for all supported languages
    - Set active_days to 1 to show on first day
    - Set order to 3 to appear after the second card
    - Set target languages to all supported languages
*/

INSERT INTO info_cards (
  name,
  active_days,
  "order",
  target_languages,
  content_json
) VALUES (
  'well_done',
  1,
  3,
  ARRAY['de', 'en', 'es', 'fr', 'it', 'nl', 'pt', 'ru', 'ua']::language_code[],
  '{
    "de": {
      "title": "Gut gemacht!",
      "description": "Überrasche deine Kollegen oder Freunde mit einem frischen Witz, Übung macht den Meister!"
    },
    "en": {
      "title": "Well done!",
      "description": "Surprise your colleague or a friend with a fresh joke, practice makes perfect!"
    },
    "es": {
      "title": "¡Bien hecho!",
      "description": "¡Sorprende a tu colega o amigo con un chiste nuevo, la práctica hace al maestro!"
    },
    "fr": {
      "title": "Bien joué !",
      "description": "Surprenez vos collègues ou amis avec une nouvelle blague, c''est en forgeant qu''on devient forgeron !"
    },
    "it": {
      "title": "Ben fatto!",
      "description": "Sorprendi un collega o un amico con una battuta fresca, la pratica rende perfetti!"
    },
    "nl": {
      "title": "Goed gedaan!",
      "description": "Verras je collega of vriend met een verse grap, oefening baart kunst!"
    },
    "pt": {
      "title": "Muito bem!",
      "description": "Surpreenda seu colega ou amigo com uma piada nova, a prática leva à perfeição!"
    },
    "ru": {
      "title": "Отлично!",
      "description": "Удиви коллегу или друга свежей шуткой, практика ведет к совершенству!"
    },
    "ua": {
      "title": "Чудово!",
      "description": "Здивуй колегу чи друга свіжим жартом, практика веде до досконалості!"
    }
  }'
);