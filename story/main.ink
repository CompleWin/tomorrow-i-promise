VAR final_choice = ""
-> act_1
=== act_1 ===

# bg: act1/bg/bg1.png # fx: fadeIn # music: act1/music/theme.mp3
Опять без соли? # speaker: Гай # sprite: act1/sprites/guy_normal.png
А ты её купил? # speaker: Марта # sprite: act1/sprites/martha_normal.png
Я думал, у нас ещё оставалась. # speaker: Гай # sprite: act1/sprites/guy_normal.png
Ну вот и я думала. # speaker: Марта # sprite: act1/sprites/martha_normal.png
Слышен стук ложек. # sfx: act1/sfx/spoons.mp3
Ладно, завтра куплю. # speaker: Гай # sprite: act1/sprites/guy_smile.png
Ты вчера так же говорил. # speaker: Марта # sprite: act1/sprites/martha_smile.png
Завтра точно. # speaker: Гай # sprite: act1/sprites/guy_smile.png
Они продолжают ужинать.
Внезапно лампа над столом гаснет.

# bg: act1/bg/bg2.png # fx: blackout # music: act1/music/night.mp3
Комната погружается в темноту. Слышен только шум улицы.
Да чтоб тебя... # speaker: Гай # sprite: act1/sprites/guy_normal.png
Может, уже достанем свечи? # speaker: Марта # sprite: act1/sprites/martha_smile.png
Подожди, сейчас включат. # speaker: Гай # sprite: act1/sprites/guy_smile.png
...

# bg: act1/bg/bg3.png # fx: lightsOn
Ну вот, я же говорил. # speaker: Гай # sprite: act1/sprites/guy_smile.png
По дому проходит лёгкий ветерок.
Гай, я тебе кое-что сказать хотела. # speaker: Марта # sprite: act1/sprites/martha_normal.png
Что такое? # speaker: Гай # sprite: act1/sprites/guy_normal.png

# bg: act1/bg/bg4.png # fx: close
Марта берёт его за руку.

# bg: act1/bg/bg5.png # fx: close
Кажется, я беременна. # speaker: Марта # sprite: act1/sprites/martha_normal.png
Гай замирает. Несколько секунд он молча смотрит на неё.
Подожди... Серьёзно? # speaker: Гай # sprite: act1/sprites/guy_suprised.png
Я сегодня сделала тест. Даже два. # speaker: Марта # sprite: act1/sprites/martha_pregnant.png
И оба? # speaker: Гай # sprite: act1/sprites/guy_suprised.png
Марта улыбается и кивает. # sprite: act1/sprites/martha_smile.png
То есть... у нас будет двойня? # speaker: Гай # sprite: act1/sprites/guy_smile.png
Смеётся. Не знаю, но думаю, что всё-таки один. # speaker: Марта # sprite: act1/sprites/martha_smile.png
Гай начинает улыбаться. Он подползает к Марте и крепко обнимает её. Марта смеётся.

# bg: act1/bg/bg6.png
Ничего себе... # speaker: Гай # sprite: act1/sprites/guy_smile.png
Надо будет сходить в больницу. Убедиться, что всё нормально. # speaker: Марта # sprite: act1/sprites/martha_smile.png
Да, конечно. Завтра сходим. # speaker: Гай # sprite: act1/sprites/guy_smile.png

# fx: toBlack # music: stop
Ты рад? # speaker: Марта
Конечно, рад. # speaker: Гай
Звук отдалённого баха. # fx: shake # sfx: act1/sfx/bang.mp3

-> act_2
=== act_2 ===

gfgfg

-> act_3
=== act_3 ===

fgfgf

* [Оставляем]
    ~ final_choice = "A"
    -> END
* [Не оставляем]
    ~ final_choice = "B"
    -> END
