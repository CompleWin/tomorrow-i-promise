VAR final_choice = ""
-> act_1
=== act_1 ===

# bg: act1/bg/bg1.png # fx: fadeIn # music: act1/music/home.mp3
Опять без соли? # speaker: Гай # sprite: act1/sprites/guy_normal.png # sfx: act1/sfx/spoons.mp3
А ты её купил? # speaker: Марта # sprite: act1/sprites/martha_normal.png
Я думал, у нас ещё оставалась. # speaker: Гай # sprite: act1/sprites/guy_normal.png
Ну вот и я думала. # speaker: Марта # sprite: act1/sprites/martha_normal.png
Ладно, завтра куплю. # speaker: Гай # sprite: act1/sprites/guy_smile.png # sfx: act1/sfx/spoons.mp3
Ты вчера так же говорил. # speaker: Марта # sprite: act1/sprites/martha_smile.png
Завтра точно. # speaker: Гай # sprite: act1/sprites/guy_smile.png
Они продолжили ужинать. # sfx: act1/sfx/spoons.mp3
Внезапно лампа над столом гаснет.

# bg: act1/bg/bg2.png # fx: blackout # sfx: act1/sfx/lamp-off.mp3
Комната погружается в темноту. Слышен только шум улицы.
Да чтоб тебя... # speaker: Гай # sprite: act1/sprites/guy_normal_dark.png
Может, уже достанем свечи? # speaker: Марта # sprite: act1/sprites/martha_smile_dark.png
Подожди, сейчас включат. # speaker: Гай # sprite: act1/sprites/guy_smile_dark.png
...

# bg: act1/bg/bg3.png # fx: lightsOn # sfx: act1/sfx/light-on.mp3
Ну вот, я же говорил. # speaker: Гай # sprite: act1/sprites/guy_smile.png
По дому проходит лёгкий ветерок.
Гай... # speaker: Марта # sprite: act1/sprites/martha_normal.png
Что такое? # speaker: Гай # sprite: act1/sprites/guy_normal.png
Я тебе кое-что сказать хотела. # speaker: Марта # sprite: act1/sprites/martha_normal.png

# bg: act1/bg/bg4.png # fx: close # music: stop
Марта берёт его за руку.

# bg: act1/bg/bg5.png # fx: close # sfx: act1/sfx/hand-on-hand.mp3
Кажется, я беременна. # speaker: Марта # sprite: act1/sprites/martha_normal.png
Гай замирает. Несколько секунд он молча смотрит на неё. # sprite: act1/sprites/guy_suprised.png
Подожди... Серьёзно? # speaker: Гай # sprite: act1/sprites/guy_suprised.png
Я сегодня сделала тест. Даже два. # speaker: Марта # sprite: act1/sprites/martha_pregnant.png
И оба? # speaker: Гай # sprite: act1/sprites/guy_suprised.png
Марта улыбается и кивает. # sprite: act1/sprites/martha_pregnant.png
То есть... у нас будет двойня? # speaker: Гай # sprite: act1/sprites/guy_suprised.png
Смеётся. Не знаю, но думаю, что всё-таки один. # speaker: Марта # sprite: act1/sprites/martha_pregnant.png

# bg: act1/bg/bg6.png # music: act1/music/home.mp3
Гай начинает улыбаться. Он подползает к Марте и крепко обнимает её. Марта смеётся. # sfx: act1/sfx/guy-moves-closer.mp3
Ничего себе... # speaker: Гай # sprite: act1/sprites/guy_smile.png
Надо будет сходить в больницу. Убедиться, что всё нормально. # speaker: Марта # sprite: act1/sprites/martha_smile.png
Да, конечно. Завтра сходим. # speaker: Гай # sprite: act1/sprites/guy_smile.png

# fx: toBlack # music: stop
Ты рад? # speaker: Марта
Конечно, рад. # speaker: Гай
... # fx: shake # sfx: act1/sfx/bang.mp3

-> act_2
=== act_2 ===

PLACEHOLDER

-> act_3
=== act_3 ===

PLACEHOLDER

* [Оставляем]
    ~ final_choice = "A"
    -> END
* [Не оставляем]
    ~ final_choice = "B"
    -> END
