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

# bg: act2/bg/bg7.png # sfx: stop
Конечно. Обсудите всё дома. Когда будете готовы, приходите. # speaker: Врач # sprite: act2/sprites/doctor_normal.png
Только, пожалуйста, не откладывайте надолго, иначе может стать поздно. # speaker: Врач # sprite: act2/sprites/doctor_normal.png

{""} # bg: act2/bg/bg8.png # sfx: act2/sfx/martha-wipes-belly.mp3

# bg: act2/bg/bg9.png
На сегодня всё. Можете одеваться. # speaker: Врач # sprite: act2/sprites/doctor_normal.png # sfx: act2/sfx/doctor-throws-napkin.mp3

# fx: toBlack # music: stop # sfx: act2/sfx/martha-gets-off-couch.mp3

-> act_3
=== act_3 ===

# bg: act3/bg/city1.webp # fx: fadeIn # music: act3/music/night.mp3
Гай остановился у берега реки.
На противоположной стороне возвышались десятки небоскребов, а их огни отражались в темной воде.
Даже глубокой ночью мегаполис продолжал жить своей жизнью.
По улицам двигались машины, на фасадах зданий мелькала реклама, а окна высоток светились до самого горизонта.
Над городом нависало багрово-красное небо.
Казалось, оно уже давно устало от бесконечных пожаров, которые не прекращались ни днем, ни ночью.
Где-то за горизонтом продолжались бои, горели промышленные районы и нефтехранилища.
Дым смешивался с городским смогом, окрашивая облака в кровавые оттенки.

# bg: act3/bg/bg3.png
Издалека город казался почти идеальным.
Там всегда было электричество, из кранов текла чистая вода, а улицы не утопали в грязи.
Однако Гай прекрасно знал, что за красивыми фасадами скрывалась совсем другая жизнь. # sfx: act3/sfx/office.mp3 loop
Люди работали почти без отдыха, большую часть заработанного отдавали за жилье и необходимые услуги, а война и постоянная тревога были знакомы им не меньше, чем жителям трущоб.

# bg: act3/bg/city1.webp  # sfx: stop
...

# bg: act3/bg/bg1.png
Еще несколько десятилетий назад люди представляли будущее совсем иначе.
Они мечтали, что технологии избавят их от бедности, голода и войн.
Теперь технологии окружали человека повсюду, но старые проблемы никуда не исчезли.

# bg: act3/bg/bg2.png
Человечество всегда стремилось к утопии, мечтая о мире, в котором каждый мог бы жить спокойно и счастливо.
Но попытки построить идеальное общество раз за разом оборачивались новыми конфликтами и трагедиями.
Люди научились создавать невероятные машины и возводить огромные города, но так и не смогли научиться действовать сообща.
Каждый преследовал собственные интересы, и в конечном счете человечество само создало мир, в котором теперь вынуждено было жить.

# bg: act3/bg/city1.webp
Гай снова посмотрел на сияющие небоскребы.
Город продолжал расти, появлялись все более совершенные технологии, но за этим великолепием он не видел того будущего, о котором когда-то мечтали люди.

# bg: act3/bg/city2.webp
...

# bg: act3/bg/city3.webp
Он перевел взгляд на свой берег.
У покосившихся домов громоздились кучи мусора, над крышами тянулись спутанные провода.
Несколько женщин стирали одежду в реке при свете старого фонаря. Неподалеку дети играли среди строительных обломков.

# bg: act3/bg/city4.webp

Гай невольно представил среди них собственного ребенка.
Ему тоже придется ходить по этим улицам, слышать ночные взрывы и привыкать к тому, что завтра может не быть ни воды, ни электричества.
А что, если через двадцать лет ничего не изменится?
Если его ребенок вырастет и будет смотреть на тот же город, на то же красное небо, задаваясь теми же вопросами?

# bg: act3/bg/city1.webp
От этой мысли ему стало не по себе.
Он еще несколько секунд смотрел на другой берег, после чего поправил сумку на плече и направился к ветрогенераторам. # sfx: act3/sfx/guy-hangs-bag.mp3 # sfx: act3/sfx/guy-walks.mp3

# fx: toBlack # music: stop # sfx: stop all


-> act_4
=== act_4 ===

# bg: act4/bg/winston_smoking.webp # fx: fadeIn # music: act4/music/field-wind.mp3
Глубокая ночь.
Гай добрался до ветряной электростанции.
Красные сигнальные огни мерцали на вершинах огромных башен.
У входа его уже ждал коллега.

# bg: act4/bg/guy_approaches.webp
О, явился! Я уж думал, без тебя начинать придется. # speaker: Уинстон # sprite: act4/sprites/winston_normal.png
Да я всего на пять минут задержался. # speaker: Гай # sprite: act4/sprites/guy_normal.png
Ладно, пошли уже. # speaker: Уинстон # sprite: act4/sprites/winston_normal.png

# bg: act4/bg/boot1.png # music: stop
Уинстон затушил сигарету

# bg: act4/bg/boot2.png
...

