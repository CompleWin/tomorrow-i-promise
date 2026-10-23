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

# bg: act4/bg/guy_approaches.webp # fx: move
О, явился! Я уж думал, без тебя начинать придется. # speaker: Уинстон # sprite: act4/sprites/winston_normal.png
Да я всего на пять минут задержался. # speaker: Гай # sprite: act4/sprites/guy_normal.png
Ладно, пошли уже. # speaker: Уинстон # sprite: act4/sprites/winston_normal.png

# bg: act4/bg/boot1.png # music: stop
Уинстон затушил сигарету

# bg: act4/bg/boot2.png # fx: move
...

# fx: toBlack # sfx: act4/sfx/turbine-climb.mp3
...

# bg: act4/bg/on_turbine.webp # music: act4/music/turbine-top-wind.mp3 # sfx: stop all
Мужчины поднялись на обслуживающую площадку и приступили к осмотру оборудования.

# bg: act4/bg/guy_thoughtful.webp
Во время работы Гай то и дело отвлекался, поглядывая то на небо, то на город внизу.
Слушай, ты чего сегодня такой прибитый? # speaker: Уинстон # sprite: act4/sprites/winston_surprised.png
Да так, задумался. # speaker: Гай # sprite: act4/sprites/guy_normal.png
О чем? # speaker: Уинстон # sprite: act4/sprites/winston_surprised.png

# bg: act4/bg/workers_waving.webp
На соседнем генераторе работали еще двое техников. Увидев Гая и Уинстона, они помахали.

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

-> act_5
=== act_5 ===

# fx: toBlack # sfx: act5/sfx/shahed.mp3
Ночную тишину внезапно нарушил резкий свист. Гай поднял голову, пытаясь понять, откуда доносится звук.
В следующую секунду соседний ветрогенератор озарила яркая вспышка. Раздался оглушительный взрыв, от которого задрожала металлическая площадка под ногами.
Пригнись! # speaker: Уинстон # sprite: act5/sprites/winston_crouching.png
Гай пригнулся и прикрыл голову руками. Ему казалось, что еще секунда, и перепонки вот-вот лопнут от этого свиста. # sprite: act5/sprites/guy_crouching.png

# bg: act5/bg/turbine_burning.webp # fx: fadeIn # music: act5/music/after-strike.mp3
Когда он снова посмотрел на соседнюю башню, ее верхняя часть уже была охвачена огнем. Из поврежденного корпуса поднимался густой дым.
Твою мать! Там же ребята! # speaker: Гай # sprite: act5/sprites/guy_shocked.png
Черт! # speaker: Уинстон # sprite: act5/sprites/winston_radio.png
Уинстон хватает рацию.  # sprite: act5/sprites/winston_radio.png # sfx: act5/sfx/radio-button.mp3
Диспетчерская, прием! Попадание в четвертый генератор! Сильный пожар! На площадке находились двое рабочих! # speaker: Уинстон # sprite: act5/sprites/winston_radio.png # sfx: act5/sfx/winston-radio-talk.mp3

# bg: act5/bg/slums1.png # sfx: stop all
Гай посмотрел вниз.

# bg: act5/bg/slums2.png
Огни поселения начали блоками затухать.

# bg: act5/bg/slums3.png
Через несколько секунд целые улицы одна за другой погрузились в темноту.

# bg: act5/bg/slums4.png
Вдалеке, на противоположном берегу, мегаполис продолжал безразлично сиять.
Гай вспомнил о Марте. Наверняка она слышала взрыв.
Он представил, как беременная жена сидит одна в темном доме, не зная, жив он, или нет.
Черт... Марта! # speaker: Гай # sprite: act5/sprites/guy_shocked.png
Гай, быстрее! Надо спускаться! # speaker: Уинстон # sprite: act5/sprites/winston_normal.png

# fx: toBlack
Мужчины быстро спускаются по тросам вниз # sfx: act5/sfx/guy-winston-descend.mp3
... # sfx: act5/sfx/descended.mp3 # fx: shake

# bg: act5/bg/standing_watching.webp # fx: fadeIn # sfx: act5/music/distant-bangs.mp3 loop
Где они?! Ты кого-нибудь видишь? # speaker: Гай # sprite: act5/sprites/guy_normal.png
Нет... Может, с другой стороны спустились? # speaker: Уинстон # sprite: act5/sprites/winston_normal.png
...
...
...
Прошла минута, затем другая. Но никто не появлялся.
Ну же, парни, ну давайте... # speaker: Уинстон # sprite: act5/sprites/winston_normal.png
Уинстон не смог договорить. Оба понимали, насколько мало времени было у рабочих после взрыва.

# bg: act5/bg/winston_supports.webp
Беги к Марте. # speaker: Уинстон # sprite: act5/sprites/winston_normal.png
У Гая встал ком в горле.
А вдруг они выбрались? # speaker: Гай # sprite: act5/sprites/guy_normal.png
Спасатели уже едут, я разберусь. # speaker: Уинстон # sprite: act5/sprites/winston_normal.png

# fx: toBlack

