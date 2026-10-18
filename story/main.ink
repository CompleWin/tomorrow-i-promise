VAR final_choice = ""
-> act_1
=== act_1 ===

# bg: bg1.png
Опять без соли? # speaker: Гай # sprite: act1/guy_normal.png
А ты её купил? # speaker: Марта # sprite: act1/martha_normal.png
Я думал, у нас еще оставалась. # speaker: Гай # sprite: act1/guy_normal.png
Ну вот и я думала. # speaker: Марта # sprite: act1/martha_normal.png
Слышен стук ложек
Ладно, завтра куплю. # speaker: Гай # sprite: act1/guy_smile.png
Ты вчера так же говорил. # speaker: Марта # sprite: act1/martha_smile.png
Завтра точно. # speaker: Гай # sprite: act1/guy_smile.png
Они продолжают ужинать.
Внезапно лампа над столом гаснет.

# bg: bg2.png
Комната погружается в темноту. Слышен только шум улицы.
Да чтоб тебя... # speaker: Гай # sprite: act1/guy_normal.png
Может, уже достанем свечи? # speaker: Марта # sprite: act1/martha_smile.png
Подожди, сейчас включат. # speaker: Гай # sprite: act1/guy_smile.png
…

# bg: bg3.png
Ну вот, я же говорил. # speaker: Гай # sprite: act1/guy_smile.png
По дому проходит легкий ветерок
Гай, я тебе кое-что сказать хотела. # speaker: Марта # sprite: act1/martha_normal.png
Что такое? # speaker: Гай # sprite: act1/guy_normal.png
Марта берет его за руку.

# bg: bg4.png
# bg: bg5.png
Кажется, я беременна. # speaker: Марта # sprite: act1/martha_normal.png
Гай замирает. Несколько секунд он молча смотрит на нее.
Подожди... Серьезно? # speaker: Гай # sprite: act1/guy_suprised.png
Я сегодня сделала тест. Даже два. # speaker: Марта # sprite: act1/martha_pregnant.png
И оба? # speaker: Гай # sprite: act1/guy_suprised.png
Марта улыбается и кивает. # sprite: act1/martha_smile.png
То есть... у нас будет двойня? # speaker: Гай # sprite: act1/guy_smile.png
Смеется. Не знаю, но думаю, что все-таки один. # speaker: Марта # sprite: act1/martha_smile.png
Гай начинает улыбаться. Он подползает к Марте и крепко обнимает ее. Марта смеется.

# bg: bg6.png
Ничего себе... # speaker: Гай # sprite: act1/guy_smile.png
Надо будет сходить в больницу. Убедиться, что все нормально. # speaker: Марта # sprite: act1/martha_smile.png
Да, конечно. Завтра сходим. # speaker: Гай # sprite: act1/guy_smile.png

Экран затухает

Ты рад? # speaker: Марта # sprite: act1/martha_smile.png
Конечно, рад. # speaker: Гай # sprite: act1/guy_smile.png
Звук отдаленного баха

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