# fx: toBlack # sfx: act4/sfx/turbine-climb.mp3
...

# bg: act4/bg/on_turbine.webp # music: act4/music/turbine-top-wind.mp3
мужчины поднялись на обслуживающую площадку и приступили к осмотру оборудования.

# bg: act4/bg/guy_thoughtful.webp
Во время работы Гай то и дело отвлекался, поглядывая то на небо, то на город внизу.
Слушай, ты чего сегодня такой прибитый? # speaker: Уинстон # sprite: act4/sprites/winston_surprised.png
Да так, задумался. # speaker: Гай # sprite: act4/sprites/guy_normal.png
О чем? # speaker: Уинстон # sprite: act4/sprites/winston_surprised.png

# bg: act4/bg/workers_waving.webp
На соседнем генераторе работали еще двое техников. Один из них помахал фонарем.

# bg: act4/bg/winston_guy_waving.webp
Гай и его коллега ответили тем же.

# bg: act4/bg/winston_guy_talking.webp
Марта беременна. # speaker: Гай # sprite: act4/sprites/guy_normal.png
Да ты что! Поздравляю! # speaker: Уинстон # sprite: act4/sprites/winston_smile.png
Спасибо. # speaker: Гай # sprite: act4/sprites/guy_normal.png
А что с лицом тогда? Не рад, что ли? # speaker: Уинстон # sprite: act4/sprites/winston_smile.png
Да рад я. Просто не ожидал, что всё так быстро получится. # speaker: Гай # sprite: act4/sprites/guy_normal.png
Ну это нормально. Я когда узнал, что у нас двойня будет, вообще чуть не поседел. # speaker: Уинстон # sprite: act4/sprites/winston_smile.png
Двойня? Ничего себе. И как вы справились? # speaker: Гай # sprite: act4/sprites/guy_smile.png
А куда деваться? Сначала тяжело было, естественно. Хорошо, что соседи помогали. # speaker: Уинстон # sprite: act4/sprites/winston_smile.png
И как сейчас? # speaker: Гай # sprite: act4/sprites/guy_smile.png
Да растут потихоньку. Уже в школу ходят. # speaker: Уинстон # sprite: act4/sprites/winston_giggle.png
Шумят, конечно, дерутся постоянно. Бывает домой приходишь, а там дурдом полный. # speaker: Уинстон # sprite: act4/sprites/winston_giggle.png
Гай усмехнулся. # sprite: act4/sprites/guy_giggle.png
Мы с Мартой вот думаем, может, стоило еще подождать немного... # speaker: Гай # sprite: act4/sprites/guy_normal.png
А чего ждать-то? # speaker: Уинстон # sprite: act4/sprites/winston_surprised.png
Ну, пока всё хоть немного успокоится. Война закончится, жизнь наладится. # speaker: Гай # sprite: act4/sprites/guy_normal.png
Слушай, мы с женой тоже так рассуждали. # speaker: Уинстон # sprite: act4/sprites/winston_surprised.png
Думали, вот весь бедлам этот закончится, тогда и о детях подумаем. # speaker: Уинстон # sprite: act4/sprites/winston_surprised.png
А потом одна война закончилась, другая началась. # speaker: Уинстон # sprite: act4/sprites/winston_surprised.png
И вы решили больше не ждать? # speaker: Гай # sprite: act4/sprites/guy_normal.png
Ага. Сам подумай, когда вообще времена хорошие были? # speaker: Уинстон # sprite: act4/sprites/winston_surprised.png
То понос, то золотуха. # speaker: Уинстон # sprite: act4/sprites/winston_surprised.png
Всё время что-нибудь происходит. # speaker: Уинстон # sprite: act4/sprites/winston_surprised.png
Так ведь и всю жизнь прождать можно. # speaker: Уинстон # sprite: act4/sprites/winston_surprised.png
Ну да, наверное... # speaker: Гай # sprite: act4/sprites/guy_normal.png
Да и кто знает, что через десять лет будет? Может, лучше станет. Может, хуже. Не угадаешь. # speaker: Уинстон # sprite: act4/sprites/winston_surprised.png
И не жалеешь? # speaker: Гай # sprite: act4/sprites/guy_normal.png
Да ты что! Конечно нет. Сейчас смотрю на своих оболтусов и даже представить не могу, как бы мы без них жили. # speaker: Уинстон # sprite: act4/sprites/winston_giggle.png
Гай невольно улыбнулся. # sprite: act4/sprites/guy_smile.png
Ладно, давай заканчивать. # speaker: Уинстон # sprite: act4/sprites/winston_normal.png
А то до утра тут проторчим. # speaker: Уинстон # sprite: act4/sprites/winston_normal.png
Давай. # speaker: Гай # sprite: act4/sprites/guy_smile.png

# fx: toBlack

-> act_5
=== act_5 ===


PLACEHOLDER


* [Оставляем]
    ~ final_choice = "A"
    -> END
* [Не оставляем]
    ~ final_choice = "B"
    -> END
