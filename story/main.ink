VAR final_choice = ""
-> act_1
=== act_1 ===
# bg: bg1.png

Опять без соли? # speaker: Гай
А ты её купил? # speaker: Марта

# bg: bg2.png

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
