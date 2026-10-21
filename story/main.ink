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

# bg: act2/bg/bg1.png # fx: fadeIn # music: act2/music/hospital.mp3 # sfx: act2/sfx/ultrasound.mp3 loop

Так... Ну что ж, поздравляю. Беременность подтверждается. Пока всё выглядит нормально. # speaker: Врач # sprite: act2/sprites/doctor_normal.png
Правда? # speaker: Марта # sprite: act2/sprites/martha_normal.png
Да. Срок еще небольшой. # speaker: Врач # sprite: act2/sprites/doctor_smile.png

# bg: act2/bg/bg2.png

Марта улыбается и поворачивается к Гаю. Тот с облегчением выдыхает и улыбается ей в ответ.
Скажите, вы планируете сохранять беременность? # speaker: Врач # sprite: act2/sprites/doctor_normal.png

# bg: act2/bg/bg3.png

Гай и Марта удивленно переглядываются.

# bg: act2/bg/bg4.png # fx: move # sfx: act2/sfx/martha-rises-rustle.mp3
Простите, что? # speaker: Марта # sprite: act2/sprites/martha_worried.png
Вы уже приняли решение насчет ребенка? # speaker: Врач # sprite: act2/sprites/doctor_normal.png
Мы... как-то еще не думали об этом. # speaker: Гай # sprite: act2/sprites/guy_normal.png

# bg: act2/bg/bg5.png

Мы только недавно узнали. # speaker: Марта # sprite: act2/sprites/martha_worried.png
Понимаю. Но советую не затягивать с решением. Чем больше срок, тем меньше у вас будет вариантов. # speaker: Врач # sprite: act2/sprites/doctor_normal.png

# bg: act2/bg/bg4.png # fx: move # sfx: act2/sfx/martha-rises-rustle.mp3
А с ребенком точно всё в порядке? # speaker: Гай # sprite: act2/sprites/guy_sad.png

На данный момент я не вижу никаких отклонений. # speaker: Врач # sprite: act2/sprites/doctor_normal.png
Но вы должны понимать, что у нас нет оборудования для генетического скрининга. # speaker: Врач # sprite: act2/sprites/doctor_normal.png
Поэтому исключить возможные нарушения развития мы не можем. # speaker: Врач # sprite: act2/sprites/doctor_normal.png

То есть мы никак не узнаем заранее? # speaker: Марта # sprite: act2/sprites/martha_sad.png
К сожалению, здесь такой возможности нет. # speaker: Врач # sprite: act2/sprites/doctor_normal.png

Можно нам немного времени подумать? # speaker: Гай # sprite: act2/sprites/guy_sad.png

# bg: act2/bg/bg7.png 

Конечно. Обсудите всё дома. Когда будете готовы, приходите. # speaker: Врач # sprite: act2/sprites/doctor_normal.png
Только, пожалуйста, не откладывайте надолго, иначе может стать поздно. # speaker: Врач # sprite: act2/sprites/doctor_normal.png

{""} # bg: act2/bg/bg8.png # sfx: act2/sfx/martha-wipes-belly.mp3

# bg: act2/bg/bg9.png

На сегодня всё. Можете одеваться. # speaker: Врач # sprite: act2/sprites/doctor_normal.png # sfx: act2/sfx/doctor-throws-napkin.mp3

# fx: toBlack # music: stop # sfx: act2/sfx/martha-gets-off-couch.mp3

...

-> act_3
=== act_3 ===

PLACEHOLDER

* [Оставляем]
    ~ final_choice = "A"
    -> END
* [Не оставляем]
    ~ final_choice = "B"
    -> END