Гай поспешил в сторону поселения. Позади все еще слышался треск горящего оборудования. # sfx: stop # sfx: act5/music/distant-fighting.mp3 loop

# bg: act5/bg/guy_walks_flashlight.webp # fx: fadeIn # sfx: act5/sfx/guy-walks-mud.mp3

Уличные фонари не работали. Гай освещал дорогу фонариком, стараясь не наступать в глубокие лужи и разбросанный мусор.

# bg: act5/bg/guy_walks_mud.webp
Он несколько раз пытался дозвониться Марте, но сеть была недоступна.
Вскоре он убрал телефон и ускорил шаг.

# bg: act5/bg/women_with_lamp.webp
Проходя мимо одного из домов, Гай заметил небольшую группу людей.
Две женщины стояли у входа, пытаясь зажечь лампу.
У тебя спичек не осталось? У нас всё закончилось. # speaker: Женщина 1
Сейчас, подожди. Вот, возьми коробок. Мне пока хватит. # speaker: Женщина 2
Спасибо тебе! # speaker: Женщина 1

# bg: act5/bg/men_repairing.webp
Чуть дальше несколько мужчин возились возле старого генератора.
Один держал фонарь, пока остальные пытались разобраться с запуском. # sfx: act5/sfx/men-start-generator.mp3
Посвети сюда, я ничего не вижу! # speaker: Мужчина 1
Да свечу я! Попробуй придержать # speaker: Мужчина 2

# bg: act5/bg/guy_walks_mud.webp
Гай продолжал идти, когда позади раздался чей-то радостный голос.
О! Заработало! # speaker: Мужчина 1 # sfx: act5/sfx/hum.mp3
Только было Гай хотел обернуться и порадоваться, как вдалеке послышалась сирена скорой помощи. # sfx: act5/sfx/ambulance.mp3
Гай снова вспомнил о Марте и поспешил домой.

# bg: act5/bg/guy_house.webp
Через некоторое время, наконец, сквозь тьму вырисовались знакомые окна и ступеньки.

# bg:  act5/bg/martha_sees_guy.png
Марта только собрала сумку и, похоже, собиралась вот-вот отправиться на поиски мужа.
Заметив Гая, она на мгновение замерла, а затем бросилась к нему. # sprite: act5/sprites/martha_crying.png

# bg: act5/bg/guy_martha_hug.png # fx: move
Гай! Господи, ты живой! # speaker: Марта # sprite: act5/sprites/martha_hug.png # sfx: act5/sfx/crying1.mp3
Марта крепко обнимает его.
Тихо, тихо... Всё хорошо, я здесь. # speaker: Гай # sprite: act5/sprites/guy_smile.png
Я услышала взрыв... Потом свет выключился, телефон не работал... # speaker: Марта # sprite: act5/sprites/martha_crying.png
Я так испугалась, я думала это твой генератор! # speaker: Марта # sprite: act5/sprites/martha_crying.png
Нет, соседний. Со мной всё нормально. # speaker: Гай # sprite: act5/sprites/guy_normal.png
Я так испугалась... # speaker: Марта # sprite: act5/sprites/martha_crying.png

# bg: act5/bg/crying_hugging.png # music: stop # sfx: stop all # sfx: act5/sfx/crying2.mp3
Марта начинает плакать еще сильнее. Гай обнимает ее крепче и гладит по голове.
Прости, я пытался позвонить, но связи нигде нет. # speaker: Гай # sprite: act5/sprites/guy_normal.png
Главное, что ты вернулся. # speaker: Марта # sprite: act5/sprites/martha_crying.png

# bg: act5/bg/guy_martha_hug.png # music: act5/music/after-strike.mp3 # sfx: stop all # sfx: act5/music/distant-fighting.mp3 loop
Некоторое время они стояли молча. Марта постепенно успокоилась, но продолжала крепко обнимать мужа.
А остальные? Там ведь тоже люди работали... # speaker: Марта # sprite: act5/sprites/martha_normal.png
Я не знаю. Снаряд прилетел прям в турбину... Не хочу ничего утверждать. # speaker: Гай # sprite: act5/sprites/guy_normal.png
Гай замечает сумку на плече Марты.
Ты куда-то собиралась? # speaker: Гай # sprite: act5/sprites/guy_normal.png
К тебе бежать. Не могла дома сидеть. # speaker: Марта # sprite: act5/sprites/martha_normal.png
Гай слабо улыбается и снова прижимает ее к себе. # sprite: act5/sprites/guy_smile.png
Побежать прям на звуки взрывов? Обычно бегут от них. # speaker: Гай # sprite: act5/sprites/guy_smile.png
Марта кивает.
Ладно, пошли, а то тебя продует. # speaker: Гай # sprite: act5/sprites/guy_smile.png # sfx: act5/sfx/guy-closes-door.mp3

# fx: toBlack # sfx: act5/sfx/couple-leaves.mp3
...

-> act_6
=== act_6 ===

PLACEHOLDER
PLACEHOLDER
PLACEHOLDER

* [Оставляем]
    ~ final_choice = "A"
    -> END
* [Не оставляем]
    ~ final_choice = "B"
    -> END
